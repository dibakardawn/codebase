<?php
include('../config/config.php');
include('auth.php');

$section = "ADMIN";
$page = "FINANCE";
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Finance Report</title>
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
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/highcharts.js"></script>
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/highcharts-accessibility.js"></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/plugins/fullCalender.js'></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/finance.js'></script>
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
	</head>
	<body>
		<div id="financeSectionHolder">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center marTop5 marBot5 f10 no-print">
				<button type="button" class="btn btn-success btn-xs f12" onclick="window.print();">
					<span id="cms_727">Print</span>
					<span class="glyphicon glyphicon-print"></span>
				</button>
			</div>
			<h5 class="text-center"><b id="cms_726">Financial Statements</b></h5>
			
			<div id="financeTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection"></div>
			
			<div id="financeBarChartHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection hide"></div>
				
			<div id="financeLineChartHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection hide"></div>
				
			<div id="financePieChartHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection hide"></div>
				
			<div id="financeCalenderHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection hide"></div>
				
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center marTop5 marBot5 f10 no-print">
				<button type="button" class="btn btn-success btn-xs f12" onclick="window.print();">
					<span id="cms_727">Print</span>
					<span class="glyphicon glyphicon-print"></span>
				</button>
			</div>
		</div>
		<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
		<input id="CMSDATA" name="CMSDATA" type="hidden" value='<?php if($section != "" && $page != ""){ echo readPreCompiledCmsData($section, $page); }?>'>
	</body>
</html>