<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$productId=isset($_REQUEST['productId'])?intval($_REQUEST['productId']):0;
$productCombinationId=isset($_REQUEST['productCombinationId'])?intval($_REQUEST['productCombinationId']):0;
if($productId > 0 && $productCombinationId > 0){
	$productSql = "SELECT `productTitle`, `productCode` FROM `product` WHERE `productId` = ".$productId;
	//echo $productSql; exit;
	$productSql_res = mysqli_query($dbConn, $productSql);
	$productSql_res_fetch = mysqli_fetch_array($productSql_res);
	//print_r($productSql_res_fetch);exit;
	$productTitle = $productSql_res_fetch["productTitle"];
	$productCode = $productSql_res_fetch["productCode"];
	
	$productCombinationSql = "SELECT `QRText` FROM `productCombination` WHERE `productCombinationId` = ".$productCombinationId;
	//echo $productCombinationSql; exit;
	$productCombinationSql_res = mysqli_query($dbConn, $productCombinationSql);
	$productCombinationSql_res_fetch = mysqli_fetch_array($productCombinationSql_res);
	//print_r($productCombinationSql_res_fetch);exit;
	$productCombinationQR = $productCombinationSql_res_fetch["QRText"];
	
	$productStockSql = "SELECT `productStock`.`stockId`,
	`productStock`.`systemReference`,
	`productStock`.`systemReferenceType`,
	`productStock`.`entryDate`,
	`productStock`.`entryReference`,
	`productStockStorage`.`storageName`
	FROM `productStock` 
	INNER JOIN `productStockStorage`
	ON `productStockStorage`.`storageId` = `productStock`.`itemPosition`
	WHERE `productStock`.`productId` = ".$productId." 
	AND `productStock`.`productCombinationId` = ".$productCombinationId." 
	AND `productStock`.`status` = 1
	ORDER BY `productStock`.`entryDate` DESC";
	//echo $productStockSql; exit;
	$productStockSql_res = mysqli_query($dbConn, $productStockSql);
	if(mysqli_num_rows($productStockSql_res) > 0){
		while($productStockSql_res_fetch = mysqli_fetch_array($productStockSql_res)){
			$productStockObject = (object) ['stockId' => (int)$productStockSql_res_fetch["stockId"], 
											'systemReference' => $productStockSql_res_fetch["systemReference"], 
											'systemReferenceType' => (int)$productStockSql_res_fetch["systemReferenceType"],
											'entryDate' => $productStockSql_res_fetch["entryDate"],
											'entryReference' => $productStockSql_res_fetch["entryReference"],
											'storageName' => $productStockSql_res_fetch["storageName"]
											];
			//echo json_encode($productStockObject);exit;
			$productStockObjectArray[] = $productStockObject;
		}
		//echo json_encode($productStockObjectArray);exit;
	}
}else{
	echo "<script language=\"javascript\">window.location = 'productStock.php'</script>";exit;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | <?php echo $productTitle; ?> [<?php echo $productCode; ?>]</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/product.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="productSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?> pull-left"></i><span id="cms_114">Stock Details</span></b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php if($productId > 0){ include('includes/productProgressTab.php'); } ?>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<h5 id="productTitle"><?php echo $productTitle." [".$productCode."]"?></h5>
							<div id="productCombination" class="marBot5"></div>
						</div>
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<button type="button" class="btn btn-success marBot5" onClick="productFunctionality.makeProductStockGroup('DATE')" rel="cms_116">Group by Date</button>
							<button type="button" class="btn btn-success marBot5" onClick="productFunctionality.makeProductStockGroup('ENTRYREF')" rel="cms_117">Group by Entry Reference</button>
							<button type="button" class="btn btn-success marBot5" onClick="productFunctionality.makeProductStockGroup('STORAGELOCATION')" rel="cms_118">Group by Storage Location</button>
						</div>
					</div>
					<div id="accordionPanelGroupHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
					<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
					<input id="productCode" name="productCode" type="hidden" value='<?php echo $productCode; ?>'>
					<input id="productCombinationId" name="productCombinationId" type="hidden" value='<?php echo $productCombinationId; ?>'>
					<input id="productCombinationQR" name="productCombinationQR" type="hidden" value='<?php echo $productCombinationQR; ?>'>
					<input id="productCombinationStockData" name="productCombinationStockData" type="hidden" value='<?php if(isset($productStockObjectArray)){ echo json_encode($productStockObjectArray); }  ?>'>
				</div>
				<!-- Combination Image Modal -->
				<div class="modal fade" id="stockDeleteModal" role="dialog">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_119" class="modal-title">Delete Selected Stocks</h4>
							</div>
							<div class="modal-body">
								<div class="input-group marBot5">
									<span id="cms_120" class="input-group-addon">Dispatch Reason : </span>
									<input id="dispatchReference" name="dispatchReference" type="text" class="form-control" placeholder="Enter Reason for Delete" rel="cms_121" autocomplete="off" value="">
								</div>
								<input id="productIdHdn" name="productIdHdn" type="hidden" value='<?php echo $productId; ?>'>
								<input id="productCombinationIdHdn" name="productCombinationIdHdn" type="hidden" value='<?php echo $productCombinationId; ?>'>
								<input id="selectedStockIds" name="selectedStockIds" type="hidden" value=''>
								<input id="ACTION" name="ACTION" type="hidden" value='DELETESTOCK'>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-success" rel="cms_113" onclick="productFunctionality.dispachProductStock()">Submit</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Combination Image Modal -->
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>