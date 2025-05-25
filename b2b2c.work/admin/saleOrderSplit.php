<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "SALEORDER";

$orderId=isset($_REQUEST['orderId'])?(int)$_REQUEST['orderId']:0;
if(intval($orderId) > 0){
	$sql = "SELECT `orderCode` FROM `orderSale` WHERE `orderId` = ".$orderId;
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$sql_res_fetch = mysqli_fetch_array($sql_res);
	$orderCode = $sql_res_fetch["orderCode"];
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Sale Order Entry</title>
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
							<span id="cms_416">Sale Order Split</span>
						</b>
					</h5>
					
					<button type="button" class="btn btn-info pull-right marBot5 marRig5" rel="cms_318" onClick="saleOrderFunctionality.mapCoCOrder()">CoC Order</button>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="input-group input-group-md marBot5 pull-right">
							<span id="cms_312" class="input-group-addon">Search Customer : </span>
							<input id="customerSearch" name="customerSearch" type="text" class="form-control" placeholder="Please enter at least 3 Characters..." autocomplete="off" value="" rel="cms_313">
							<span class="input-group-addon">
								<i id="customerGroupAddonIcon" class="fa fa-search hover"></i>
							</span>
						</div>
					</div>
					<div id="customerSearchResult" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					</div>
					<div id="selectedCustomerTitle" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide"><b id="cms_317">Selected Customer : </b></div>
					<div id="selectedCustomerSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					</div>
					<div id="customerDeliveryAddressTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20">
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<h3 class="text-center"><span id="cms_417">Existing Order</span> [<?php echo $orderCode; ?>]</h3>
							<div id="cartTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX">
							</div>
							<div id="totalCalcSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-left hide">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_331">Total Before Tax</span> : <span id="totalBeforeTax"></span>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_710">Packing Cost</span> : <span id="packingCost"></span>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_332">Tax</span> : <span id="taxP"></span> %
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_333">Total</span> : <span id="totalPrice"></span>
								</div>
								<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group">
										<span id="deliveryDateSpan" class="input-group-addon">
											<span id="cms_353">Delivery Date</span>
										</span>
										<input id="deliveryDate" name="deliveryDate" type="date" class="form-control" autocomplete="off" value="<?php echo date('Y-m-d'); ?>">
									</div>
								</div>
							</div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopaddingOnly">
							<h3 id="cms_418" class="text-center">New Cart</h3>
							<div id="newCartTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX">
							</div>
							<div id="totalCalcSectionNew" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-right hide">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_331">Total Before Tax</span> : <span id="totalBeforeTaxNew"></span>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_710">Packing Cost</span> : <span id="packingCostNew"></span>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_332">Tax</span> : <span id="taxPNew"></span> %
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_333">Total</span> : <span id="totalPriceNew"></span>
								</div>
								<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly pull-right">
									<div class="input-group">
										<span id="deliveryDateSpan" class="input-group-addon">
											<span id="cms_353">Delivery Date</span>
										</span>
										<input id="deliveryDateNew" name="deliveryDateNew" type="date" class="form-control" autocomplete="off" value="<?php echo date('Y-m-d'); ?>">
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
						<button id="placeOrderBtn" type="button" class="btn btn-success marTop5" disabled onClick="saleOrderFunctionality.splitOrder()" rel="cms_352">Submit Order</button>
					</div>
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<input id="selectedCustomerId" name="selectedCustomerId" type="hidden" value='0'>
					<input id="selectedCustomerGrade" name="selectedCustomerGrade" type="hidden" value=''>
					<input id="selectedCustomerDeliveryAddressId" name="selectedCustomerDeliveryAddressId" type="hidden" value='0'>
					<input id="cartOrder" name="cartOrder" type="hidden" value='{}'>
					<input id="orderId" name="orderId" type="hidden" value='0'>
					<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
				</div>
			</div>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>