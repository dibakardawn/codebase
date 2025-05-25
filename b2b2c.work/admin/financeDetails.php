<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "FINANCE";

$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
$financeId=isset($_REQUEST['financeId'])?(int)$_REQUEST['financeId']:0;
if($ACTION == "DELETE"){
	if($financeId > 0){
		/*----------------------------------Deleting Supporting Document from Finance---------------------------------*/
		$sql = "SELECT `supportingDocument` FROM `finance` WHERE `financeId` = " . $financeId;
		// echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		$sql_res_fetch = mysqli_fetch_array($sql_res);
		$supportingDocuments = explode(',', $sql_res_fetch["supportingDocument"]);
		foreach ($supportingDocuments as $document) {
			$document = trim($document);
			if (!empty($document)) {
				deleteFile($document, "uploads/financeSuppotingDocument/");
			}
		}
		/*----------------------------------Deleting Supporting Document from Finance---------------------------------*/
		
		$sql_delete = "DELETE FROM finance WHERE `finance`.`financeId` = ".$financeId;
		//echo $sql_delete; exit;
		$sql_delete_res = mysqli_query($dbConn, $sql_delete);
	}
	echo "<script language=\"javascript\">window.location = 'finance.php'</script>";exit;
}else{
	if($financeId > 0){
		$sql = "SELECT 
				`finance`.`financeId`, 
				`finance`.`financeCode`, 
				`finance`.`financeType`, 
				`finance`.`financeCategoryId`, 
				CASE 
					WHEN `finance`.`financeType` = 0 THEN `expenseType`.`expenseTypeTitle`
					WHEN `finance`.`financeType` = 1 THEN `earningType`.`earningTypeTitle`
					ELSE NULL
				END AS `FinanceCategory`,
				`finance`.`financeTitle`, 
				`finance`.`financeDate`, 
				`finance`.`debit`, 
				`finance`.`credit`, 
				`finance`.`description`, 
				`finance`.`supportingDocument`
			FROM `finance`
			LEFT JOIN `expenseType` ON `finance`.`financeType` = 0 AND `expenseType`.`expenseTypeId` = `finance`.`financeCategoryId`
			LEFT JOIN `earningType` ON `finance`.`financeType` = 1 AND `earningType`.`earningTypeId` = `finance`.`financeCategoryId`
			WHERE `finance`.`financeId` = ".$financeId;
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		$sql_res_fetch = mysqli_fetch_array($sql_res);
		//print_r($sql_res_fetch); exit;
	}else{
		echo "<script language=\"javascript\">window.location = 'finance.php'</script>";exit;
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Finance Details</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/finance.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="financeSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span><?php echo $sql_res_fetch["financeCode"]." (".$sql_res_fetch["FinanceCategory"].")"; ?></span>
						</b>
					</h5>
					<?php if(intval($_SESSION['userRoleid']) == 1){ ?>
						<button type="button" id="deleteBtn" class="btn btn-danger pull-right" onclick="financeFunctionality.deleteFinanceRecord(<?php echo $sql_res_fetch["financeId"]; ?>)">Delete</button>
					<?php } ?>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 noLeftPaddingOnly">
						<div>
							<b id="cms_773">Title : </b>
							<span><?php echo $sql_res_fetch["financeTitle"]; ?></span>
						</div>
						<div>
							<b id="cms_771">Date & Time : </b>
							<span><?php echo $sql_res_fetch["financeDate"]; ?></span>
						</div>
						<div>
							<b id="cms_774">Amount : </b>
							<span id="defaultCurrency"></span>
							<span>
								<?php 
									if(intval($sql_res_fetch["financeType"]) == 0){ 
										echo $sql_res_fetch["debit"]; 
									} else { 
										echo $sql_res_fetch["credit"]; 
									}  
								?>
							</span>
						</div>
						<div>
							<b id="cms_772">Description : </b>
							<span><?php echo $sql_res_fetch["description"]; ?></span>
						</div>
					</div>
					<div id="filePreview" class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
					</div>
				</div>
				<input id="supportingDocuments" name="supportingDocuments" type="hidden" value='<?php echo $sql_res_fetch["supportingDocument"]; ?>'>
				<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>