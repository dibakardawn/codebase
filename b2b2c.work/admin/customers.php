<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "CUSTOMER";

?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Customers</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/customers.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="customerSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_187">Customers</span></b></h5>
					<button type="button" class="btn btn-success pull-right marBot5" onClick="customerFunctionality.addCustomer()" rel="cms_188">Add Customer</button>
					<button type="button" class="btn btn-info pull-right marBot5 marRig5" rel="cms_276" data-toggle="modal" data-target="#customerSearchModal">Search</button>
				</header>
				<div id="customerGrid" class="w3-row-padding w3-margin-bottom scrollX">
				</div>
			</div>
			<!-- Customer Search Modal -->
			<div class="modal fade" id="customerSearchModal" role="dialog">
				<div class="modal-dialog modal-md">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 id="cms_277" class="modal-title">Customer Search</h4>
						</div>
						<div id="customerSearchModalBody" class="modal-body">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="keywordSpan" class="input-group-addon">
											<span id="cms_278">Keyword : </span>
										</span>
										<input id="keyword" name="keyword" type="text" class="form-control" placeholder="Please Enter Some Keyword" rel="cms_279" autocomplete="off" value="" onkeypress="customerFunctionality.keywordOnkeyup()">
									</div>
								</div>
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
									<select id="companyType" class="filterDDL w98p marTop5">
										<option value="0" id="cms_280">-- Company Type --</option>
									</select>
								</div>
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
									<select id="customerGrade" class="filterDDL w98p marTop5">
										<option value="" id="cms_281">-- Customer Grade --</option>
									</select>
								</div>
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly marTop5">
									<label id="status_switch" class="switch pull-left" onchange="customerFunctionality.onSwitchChange(this.id, event)">
										<input id="status" name="status" type="checkbox" value="1" checked="checked">
										<span id="statusSlider" class="slider"></span>
									</label>
									<label id="status_lbl_1" class="pull-left marTop5 marleft5 greenText"><span id="cms_282">Active</span></label>
									<label id="status_lbl_0" class="pull-left marTop5 marleft5 redText"><span id="cms_283">Inactive</span></label>
								</div>
							</div>
							<br clear="all">
						</div>
						<div class="modal-footer">
							<input id="selectedProductIds" name="selectedProductIds" type="hidden" value=''>
							<button id="productSearchResetBtn" type="button" class="btn btn-default pull-left" onClick="customerFunctionality.customerSearchModalFormReset()" rel="cms_284">Reset</button>
							<button id="productSearchSearchBtn" type="button" class="btn btn-success pull-right" onClick="customerFunctionality.customerSearchModalFormSubmit()" rel="cms_285">Submit</button>
						</div>
					</div>
				</div>
			</div>
			<!-- Customer Search Modal -->
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>