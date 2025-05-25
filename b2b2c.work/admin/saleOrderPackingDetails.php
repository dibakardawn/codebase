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
		<title><?php echo SITETITLE; ?> Admin | Sale Order Packing Details | <?php echo $orderCode; ?></title>
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
							<span id="cms_437">Sale Order Packing Details</span>
						</b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php include('includes/orderDetailsTab.php'); ?>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<select id="packageList" name="packageList" class="pull-left ddlStyle marRig10 marTop5" onChange="saleOrderFunctionality.changePackageList()">
						</select>
						<select id="packageDimention" name="packageDimention" class="pull-left ddlStyle marRig10 marTop5" onChange="saleOrderFunctionality.changePackageDimention()">
						</select>
						<button id="populatePackageBtn" type="button" class="btn btn-success marTop5" disabled onClick="saleOrderFunctionality.populatePackages()" rel="cms_438">Populate Package</button>
					</div>
					<div id="packageDetailsHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
					</div>
					<div id="orderItemsHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5 scrollX">
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
						<button id="placeOrderBtn" type="button" class="btn btn-success marTop5" onClick="saleOrderFunctionality.savePackingDetails()" rel="cms_439">Save Packaging Details</button>
						<button id="cartonTagBtn" type="button" class="btn btn-success marTop5" onclick="saleOrderFunctionality.openCartonTag()"><i class="fa fa-tags marRig5"></i><span id="cms_370">Carton Tag</span></button>
					</div>
				</div>
				<!--Sale Order Packet Modal-->
				<div class="modal fade" id="saleOrderPacketModal" role="dialog">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="saleOrderPacketHeader" class="modal-title"></h4>
							</div>
							<div class="modal-body">
								<div id="saleOrderPacketTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-default pull-right" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
				<!--Sale Order Packet Modal-->
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<input id="orderId" name="orderId" type="hidden" value='0'>
					<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
				</div>
			</div>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>