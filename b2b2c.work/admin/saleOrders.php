<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SALEORDER";
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Sale Orders</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/saleOrder.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="saleOrderSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i>	
							<span id="cms_306">Sale Orders</span>
						</b>
					</h5>

					<button type="button" class="btn btn-success pull-right marBot5 marRig5" rel="cms_307" onClick="saleOrderFunctionality.addSaleOrder()">Add Sale Order</button>
					<button type="button" class="btn btn-info pull-right marBot5 marRig5" rel="cms_308" onClick="saleOrderFunctionality.searchSaleOrderModal()">Search Sale Orders</button>
				</header>
				<div id="saleOrderTableHolder" class="w3-row-padding w3-margin-bottom scrollX">
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
				<!-- Sale Order Search Modal -->
				<div class="modal fade" id="saleOrderSearchModal" role="dialog">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_308" class="modal-title">Search Sale Orders</h4>
							</div>
							<div id="productSearchModalBody" class="modal-body minH234">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
										<div class="input-group marBot5">
											<span id="cms_492" class="input-group-addon">Order Code : </span>
											<input id="orderCode" name="orderCode" type="text" class="form-control" placeholder="Please Enter Order Code" autocomplete="off" rel="cms_493" onkeypress="saleOrderFunctionality.orderQRCodeSearch(event)">
										</div>
									</div>
									<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<select id="orderStatusDDL" name="orderStatusDDL" class="pull-left w100p h34 marBot5"></select>
									</div>
									<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
										<div class="input-group marBot5">
											<span id="cms_495" class="input-group-addon">Start Date : </span>
											<input id="startDate" name="startDate" type="date" class="form-control">
										</div>
									</div>
									<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="cms_496" class="input-group-addon">End Date : </span>
											<input id="endDate" name="endDate" type="date" class="form-control">
										</div>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
											<div class="input-group input-group-md marBot5 pull-right">
												<span id="cms_312" class="input-group-addon">Search Customer : </span>
												<input id="customerSearch" name="customerSearch" type="text" class="form-control" placeholder="Please enter at least 3 Characters..." autocomplete="off" value="" rel="cms_313">
												<span class="input-group-addon">
													<i id="customerGroupAddonIcon" class="fa fa-search hover"></i>
												</span>
											</div>
										</div>
										<div id="customerSearchResult" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
										<div id="selectedCustomerTitle" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide"><b id="cms_317">Selected Customer : </b></div>
										<div id="selectedCustomerSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<input type="hidden" id="selectedCustomerId" name="selectedCustomerId" value="0">
								<input type="hidden" id="selectedCustomerGrade" name="selectedCustomerGrade" value="">
								<button id="saleOrderSearchResetBtn" type="button" class="btn btn-default pull-left" onClick="saleOrderFunctionality.searchSaleOrderFormReset()" rel="cms_309">Reset</button>
								<button id="saleOrderSearchBtn" type="button" class="btn btn-success pull-right" onClick="saleOrderFunctionality.saleOrderSearch()" rel="cms_310">Search</button>
								<button type="button" class="btn btn-success pull-right" onclick="saleOrderFunctionality.getQRforSearch()">
									<i class="fa fa-barcode"></i>
									<i class="fa fa-qrcode"></i>
									<span id="cms_321">Scanner</span>
								</button>
								<div id="barcodeScannerHolder" class="pull-right marRig5 hide">
									<img src="../assets/images/barcodeScanner.gif" alt="barcodeScanner" class="w38">
								</div>
								<button type="button" class="btn btn-success pull-right" onclick="saleOrderFunctionality.openQrScannerCamera()">
									<i class="fa fa-camera"></i>
									<i class="fa fa-qrcode"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Sale Order Search Modal -->
				<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>