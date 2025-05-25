<?php
include('../config/config.php');
$section = "SUPPLIERPORTAL";
$page = "LOGIN";
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title><?php echo SITENAME; ?> Supplier Portal Login</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" type="image/x-icon" href="<?php echo SITEURL; ?>favicon.ico">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
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
		<div class="container-fluid">
			<div class="row">
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<h2 class="text-center" id="cms_589">Welcome to Supplier Portal</h2>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
						<img src="<?php echo SITEURL."assets/images/logo.jpg"; ?>" alt="logo" class="logo">
					</div>
					<div id="supplierEmailSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12"></div>
						<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 text-center">
							<div class="input-group marBot5">
								<span id="supplierEmailSpan" class="input-group-addon">
									<span id="cms_590">Registered Email : </span>
								</span>
								<input id="supplierEmail" name="supplierEmail" type="text" class="form-control" placeholder="Enter your registeded E-mail" value="" rel="cms_591">
							</div>
							<button id="checkSupplierEmailBtn" type="button" class="btn btn-success" onClick="supplierFunctionality.checkSupplierEmail()" rel="cms_592">Submit</button>
						</div>
						<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12"></div>
					</div>
					<div id="otpSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 hide">
						<h2 class="text-center" id="cms_593">Please check you email and enter the OTP</h2>
						<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12"></div>
						<div id="otpForm" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
							<input type="number" id="otp-input_1" class="otp-input" maxlength="1" autocomplete="off" >
							<input type="number" id="otp-input_2" class="otp-input" maxlength="1" autocomplete="off" >
							<input type="number" id="otp-input_3" class="otp-input" maxlength="1" autocomplete="off" >
							<input type="number" id="otp-input_4" class="otp-input" maxlength="1" autocomplete="off" >
							<input type="number" id="otp-input_5" class="otp-input" maxlength="1" autocomplete="off" >
							<input type="number" id="otp-input_6" class="otp-input" maxlength="1" autocomplete="off" >
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
							<button id="otpBtn" type="button" class="btn btn-success marTop5" onClick="supplierFunctionality.checkSupplierOtp()" rel="cms_594">Verify OTP</button>
							<h5 id="errorMsg" class="redText text-center"></h5>
						</div>
						<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12"></div>
					</div>
					<p class="text-center"></p>
					<p class="text-center">
						<span id="cms_595">How to use this portal, Complete Guide</span> 
						<a href="<?php echo SITEURL."uploads/helpDocuments/supplierPortal/How_to_process_a_purchase_order_from_supplier_side.pdf"; ?>" target="_blank" id="cms_596">Guide Link</a></p>
				</div>
			</div>
			<input id="CMSDATA" name="CMSDATA" type="hidden" value='<?php if($section != "" && $page != ""){ echo readPreCompiledCmsData($section, $page); }?>'>
		</div>
	</body>
</html>