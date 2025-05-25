<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";


if(count($_POST)){
	$financeType=isset($_REQUEST['financeType'])?$_REQUEST['financeType']:"";
	/*echo "companyType : ".$companyType."<br>";exit;*/

	if($financeType != "" && $financeType == "EARNING"){
		$earningTypeTitle=isset($_REQUEST['financeTypeTitle'])?$_REQUEST['financeTypeTitle']:"";
		$sql = "INSERT INTO `earningType` (`earningTypeId`, `earningTypeTitle`) 
				VALUES (NULL, '".$earningTypeTitle."')";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
	}else if($financeType != "" && $financeType == "EXPENSE"){
		$expenseTypeTitle=isset($_REQUEST['financeTypeTitle'])?$_REQUEST['financeTypeTitle']:"";
		$sql = "INSERT INTO `expenseType` (`expenseTypeId`, `expenseTypeTitle`) 
				VALUES (NULL, '".$expenseTypeTitle."')";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
	}
	
	echo "<script language=\"javascript\">window.location = 'financeCategory.php'</script>";exit;
}else{
	
	/*--------------------------------------------Deleting Finance Type Data-----------------------------------*/
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	if($ACTION == "DELETE"){
		$financeType=isset($_REQUEST['financeType'])?$_REQUEST['financeType']:"";
		if($financeType != "" && $financeType == "EARNING"){
			$earningTypeId=isset($_REQUEST['earningTypeId'])?(int)$_REQUEST['earningTypeId']:0;
			if($earningTypeId > 0){
				$sqlDelete="DELETE FROM `earningType` WHERE `earningType`.`earningTypeId` = ".$earningTypeId;
				//echo $sqlDelete; exit;
				//$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
			}
		}else if($financeType != "" && $financeType == "EXPENSE"){
			$expenseTypeId=isset($_REQUEST['expenseTypeId'])?(int)$_REQUEST['expenseTypeId']:0;
			if($expenseTypeId > 0){
				$sqlDelete="DELETE FROM `expenseType` WHERE `expenseType`.`expenseTypeId` = ".$expenseTypeId;
				//echo $sqlDelete; exit;
				//$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
			}
		}
		echo "<script language=\"javascript\">window.location = 'financeCategory.php'</script>";exit;
	}
	/*--------------------------------------------Deleting Finance Type Data-----------------------------------*/
	
	/*--------------------------------------------Populating Earning Type Data---------------------------------*/
	$sql="SELECT `earningTypeId`,`earningTypeTitle` FROM `earningType` WHERE 1";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$earningTypeObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$earningTypeObject = (object) [
										'earningTypeId' => (int)$sql_res_fetch["earningTypeId"], 
										'earningTypeTitle' => $sql_res_fetch["earningTypeTitle"]
									  ];
		//echo json_encode($earningTypeObject);exit;
		$earningTypeObjectArray[] = $earningTypeObject;
	}
	//echo json_encode($earningTypeObjectArray);exit;
	/*--------------------------------------------Populating Earning Type Data---------------------------------*/
	
	/*--------------------------------------------Populating Expense Type Data---------------------------------*/
	$sql="SELECT `expenseTypeId`,`expenseTypeTitle` FROM `expenseType` WHERE 1";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$expenseTypeObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$expenseTypeObject = (object) [
										'expenseTypeId' => (int)$sql_res_fetch["expenseTypeId"], 
										'expenseTypeTitle' => $sql_res_fetch["expenseTypeTitle"]
									  ];
		//echo json_encode($expenseTypeObject);exit;
		$expenseTypeObjectArray[] = $expenseTypeObject;
	}
	//echo json_encode($expenseTypeObjectArray);exit;
	/*--------------------------------------------Populating Expense Type Data---------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Finance Categories</title>
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
			<div id="financeCategorySectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_909">Finance Categories</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<form id="financeCategoryForm" name="financeCategoryForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return settingsFunctionality.validateFinanceCategoryForm();">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20">
						
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<select id="financeType" name="financeType" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 h34 w100p marBot5">
									<option id="cms_910" value="">-- Select Finance Type --</option>
									<option id="cms_911" value="EARNING">Earning</option>
									<option id="cms_912" value="EXPENSE">Expense</option>
								</select>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_913">Finance Type Title</span>
									<input type="text" id="financeTypeTitle" name="financeTypeTitle" class="form-control" value="" placeholder="Please Enter Finance Type Title" rel="cms_914">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<button id="submitBtn" type="submit" class="btn btn-success pull-left" rel="cms_832">Submit</button>
							</div>
							
						</div>
					</form>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<h6>
								<b>
									<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
									<span id="cms_915">List of Earning Categories</span>
								</b>
							</h6>
							<div id="earningTableContainer" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div> 
						</div>
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopaddingOnly">
							<h6>
								<b>
									<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
									<span id="cms_916">List of Expense Categories</span>
								</b>
							</h6>
							<div id="expenseTableContainer" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div> 
						</div>
					</div>
					<input id="earningData" name="earningData" type="hidden" value='<?php echo json_encode($earningTypeObjectArray); ?>'>
					<input id="expenseData" name="expenseData" type="hidden" value='<?php echo json_encode($expenseTypeObjectArray); ?>'>
				</div>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>