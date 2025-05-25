<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";

if(count($_POST)){
	$featureTitle=isset($_REQUEST['featureTitle'])?$_REQUEST['featureTitle']:"";
	$featureType=isset($_REQUEST['featureType'])?$_REQUEST['featureType']:"";
	$featureUnit=isset($_REQUEST['featureUnit'])?$_REQUEST['featureUnit']:NULL;

	/*echo "featureTitle : ".$featureTitle."<br>";
	echo "featureType : ".$featureType."<br>";
	echo "featureUnit : ".$featureUnit."<br>";
	exit;*/
	
	if($featureTitle != "" && $featureType != ""){
		$sql = "INSERT INTO `productFeature` (`featureId`, `featureTitle`, `featureType`, `featureUnit`) 
				VALUES (NULL, '".$featureTitle."', '".$featureType."', '".$featureUnit."')";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
	}
	echo "<script language=\"javascript\">window.location = 'features.php'</script>";exit;
}else{
	/*--------------------------------------------Deleting Product Feature Data-----------------------------------*/
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	if($ACTION == "DELETE"){
		$featureId=isset($_REQUEST['featureId'])?(int)$_REQUEST['featureId']:0;
		if($featureId > 0){
			$sqlDelete="DELETE FROM `productFeature` WHERE `productFeature`.`featureId` = ".$featureId;
			//echo $sqlDelete; exit;
			//$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
		}
		echo "<script language=\"javascript\">window.location = 'features.php'</script>";exit;
	}
	/*--------------------------------------------Deleting Product Feature Data-----------------------------------*/
	
	/*--------------------------------------------Populating Product Feature Data---------------------------------*/
	$sql="SELECT `featureId`,`featureTitle`,`featureType`,`featureUnit` FROM `productFeature` WHERE 1";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$productFeatureObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$productFeatureObject = (object) [
										'featureId' => (int)$sql_res_fetch["featureId"], 
										'featureTitle' => $sql_res_fetch["featureTitle"],
										'featureType' => $sql_res_fetch["featureType"],
										'featureUnit' => $sql_res_fetch["featureUnit"]
									  ];
		//echo json_encode($productFeatureObject);exit;
		$productFeatureObjectArray[] = $productFeatureObject;
	}
	//echo json_encode($productFeatureObjectArray);exit;
	/*--------------------------------------------Populating Product Feature Data---------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Features</title>
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
			<div id="productFeatureSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_887">Product Feature</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<form id="productFeatureForm" name="productFeatureForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return settingsFunctionality.validateProductFeatureForm();">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20">
						
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_888">Feature Title</span>
									<input type="text" id="featureTitle" name="featureTitle" class="form-control" value="" placeholder="Please Enter Feature Title" rel="cms_889">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_890">Feature Type</span>
									<input type="text" id="featureType" name="featureType" class="form-control" value="" placeholder="Please Enter Feature Type" rel="cms_891">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_892">Feature Unit</span>
									<input type="text" id="featureUnit" name="featureUnit" class="form-control" value="" placeholder="Please Enter Feature Unit" rel="cms_893">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly text-right">
								<button id="submitBtn" type="submit" class="btn btn-success" rel="cms_832">Submit</button>
							</div>
							
						</div>
					</form>
					<h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_894">List of Product Features</span>
						</b>
					</h5>
					<div id="productFeatureTableContainer" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
				</div>
				<input id="productFeatureData" name="productFeatureData" type="hidden" value='<?php echo json_encode($productFeatureObjectArray); ?>'>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>