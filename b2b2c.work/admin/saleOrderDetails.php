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
		<title><?php echo SITETITLE; ?> Admin | Sale Order Details</title>
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
				<header class="w3-container" style="padding-top:10px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if (isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_357">Sale Order Details</span>
						</b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php include('includes/orderDetailsTab.php'); ?>
					<div id="orderStatusProgress" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padTop10 padBot10 marBot5">
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="oderDetailsSection1" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 noLeftPaddingOnly marBot10"></div>
						<div id="oderDetailsSection2" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly marBot10 scrollX"></div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="oderDetailsSection3" class="col-lg-9 col-md-9 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<div id="cartTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
							<div id="totalCalcSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
								<div id="paymentModeSection" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
									<b id="cms_863">Payment Information : </b>
									<div id="saleOrderPaymentInformation"></div>
								</div>
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-right">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<b id="cms_331">Total Before Tax</b> : <span id="totalBeforeTax"></span>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<b id="cms_710">Packing Cost</b> : <span id="packingCost"></span>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<b id="cms_725">Special Discount</b> : <span id="specialDiscount"></span>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<b id="cms_332">Tax</b> : <span id="taxP"></span> %
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<b id="cms_333">Total</b> : <span id="totalPrice"></span>
									</div>
									<div id="creditNote" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									</div>
								</div>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop10">
								<!--<div class="sectionBlock hover" onclick="saleOrderFunctionality.openInvoice()">
									<div class="text-center">Invoice</div> 
									<div class="text-center">
										<img src="../assets/images/report.png" alt="Invoice" class="w80">
									</div>
								</div>
								<div class="sectionBlock hover" onclick="saleOrderFunctionality.printBill()">
									<div class="text-center">Print Bill</div> 
									<div class="text-center">
										<img src="../assets/images/printer.png" alt="Print Bill" class="w80">
									</div>
								</div>
								<div class="sectionBlock hover" onclick="saleOrderFunctionality.openCartonTag()">
									<div class="text-center">Carton Tag</div> 
									<div class="text-center">
										<img src="../assets/images/cartonTag.png" alt="Carton Tag" class="w80">
									</div>
								</div>
								<div class="sectionBlock hover" onclick="saleOrderFunctionality.openMail()">
									<div class="text-center">Mails</div> 
									<div class="text-center">
										<img src="../assets/images/mail.png" alt="Mails" class="w80">
									</div>
								</div>
								<div class="sectionBlock hover" onclick="saleOrderFunctionality.openCreditNote()">
									<div class="text-center">Credit Note</div> 
									<div class="text-center">
										<img src="../assets/images/creditNote.png" alt="Credit Note" class="w80">
									</div>
								</div>-->
								
								<button id="invoiceBtn" type="button" class="btn btn-success pull-left marBot3 marTop3" onclick="saleOrderFunctionality.openInvoice()">
									<i class="fa fa-file-pdf-o"></i>
									<span id="cms_368">Invoice</span>
								</button>
								<button id="printBillBtn" type="button" class="btn btn-primary pull-left marleft5 marBot3 marTop3" onclick="saleOrderFunctionality.printBill()">
									<i class="fa fa-print"></i>
									<span id="cms_369">Print Bill</span>
								</button>
								<button id="cartonTagBtn" type="button" class="btn btn-success pull-left marleft5 marBot3 marTop3" onclick="saleOrderFunctionality.openCartonTag()">
									<i class="fa fa-tags"></i>
									<span id="cms_370">Carton Tag</span>
								</button>
								<button id="mailsBtn" type="button" class="btn btn-primary pull-left marleft5 marBot3 marTop3" onclick="saleOrderFunctionality.openMail()">
									<i class="fa fa-envelope"></i>
									<span id="cms_371">Mails</span>
								</button>
								<button id="creditNoteBtn" type="button" class="btn btn-warning pull-left marleft5 marBot3 marTop3" onclick="saleOrderFunctionality.openCreditNote()">
									<i class="fa fa-file-text"></i>
									<span id="cms_372">Credit Note</span>
								</button>
								<button id="editOrderBtn" type="button" class="btn btn-success pull-left marleft5 marBot3 marTop3" onClick="saleOrderFunctionality.editOrder()">
									<i class="fa fa-pencil-square-o"></i>
									<span id="cms_373">Edit Order</span>
								</button>
								<button id="splitOrderBtn" type="button" class="btn btn-primary pull-left marleft5 marBot3 marTop3" onClick="saleOrderFunctionality.gotoSplitOrder()">
									<i class="fa fa-code-fork"></i>
									<span id="cms_374">Split order</span>
								</button>
								<button id="duplicateOrderBtn" type="button" class="btn btn-warning pull-left marleft5 marBot3 marTop3" onClick="saleOrderFunctionality.placeOrder()">
									<i class="fa fa-copy"></i>
									<span id="cms_375">Duplicate order</span>
								</button>
								<div class="dropdown pull-left marleft5 marBot3 marTop3">
									<button id="actionBtn" class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" >
										<span id="cms_367">Action</span> 
										<span class="caret"></span>
									</button>
									<ul id="orderStatusBunAction" class="dropdown-menu">
									</ul>
								</div>
								<button id="gotoOrdersBtn" type="button" class="btn btn-success pull-left marleft5 marBot3 marTop3" onClick="saleOrderFunctionality.gotoOrders()">
									<i class="fa fa-tasks"></i>
									<span id="cms_382">Go to Orders</span>
								</button>
								<button id="newOrderBtn" type="button" class="btn btn-primary pull-left marleft5 marBot3 marTop3" onClick="saleOrderFunctionality.addSaleOrder()">
									<i class="fa fa-cart-arrow-down"></i>
									<span id="cms_383">New order</span>
								</button>
								<?php 
								if (isset($_SESSION['userRoleid']) && is_numeric($_SESSION['userRoleid'])) {
									$userRoleid = intval($_SESSION['userRoleid']);
									if($userRoleid === 1){
								?>
								<button id="deleteOrderBtn" type="button" class="btn btn-danger marleft5 marBot3 marTop3" onClick="saleOrderFunctionality.deleteOrder()">
									<i class="fa fa-trash-o"></i>
									<span id="cms_384">Delete order</span>
								</button>
								<?php 
									}
								} 
								?>
							</div>
						</div>
						<div id="oderDetailsSection4" class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
							<div id="billPrint" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 receipt"></div>
						</div>
					</div>
				</div>
				<!--Credit Note Modal-->
				<div class="modal fade" id="creditNoteModal" role="dialog">
					<div class="modal-dialog w98p">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title" id="cms_571">Make Credit Note</h4>
							</div>
							<div class="modal-body">
								<div id="creditNoteTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_572">Close</button>
								<button type="button" class="btn btn-success pull-right" onclick="saleOrderFunctionality.createCreditNote()" rel="cms_573">Submit</button>
							</div>
						</div>
					</div>
				</div>
				<!--Credit Note Modal-->
				<!-- Payment Option Modal -->
				<div class="modal fade" id="paymentOptionModal" role="dialog">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_864" class="modal-title">Select Payment Option</h4>
							</div>
							<div id="paymentOptionModalBody" class="modal-body text-center">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div id="payByCard" class="paymentGifBlock marRig5 hover" onclick="saleOrderFunctionality.selectPaymentMode('CARD')">
										<img src="../assets/images/payByCard.gif" alt="Pay by Card">
										<div class="text-center f10">CARD</div>
									</div>
									<div id="payByUpi" class="paymentGifBlock marRig5 hover" onclick="saleOrderFunctionality.selectPaymentMode('UPI')">
										<img src="../assets/images/payByUPI.gif" alt="Pay by UPI">
										<div class="text-center f10">UPI</div>
									</div>
									<div id="payByCash" class="paymentGifBlock marRig5 hover" onclick="saleOrderFunctionality.selectPaymentMode('CASH')">
										<img src="../assets/images/payByCash.gif" alt="Pay by Cash">
										<div class="text-center f10">CASH</div>
									</div>
									<div id="payByOnline" class="paymentGifBlock hover" onclick="saleOrderFunctionality.selectPaymentMode('ONLINE')">
										<img src="../assets/images/online.gif" alt="Pay Online">
										<div class="text-center f10">ONLINE</div>
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 noLeftPaddingOnly">
										<div class="input-group marBot5">
											<span id="saleOrderAmountSpan" class="input-group-addon">
												<span id="cms_865">Amount</span>: 
												<span id="saleOrderCurrency"></span>
											</span>
											<input id="saleOrderAmount" name="saleOrderAmount" type="number" class="form-control" placeholder="0.00" autocomplete="off" value="" onblur="saleOrderFunctionality.verifyPendingAmount()">
										</div>
									</div>
									<div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="saleOrderNarrationSpan" class="input-group-addon">
												<span id="cms_866">Narration</span>: 
											</span>
											<input id="saleOrderNarration" name="saleOrderNarration" type="text" class="form-control" autocomplete="off" value="">
										</div>
									</div>
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<input id="saleOrderPaymentStatus" name="saleOrderPaymentStatus" type="hidden" value="">
								<input id="saleOrderPaymentMode" name="saleOrderPaymentMode" type="hidden" value="">
								<input id="saleOrderPaymentDetails" name="saleOrderPaymentDetails" type="hidden" value="">
								<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_572">Close</button>
								<button id="paymentOptionModalSaveBtn" type="button" class="btn btn-success pull-right" onclick="saleOrderFunctionality.updatePaymentInformation()">
									<span id="cms_573">Save</span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Payment Option Modal -->
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<input id="selectedCustomerGrade" name="selectedCustomerGrade" type="hidden" value=''>
					<input id="selectedCustomerId" name="selectedCustomerId" type="hidden" value='0'>
					<input id="selectedCustomerDeliveryAddressId" name="selectedCustomerDeliveryAddressId" type="hidden" value='0'>
					<input id="cartOrder" name="cartOrder" type="hidden" value='{}'>
					<input id="deliveryDate" name="deliveryDate" type="hidden" value=''>
					<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
				</div>
			</div>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>