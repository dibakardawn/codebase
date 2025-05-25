<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "MAIL";

$sqlDeleteOTPMail = "DELETE FROM `mail` WHERE `reference` = 'OTP' AND `sent` = 1";
//echo $sqlDeleteOTPMail; exit;
$sqlDeleteOTPMail_res = mysqli_query($dbConn, $sqlDeleteOTPMail);

?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Mails</title>
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
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/plugins/fullCalender.css">
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/mail.js'></script>
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="mailSectionHolder">
				<header class="w3-container">
					<h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_778">Mails</span>
						</b>
					</h5>
					<div class="input-group">
						<input type="text" id="search" name="search" class="form-control" placeholder="Search with keyword">
						<div class="input-group-btn">
						  <button class="btn btn-default h34" type="button" onclick="mailFunctionality.searchMail()">
							<i class="glyphicon glyphicon-search"></i>
						  </button>
						</div>
					</div>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX">
						<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">
							<tr>
								<td width="100%"><strong id="cms_779">List of Mails</strong></td>
							</tr>
							<?php
							$search=isset($_REQUEST['search'])?$_REQUEST['search']:"";
							//echo $search; exit;
							$subQry = "";
							if($search != ""){
								$subQry = " AND concat(toEmail, fromEmail, subject,	reference) like '%".$search."%'";
							}
							$sqlMails = "SELECT 
										`mailId`,
										`toEmail`,
										`fromEmail`,
										`subject`,
										`body`,
										DATE_FORMAT(`createdTimeStamp` ,'%Y-%m-%d %H:%i:%s') AS 'createdDate'
										FROM `mail` 
										WHERE `sent` = 0 ".$subQry." 
										ORDER BY `createdTimeStamp` DESC";
							//xxxx `sent` = 0 temporary vs `sent` = 1 permanent
							//echo $sqlMails; exit;
							$sqlMails_res = mysqli_query($dbConn, $sqlMails);
							while($sqlMails_res_fetch = mysqli_fetch_array($sqlMails_res)){
							?>
							<tr>
								<td>
									<div class="pull-left w100p hover" onclick="mailFunctionality.openMail(<?php echo $sqlMails_res_fetch["mailId"]; ?>)">
										<span id="subject_<?php echo $sqlMails_res_fetch["mailId"]; ?>" class="pull-left blueText"><?php echo $sqlMails_res_fetch["subject"]; ?></span>
										<span class="pull-right blueText"><?php echo $sqlMails_res_fetch["createdDate"]; ?></span>
									</div>
									<div class="pull-left w100p f12">
										<span class="pull-left greenText marRig5"><?php echo $sqlMails_res_fetch["fromEmail"]; ?></span>
										<span class="pull-left marRig5">To</span>
										<span class="pull-left greenText marRig5"><?php echo $sqlMails_res_fetch["toEmail"]; ?></span>
									</div>
									<input type="hidden" id="hdnBody_<?php echo $sqlMails_res_fetch["mailId"]; ?>" name="hdnBody_<?php echo $sqlMails_res_fetch["mailId"]; ?>" value="<?php echo $sqlMails_res_fetch["body"]; ?>">
								</td>
							</tr>
							<?php } ?>
						</table>
						<div class="modal fade" id="mailModal" role="dialog">
							<div class="modal-dialog modal-lg">
								<div class="modal-content">
									<div class="modal-header">
										<button type="button" class="close" data-dismiss="modal">&times;</button>
										<h6 class="modal-title"></h6>
									</div>
									<div class="modal-body scrollY"></div>
									<div class="modal-footer">
										<button type="button" class="btn btn-default" data-dismiss="modal" rel="cms_780">Close</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
			<!-- End page content -->
		</div>
	</body>
</html>