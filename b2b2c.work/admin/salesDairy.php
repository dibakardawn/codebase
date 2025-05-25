<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "SALESDAIRY";
?>

<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Sales Dairy</title>
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
		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/plugins/fullCalender.js'></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/salesDairy.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="salesDairyHolder">
				<header class="w3-container" style="padding-top:10px">
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_264">Sales Dairy Calender</span></b></h5>
					<button type="button" class="btn btn-success pull-right" onclick="salesDairyFunctionality.toggleRightPanel('open', 'createEvent', '')" rel="cms_265">Create Sales Event</button>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div id="calendarHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly scrollX marBot10">
						<div id='calendar'></div>
					</div>
					<div id="createSalesEventHolder" class="col-lg-3 col-md-3 col-sm-3 col-xs-12 sectionBlock hide">
						<div><i class="fa fa-close redText pull-right marTop10" onclick="salesDairyFunctionality.toggleRightPanel('close', '', '')"></i></div>
						<h5 id="cms_265">Create Sales Event</h5>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="startDateTimeSpan" class="input-group-addon">
									<span id="cms_266">Event Start Time : </span>
								</span>
								<input id="startDateTime" name="startDateTime" type="datetime-local" min="<?php echo date("Y-m-d"); ?>" max="<?php echo date('Y', strtotime('+1 year')); ?>" class="form-control" autocomplete="off" value="">
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="endDateTimeSpan" class="input-group-addon">
									<span id="cms_267">End Date Time : </span>
								</span>
								<input id="endDateTime" name="endDateTime" type="datetime-local" min="<?php echo date("Y-m-d"); ?>" max="<?php echo date('Y', strtotime('+1 year')); ?>" class="form-control" autocomplete="off" value="">
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="cms_268" class="input-group-addon">Event Title : </span>
								<input id="eventTitle" name="eventTitle" type="text" class="form-control" placeholder="Please Enter Event Title" autocomplete="off" value="" rel="cms_269">
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
							<div id="cms_270">Event Minutes :</div>
							<textarea id="eventMinutes" name="eventMinutes" rows="12" cols="45"></textarea>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
							<input id="parentId" name="parentId" type="hidden" value="0">
							<button type="button" class="btn btn-success marBot5" onclick="salesDairyFunctionality.saveSalesDairyEvent()" rel="cms_271">Save</button>
						</div>
					</div>
					<div id="salesEventHolder" class="col-lg-3 col-md-3 col-sm-3 col-xs-12 maxH500 minH234 sectionBlock hide">
						<div><i class="fa fa-close redText pull-right marTop10" onclick="salesDairyFunctionality.toggleRightPanel('close', '', '')"></i></div>
						<h5 id="salesEventTitle" class="text-center"></h5>
						<div><b id="cms_266">Event Start Time : </b><span id="startTimeSpan"></span></div>
						<div><b id="cms_267">Event End Time : </b><span id="endTimeSpan"></span></div>
						<div><b id="cms_270">Event Minutes : </b></div>
						<div id="eventMinutesSection"></div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<input id="salesDairyId" name="salesDairyId" type="hidden" value="">
							<input id="parentIdHdn" name="parentIdHdn" type="hidden" value="0">
							<div class="text-center">
								<button id="createFollowupSalesEventBtn" type="button" class="btn btn-success marTop10 marBot5" onclick="salesDairyFunctionality.createFollowupSalesEvent()" rel="cms_273">Create Follow Up Event</button>
								<button id="previousSalesEventBtn" type="button" class="btn btn-success marTop10 marBot5 hide" onclick="salesDairyFunctionality.gotoPreviousSalesEvent()" rel="cms_274">Previous Event</button>
							</div>
							<div class="text-center">
								<button id="deleteSalesDairyEventBtn" type="button" class="btn btn-danger marBot10" onclick="salesDairyFunctionality.deleteSalesDairyEvent()" rel="cms_272">Delete Event</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>