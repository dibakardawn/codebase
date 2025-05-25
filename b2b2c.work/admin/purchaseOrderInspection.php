<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PURCHASEORDER";
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Purchase Order Inspection</title>
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
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/hummingbird-treeview.js"></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/purchaseOrder.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="purchaseOrderSectionHolder">
				<header class="w3-container" style="padding-top:10px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if (isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_699">Purchase Order Inspection</span>
						</b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 noLeftPaddingOnly">
							<h5 id="arrivedItemsHeader" class="text-center"></h5>
							<div id="cartTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX">
							</div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
							<h5 id="defectiveItemsHeader" class="text-center"></h5>
							<div id="discardTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX">
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center marTop10">
							<button type="button" class="btn btn-success" rel="cms_701" onclick="purchaseOrderFunctionality.saveInspection(true)">Save Inspection</button>
							<button type="button" class="btn btn-success" rel="cms_702" onclick="purchaseOrderFunctionality.openItemPositionModal()">Finalize Inspection & Convert to Stock</button>
						</div>
					</div>
					<!--Sale Order Packet Modal-->
					<div class="modal fade" id="returnNoteModal" role="dialog">
						<div class="modal-dialog modal-md">
							<div class="modal-content">
								<div class="modal-header">
									<button type="button" class="close" data-dismiss="modal">&times;</button>
									<h4 id="returnNoteHeader" class="modal-title"></h4>
								</div>
								<div class="modal-body">
									<div id="returnNoteTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									</div>
									<br clear="all">
								</div>
								<div class="modal-footer">
									<input id="productCombinationId" name="productCombinationId" type="hidden" value='0'>
									<input id="index" name="index" type="hidden" value='0'>
									<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_696">Close</button>
									<button type="button" class="btn btn-success pull-right" rel="cms_559" onclick="purchaseOrderFunctionality.saveReturnNote()">Save</button>
								</div>
							</div>
						</div>
					</div>
					<!--Sale Order Packet Modal-->
					<!--Item Position Modal-->
					<div class="modal fade" id="itemPositionModal" role="dialog">
						<div class="modal-dialog modal-md">
							<div class="modal-content">
								<div class="modal-header">
									<button type="button" class="close" data-dismiss="modal">&times;</button>
									<h4 id="cms_703" class="modal-title">Select Item Position</h4>
								</div>
								<div class="modal-body">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div id="treeview_container" class="hummingbird-treeview scrollX">
											<ul id="treeview" class="hummingbird-base padLeft16"></ul>
										</div>
									</div>
									<br clear="all">
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_696">Close</button>
									<button type="button" class="btn btn-success pull-right" rel="cms_704" onclick="purchaseOrderFunctionality.saveInspection(false)">Convert to Stock</button>
									<div class="pull-right">
										<label class="pull-right marLeft5">
											<i id="barCode" class="fa fa-barcode f38 hide"></i>
											<i id="qrCode" class="fa fa-qrcode f38"></i>
										</label>
										<label id="barQr_switch" class="switch pull-right" onchange="purchaseOrderFunctionality.onBarQrSwitchChange()">
											<input id="barQr" name="barQr" type="checkbox" value="0">
											<span id="barQrSlider" class="slider"></span>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!--Item Position Modal-->
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<input id="selectedSupplierId" name="selectedSupplierId" type="hidden" value='0'>
					<input id="purchaseOrderId" name="purchaseOrderId" type="hidden" value='0'>
					<input id="itemPosition" name="itemPosition" type="hidden" value='0'>
					<input id="systemReferenceType" name="systemReferenceType" type="hidden" value='0'>
					<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
				</div>
			</div>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>