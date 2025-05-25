<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
$orderId=isset($_REQUEST['orderId'])?(int)$_REQUEST['orderId']:0;
$deliveryNoteObj = "";
$orderItemObj = "";
$totalPrice = 0.00;
$deliveryDate = "";

if(intval($orderId) > 0){
	$sql_order = "SELECT 
	`orderCode`,
	`customerId`,
	`deliveryNote`,
	`orderItemObj`,
	`tax`,
	`status`,
	`orderDate`,
	`deliveryDate` 
	FROM `orderMaster` 
	WHERE `orderId` = ".$orderId;
	//echo $sql_order; exit;
	$sql_order_res = mysqli_query($dbConn, $sql_order);
	$sql_order_res_fetch = mysqli_fetch_array($sql_order_res);
	$customerId = intval($sql_order_res_fetch["customerId"]);
	$deliveryNoteObj = $sql_order_res_fetch["deliveryNote"];
	$deliveryNoteObj = str_replace('"', "'", $deliveryNoteObj);
	$orderItemObj = $sql_order_res_fetch["orderItemObj"];
	$deliveryDate = $sql_order_res_fetch["deliveryDate"];
}else{
	echo "<script language=\"javascript\">window.location = 'orders.php'</script>";exit;
}
/*-----------------------------------------------Product Collection-------------------------*/
$sql_productCollection = "SELECT `collectionId`,
								`collectionName` 
								FROM `productCollection` 
								WHERE 1";
//echo $sql_productCollection; exit;
$sql_productCollection_res = mysqli_query($dbConn, $sql_productCollection);
while($sql_productCollection_res_fetch = mysqli_fetch_array($sql_productCollection_res)){
	$productCollectionObject = (object) ['collectionId' => $sql_productCollection_res_fetch["collectionId"], 
								'collectionName' => $sql_productCollection_res_fetch["collectionName"]
								];
	//echo json_encode($productCollectionObject);exit;
	$productCollectionObjectArray[] = $productCollectionObject;
}
//echo json_encode($productCollectionObjectArray);exit;
/*-----------------------------------------------Product Collection-------------------------*/
/*-----------------------------------------------Product------------------------------------*/
$sql_product = "SELECT `productId`,
						`productCode`,
						`productTitle`,
						`productMainImage`,
						`productSlug`,
						`cartonUnitQuantity`,
						`collectionId` 
						FROM `product` 
						WHERE `Status`= 1";
//echo $sql_product; exit;
$sql_product_res = mysqli_query($dbConn, $sql_product);
while($sql_product_res_fetch = mysqli_fetch_array($sql_product_res)){
	$productObject = (object) ['productId' => $sql_product_res_fetch["productId"], 
								'productCode' => $sql_product_res_fetch["productCode"],
								'productTitle' => $sql_product_res_fetch["productTitle"],
								'productMainImage' => $sql_product_res_fetch["productMainImage"],
								'productSlug' => $sql_product_res_fetch["productSlug"],
								'cartonUnitQuantity' => $sql_product_res_fetch["cartonUnitQuantity"],
								'collectionId' => $sql_product_res_fetch["collectionId"]
								];
	//echo json_encode($productObject);exit;
	$productObjectArray[] = $productObject;
}
//echo json_encode($productObjectArray);exit;
/*-----------------------------------------------Product------------------------------------*/
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Duplicate Order</title>
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
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/plugins/signature_pad.min.js'></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/orders.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
   <body class="w3-light-grey">
	<?php include('includes/header.php'); ?>
	<?php include('includes/sidebar.php'); ?>
	<div class="w3-main">
		<div id="ordersSectionHolder">
			<header class="w3-container" style="padding-top:22px">
				<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> Duplicate Order</b></h5>
			</header>
			<div class="w3-row-padding w3-margin-bottom">
				<h5>Customer Details</h5>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padTop10 padBot10 sectionBlock marBot5">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
						<select id="customerDDL" name="customerDDL" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 h34" onChange="ordersFunctionality.onCustomerDDLChange(this.value)">
							<option value="0">-- Select Customer --</option>
							<?php
							$sql_customer = "SELECT `customerId`,`companyName`,`buyerName`,`contactPerson`,`phone` FROM `customer` WHERE `status` = 1 ORDER BY `customerId` DESC";
							//echo $sql_customer; exit;
							$sql_customer_res = mysqli_query($dbConn, $sql_customer);
							while($sql_customer_res_fetch = mysqli_fetch_array($sql_customer_res)){
								?>
									<option value="<?php echo $sql_customer_res_fetch["customerId"]; ?>" <?php if(intval($customerId) == intval($sql_customer_res_fetch["customerId"])){ echo "SELECTED"; } ?>><?php echo $sql_customer_res_fetch["companyName"]." - ".$sql_customer_res_fetch["buyerName"]." - ".$sql_customer_res_fetch["contactPerson"]." - ".$sql_customer_res_fetch["phone"]; ?></option>
								<?php 
							} 
							?>
						</select>
					</div>
					<?php
					$selectedDeliveryAddressId = 0;
					if(intval($customerId) > 0){
						$sql1 = "SELECT 
						`customer`.`customerId`,
						`customer`.`companyName`,
						`customer`.`companyType`,
						`companyType`.`companyType` as 'compType',
						`customer`.`buyerName`,
						`customer`.`contactPerson`,
						`customer`.`customerGrade`,
						`customer`.`address`,
						`customer`.`phone`,
						`customer`.`fax`,
						`customer`.`email`,
						`customer`.`mobile`,
						`customer`.`vat`,
						`customer`.`tax`,
						`customer`.`registrationForm`,
						`customer`.`registrationDate`,
						`customer`.`lastLoginDate`,
						`customer`.`status`
						FROM `customer` 
						INNER JOIN `companyType`
						ON `companyType`.`companyTypeId` = `customer`.`companyType`
						WHERE `customer`.`customerId` = ".$customerId;
						//echo $sql1; exit;
						$sql1_res = mysqli_query($dbConn, $sql1);
						$sql1_res_fetch = mysqli_fetch_array($sql1_res);
					?>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Company Name : </b><?php echo $sql1_res_fetch["companyName"]; ?></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Company Type : </b><?php echo $sql1_res_fetch["compType"]; ?></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Buyer Name : </b><?php echo $sql1_res_fetch["buyerName"]; ?></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Contact Person Name : </b><?php echo $sql1_res_fetch["contactPerson"]; ?></div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Address : </b><?php echo $sql1_res_fetch["address"]; ?></div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<b>Select Delivery Address : </b>
						<table class="table table-bordered table-hover table-striped f12">
							<tbody>
								<?php
								$i = 0;
								$sql2 = "SELECT
								`customerDeliveryAddress`.`deliveryAddressId`,
								`customerDeliveryAddress`.`companyName`,
								`customerDeliveryAddress`.`contactPerson`,
								`customerDeliveryAddress`.`phone`,
								`customerDeliveryAddress`.`email`,
								`customerDeliveryAddress`.`address`,
								`customerDeliveryAddress`.`postCode`,
								`customerDeliveryAddress`.`country`,
								`customerDeliveryAddress`.`town`
								FROM `customerDeliveryAddress`
								WHERE `customerDeliveryAddress`.`customerId` = ".$customerId;
								//echo $sql2; exit;
								$sql2_res = mysqli_query($dbConn, $sql2);
								$sql2_res_rowcount=mysqli_num_rows($sql2_res);
								if($sql2_res_rowcount > 0){
									while($sql2_res_fetch = mysqli_fetch_array($sql2_res)){
										if($i == 0){ 
											$selectedDeliveryAddressId = $sql2_res_fetch["deliveryAddressId"];
										}
									?>
									<tr>
										<td width="2%">
											<input type="radio" id="customerDeliveryAddress_<?php echo $sql2_res_fetch["deliveryAddressId"]; ?>" name="customerDeliveryAddress" value="<?php echo $sql2_res_fetch["deliveryAddressId"]; ?>" <?php if($i == 0){ echo "checked"; }?> onclick="ordersFunctionality.onDeliveryAddressRadioChnage(this.value)">
											<input type="hidden" id="customerDeliveryCountry_<?php echo $sql2_res_fetch["deliveryAddressId"]; ?>" name="customerDeliveryCountry_<?php echo $sql2_res_fetch["deliveryAddressId"]; ?>" value="<?php echo $sql2_res_fetch["country"]; ?>">
										</td>
										<td width="98%">
											<?php 
												echo "<b>Company Name :</b> ".$sql2_res_fetch["companyName"]." | ";
												echo "<b>Contact Person :</b> ".$sql2_res_fetch["contactPerson"]." | ";
												echo "<b>Phone :</b> ".$sql2_res_fetch["phone"]." | ";
												echo "<b>e-mail :</b> ".$sql2_res_fetch["email"]." | ";
												echo "<b>Address :</b> ".$sql2_res_fetch["address"]." | ";
												echo "<b>Town :</b> ".$sql2_res_fetch["town"]." | ";
												echo "<b>Post Code :</b> ".$sql2_res_fetch["postCode"]." | ";
												echo "<b>Country :</b> ".$sql2_res_fetch["country"];
											?>
										</td>
									</tr>
									<?php 
										$i++; 
									} 
								}else{
								?>
									<tr>
										<td><span class="redText">Delivery Address is not avilable, You cant create order with out adding delivery address</span></td>
									</tr>
								<?php } ?>
							</tbody>
						</table>
					</div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Phone : </b><?php echo $sql1_res_fetch["phone"]; ?></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Fax : </b><?php echo $sql1_res_fetch["fax"]; ?></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Email : </b><a href = "mailto: <?php echo $sql1_res_fetch["email"]; ?>"><?php echo $sql1_res_fetch["email"]; ?></a></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Mobile : </b><?php echo $sql1_res_fetch["mobile"]; ?></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>VAT : </b><?php echo $sql1_res_fetch["vat"]; ?></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>TAX : </b><?php echo $sql1_res_fetch["tax"]; ?></div>
					<?php if($sql1_res_fetch["registrationForm"] != ""){ ?>
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_247">Registration Form </b> : <a href="<?php echo SITEURL; ?>uploads/customerRegistrationForm/<?php echo $sql1_res_fetch["registrationForm"]; ?>" target="_blank"><i class="fa fa-file-pdf-o redText hover"></i></a></div>
					<?php }else{ ?>
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_247">Registration Form </b> : No files present</div>
					<?php } ?>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Customer Registration Date : </b> <?php echo $sql1_res_fetch["registrationDate"]; ?></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Customer Last Login Date : </b> <?php echo $sql1_res_fetch["lastLoginDate"]; ?></div>
					<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b>Customer Grade : </b> <?php echo $sql1_res_fetch["customerGrade"]; ?></div>
					<input type="hidden" id="customerIdHdn" name="customerIdHdn" value="<?php echo $customerId; ?>">
					<?php } ?>
				</div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot5">
					<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly">
						<h5>Customer cart</h5>
					</div>
					<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
						<?php if(intval($customerId) > 0){ ?>
						<button id="openProductModal" type="button" class="pull-right w3-button w3-green" onclick="ordersFunctionality.openProductModal()">Add Order Item</button>
						<?php } ?>
						<input id="productCollectionSerializedData" name="productCollectionSerializedData" type="hidden" value='<?php if(mysqli_num_rows($sql_productCollection_res) > 0){ echo json_encode($productCollectionObjectArray); }else { echo "[]"; } ?>'>
						<input id="productSerializedData" name="productSerializedData" type="hidden" value='<?php if(mysqli_num_rows($sql_product_res) > 0){ echo json_encode($productObjectArray); } else { echo "[]"; } ?>'>
					</div>
				</div>
				<div id="cartSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 padTop10 padBot10 sectionBlock marBot5 scrollX"></div>
				<div id="otherFormElements" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
					<button id="placeOrderBtn" type="button" class="w3-button w3-green" onclick="ordersFunctionality.placeOrder()">Place Order</button>				
				</div>
				<form id="orderEntryForm" name="orderEntryForm" method="POST" action="ordersEntry.php">
					<input type="hidden" id="customerId" name="customerId" value="<?php echo $customerId; ?>">
					<input type="hidden" id="deliveryAddressId" name="deliveryAddressId" value="<?php echo $selectedDeliveryAddressId; ?>">
					<input type="hidden" id="orderId" name="orderId" value="<?php echo $orderId; ?>">
					<input type="hidden" id="deliveryNoteObj" name="deliveryNoteObj" value="<?php echo $deliveryNoteObj; ?>">
					<input type="hidden" id="orderItemObj" name="orderItemObj" value="<?php echo $orderItemObj; ?>">
					<input type="hidden" id="totalPriceHdn" name="totalPriceHdn" value="<?php echo $totalPrice; ?>">
					<input type="hidden" id="deliveryDate" name="deliveryDate" value="">
					<input type="hidden" id="tax" name="tax" value="<?php if(isset($sql_order_res_fetch["tax"])){ echo $sql_order_res_fetch["tax"]; }else{ echo "0"; } ?>">
					<input type="hidden" id="customerSignBase64" name="customerSignBase64" value="">
					<input type="hidden" id="useExistingSign" name="useExistingSign" value="<?php echo file_exists("../".UPLOADFOLDER."customerSignature/CUST-SIGN_".$customerId.".jpeg"); ?>">
				</form>
			</div>
		</div>
		<!-- Add product in existing Cart Modal -->
		<div class="modal fade" id="productModal" role="dialog">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Add Cart Item</h4>
					</div>
					<div class="modal-body">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
								<select id="productCollectionId" name="productCollectionId" class="h34 w98p"></select>
							</div>
							<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
								<select id="productId" name="productId" class="h34 w98p">
									<option value='0'>-- Select Product --</option>
								</select>
							</div>
							<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
								<select id="colorId" name="colorId" class="h34 pull-left marRig5">
									<option value=''>-- Select Color --</option>
								</select>
								<div id="selectedColorBox" class="colorCube2 pull-left hide"></div>
							</div>
						</div>
						<div id="productImages" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
						<br clear="all">
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-success" onclick="ordersFunctionality.addProductToCart()">Add Product</button>
					</div>
				</div>
			</div>
		</div>
		<!-- Add product in existing Cart Modal -->
		<!-- Signature Modal -->
		<div class="modal fade" id="signatureModal" role="dialog">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Customer Signature</h4>
					</div>
					<div id="signatureCanvas" class="modal-body">
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
						<button type="button" class="btn btn-default pull-right w3-green" onclick="ordersFunctionality.processCustomerSignature()">Save</button>
						<button type="button" class="btn btn-default pull-right w3-orange" onclick="ordersFunctionality.skipCustomerSignature()">Skip</button>
					</div>
				</div>
			</div>
		</div>
		<!-- Signature Modal -->
		<br>
		<?php include('includes/footer.php'); ?>
	</div>
</body>
</html>