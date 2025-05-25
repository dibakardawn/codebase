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
		<title><?php echo SITETITLE; ?> Admin | Finance Entry</title>
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
							<span id="cms_754">Finance Entry</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<!--Dont delete form it is being serialized at the time of submittion-->
					<form id="financeEntryForm" name="financeEntryForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" enctype="multipart/form-data">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
							<div id="financeTypeDDLHolder" class="col-lg-2 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">
								<select id="financeTypeDDL" name="financeTypeDDL" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 h34 w240" onchange="financeFunctionality.onChangeFinanceType()">
									<option id="cms_761" value="">-- Select Finance Type --</option>
									<option id="cms_762" value="0">Expense</option>
									<option id="cms_763" value="1">Earning</option>
								</select>
							</div>
							<div id="financeDateHolder" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
								<div class="input-group input-group-md">
									<span class="input-group-addon" id="cms_771">Date & Time : </span>
									<input type="datetime-local" id="financeDate" name="financeDate" class="form-control" value="">
								</div>
							</div>
						</div>
						<div id="expenseSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
								<div id="expenseTypeDDLHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">
									<select id="expenseTypeDDL" name="expenseTypeDDL" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 h34 w240">
										<option id="cms_736" value="0">-- Select Expense Type --</option>
									</select>
								</div>
								<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
									<div class="input-group input-group-md">
										<span class="input-group-addon" id="cms_755">Expense Title</span>
										<input type="text" id="expenseTitle" name="expenseTitle" class="form-control" value="" placeholder="Please enter something about expense" rel="cms_756">
									</div>
								</div>
								<div id="totalexpenseHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">
									<div class="input-group input-group-md">
										<span class="input-group-addon" id="cms_757">Total Expense</span>
										<input type="number" id="totalexpense" name="totalexpense" class="form-control" value="0.00" placeholder="0.00">
									</div>
								</div>
								<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
									<div class="input-group marBot5">
										<span id="expenseDocumentSpan" class="input-group-addon">
											<span id="cms_759">Expense Documents</span> : 
										</span>
										<input type="file" name="expenseDocument[]" id="expenseDocument" class="form-control" autocomplete="off" multiple accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.text,.png,.jpg,.jpeg" onchange="financeFunctionality.listFiles('inputSection', this)">
									</div>
									<div id="expenseFilesSelected"></div>
								</div>
							</div>
							<div id="expenseDescriptionHolder" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly marBot5">
								<div id="cms_772">Description : </div>
								<textarea id="expenseDescription" name="expenseDescription" rows="2" cols="100" class="w100p"></textarea>
							</div>
						</div>
						<div id="earningSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
								<div id="earningTypeDDLHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">
									<select id="earningTypeDDL" name="earningTypeDDL" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 h34 w240">
										<option id="cms_764" value="0">-- Select Earning Type --</option>
									</select>
								</div>
								<div id="earningTitleHolder" class="col-lg-8 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">
									<div class="input-group input-group-md">
										<span class="input-group-addon" id="cms_765">Earning Title</span>
										<input type="text" id="earningTitle" name="earningTitle" class="form-control" value="" placeholder="Please enter something about earning" rel="cms_766">
									</div>
								</div>
								<div id="totalEarningHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">
									<div class="input-group input-group-md">
										<span class="input-group-addon" id="cms_767">Total Earning</span>
										<input type="number" id="totalEarning" name="totalEarning" class="form-control" value="0.00" placeholder="0.00">
									</div>
								</div>
								<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
									<div class="input-group marBot5">
										<span id="earningDocumentSpan" class="input-group-addon">
											<span id="cms_768">Earning Documents</span> : 
										</span>
										<input type="file" name="earningDocument[]" id="earningDocument" class="form-control" autocomplete="off" multiple accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.text,.png,.jpg,.jpeg" onchange="financeFunctionality.listFiles('inputSection', this)">
									</div>
									<div id="earningFilesSelected"></div>
								</div>
							</div>
							<div id="earningDescriptionHolder" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly marBot5">
								<div id="cms_772">Description : </div>
								<textarea id="earningDescription" name="earningDescription" rows="2" cols="100" class="w100p"></textarea>
							</div>
						</div>
						<div id="submitSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center hide">
							<button id="submitBtn" type="button" class="btn btn-success" onclick="financeFunctionality.submitFinanceRecord()" rel="cms_760">Submit</button>
						</div>
					</form>
					<!--Dont delete form it is being serialized at the time of submittion-->
				</div>
				<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>