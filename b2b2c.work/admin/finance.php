<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "FINANCE";
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Finance</title>
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
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/plugins/fullCalender.css">
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/highcharts.js"></script>
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/highcharts-accessibility.js"></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/plugins/fullCalender.js'></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/finance.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="financeSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_726">Financial Statements</span>
						</b>
					</h5>
					<div class="pull-right">
						<button type="button" class="btn btn-success btn-sm pull-right marBot5" onClick="financeFunctionality.printFinancialStatements()">
							<i class="fa fa-print"></i> <span id="cms_727">Print</span> 
						</button>
						<button type="button" class="btn btn-success btn-sm pull-right marBot5 marRig5" onClick="financeFunctionality.gotoAddExpense()">
							<i class="fa fa-money"></i> <span id="cms_729">Add Record</span> 
						</button>
						<button type="button" class="btn btn-info btn-sm pull-right marBot5 marRig5" onClick="financeFunctionality.openFinanceSearchModal()">
							<i class="fa fa-search"></i>
							<span id="cms_728">Search</span> 
						</button>
					</div>
					<div id="financeViewHolder" class="pull-right marRig5">
						<div class="toggle-switch marBot5" id="financeView">
							<div class="option selected" data-value="TABLE"><i class="fa fa-align-justify"></i></div>
							<div class="option" data-value="BAR"><i class="fa fa-bar-chart"></i></div>
							<div class="option" data-value="LINE"><i class="fa fa-line-chart"></i></div>
							<div class="option" data-value="PIE"><i class="fa fa-pie-chart"></i></div>
							<div class="option" data-value="CALENDER"><i class="fa fa-calendar"></i></div>
						</div>
					</div>
				</header>
				
				<div id="financeTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection scrollX">
				</div>
				
				<div id="financeBarChartHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection scrollX hide">
				</div>
				
				<div id="financeLineChartHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection scrollX hide">
				</div>
				
				<div id="financePieChartHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection scrollX hide">
				</div>
				
				<div id="financeCalenderHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 financeViewSection scrollX hide">
				</div>
				
				<!--Search Modal -->
				<div class="modal fade" id="searchModal" role="dialog">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title" id="cms_730">Search Financial Records</h4>
							</div>
							<div class="modal-body">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
											<div class="input-group marBot5">
												<span id="cms_731" class="input-group-addon">From Date : </span>
												<input id="fromDate" name="fromDate" type="date" class="form-control" autocomplete="off" value="">
											</div>
										</div>
										
										<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
											<div class="input-group marBot5">
												<span id="cms_732" class="input-group-addon">To Date : </span>
												<input id="toDate" name="toDate" type="date" class="form-control" autocomplete="off" value="">
											</div>
										</div>
									</div>
									
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
											<div class="toggle-switch marBot5" id="debitCreditToggle">
												<div class="option selected" data-value="ALL" id="cms_733">All Records</div>
												<div class="option" data-value="DEBIT" id="cms_734">Debit Only</div>
												<div class="option" data-value="CREDIT" id="cms_735">Credit Only</div>
											</div>
										</div>
										<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly marBot3">
											<select id="financeCategoryDDL" name="financeCategoryDDL" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 h34" onchange="financeFunctionality.onChangeFinanceCategory()">
												<option id="cms_784" value="0">-- Select Finance Category --</option>
											</select>
										</div>
									</div>
									
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group input-group-md marBot5">
											<div class="input-group-btn">
												<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												  ORD <span class="caret"></span>
												</button>
												<ul class="dropdown-menu">
												  <li class="finOrdType hover" onclick="financeFunctionality.selectORDType('ORDS')">ORDS</li>
												  <li class="finOrdType hover" onclick="financeFunctionality.selectORDType('ORDP')">ORDP</li>
												</ul>
											</div>
											<span id="keywordSpan" class="input-group-addon"></span>
											<input type="text" id="keyword" name="keyword" class="form-control" placeholder="Please enter keywords" onblur="financeFunctionality.formatKeyword()">
										</div>
									</div>
									
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
											<div class="input-group input-group-md marBot5 pull-right">
												<span id="cms_737" class="input-group-addon">Search Customer : </span>
												<input id="customerSearch" name="customerSearch" type="text" class="form-control" placeholder="Please enter at least 3 Characters..." autocomplete="off" value="" rel="cms_738">
												<span class="input-group-addon">
													<i id="customerGroupAddonIcon" class="fa fa-search hover"></i>
												</span>
											</div>
										</div>
										<div id="customerSearchResult" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										</div>
										<div id="selectedCustomerTitle" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide"><b id="cms_739">Selected Customer : </b></div>
										<div id="selectedCustomerSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										</div>
									</div>
									
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
											<div class="input-group input-group-md marBot5 pull-right">
												<span id="cms_742" class="input-group-addon">Search Supplier : </span>
												<input id="supplierSearch" name="supplierSearch" type="text" class="form-control" placeholder="Please enter at least 3 Characters..." autocomplete="off" value="" rel="cms_738">
												<span class="input-group-addon">
													<i id="supplierGroupAddonIcon" class="fa fa-search hover"></i>
												</span>
											</div>
										</div>
										<div id="supplierSearchResult" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										</div>
										<div id="selectedSupplierTitle" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
											<b id="cms_743">Selected Supplier : </b>
										</div>
										<div id="selectedSupplierSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										</div>
									</div>

								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<input id="selectedCustomerId" name="selectedCustomerId" type="hidden" value='0'>
								<input id="selectedSupplierId" name="selectedSupplierId" type="hidden" value='0'>
								<input id="trxType" name="trxType" type="hidden" value=''>
								<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_744">Close</button>
								<button type="button" class="btn btn-success pull-right" onclick="financeFunctionality.financeStatementSearch();" rel="cms_728">Search</button>
								<button type="button" class="btn btn-default pull-right" onclick="financeFunctionality.resetFinanceStatementSearch();" rel="cms_746">Reset</button>
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