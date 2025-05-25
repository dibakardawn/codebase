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
		<title><?php echo SITETITLE; ?> Admin | Purchase Orders</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/purchaseOrder.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="purchaseOrderSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i>	
							<span id="cms_506">Purchase Orders</span>
						</b>
					</h5>

					<button type="button" class="btn btn-success pull-right marBot5 marRig5" rel="cms_507" onClick="purchaseOrderFunctionality.addPurchaseOrder()">Add Purchase Order</button>
					<button type="button" class="btn btn-info pull-right marBot5 marRig5" rel="cms_508" onClick="purchaseOrderFunctionality.searchPurchaseOrderModal()">Search Purchase Orders</button>
				</header>
				<div id="purchaseOrderTableHolder" class="w3-row-padding w3-margin-bottom scrollX">
				</div>
				<!-- QR Modal for future on demand use-->
				<div class="modal fade" id="QRModal" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="QRModalHeader" class="modal-title"> </h4>
							</div>
							<div id="QRCodeModalBody" class="modal-body centerSection">
							</div>
							<!--<div class="modal-footer">
								<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
							</div>-->
						</div>
					</div>
				</div>
				<!-- QR Modal for future on demand use-->
				<!-- Purchase Order Search Modal -->
				<div class="modal fade" id="purchaseOrderSearchModal" role="dialog">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_508" class="modal-title">Search Purchase Orders</h4>
							</div>
							<div id="productSearchModalBody" class="modal-body minH234">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
										<div class="input-group marBot5">
											<span id="cms_509" class="input-group-addon">Purchase Order Code : </span>
											<input id="orderCode" name="orderCode" type="text" class="form-control" placeholder="Please Enter Purchase Order Code" autocomplete="off" rel="cms_510" onkeypress="purchaseOrderFunctionality.orderQRCodeSearch(event)">
										</div>
									</div>
									<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<select id="purchaseOrderStatusDDL" name="purchaseOrderStatusDDL" class="pull-left w100p h34 marBot5"></select>
									</div>
									<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
										<div class="input-group marBot5">
											<span id="cms_511" class="input-group-addon">Start Date : </span>
											<input id="startDate" name="startDate" type="date" class="form-control">
										</div>
									</div>
									<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="cms_512" class="input-group-addon">End Date : </span>
											<input id="endDate" name="endDate" type="date" class="form-control">
										</div>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
											<div class="input-group input-group-md marBot5 pull-right">
												<span id="cms_518" class="input-group-addon">Search Supplier : </span>
												<input id="supplierSearch" name="supplierSearch" type="text" class="form-control" placeholder="Please enter at least 3 Characters..." autocomplete="off" value="" rel="cms_519">
												<span class="input-group-addon">
													<i id="supplierGroupAddonIcon" class="fa fa-search hover"></i>
												</span>
											</div>
										</div>
										<div id="supplierSearchResult" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
										<div id="selectedSupplierTitle" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
											<b id="cms_520">Selected Supplier : </b>
										</div>
										<div id="selectedSupplierSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<input type="hidden" id="selectedSupplierId" name="selectedSupplierId" value="0">
								<button id="purchaseOrderSearchResetBtn" type="button" class="btn btn-default pull-left" onClick="purchaseOrderFunctionality.searchPurchaseOrderFormReset()" rel="cms_513">Reset</button>
								<button id="purchaseOrderSearchBtn" type="button" class="btn btn-success pull-right" onClick="purchaseOrderFunctionality.purchaseOrderSearch()" rel="cms_514">Search</button>
								<button type="button" class="btn btn-success pull-right" onclick="purchaseOrderFunctionality.getQRforSearch()">
									<i class="fa fa-barcode"></i>
									<i class="fa fa-qrcode"></i>
									<span id="cms_515">Scanner</span>
								</button>
								<div id="barcodeScannerHolder" class="pull-right marRig5 hide">
									<img src="../assets/images/barcodeScanner.gif" alt="barcodeScanner" class="w38">
								</div>
								<button type="button" class="btn btn-success pull-right" onclick="purchaseOrderFunctionality.openQrScannerCamera()">
									<i class="fa fa-camera"></i>
									<i class="fa fa-qrcode"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Purchase Order Search Modal -->
				<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>