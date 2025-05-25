<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";

if(count($_POST)){
	$currency=isset($_REQUEST['currency'])?$_REQUEST['currency']:"";
	$currencySign=isset($_REQUEST['currencySign'])?$_REQUEST['currencySign']:"";

	/*echo "currency : ".$currency."<br>";
	echo "currencySign : ".$currencySign."<br>";
	exit;*/
	
	if($currency != "" && $currencySign != ""){
		$sql = "INSERT INTO `currency` (`currencyId`, `currency`, `currencySign`) 
				VALUES (NULL, '".$currency."', '".$currencySign."')";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
	}
	echo "<script language=\"javascript\">window.location = 'currency.php'</script>";exit;
}else{
	/*--------------------------------------------Deleting currency Data-----------------------------------*/
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	if($ACTION == "DELETE"){
		$currencyId=isset($_REQUEST['currencyId'])?(int)$_REQUEST['currencyId']:0;
		if($currencyId > 0){
			$sqlDelete="DELETE FROM `currency` WHERE `currency`.`currencyId` = ".$currencyId;
			//echo $sqlDelete; exit;
			$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
		}
		echo "<script language=\"javascript\">window.location = 'currency.php'</script>";exit;
	}
	/*--------------------------------------------Deleting currency Data-----------------------------------*/
	
	/*--------------------------------------------Defaulting currency Data---------------------------------*/
	if($ACTION == "MAKEDEFAULT"){
		$currencyId=isset($_REQUEST['currencyId'])?$_REQUEST['currencyId']:0;
		if($currencyId > 0){
			$sqlUpdate1="UPDATE `currency` SET `isDefault` = 0 WHERE 1 ";
			//echo $sqlUpdate1; exit;
			$sqlUpdate1_res = mysqli_query($dbConn, $sqlUpdate1);
			
			$sqlUpdate2="UPDATE `currency` SET `isDefault` = 1 WHERE `currency`.`currencyId` = ".$currencyId;
			//echo $sqlUpdate2; exit;
			$sqlUpdate2_res = mysqli_query($dbConn, $sqlUpdate2);
			
			/*----------------------------------Updating project information Data-------------------------*/
			$sqlSelect = "SELECT `currency`, `currencySign` FROM `currency` WHERE `currencyId` = ".$currencyId;
			$sqlSelect_res = mysqli_query($dbConn, $sqlSelect);
			$currencyData = mysqli_fetch_assoc($sqlSelect_res);
			if ($currencyData) {
				$projectInfoData = readPreCompliedData("PROJECTINFORMATION");
				$projectInfoData = json_decode($projectInfoData, true);
				$projectInfoData['defaultInformation']['currency'] = $currencyData['currency'];
				$projectInfoData['defaultInformation']['currencySign'] = $currencyData['currencySign'];
				//echo var_dump($projectInfoData);exit;
				overWritePreCompileData("PROJECTINFORMATION", $projectInfoData);
				//Important! go to api/preCompiledData/projectInformations.json and chnage the Currency Sign manually
			}
			/*----------------------------------Updating project information Data-------------------------*/
		}
		echo "<script language=\"javascript\">window.location = 'currency.php'</script>";exit;
	}
	/*--------------------------------------------Defaulting currency Data---------------------------------*/
	
	/*--------------------------------------------Populating currency Data---------------------------------*/
	mysqli_set_charset($dbConn, 'utf8mb4');
	$sql="SELECT `currencyId`,`currency`,`currencySign`,`isDefault` FROM `currency` WHERE 1";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$currencyObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$currencyObject = (object) [
								   'currencyId' => (int)$sql_res_fetch["currencyId"], 
								   'currency' => $sql_res_fetch["currency"],
								   'currencySign' => $sql_res_fetch["currencySign"],
								   'isDefault' => $sql_res_fetch["isDefault"] ? true : false
								  ];
		//echo json_encode($currencyObject);exit;
		$currencyObjectArray[] = $currencyObject;
	}
	//echo json_encode($currencyObjectArray, JSON_UNESCAPED_UNICODE);exit;
	/*--------------------------------------------Populating currency Data---------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Settings currency</title>
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
			<div id="currencySectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_835">Currency</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<form id="financeEntryForm" name="financeEntryForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return settingsFunctionality.validateCurrencyEntryForm();">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20">
						
							<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_835">Currency</span>
									<input type="text" id="currency" name="currency" class="form-control" value="" placeholder="Please enter currency name" rel="cms_836">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_837">Currency Sign</span>
									<input type="text" id="currencySign" name="currencySign" class="form-control" value="" placeholder="Please enter currency sign" rel="cms_838">
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
							<span id="cms_839">List of Currencies</span>
						</b>
					</h5>
					<div id="currencyTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
				</div>
				<input id="currencyData" name="currencyData" type="hidden" value='<?php echo json_encode($currencyObjectArray, JSON_UNESCAPED_UNICODE); ?>'>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>