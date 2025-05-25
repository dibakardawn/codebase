<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";

if(count($_POST)){
	$companyType=isset($_REQUEST['companyType'])?$_REQUEST['companyType']:"";

	/*echo "companyType : ".$companyType."<br>";
	exit;*/
	
	if($companyType != ""){
		$sql = "INSERT INTO `companyType` (`companyTypeId`, `companyType`) 
				VALUES (NULL, '".$companyType."')";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		
		updateLiveTime($dbConn, 'COMPANYTYPE');
	}
	echo "<script language=\"javascript\">window.location = 'companyTypes.php'</script>";exit;
}else{
	/*--------------------------------------------Deleting Company Type Data-----------------------------------*/
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	if($ACTION == "DELETE"){
		$companyTypeId=isset($_REQUEST['companyTypeId'])?(int)$_REQUEST['companyTypeId']:0;
		if($companyTypeId > 0){
			$sqlDelete="DELETE FROM `companyType` WHERE `companyType`.`companyTypeId` = ".$companyTypeId;
			//echo $sqlDelete; exit;
			//$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
			//updateLiveTime($dbConn, 'COMPANYTYPE');
		}
		echo "<script language=\"javascript\">window.location = 'companyTypes.php'</script>";exit;
	}
	/*--------------------------------------------Deleting Company Type Data-----------------------------------*/
	
	/*--------------------------------------------Populating Company Type Data---------------------------------*/
	$sql="SELECT `companyTypeId`,`companyType` FROM `companyType` WHERE 1";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$companyTypeObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$companyTypeObject = (object) [
										'companyTypeId' => (int)$sql_res_fetch["companyTypeId"], 
										'companyType' => $sql_res_fetch["companyType"]
									  ];
		//echo json_encode($companyTypeObject);exit;
		$companyTypeObjectArray[] = $companyTypeObject;
	}
	//echo json_encode($companyTypeObjectArray);exit;
	/*--------------------------------------------Populating Company Type Data---------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Company Types</title>
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
			<div id="companyTypeSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_884">Company Type</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<form id="companyTypeForm" name="companyTypeForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return settingsFunctionality.validateCompanyTypeForm();">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20">
						
							<div class="col-lg-3 col-md-3 col-sm-9 col-xs-9 nopaddingOnly">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_884">Company Type</span>
									<input type="text" id="companyType" name="companyType" class="form-control" value="" placeholder="Please enter Company Type" rel="cms_886">
								</div>
							</div>
							
							<div class="col-lg-9 col-md-9 col-sm-3 col-xs-3 nopaddingOnly text-right">
								<button id="submitBtn" type="submit" class="btn btn-success" rel="cms_832">Submit</button>
							</div>
							
						</div>
					</form>
					<h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_885">List of Company Types</span>
						</b>
					</h5>
					<div id="companyTypeTableContainer" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
				</div>
				<input id="companyTypeData" name="companyTypeData" type="hidden" value='<?php echo json_encode($companyTypeObjectArray); ?>'>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>