<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";

if(count($_POST)){
	$language=isset($_REQUEST['language'])?$_REQUEST['language']:"";
	$sign=isset($_REQUEST['sign'])?$_REQUEST['sign']:"";

	/*echo "language : ".$language."<br>";
	echo "sign : ".$sign."<br>";
	exit;*/
	
	if($language != "" && $sign != ""){
		$sql1 = "INSERT INTO `language` (`langId`, `language`, `sign`, `isDefault`) 
				VALUES (NULL, '".$language."', '".$sign."', 0)";
		//echo $sql1; exit;
		$sql1_res = mysqli_query($dbConn, $sql1);
		
		$sql2 = "ALTER TABLE `cms` ADD COLUMN `content_".$sign."` TEXT DEFAULT NULL";
		//echo $sql2; exit;
		$sql2_res = mysqli_query($dbConn, $sql2);
		
		updateLiveTime($dbConn, 'LANGUAGE');
	}
	echo "<script language=\"javascript\">window.location = 'languages.php'</script>";exit;
}else{
	
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	/*--------------------------------------------Deleting Language Data-----------------------------------*/
	if($ACTION == "DELETE"){
		$langId=isset($_REQUEST['langId'])?(int)$_REQUEST['langId']:0;
		if($langId > 0){
			$sql = "SELECT `sign` FROM `language` WHERE `langId` = ".$langId;
			//echo $sql; exit;
			$sql_res = mysqli_query($dbConn, $sql);
			$sql_res_fetch = mysqli_fetch_array($sql_res);
			$sign = $sql_res_fetch["sign"];
			
			$sqlDelete1 = "ALTER TABLE `cms` DROP COLUMN `content_".$sign."`";
			//echo $sqlDelete1; exit;
			$sqlDelete1_res = mysqli_query($dbConn, $sqlDelete1);
			
			$sqlDelete2 = "DELETE FROM `language` WHERE `language`.`langId` = ".$langId;
			//echo $sqlDelete2; exit;
			$sqlDelete2_res = mysqli_query($dbConn, $sqlDelete2);
			
			updateLiveTime($dbConn, 'LANGUAGE');
		}
		echo "<script language=\"javascript\">window.location = 'languages.php'</script>";exit;
	}
	/*--------------------------------------------Deleting Language Data-----------------------------------*/
	
	/*--------------------------------------------Defaulting Language Data---------------------------------*/
	if($ACTION == "SETDEFAULTLANG"){
		$langId=isset($_REQUEST['langId'])?(int)$_REQUEST['langId']:0;
		if($langId > 0){
			$sqlUpdate = "UPDATE language 
						  SET isDefault = CASE 
							WHEN langId = ".$langId." THEN 1
							ELSE 0
						  END";
			//echo $sqlUpdate; exit;
			$sqlUpdate_res = mysqli_query($dbConn, $sqlUpdate);

			updateLiveTime($dbConn, 'LANGUAGE');
		}
		echo "<script language=\"javascript\">window.location = 'languages.php'</script>";exit;
	}
	/*--------------------------------------------Defaulting Language Data---------------------------------*/
	
	/*--------------------------------------------Populating Language Data---------------------------------*/
	$sql="SELECT `langId`,`language`, `sign`, `isDefault` FROM `language` WHERE 1";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$languageObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$languageObject = (object) [
										'langId' => (int)$sql_res_fetch["langId"], 
										'language' => $sql_res_fetch["language"],
										'sign' => $sql_res_fetch["sign"],
										'isDefault' => (int)$sql_res_fetch["isDefault"]
									  ];
		//echo json_encode($languageObject);exit;
		$languageObjectArray[] = $languageObject;
	}
	//echo json_encode($languageObjectArray);exit;
	/*--------------------------------------------Populating Language Data---------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Languages</title>
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
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/settings.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="languageSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_930">Language</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<form id="languageForm" name="languageForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return settingsFunctionality.validateLanguageForm();">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20">
						
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_930">Language</span>
									<input type="text" id="language" name="language" class="form-control" value="" placeholder="Please Enter Language" rel="cms_931">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_932">Language Sign</span>
									<input type="text" id="sign" name="sign" class="form-control" value="" placeholder="Please Enter Language Sign" rel="cms_933">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<button id="submitBtn" type="submit" class="btn btn-success pull-left" rel="cms_832">Submit</button>
							</div>
							
						</div>
					</form>
					<h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_934">List of Languages</span>
						</b>
					</h5>
					<div id="languageTableContainer" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
				</div>
				<input id="languageData" name="languageData" type="hidden" value='<?php echo json_encode($languageObjectArray); ?>'>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>