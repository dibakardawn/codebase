<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SUPPLIER";

$supplierId=isset($_REQUEST['supplierId'])?(int)$_REQUEST['supplierId']:0;
//echo $supplierId; exit;
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Supplier Entry</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/supplier.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="supplierSectionHolder">
				<header class="w3-container" style="padding-top:22px">
				   <h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_450">Supplier Entry</span>
						</b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<h5>
						<?php if($supplierId > 0){ ?><span id="cms_451">Edit</span><?php }else{ ?><span id="cms_452">Add</span><?php } ?>
						<span id="cms_453">Supplier Data</span>
					</h5>
					<div class="sectionBlock2 marBot20">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="cms_454" class="input-group-addon">Supplier Name: </span>
									<input id="supplierName" name="supplierName" type="text" class="form-control" placeholder="Please Enter Product Name" autocomplete="off" rel="cms_455">
								</div>
							</div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group marBot5">
									<span id="cms_456" class="input-group-addon">Contact Person : </span>
									<input id="supplierContactPerson" name="supplierContactPerson" type="text" class="form-control" placeholder="Please Enter Contact Persion" autocomplete="off" value="" rel="cms_457">
								</div>
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="cms_458" class="input-group-addon">Address : </span>
								<input id="supplierAddress" name="supplierAddress" type="text" class="form-control" placeholder="Please Enter Supplier Address" autocomplete="off" value="" rel="cms_459">
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="cms_460" class="input-group-addon">Town : </span>
									<input id="supplierTown" name="supplierTown" type="text" class="form-control" placeholder="Please Enter Town" autocomplete="off" value="" rel="cms_461">
								</div>
							</div>
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="cms_462" class="input-group-addon">Post Code : </span>
									<input id="supplierPostCode" name="supplierPostCode" type="text" class="form-control" placeholder="Please Enter Post Code" autocomplete="off" value="" rel="cms_463">
								</div>
							</div>
							<div id="countryHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<select id="supplierCountry" name="supplierCountry" class="pull-left w84p h34 marBot5" onchange="supplierFunctionality.changeCountry()" autocomplete="off">
								</select>
								<input type="hidden" id="supplierCountryHdn" name="supplierCountryHdn" value="">
								<div class="pull-left marleft5">
									<img id="flagImg" src="<?php echo SITEURL.'assets/images/flag.jpg' ?>" class="w50 h34">
								</div>
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="cms_464" class="input-group-addon">Contact Number: </span>
									<span id="supplierContactNoExtension" class="input-group-addon">000</span>
									<input id="supplierContactNo" name="supplierContactNo" type="text" class="form-control" placeholder="Please Enter Contact Number" autocomplete="off" value="" rel="cms_465">
								</div>
							</div>
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="supplierEmailSpan" class="input-group-addon">Email: </span>
									<input id="supplierEmail" name="supplierEmail" type="text" class="form-control" placeholder="Please Enter Email" autocomplete="off" value="" <?php if($supplierId > 0){ echo "disabled"; }?> rel="cms_483" onblur="supplierFunctionality.checkEmailAvilable()">
									<span id="emailExtSpan" class="input-group-addon">
										<span id="emailInfoIcon" class="fa fa-envelope blueText f18"></span>
										<span id="emailOkIcon" class="glyphicon glyphicon-ok-circle greenText f18 hide"></span>
										<span id="emailCrossIcon" class="glyphicon glyphicon-remove-circle redText f18 hide"></span>
									</span>
								</div>
							</div>
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group marBot5">
									<span id="supplierFaxSpan" class="input-group-addon">FAX: </span>
									<input id="supplierFax" name="supplierFax" type="text" class="form-control" placeholder="Please Enter FAX" autocomplete="off" value="" rel="cms_466">
								</div>
							</div>
						</div>
					</div>
					<h5>
						<?php if($supplierId > 0){ ?><span id="cms_451">Edit</span><?php }else{ ?><span id="cms_452">Add</span><?php } ?>
						<span id="cms_467">Financial Data</span>
					</h5>
					<div class="sectionBlock2 marBot20">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="cms_468" class="input-group-addon">Bank Name: </span>
									<input id="bankName" name="bankName" type="text" class="form-control" placeholder="Please Enter Bank Name" autocomplete="off" value="" rel="cms_469">
								</div>
							</div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group marBot5">
									<span id="cms_470" class="input-group-addon">Account No: </span>
									<input id="accountNo" name="accountNo" type="text" class="form-control" placeholder="Please Enter Account No" autocomplete="off" value="" rel="cms_471">
								</div>
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="cms_472" class="input-group-addon">Bank Address: </span>
								<input id="bankAddress" name="bankAddress" type="text" class="form-control" placeholder="Please Enter Address" autocomplete="off" value="" rel="cms_473">
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="SWIFTSpan" class="input-group-addon">SWIFT: </span>
									<input id="SWIFT" name="SWIFT" type="text" class="form-control" placeholder="Please Enter SWIFT" autocomplete="off" value="" rel="cms_474">
								</div>
							</div>
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="supplierVatSpan" class="input-group-addon">VAT: </span>
									<input id="supplierVat" name="supplierVat" type="text" class="form-control" placeholder="Please Enter VAT" autocomplete="off" value="" rel="cms_475">
								</div>
							</div>
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group marBot5">
									<span id="GSTINSpan" class="input-group-addon">GST: </span>
									<input id="GSTIN" name="GSTIN" type="text" class="form-control" placeholder="Please Enter GST" autocomplete="off" value="" rel="cms_476">
								</div>
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="IECSpan" class="input-group-addon">IEC: </span>
									<input id="IEC" name="IEC" type="text" class="form-control" placeholder="Please Enter IEC" autocomplete="off" value="" rel="cms_477">
								</div>
							</div>
							<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="PANSpan" class="input-group-addon">PAN: </span>
									<input id="PAN" name="PAN" type="text" class="form-control" placeholder="Please Enter PAN" autocomplete="off" value="" rel="cms_478">
								</div>
							</div>
							<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group marBot5">
									<span id="REXSpan" class="input-group-addon">REX: </span>
									<input id="REX" name="REX" type="text" class="form-control" placeholder="Please Enter REX" autocomplete="off" value="" rel="cms_479">
								</div>
							</div>
							<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group marBot5">
									<span id="ARNSpan" class="input-group-addon">ARN: </span>
									<input id="ARN" name="ARN" type="text" class="form-control" placeholder="Please Enter ARN" autocomplete="off" value="" rel="cms_480">
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
						<input id="supplierId" name="supplierId" type="hidden" value="<?php echo $supplierId; ?>">
						<button type="submit" class="btn btn-success marTop5" rel="cms_481" onclick="supplierFunctionality.saveSupplier();">Save</button>
					</div>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>