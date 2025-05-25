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
		<title><?php echo SITETITLE; ?> Admin | Purchase Order Details</title>
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
							<span id="cms_561">Purchase Order Details</span>
						</b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php include('includes/purchaseOrderDetailsTab.php'); ?>
					<div id="purchaseOrderStatusProgress" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padTop10 padBot10 marBot5">
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="orderDetailsSection1" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 noLeftPaddingOnly marBot10"></div>
						<div id="orderDetailsSection2" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly marBot10 scrollX"></div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="oderDetailsSection3" class="col-lg-8 col-md-8 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<div id="cartTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
							<div id="totalCalcSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
								<div id="paymentModeSection" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
									<b id="cms_562">Payment Information</b>
									<div id="purchaseOrderPaymentInfo">N/A</div>
								</div>
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-right">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<b id="cms_524">Total Before Tax</b> : <span id="totalBeforeTax"></span>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<b id="cms_706">Packing Cost</b> : <span id="packingCost"></span>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<b id="cms_525">Tax</b> : <span id="taxP"></span> %
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<b id="cms_526">Total</b> : <span id="totalPrice"></span>
									</div>
									<div id="debitNote" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									</div>
								</div>
							</div>
							<div id="tncSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
								<div><b id="cms_556">Terms & Conditions :</b></div>
								<div id="tncHTML" class="f12 clauseItem"></div>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop10">
								<button id="invoiceBtn" type="button" class="btn btn-success pull-left marBot3 marTop3" onclick="purchaseOrderFunctionality.openInvoice()">
									<i class="fa fa-file-pdf-o"></i>
									<span id="cms_563">Invoice</span>
								</button>
								<button id="mailsBtn" type="button" class="btn btn-primary pull-left marleft5 marBot3 marTop3" onclick="purchaseOrderFunctionality.openMail()">
									<i class="fa fa-envelope"></i>
									<span id="cms_564">Mails</span>
								</button>
								<button id="editPurchaseOrderBtn" type="button" class="btn btn-success pull-left marleft5 marBot3 marTop3" onClick="purchaseOrderFunctionality.editPurchaseOrder()">
									<i class="fa fa-pencil-square-o"></i>
									<span id="cms_565">Edit Purchase Order</span>
								</button>
								<button id="splitPurchaseOrderBtn" type="button" class="btn btn-primary pull-left marleft5 marBot3 marTop3" onClick="purchaseOrderFunctionality.splitPurchaseOrder()">
									<i class="fa fa-code-fork"></i>
									<span id="cms_566">Split Purchase order</span>
								</button>
								<button id="duplicatePurchaseOrderBtn" type="button" class="btn btn-warning pull-left marleft5 marBot3 marTop3" onClick="purchaseOrderFunctionality.placePurchaseOrder()">
									<i class="fa fa-copy"></i>
									<span id="cms_567">Duplicate Purchase order</span>
								</button>
								<div class="dropdown pull-left marleft5 marBot3 marTop3">
									<button id="actionBtn" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" >
										<span id="cms_554">Action</span> 
										<span class="caret"></span>
									</button>
									<ul id="purchaseOrderStatusBunAction" class="dropdown-menu">
									</ul>
								</div>
								<button id="inspectionBtn" type="button" class="btn btn-danger marleft5 marBot3 marTop3" onClick="purchaseOrderFunctionality.goToInspection()">
										<i class="fa fa-search"></i>
										<span id="cms_584">Inspection</span>
									</button>
								<button id="gotoPurchaseOrdersBtn" type="button" class="btn btn-success pull-left marleft5 marBot3 marTop3" onClick="purchaseOrderFunctionality.gotoPurchaseOrders()">
									<i class="fa fa-tasks"></i>
									<span id="cms_568">Go to Purchase Orders</span>
								</button>
								<button id="newPurchaseOrderBtn" type="button" class="btn btn-primary pull-left marleft5 marBot3 marTop3" onClick="purchaseOrderFunctionality.addPurchaseOrder()">
									<i class="fa fa-cart-arrow-down"></i>
									<span id="cms_569">New Purchase order</span>
								</button>
								<?php 
									$userRoleid = isset($_SESSION['userRoleid']) ? intval($_SESSION['userRoleid']) : 0;
									if($userRoleid === 1){
								?>
									<button id="deletePurchaseOrderBtn" type="button" class="btn btn-danger marleft5 marBot3 marTop3" onClick="purchaseOrderFunctionality.deletePurchaseOrder()">
										<i class="fa fa-trash-o"></i>
										<span id="cms_570">Delete purchase order</span>
									</button>
								<?php } ?>
							</div>
						</div>
						<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopaddingOnly">
							<div id="clauseSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
								<div><b id="cms_555">Clauses : </b></div>
								<div id="clauseHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								</div>
							</div>
							<div id="signSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 noLeftPaddingOnly">
									<div><b id="cms_560">Signature : </b></div>
									<img src="<?php echo SITEURL; ?>assets/images/sign.png" alt="signature" class="productImageBlock5 w100p">
								</div>
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
									<div><b id="cms_708">Supplier Signature : </b></div>
									<div id="supplierSignSection"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Payment Option Modal -->
				<div class="modal fade" id="paymentOptionModal" role="dialog">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_852" class="modal-title">Select Payment Option</h4>
							</div>
							<div id="paymentOptionModalBody" class="modal-body text-center">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div id="payByCard" class="paymentGifBlock marRig5 hover" onclick="purchaseOrderFunctionality.selectPaymentMode('CARD')">
										<img src="../assets/images/payByCard.gif" alt="Pay by Card">
										<div class="text-center f10">CARD</div>
									</div>
									<div id="payByUpi" class="paymentGifBlock marRig5 hover" onclick="purchaseOrderFunctionality.selectPaymentMode('UPI')">
										<img src="../assets/images/payByUPI.gif" alt="Pay by UPI">
										<div class="text-center f10">UPI</div>
									</div>
									<div id="payByCash" class="paymentGifBlock marRig5 hover" onclick="purchaseOrderFunctionality.selectPaymentMode('CASH')">
										<img src="../assets/images/payByCash.gif" alt="Pay by Cash">
										<div class="text-center f10">CASH</div>
									</div>
									<div id="payByOnline" class="paymentGifBlock hover" onclick="purchaseOrderFunctionality.selectPaymentMode('ONLINE')">
										<img src="../assets/images/online.gif" alt="Pay Online">
										<div class="text-center f10">ONLINE</div>
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 noLeftPaddingOnly">
										<div class="input-group marBot5">
											<span id="purchaseOrderAmountSpan" class="input-group-addon">
												<span id="cms_870">Amount</span>: 
												<span id="purchaseOrderCurrency"></span>
											</span>
											<input id="purchaseOrderAmount" name="purchaseOrderAmount" type="number" class="form-control" placeholder="0.00" autocomplete="off" value="">
										</div>
									</div>
									<div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="purchaseOrderNarrationSpan" class="input-group-addon">
												<span id="cms_871">Narration</span>: 
											</span>
											<input id="purchaseOrderNarration" name="purchaseOrderNarration" type="text" class="form-control" autocomplete="off" value="">
										</div>
									</div>
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<input id="purchaseOrderPaymentStatus" name="purchaseOrderPaymentStatus" type="hidden" value="">
								<input id="purchaseOrderPaymentMode" name="purchaseOrderPaymentMode" type="hidden" value="">
								<input id="purchaseOrderPaymentDetails" name="purchaseOrderPaymentDetails" type="hidden" value="">
								<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_696">Close</button>
								<button id="paymentOptionModalSaveBtn" type="button" class="btn btn-success pull-right" onclick="purchaseOrderFunctionality.updatePaymentInformation()">
									<span id="cms_559">Save</span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Payment Option Modal -->
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