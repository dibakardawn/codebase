<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "SALESSEARCH";

if(count($_POST)){
	$searchQueryEncrypted=isset($_REQUEST['searchQueryEncrypted'])?$_REQUEST['searchQueryEncrypted']:"";
	$selectedLang=isset($_REQUEST['selectedLang'])?$_REQUEST['selectedLang']:'en';
	$sql = "INSERT INTO `salesSearch` (
										`salesSearchContent`, 
										`supportingDocuments`, 
										`createdBy`, 
										`createdOn`, 
										`salesSearchParentId`, 
										`status`
									) VALUES (
										'".$searchQueryEncrypted."',
										'', 
										'".$_SESSION['userId']."', 
										NOW(), 
										'0', 
										'1')";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$inserted_salesSearchId = mysqli_insert_id($dbConn);
	
	/*------------------------------------Inserting mail for Sales Expert-----------------------------*/
	$fromEmail = SYSTEMEMAIL;
	$subject = "A new query for you! from ".SITENAME." users";
	$sql_salesExpert = "SELECT `adminUser`.`userEmail` 
						FROM `adminUser` 
						INNER JOIN `adminUserRole`
						ON `adminUserRole`.`userRoleid` = `adminUser`.`userRoleid`
						WHERE `adminUserRole`.`userRole` = 'SALESEXPERT'
						AND `adminUser`.`status` = 1";
	//echo $sql_salesExpert; exit;
	$sql_salesExpert_res = mysqli_query($dbConn, $sql_salesExpert);
	while($sql_salesExpert_res_fetch = mysqli_fetch_array($sql_salesExpert_res)){
		$toEmail = $sql_salesExpert_res_fetch["userEmail"];
		if($toEmail != ""){
			$template = file_get_contents('../assets/templates/mailTemplates/sales_expert_new_task.' . $selectedLang . '.html');
			$replacements = [
				'{{SITEURL}}'  => SITEURL,
				'{{SITENAME}}' => SITENAME,
				'{{year}}'     => date('Y')
			];
			foreach ($replacements as $key => $value) {
				$template = str_replace($key, $value, $template);
			}
			$message = $template;
			insertMail($dbConn, $toEmail, $fromEmail, $subject, $message, "SALESQUERY-".$inserted_salesSearchId);
		}
	}
	/*------------------------------------Inserting mail for Sales Expert-----------------------------*/
	echo "<script language=\"javascript\">window.location = 'salesSearch.php'</script>";exit;
}else{
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	if($ACTION == "DELETESALESQUERY"){
		$salesSearchId=isset($_REQUEST['salesSearchId'])?(int)$_REQUEST['salesSearchId']:0;
		
		/*--------------------------Getting Supporting Documents------------------------------*/
		$salesSearchFileArr = [];
		$sql = "SELECT `supportingDocuments` FROM `salesSearch` WHERE `salesSearchParentId` = ".$salesSearchId;
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		while($sql_res_fetch = mysqli_fetch_array($sql_res)){
			if($sql_res_fetch["supportingDocuments"] != ""){
				$files = explode(",", $sql_res_fetch["supportingDocuments"]);
				$salesSearchFileArr = array_merge($salesSearchFileArr, $files); 
			}
		}
		//print_r($salesSearchFileArr); exit;
		/*--------------------------Getting Supporting Documents------------------------------*/
		
		/*--------------------------Deleting Supporting Documents-----------------------------*/
		for($i = 0; $i < count($salesSearchFileArr); $i++){
			deleteFile($salesSearchFileArr[$i], "uploads/salesQuestionSuppotingDocument/");
		}
		/*--------------------------Deleting Supporting Documents-----------------------------*/
		
		/*--------------------------Deleting Sales Search Child Records-----------------------*/
		$sql_delete_child = "DELETE FROM `salesSearch` WHERE `salesSearch`.`salesSearchParentId` = ".$salesSearchId;
		//echo $sql_delete_child; exit;
		$sql_delete_child_res = mysqli_query($dbConn, $sql_delete_child);
		/*--------------------------Deleting Sales Search Child Records-----------------------*/
		
		/*--------------------------Deleting Sales Search Parent Records----------------------*/
		$sql_delete_parent = "DELETE FROM `salesSearch` WHERE `salesSearch`.`salesSearchId` = ".$salesSearchId;
		//echo $sql_delete_parent; exit;
		$sql_delete_parent_res = mysqli_query($dbConn, $sql_delete_parent);
		/*--------------------------Deleting Sales Search Parent Records----------------------*/
		
		echo "<script language=\"javascript\">window.location = 'salesSearch.php'</script>";exit;
	}else{
		$sql = "SELECT `salesSearch`.`salesSearchId`,
		`salesSearch`.`salesSearchContent`,
		`salesSearch`.`createdBy`,
		CONCAT(`adminUser`.`userFirstName`, ' ', `adminUser`.`userLastName`) AS 'userName',
		DATE_FORMAT(`salesSearch`.`createdOn`, '%d-%m-%Y %r') AS 'createdOn',
		(
			SELECT COUNT(*) 
			FROM `salesSearch` AS child
			WHERE child.`salesSearchParentId` = `salesSearch`.`salesSearchId`
		) AS 'childCount'
		FROM `salesSearch` 
		INNER JOIN `adminUser`
		ON `salesSearch`.`createdBy` = `adminUser`.`userId`
		WHERE `salesSearch`.`salesSearchParentId` = 0 
		AND `salesSearch`.`status` = 1 
		ORDER BY `salesSearch`.`createdOn` DESC";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		$noOfRecords = mysqli_num_rows($sql_res);
	}
}
?>

<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Sales Search</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/salesSearch.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="salesSearchHolder">
				<header class="w3-container" style="padding-top:10px">
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_286">Sales Search</span></b></h5>
					<button type="button" class="btn btn-info pull-right marTop5" rel="cms_301" data-toggle="modal" data-target="#salesSearchQModal">What is Sales Search ?</button>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php if(intval($_SESSION['userRoleid']) != 4){ //Sales expert Cant see this Search Panel ?>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<span id="cms_287">You can place your busniess query here, for an example :</span> 
							<b id="cms_288">Please prepare a list of leather goods traders of Bern, Switzerland</b>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<form id="salesSearchForm" name="salesSearchForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return salesSearchFunctionality.validateSalesSearchForm();">
								<div class="input-group input-group-lg marBot5 pull-right">
									<span id="cms_289" class="input-group-addon">Place Your Query : </span>
									<input id="searchQuery" name="searchQuery" type="text" class="form-control" placeholder="Please Place Your Query Here..." autocomplete="off" value="" rel="cms_302">
									<input id="searchQueryEncrypted" name="searchQueryEncrypted" type="hidden" value="">
									<span class="input-group-addon"><i class="fa fa-cloud-upload hover" onclick="salesSearchFunctionality.submitQuery();"></i></span>
								</div>
								<input id="selectedLang" name="selectedLang" type="hidden" value="en">
							</form>
						</div>
					<?php } ?>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<?php 
						if($noOfRecords > 0){
							while($sql_res_fetch = mysqli_fetch_array($sql_res)){ 
								$salesSearchQuestionClass = "salesSearchQustionsRed";
								if(intval($sql_res_fetch["childCount"]) > 0){
									$salesSearchQuestionClass = "salesSearchQustionsGreen";
								}
								?>
									<div id="salesSearchQuestion_<?php echo $sql_res_fetch["salesSearchId"]; ?>" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 <?php echo $salesSearchQuestionClass; ?>">
										<?php if(intval($_SESSION['userRoleid']) != 4){ //Sales expert Cant see this Search Panel ?>
											<span class="pull-right"><i class="fa fa-times redText hover marleft5" onclick="salesSearchFunctionality.deleteSalesQuery(<?php echo $sql_res_fetch["salesSearchId"]; ?>);"></i></span>
										<?php } ?>
										<div id="salesSearchContent_<?php echo $sql_res_fetch["salesSearchId"]; ?>"></div>
										<input id="salesSearchContentEncrypted_<?php echo $sql_res_fetch["salesSearchId"]; ?>" name="salesSearchContentEncrypted_<?php echo $sql_res_fetch["salesSearchId"]; ?>" type="hidden" value="<?php echo $sql_res_fetch["salesSearchContent"]; ?>">
										<div class="pull-left f12">
											<b id="cms_290">Posted By :</b><span> <?php echo $sql_res_fetch["userName"]; ?></span><span> on <?php echo $sql_res_fetch["createdOn"]; ?></span>
										</div>
										<?php 
										if(intval($_SESSION['userRoleid']) == 4){
											?>
											<div class="pull-right f12">
												<a href="salesQueryDetail.php?salesSearchId=<?php echo $sql_res_fetch["salesSearchId"]; ?>">
													<i class="fa fa-comments-o"></i>
													<span id="cms_291">Respond</span>
												</a>
											</div>
											<?php
										}else{
											if(intval($sql_res_fetch["childCount"]) > 0){
												?>
												<div class="pull-right f12">
													<b id="cms_292">Responded by sales exparts</b>
													<i class="fa fa-comments-o"></i>
													<a href="salesQueryDetail.php?salesSearchId=<?php echo $sql_res_fetch["salesSearchId"]; ?>" id="cms_293">View Response</a>
												</div>
												<?php
											}
										}
										?>
									</div>
								<?php 
							} 
						}
						?>
					</div>
				</div>
				<!-- Customer Search Modal -->
				<div class="modal fade" id="salesSearchQModal" role="dialog">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_305" class="modal-title">What Sales Search Do?</h4>
							</div>
							<div id="salesSearchQModalBody" class="modal-body">
								<div id="cms_303">You can post your business query here. Our business experts will provide you the answer and relevant data, so that you can get the necessary suggestions on time. The business query you will be posting here may take some days to be answered by our business experts. You will be notified on your registered mail id once our business experts will respond to your query.</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<button type="button" class="btn pull-right" data-dismiss="modal" rel="cms_304">Close</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Customer Search Modal -->
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>