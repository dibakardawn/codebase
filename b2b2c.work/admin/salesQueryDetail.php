<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "SALESSEARCH";

$salesSearchId=isset($_REQUEST['salesSearchId'])?(int)$_REQUEST['salesSearchId']:0;
if(count($_POST)){
	$salesAnswerEncrypted=isset($_REQUEST['salesAnswerEncrypted'])?$_REQUEST['salesAnswerEncrypted']:"";
	$selectedLang=isset($_REQUEST['selectedLang'])?$_REQUEST['selectedLang']:'en';
	$supportingDocuments = multiplefileUpload($salesSearchId, "uploads/salesQuestionSuppotingDocument/", "supportingDocument", "supportingDocument", ALLOWEDSALESSUPPORTINGDOCEXTENSIONS);
	
	/*echo "salesAnswerEncrypted : ".$salesAnswerEncrypted."<br>";
	echo "supportingDocuments : ".$supportingDocuments."<br>";exit;*/
	
	$sql = "INSERT INTO `salesSearch` (
										`salesSearchContent`, 
										`supportingDocuments`, 
										`createdBy`, 
										`createdOn`, 
										`salesSearchParentId`, 
										`status`
									) VALUES (
										'".$salesAnswerEncrypted."',
										'".$supportingDocuments."', 
										'".$_SESSION['userId']."', 
										NOW(), 
										'".$salesSearchId."', 
										'1')";
	$sql_res = mysqli_query($dbConn, $sql);
	/*------------------------------------Inserting mail for the Other User involve in the Query-----------------------------*/
	$fromEmail = SYSTEMEMAIL;
	$subject = "A new messge for you, from ".SITENAME." users";
	$sql_otherUserEmail = "SELECT DISTINCT `adminUser`.`userEmail`
							FROM `salesSearch`
							INNER JOIN `adminUser` ON `salesSearch`.`createdBy` = `adminUser`.`userId`
							WHERE (`salesSearch`.`salesSearchId` = '".$salesSearchId."' OR `salesSearch`.`salesSearchParentId` = '".$salesSearchId."')
							AND `salesSearch`.`createdBy` != '".$_SESSION['userId']."'";
	//echo $sql_otherUserEmail; exit;
	$sql_otherUserEmail_res = mysqli_query($dbConn, $sql_otherUserEmail);
	while($sql_otherUserEmail_res_fetch = mysqli_fetch_array($sql_otherUserEmail_res)){
		$toEmail = $sql_otherUserEmail_res_fetch["userEmail"];
		if($toEmail != ""){
			$template = file_get_contents('../assets/templates/mailTemplates/sales_new_message_notification.' . $selectedLang . '.html');
			$replacements = [
				'{{SITEURL}}'  => SITEURL,
				'{{SITENAME}}' => SITENAME,
				'{{year}}'     => date('Y')
			];
			foreach ($replacements as $key => $value) {
				$template = str_replace($key, $value, $template);
			}
			$message = $template;
			insertMail($dbConn, $toEmail, $fromEmail, $subject, $message, "SALESQUERY-".$salesSearchId);
		}
	}
	/*------------------------------------Inserting mail for the Other User involve in the Query-----------------------------*/
	echo "<script language=\"javascript\">window.location = 'salesQueryDetail.php?salesSearchId=".$salesSearchId."'</script>";exit;
}else{
	if($salesSearchId > 0){
		$sql = "SELECT `salesSearch`.`salesSearchId`,
		`salesSearch`.`salesSearchContent`,
		`salesSearch`.`createdBy`,
		CONCAT(`adminUser`.`userFirstName`, ' ', `adminUser`.`userLastName`) AS 'userName',
		DATE_FORMAT(`salesSearch`.`createdOn`, '%d-%m-%Y %r') AS 'createdOn'
		FROM `salesSearch` 
		INNER JOIN `adminUser`
		ON `salesSearch`.`createdBy` = `adminUser`.`userId`
		WHERE `salesSearch`.`salesSearchId` = ".$salesSearchId."
		AND `salesSearch`.`status` = 1 
		ORDER BY `salesSearch`.`createdOn` DESC";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		$sql_res_fetch = mysqli_fetch_array($sql_res);
		
		$sql_ChildItems = "SELECT `salesSearch`.`salesSearchId`,
		`salesSearch`.`salesSearchContent`,
		`salesSearch`.`supportingDocuments`,
		`salesSearch`.`createdBy`,
		CONCAT(`adminUser`.`userFirstName`, ' ', `adminUser`.`userLastName`) AS 'userName',
		`adminUser`.`userRoleid`,
		DATE_FORMAT(`salesSearch`.`createdOn`, '%d-%m-%Y %r') AS 'createdOn'
		FROM `salesSearch` 
		INNER JOIN `adminUser`
		ON `salesSearch`.`createdBy` = `adminUser`.`userId`
		WHERE `salesSearch`.`salesSearchParentId` = ".$salesSearchId."
		AND `salesSearch`.`status` = 1 
		ORDER BY `salesSearch`.`createdOn` ASC";
		//echo $sql_ChildItems; exit;
		$sql_ChildItems_res = mysqli_query($dbConn, $sql_ChildItems);
	}else{
		echo "<script language=\"javascript\">window.location = 'salesSearch.php'</script>";exit;
	}
}
?>

<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Sales Query Detail</title>
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
		<link rel="stylesheet" href="https://cdn.quilljs.com/1.2.2/quill.snow.css">
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
		<script type="text/javascript" src="https://cdn.quilljs.com/1.2.2/quill.js"></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/salesSearch.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="salesSearchHolder">
				<header class="w3-container" style="padding-top:10px">
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_294">Sales Query Details</span></b></h5>
					<button type="button" class="btn btn-info pull-right marBot5" rel="cms_295" onclick="salesSearchFunctionality.goToSalesQueries()">Queries</button>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div id="chatMessages" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot10 chat-messages">
						
						<div id="salesSearchQuestion_<?php echo $salesSearchId; ?>" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly message user">
							<div class="content">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly" id="salesSearchContent_<?php echo $salesSearchId; ?>"></div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-left marTop5 f12">
									<b id="cms_290">Posted By :</b><span> <?php echo $sql_res_fetch["userName"]; ?></span><span> on <?php echo $sql_res_fetch["createdOn"]; ?></span>
								</div>
							</div>
							<input id="salesSearchContentEncrypted_<?php echo $salesSearchId; ?>" name="salesSearchContentEncrypted_<?php echo $salesSearchId; ?>" type="hidden" value="<?php echo $sql_res_fetch["salesSearchContent"]; ?>">
						</div>
						
						<?php 
						while($sql_ChildItems_res_fetch = mysqli_fetch_array($sql_ChildItems_res)){
							$msgType = "user"; //Blue messege right aligned
							if(intval($sql_ChildItems_res_fetch["userRoleid"]) == 4){
								$msgType = "bot"; //Gray messege left aligned
							}
						?>
							<div id="salesSearchQuestion_<?php echo $salesSearchId; ?>" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly message <?php echo $msgType; ?>">
								<div class="content">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly" id="salesSearchContent_<?php echo $sql_ChildItems_res_fetch["salesSearchId"]; ?>"></div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly" id="fileListHolder_<?php echo $sql_ChildItems_res_fetch["salesSearchId"]; ?>"></div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5 text-left f12">
										<b id="cms_290">Posted By :</b><span> <?php echo $sql_ChildItems_res_fetch["userName"]; ?></span><span> on <?php echo $sql_ChildItems_res_fetch["createdOn"]; ?></span>
									</div>
								</div>
								<input id="salesSearchContentEncrypted_<?php echo $sql_ChildItems_res_fetch["salesSearchId"]; ?>" name="salesSearchContentEncrypted_<?php echo $sql_ChildItems_res_fetch["salesSearchId"]; ?>" type="hidden" value="<?php echo $sql_ChildItems_res_fetch["salesSearchContent"]; ?>">
								<input id="supportingDocuments_<?php echo $sql_ChildItems_res_fetch["salesSearchId"]; ?>" name="supportingDocuments_<?php echo $sql_ChildItems_res_fetch["salesSearchId"]; ?>" type="hidden" value="<?php echo $sql_ChildItems_res_fetch["supportingDocuments"]; ?>">
							</div>
						<?php } ?>
						
					</div>
					<h5><b><i class="fa fa-commenting marRig5"></i></b><b id="cms_300">Post Your comments here</b></h5>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<form id="salesAnswerForm" name="salesAnswerForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return salesSearchFunctionality.validateSalesAnswerForm();" enctype="multipart/form-data">
							<div id="salesAnswerBodyHolder" class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
								<div id="salesAnswerErrHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
								<div id="salesAnswerBody"></div>
								<input id="salesAnswerEncrypted" name="salesAnswerEncrypted" type="hidden" value="">
							</div>
							<div id="supportingDocumentHolder" class="col-lg-6 col-md-6 col-sm-6 col-xs-12 noRightPaddingOnly">
								<div id="cms_296" class="redText">Supporting Documents sholud be .pdf,.xls,.xlsx,.csv,.doc,.docx,.text,.png,.jpg,.jpeg only</div>
								<div class="input-group marBot5">
									<span id="supportingDocumentSpan" class="input-group-addon"><span id="cms_297">Supporting Documents</span> : </span>
									<input type="file" name="supportingDocument[]" id="supportingDocument" class="form-control" autocomplete="off" multiple accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.text,.png,.jpg,.jpeg" onchange="salesSearchFunctionality.listFiles('inputSection')">
								</div>
								<div id="FilesSelected"></div>
								<br clear="all">
								<input id="salesSearchId" name="salesSearchId" type="hidden" value="<?php echo $salesSearchId; ?>">
								<input id="selectedLang" name="selectedLang" type="hidden" value="en">
								<button id="submitBtn" type="submit" class="btn btn-success disabled marLeft5" rel="cms_298">Submit</button>
							</div>
						</form>
					</div>
					
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>