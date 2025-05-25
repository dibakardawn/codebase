<?php
include('../config/config.php');
$section = "SUPPLIERPORTAL";
$page = "ORDERDETAIL";
$orderId=isset($_REQUEST['orderId'])?$_REQUEST['orderId']:0;
if(!isset($_SESSION['supplierId'])){
	echo "<script language=\"javascript\">window.location = 'logout.php'</script>";
}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Welcome to Supplier Portal | Order Packing Carton Tag</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" type="image/x-icon" href="<?php echo SITEURL; ?>favicon.ico">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<!-------------------------------------------------Font Awesome----------------------------------------------------------->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0" as="font" type="font/woff2" crossorigin="anonymous">
		<!-------------------------------------------------Font Awesome----------------------------------------------------------->
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/supplierStyle/supplierStyle.css">
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/supplierFunctionality/supplierFunctionality.js'></script>
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
	</head>
	<body>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-left no-print">
			<button type="button" class="btn btn-xs btn-success marLeft5 marTop5" onclick="window.print();">
				<i class="fa fa-print marRig5"></i>
				<span>Print</span>
			</button>
		</div>
		<div id="printableCartonData" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot16">
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-left no-print">
			<button type="button" class="btn btn-xs btn-success marLeft5 marTop5" onclick="window.print();">
				<i class="fa fa-print marRig5"></i>
				<span>Print</span>
			</button>
			<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
		</div>
	</body>
</html>