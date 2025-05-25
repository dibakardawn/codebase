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
		<title>Welcome to Supplier Portal | Order Packing Details</title>
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
		<?php include('includes/header.php'); ?>
		<div id="orderPackingDetailSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot16">
			<h4 class="text-left">
				<b>
					<i class="fa fa-archive"></i> 
					<span id="cms_657">Order Packing Details</span>
				</b>
			</h4>
			<?php include('includes/orderDetailPackingTab.php'); ?>
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<select id="packageList" name="packageList" class="pull-left ddlStyle marRig10 marTop5" onChange="supplierFunctionality.changePackageList()">
					</select>
					<select id="packageDimention" name="packageDimention" class="pull-left ddlStyle marRig10 marTop5" onChange="supplierFunctionality.changePackageDimention()">
					</select>
					<button id="populatePackageBtn" type="button" class="btn btn-success marTop5" disabled onClick="supplierFunctionality.populatePackages()" rel="cms_660">Populate Package</button>
				</div>
				<div id="packageDetailsHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
				</div>
				<div id="orderItemsHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
					<button id="placeOrderBtn" type="button" class="btn btn-success marTop5" onClick="supplierFunctionality.savePackingDetails()" rel="cms_661">Save Packaging Details</button>
					<button id="markAsShippedBtn" type="button" class="btn btn-success marTop5" onClick="supplierFunctionality.markedAsShipped()" rel="cms_682" disabled>Mark as Shipped</button>
					<button id="cartonTagBtn" type="button" class="btn btn-primary marTop5" onclick="supplierFunctionality.openCartonTag()"><span id="cms_662">Carton Tag</span></button>
				</div>
			</div>
		</div>
		<br clear="all">
		<!--Sale Order Packet Modal-->
		<div class="modal fade" id="saleOrderPacketModal" role="dialog">
			<div class="modal-dialog modal-md">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 id="saleOrderPacketHeader" class="modal-title"></h4>
					</div>
					<div class="modal-body">
						<div id="saleOrderPacketTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						</div>
						<br clear="all">
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default pull-right" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
		<!--Sale Order Packet Modal-->
		<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
		<?php include('includes/footer.php'); ?>
	</body>
</html>