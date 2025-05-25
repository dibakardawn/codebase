<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";

if(count($_POST)){
	$country=isset($_REQUEST['country'])?$_REQUEST['country']:"";
	$countryCode=isset($_REQUEST['countryCode'])?$_REQUEST['countryCode']:"";
	$telePhoneExt=isset($_REQUEST['telePhoneExt'])?$_REQUEST['telePhoneExt']:"";

	/*echo "country : ".$country."<br>";
	echo "countryCode : ".$countryCode."<br>";
	echo "telePhoneExt : ".$telePhoneExt."<br>";
	exit;*/
	
	if($country != "" && $countryCode != "" && $telePhoneExt != ""){
		$sql = "INSERT INTO `country` (`countryId`, `country`, `countryCode`, `telePhoneExt`) 
				VALUES (NULL, '".$country."', '".$countryCode."', '".$telePhoneExt."')";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		updateLiveTime($dbConn, "COUNTRY");
	}
	echo "<script language=\"javascript\">window.location = 'countries.php'</script>";exit;
}else{
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	
	/*--------------------------------------------Deleting Country Data-----------------------------------*/
	if($ACTION == "DELETE"){
		$countryId=isset($_REQUEST['countryId'])?$_REQUEST['countryId']:0;
		if($countryId > 0){
			$sqlDelete="DELETE FROM country WHERE `country`.`countryId` = ".$countryId;
			//echo $sqlDelete; exit;
			$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
			updateLiveTime($dbConn, "COUNTRY");
		}
		echo "<script language=\"javascript\">window.location = 'countries.php'</script>";exit;
	}
	/*--------------------------------------------Deleting Country Data-----------------------------------*/
	
	/*--------------------------------------------Defaulting Country Data---------------------------------*/
	if($ACTION == "MAKEDEFAULT"){
		$countryId=isset($_REQUEST['countryId'])?$_REQUEST['countryId']:0;
		if($countryId > 0){
			$sqlUpdate1="UPDATE `country` SET `isDefault` = 0 WHERE 1 ";
			//echo $sqlUpdate1; exit;
			$sqlUpdate1_res = mysqli_query($dbConn, $sqlUpdate1);
			
			$sqlUpdate2="UPDATE `country` SET `isDefault` = 1 WHERE `country`.`countryId` = ".$countryId;
			//echo $sqlUpdate2; exit;
			$sqlUpdate2_res = mysqli_query($dbConn, $sqlUpdate2);
			
			updateLiveTime($dbConn, "COUNTRY");
		}
		echo "<script language=\"javascript\">window.location = 'countries.php'</script>";exit;
	}
	/*--------------------------------------------Defaulting Country Data---------------------------------*/
	
	/*--------------------------------------------Populating Country Data---------------------------------*/
	$sql="SELECT `countryId`,`country`,`countryCode`,`telePhoneExt`,`isDefault` FROM `country` WHERE 1";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$countryObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$countryObject = (object) [
								   'countryId' => (int)$sql_res_fetch["countryId"], 
								   'country' => $sql_res_fetch["country"],
								   'countryCode' => $sql_res_fetch["countryCode"],
								   'telePhoneExt' => $sql_res_fetch["telePhoneExt"],
								   'isDefault' => $sql_res_fetch["isDefault"] ? true : false
								  ];
		//echo json_encode($countryObject);exit;
		$countryObjectArray[] = $countryObject;
	}
	//echo json_encode($countryObjectArray);
	/*--------------------------------------------Populating Country Data---------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Settings Country</title>
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
			<div id="countrySectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_825">Countries</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<form id="financeEntryForm" name="financeEntryForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return financeFunctionality.validateFinanceEntryForm();" enctype="multipart/form-data">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20">
						
							<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_826">Country</span>
									<input type="text" id="country" name="country" class="form-control" value="" placeholder="Please enter country name" rel="cms_827">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_828">Country Code</span>
									<input type="text" id="countryCode" name="countryCode" class="form-control" value="" placeholder="Please enter country Code" rel="cms_829">
								</div>
							</div>
							
							<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_830">Telephone Ext</span>
									<input type="text" id="telePhoneExt" name="telePhoneExt" class="form-control" value="" placeholder="Please enter country extension" rel="cms_831">
								</div>
							</div>
							
							<div class="col-lg-1 col-md-1 col-sm-12 col-xs-12 nopaddingOnly text-right">
								<button id="submitBtn" type="submit" class="btn btn-success" rel="cms_832">Submit</button>
							</div>
							
						</div>
					</form>
					<h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_833">List of Countries</span>
						</b>
					</h5>
					<div id="countryTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
				</div>
				<input id="countryData" name="countryData" type="hidden" value='<?php echo json_encode($countryObjectArray); ?>'>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>