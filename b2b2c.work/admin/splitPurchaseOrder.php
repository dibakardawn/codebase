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
		<title><?php echo SITETITLE; ?> Admin | Split Purchase Order</title>
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
				<header class="w3-container" style="padding-top:10px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if (isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_566">Split Purchase Order</span>
						</b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="selectedSupplierTitle" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<b id="cms_520">Selected Supplier : </b>
						</div>
						<div id="selectedSupplierSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 customerResultItem">
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
								<h3 class="text-center">
									<span id="cms_585">Existing Purchase Order</span> 
									<span id="existingPurchaseOrderCode">[ORDS_0029]</span>
								</h3>
								<div id="cartTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
								<div id="totalCalcSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-left">
										<span id="cms_524">Total Before Tax</span> : <span id="totalBeforeTax"></span>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-left">
										<span id="cms_525">Tax</span> : <span id="taxP"></span> %
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-left">
										<span id="cms_526">Total</span> : <span id="totalPrice"></span>
									</div>
									<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopaddingOnly pull-left">
										<div class="input-group">
											<span id="deliveryDateSpan" class="input-group-addon">
												<span id="cms_528">Expected Delivery Date</span>
											</span>
											<input id="deliveryDate" name="deliveryDate" type="date" class="form-control" autocomplete="off" value="">
										</div>
									</div>
								</div>
							</div>
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 noRightPaddingOnly">
								<h3 class="text-center"><span id="cms_586">New Purchase Order</span></h3>
								<div id="cartNewTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
								<div id="newTotalCalcSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-right">
										<span id="cms_524">Total Before Tax</span> : <span id="newTotalBeforeTax"></span>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-right">
										<span id="cms_525">Tax</span> : <span id="newTaxP"></span> %
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-right">
										<span id="cms_526">Total</span> : <span id="newTotalPrice"></span>
									</div>
									<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopaddingOnly pull-right">
										<div class="input-group">
											<span id="newDeliveryDateSpan" class="input-group-addon">
												<span id="cms_528">Expected Delivery Date</span>
											</span>
											<input id="newDeliveryDate" name="newDeliveryDate" type="date" class="form-control" autocomplete="off" value="<?php echo date('Y-m-d'); ?>">
										</div>
									</div>
								</div>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
								<div id="errorMsg" class="marTop5 marBot5 redText f16"></div>
								<button id="splitPurchaseOrderBtn" type="button" class="btn btn-success marleft5 marTop5" disabled onClick="purchaseOrderFunctionality.splitPurchaseOrderSubmit()" rel="cms_566">Split Purchase Order</button>
							</div>
						</div>
					</div>
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<input id="selectedSupplierId" name="selectedSupplierId" type="hidden" value='0'>
					<input id="purchaseOrderId" name="purchaseOrderId" type="hidden" value='0'>
					<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
				</div>
			</div>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>