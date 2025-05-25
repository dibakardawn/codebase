<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "CUSTOMER";

$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
//echo $customerId; exit;
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Customer Details</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/plugins/signature_pad.min.js'></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/customers.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="customerSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> Customer Details</b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sectionBlock2 marBot10">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_193">Company Name </b> : <span id="companyNameTypeGrade"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_247">Buyer Name </b> : <span id="buyerName"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_195">Contact Person </b> : <span id="contactPersonVal"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_230">Existing Id </b> : <span id="existingId"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_222">Phone </b>: <span id="phoneVal"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Fax </b>: <span id="fax"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Email : </b><a id="emailVal" href="#" class="blueText"></a></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_226">Mobile </b> : <span id="mobile"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_228">Website </b> : <span id="website"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_250">Registration Date </b> : <span id="registrationDate"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_251">Last Login Date </b> : <span id="lastLoginDate"></span></div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_216">Address </b> : <span id="addressVal"></span></div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
								<b id="cms_220">Town </b> : <span id="townVal"></span> | 
								<b id="cms_218"> PostCode </b> : <span id="postCodeVal"></span> | 
								<b id="cms_249">Country </b> : <span id="countryVal"></span>
								<input type="hidden" id="countryHdn" name="countryHdn" value="">
							</div>
						</div>
						
						<div id="customerDeliveryAddressTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
						</div>
						
						<h5>
							<b><i class="fa fa-bank"></i></b>
							<b id="cms_232">Financial Data</b>
						</h5>
							
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sectionBlock2 marBot10">
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_239">Account Holder Name </b>:<span id="accountHolderName"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Bank </b>:<span id="bank"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Account No </b>:<span id="accountNo"></span></div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>SortCode </b>:<span id="sortCode"></span></div>
							<input id="bankDetails" name="bankDetails" type="hidden" value="">
						</div>
						
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
							<h5>
								<b><i class="fa fa-google-wallet"></i></b>
								<b id="cms_261">Customer Signature</b>
							</h5>
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="customerSignatureBlock pull-left marRig5 marBot5">
									<?php if (file_exists("../".UPLOADFOLDER."customerSignature/CUST-SIGN_".$customerId.".jpeg")) {?>
										<img src="<?php echo SITEURL.UPLOADFOLDER."customerSignature/CUST-SIGN_".$customerId.".jpeg"; ?>" alt="Signature" onerror="appCommonFunctionality.onImgError(this)">
										<div>
											<i class="fa fa-trash-o pull-left redText hover f24" onClick="customerFunctionality.deleteCustomerSignature(<?php echo $customerId; ?>)"></i>
										</div>
									<?php } else { ?>	
										<img src="<?php echo SITEURL."assets/images/noImages.png"; ?>" alt="Signature">
									<?php } ?>
							</div>
						</div>
						
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
							<input id="customerId" name="customerId" type="hidden" value="<?php echo $customerId; ?>">
							<input type="hidden" id="customerSignBase64" name="customerSignBase64" value="">
							
							<button type="button" class="pull-left btn btn-success marRig10 marBot5" data-toggle="modal" data-target="#customerDeliveryAddressModal" rel="cms_256">Add delivery Address</button>
							<button type="button" class="pull-left btn btn-success marRig10 marBot5" onClick="customerFunctionality.editCustomer(<?php echo $customerId; ?>)" id="cms_258">Edit customer</button>
							<button type="button" class="pull-left btn btn-success marRig10 marBot5" onClick="customerFunctionality.openSignatureModal()" rel="cms_259">Capture Customer Signature</button>
							
							<button type="button" id="searchOrder" class="pull-right btn btn-info marRig10 marBot5" onClick="customerFunctionality.searchOrder(<?php echo intval($customerId); ?>)" rel="cms_872">Search Sale Order</button>
							<button type="button" id="createOrder" class="pull-right btn btn-info marRig10 marBot5" disabled onClick="customerFunctionality.gotoSaleOrder(<?php echo intval($customerId); ?>)" rel="cms_255">Create Order</button>
							<button type="button" class="pull-right btn btn-info marRig10 marBot5" onClick="customerFunctionality.gotoCustomerBalanceSheet(<?php echo intval($customerId); ?>)" rel="cms_938">Customer Balance Sheet</button>
							<button type="button" class="pull-right btn btn-info marRig10 marBot5" onClick="customerFunctionality.goToCustomers()" rel="cms_257">Go to customers</button>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Delivery Address Modal -->
			<div class="modal fade" id="customerDeliveryAddressModal" role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title" id="cms_265">Add delivery address</h4>
						</div>
						<div class="modal-body">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
									<div class="input-group marBot5">
										<span id="companyNameSpan" class="input-group-addon"><span id="cms_193">Company Name </span>:</span>
										<input id="companyName" name="companyName" type="text" class="form-control" placeholder="Please Enter Company Name" autocomplete="off" value="" rel="cms_203">
									</div>
								</div>
								<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="contactPersonSpan" class="input-group-addon"><span id="cms_195">Contact Person</span> : </span>
										<input id="contactPerson" name="contactPerson" type="text" class="form-control" placeholder="Please Enter Contact Person" autocomplete="off" value="" rel="cms_215">
									</div>
								</div>
								<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
									<div class="input-group marBot5">
										<span id="phoneSpan" class="input-group-addon"><span id="cms_222">Phone</span> : </span>
										<span id="phoneExtension" class="input-group-addon">000</span>
										<input id="phone" name="phone" type="text" class="form-control" placeholder="Please Enter Phone Number" autocomplete="off" value="" rel="cms_223" onkeyup="customerFunctionality.formatInputValue(this.id)">
									</div>
								</div>
								<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="emailSpan" class="input-group-addon">Email : </span>
										<input id="email" name="email" type="text" class="form-control" placeholder="Please Enter Email" rel="cms_225" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)">
									</div>
								</div>
								<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
									<div class="input-group marBot5">
										<span id="addressSpan" class="input-group-addon"><span id="cms_216">Address</span> : </span>
										<input id="address" name="address" type="text" class="form-control" placeholder="Please Enter Address" autocomplete="off" value="" rel="cms_217">
									</div>
								</div>
								<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="postCodeSpan" class="input-group-addon"><span id="cms_218">PostCode</span> : </span>
										<input id="postCode" name="postCode" type="text" class="form-control" placeholder="Please Enter Post Code" autocomplete="off" value="" rel="cms_219" onkeyup="customerFunctionality.formatInputValue(this.id)">
									</div>
								</div>
								<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
									<div class="input-group marBot5">
										<span id="townSpan" class="input-group-addon"><span id="cms_220">Town</span> : </span>
										<input id="town" name="town" type="text" class="form-control" placeholder="Please Enter Town" autocomplete="off" value="" rel="cms_221">
									</div>
								</div>
								<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<select id="country" name="country" class="pull-left w84p h34 marBot5" onchange="customerFunctionality.changeCountry()" autocomplete="off">
									</select>
									<div class="pull-left marleft5"><img id="flagImg" src="<?php echo SITEURL.'assets/images/flag.jpg' ?>" class="w50 h34"></div>
								</div>
								<div id="sameAddressSwitchSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<label id="sameAddress_switch" class="switch pull-left" onchange="customerFunctionality.onSwitchSameAddress(this.id)">
										<input id="sameAddress" name="sameAddress" type="checkbox" value="0">
										<span id="statusSlider" class="slider"></span>
									</label>
									<label id="sameAddress_lbl_1" class="pull-left marTop5 marleft5 hide"><span id="cms_262">Billing address same as delivery address</span></label>
									<label id="sameAddress_lbl_0" class="pull-left marTop5 marleft5"><span id="cms_263">Billing address and delivery address are different</span></label>
								</div>
							</div>
							<br clear="all">
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-success" onClick="customerFunctionality.submitDeliveryAddress()">Save</button>
						</div>
					</div>
				</div>
			</div>
			<!-- Delivery Address Modal -->
			
			<!-- Signature Modal -->
			<div class="modal fade" id="signatureModal" role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title" id="cms_258">Customer Signature</h4>
						</div>
						<div id="signatureCanvas" class="modal-body">Loading...</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_264">Close</button>
							<button type="button" class="btn btn-default pull-right w3-green" onclick="customerFunctionality.processCustomerSignature()">Save</button>
						</div>
					</div>
				</div>
			</div>
			<!-- Signature Modal -->
			
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>