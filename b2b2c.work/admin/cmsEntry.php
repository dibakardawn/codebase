<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$cmsId=isset($_REQUEST['cmsId'])?(int)$_REQUEST['cmsId']:0;
if(count($_POST))
{	
	$section=isset($_REQUEST['section'])?$_REQUEST['section']:"";
	$page=isset($_REQUEST['page'])?$_REQUEST['page']:"";
	/*echo "Section : ".$section." <br> ";
	echo "Page : ".$page." <br> ";
	exit;*/
	
	$updateSubQuery = "";
	$insertSubQuery1 = "";
	$insertSubQuery2 = "";
	$sql_lang = "SELECT `sign` FROM `language` WHERE 1";
	//echo $sql_lang; exit;
	$sql_lang_res = mysqli_query($dbConn, $sql_lang);
	while($sql_lang_res_fetch = mysqli_fetch_array($sql_lang_res)){
		${"content_".$sql_lang_res_fetch["sign"]} = isset($_REQUEST["content_".$sql_lang_res_fetch["sign"]])?$_REQUEST["content_".$sql_lang_res_fetch["sign"]]:"";
		//echo "content_".$sql_lang_res_fetch["sign"]." : ".${"content_".$sql_lang_res_fetch["sign"]}." <br> ";
		$updateSubQuery = $updateSubQuery."`content_".$sql_lang_res_fetch["sign"]."` = '".mysqli_real_escape_string($dbConn, ${"content_".$sql_lang_res_fetch["sign"]})."',";
		$insertSubQuery1 = $insertSubQuery1."`content_".$sql_lang_res_fetch["sign"]."`,";
		$insertSubQuery2 = $insertSubQuery2."'".mysqli_real_escape_string($dbConn, ${"content_".$sql_lang_res_fetch["sign"]})."',";
	}
	$updateSubQuery = rtrim($updateSubQuery, ",");
	$insertSubQuery1 = rtrim($insertSubQuery1, ",");
	$insertSubQuery2 = rtrim($insertSubQuery2, ",");
	
	if($cmsId > 0){ //Edit
		//echo $updateSubQuery; exit;
		$sqlEdit = "UPDATE `cms` SET 
		`section` = '".$section."',
		`page` = '".$page."',
		".$updateSubQuery."
		WHERE `cms`.`cmsId` = ".$cmsId;
		//echo $sqlEdit; exit;
		$sqlEdit_res = mysqli_query($dbConn, $sqlEdit);
		
		/*----------------------------Populate PreCompiled CMS Data--------------------------------------*/
		populateCmsData($dbConn, $section, $page);
		/*----------------------------Populate PreCompiled CMS Data--------------------------------------*/
		echo "<script language=\"javascript\">window.location = 'cms.php?section=".$section."&page=".$page."'</script>";exit;
	}else if($cmsId === 0){ //Add
		//echo $insertSubQuery1."<br>".$insertSubQuery2;exit;
		$sqlAdd = "INSERT INTO `cms` (
										`section`, 
										`page`, 
										".$insertSubQuery1.") 
									VALUES (
										'".$section."', 
										'".$page."', 
										".$insertSubQuery2.")";
		//echo $sqlAdd; exit;
		$sqlAdd_res = mysqli_query($dbConn, $sqlAdd);
		
		/*----------------------------Populate PreCompiled CMS Data--------------------------------------*/
		populateCmsData($dbConn, $section, $page);
		/*----------------------------Populate PreCompiled CMS Data--------------------------------------*/
		echo "<script language=\"javascript\">window.location = 'cms.php?section=".$section."&page=".$page."'</script>";exit;
	}
}else{
	$section=isset($_REQUEST['section'])?$_REQUEST['section']:"";
	$page=isset($_REQUEST['page'])?$_REQUEST['page']:"";
	if($cmsId > 0){
		$sql_cms_content = "SELECT `section`,`page` FROM `cms` WHERE `cmsId` = ".$cmsId;
		//echo $sql_cms_content; exit;
		$sql_cms_content_res = mysqli_query($dbConn, $sql_cms_content);
		while($sql_cms_content_res_fetch = mysqli_fetch_array($sql_cms_content_res)){
			$section=$sql_cms_content_res_fetch["section"];
			$page=$sql_cms_content_res_fetch["page"];
		}
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Content Management System</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon" />
		<link rel="icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/adminStyle/adminW3.css">
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/adminStyle/adminStyle.css">
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/settings.js'></script>
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="cmsSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> Content Management System</b></h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot5">
					<form id="cmsForm" name="cmsForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return settingsFunctionality.validateCmsEntry();">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
							<select id="section" name="section" class="pull-left h34 marRig10" onchange="settingsFunctionality.onSectionDDLChange()">
								<option value="">-- Change Section --</option>
								<?php 
								$sql_section = "SELECT `section` FROM `cmsSection` WHERE 1 GROUP BY `section`";
								//echo $sql_section; exit;
								$sql_section_res = mysqli_query($dbConn, $sql_section);
								while($sql_section_res_fetch = mysqli_fetch_array($sql_section_res)){
								?>
								<option value="<?php echo $sql_section_res_fetch["section"]; ?>" <?php if($section == $sql_section_res_fetch["section"]){ echo "SELECTED"; } ?>><?php echo $sql_section_res_fetch["section"]; ?></option>
								<?php } ?>
							</select>
							<?php if($section != ""){ ?>
							<select id="page" name="page" class="pull-left h34 marRig10" onchange="settingsFunctionality.onPageDDLChnage()">
								<option value="">-- Change Page --</option>
								<?php 
								$sql_page = "SELECT `page` FROM `cmsSection` WHERE `section` = '".$section."' ORDER BY `cmsSectionId` ASC";
								//echo $sql_page; exit;
								$sql_page_res = mysqli_query($dbConn, $sql_page);
								while($sql_page_res_fetch = mysqli_fetch_array($sql_page_res)){
								?>
								<option value="<?php echo $sql_page_res_fetch["page"]; ?>" <?php if($page == $sql_page_res_fetch["page"]){ echo "SELECTED"; } ?>><?php echo $sql_page_res_fetch["page"]; ?></option>
								<?php } ?>
							</select>
							<?php } ?>
						</div>
						<div id="cmsInputs" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						</div>
						<input type="hidden" id="cmsId" name="cmsId" value="<?php echo $cmsId; ?>">
					</form>
				</div>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>