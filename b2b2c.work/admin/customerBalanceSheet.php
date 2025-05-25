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
		<title><?php echo SITETITLE; ?> Admin | Customer Balance Sheet</title>
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
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_938">Customer Balance Sheet</span>
						</b>
					</h5>
					<div class="pull-right">
						<button type="button" class="btn btn-success pull-right marBot5" onClick="customerFunctionality.printFinancialStatements()">
							<i class="fa fa-print"></i> <span id="cms_939">Print</span> 
						</button>
						<button type="button" class="btn btn-info pull-right marBot5 marRig5" onClick="customerFunctionality.openFinanceSearchModal()">
							<i class="fa fa-search"></i>
							<span id="cms_276">Search</span> 
						</button>
					</div>
					<div id="financeViewHolder" class="pull-right marRig5">
						<div class="toggle-switch marBot5" id="financeView">
							<div class="option selected" data-value="ADMINVIEW" id="cms_940">Admin View</div>
							<div class="option" data-value="CUSTOMERVIEW" id="cms_941">Customer View</div>
						</div>
					</div>
				</header>
				
				<div id="financeTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection scrollX">
				</div>
				
				<!--Search Modal -->
				<div class="modal fade" id="searchModal" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h6 class="modal-title" id="cms_942">Search Customer Financial Records</h6>
							</div>
							<div class="modal-body">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="cms_943" class="input-group-addon">From Date : </span>
											<input id="fromDate" name="fromDate" type="date" class="form-control" autocomplete="off" value="">
										</div>
									</div>
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="cms_944" class="input-group-addon">To Date : </span>
											<input id="toDate" name="toDate" type="date" class="form-control" autocomplete="off" value="">
										</div>
									</div>
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-default pull-left" onclick="customerFunctionality.resetFinanceStatementSearch();" rel="cms_284">Reset</button>
								<button type="button" class="btn btn-success pull-right" onclick="customerFunctionality.financeStatementSearch();" rel="cms_276">Search</button>
							</div>
						</div>
					</div>
				</div>
				<!--Search Modal -->
				
				<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>