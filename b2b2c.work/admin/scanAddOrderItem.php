<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
/*-----------------------------------------------Product------------------------------------*/
$sql = "SELECT 
		`product`.`productId`,
		`product`.`productTitle`,
		`product`.`productCode`, 
		`product`.`cartonUnitQuantity`,
		`product`.`productSlug`,
		`productColorBarcode`.`colorName`,
		`productColorBarcode`.`colorCode`,
		`productColorBarcode`.`barCode`,
		`product`.`productMainImage`,
		`product`.`productPrice`,
		`product`.`productPriceA`,
		`product`.`productPriceW`
		FROM `product` 
		INNER JOIN `productColorBarcode`
		ON `productColorBarcode`.`productId` = `product`.`productId`
		WHERE `product`.`Status` = 1";
//echo $sql; exit;
$sql_res = mysqli_query($dbConn, $sql);
while($sql_res_fetch = mysqli_fetch_array($sql_res)){
	$productObject = (object) ['productId' => $sql_res_fetch["productId"], 
								'productCode' => $sql_res_fetch["productCode"],
								'productTitle' => $sql_res_fetch["productTitle"],
								'cartonUnitQuantity' => $sql_res_fetch["cartonUnitQuantity"],
								'productSlug' => $sql_res_fetch["productSlug"],
								'colorName' => $sql_res_fetch["colorName"],
								'colorCode' => $sql_res_fetch["colorCode"],
								'barCode' => $sql_res_fetch["barCode"],
								'productMainImage' => $sql_res_fetch["productMainImage"],
								'productPriceR' => $sql_res_fetch["productPrice"],
								'productPriceA' => $sql_res_fetch["productPriceA"],
								'productPriceW' => $sql_res_fetch["productPriceW"]
							  ];
	//echo json_encode($productObject);exit;
	$productObjectArray[] = $productObject;
}
//echo json_encode($productObjectArray);exit;
/*-----------------------------------------------Product------------------------------------*/

/*-----------------------------------------------Customer Grade-----------------------------*/
$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
if($customerId > 0){
	$sql_customer = "SELECT `customerGrade` FROM `customer` WHERE `customerId` = ".$customerId;
	//echo $sql_customer; exit;
	$sql_customer_res = mysqli_query($dbConn, $sql_customer);
	$sql_customer_res_fetch = mysqli_fetch_array($sql_customer_res);
}else{
	echo "<script language=\"javascript\">window.location = 'orders.php'</script>";exit;
}
/*-----------------------------------------------Customer Grade-----------------------------*/
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Scan & Add Order Items</title>
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
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css">  
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script src="https://cdn.jsdelivr.net/npm/scandit-sdk@5.x"></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/orders.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="ordersSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa fa-cart-arrow-down"></i> 
							<span>Scan & Add Order Items</span>
						</b>
					</h5>
				</header>
				<div class="container-fluid text-center">    
					<div id="scandit-barcode-picker"></div>
				</div>
				<input id="productSerializedData" name="productSerializedData" type="hidden" value='<?php if(mysqli_num_rows($sql_res) > 0){ echo json_encode($productObjectArray); } else { echo "[]"; } ?>'>
				<input id="customerGrade" name="customerGrade" type="hidden" value='<?php if(mysqli_num_rows($sql_customer_res) > 0){ echo $sql_customer_res_fetch["customerGrade"]; } else { echo "W"; } ?>'>
				<!-- Product Recognization Modal -->
				<div class="modal fade" id="recognizedProductModal" role="dialog">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="recognizedProductModalHeader" class="modal-title"></h4>
							</div>
							<div class="modal-body">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8 nopaddingOnly">
										<img id="recognizedProductbarCodeImg" src="" onerror="ordersFunctionality.barCodeImgError(this);">
									</div>
									<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 nopaddingOnly">
										<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
											<div id="recognizedProductColor" class="colorCube pull-right"></div>
										</div>
										<div id="recognizedProductColorText" class="text-right"></div>
									</div>
								</div>
								<div id="recognizedProductImages" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly recognizedProductImages"></div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="quantitySpan" class="input-group-addon">Quantity : </span>
										<input type="number" id="quantity" name="quantity" class="form-control minW80" autocomplete="off" value="">
									</div>
									<div class="input-group marBot5">
										<span id="unitPriceSpan" class="input-group-addon">Unit Price € : </span>
										<input type="number" id="unitPrice" name="unitPrice" class="form-control minW80" autocomplete="off" value="0.00" min="0.00" step="0.01">
									</div>
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
								<button id="addScannedItemToOrderBtn" type="button" class="btn btn-default pull-right w3-green" onclick="ordersFunctionality.addScannedItemToOrder()" disabled>Add to order</button>
								<button type="button" class="btn btn-default pull-right w3-green" onclick="window.location.reload()">Re-Scan</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Product Recognization Modal -->
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>