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
	
	$productCombinationSql = "SELECT `QRText`,`systemReference` FROM `productCombination` WHERE `productCombinationId` = ".$productCombinationId;
	//echo $productCombinationSql; exit;
	$productCombinationSql_res = mysqli_query($dbConn, $productCombinationSql);
	$productCombinationSql_res_fetch = mysqli_fetch_array($productCombinationSql_res);
	//print_r($productCombinationSql_res_fetch);exit;
	$productCombinationQR = $productCombinationSql_res_fetch["QRText"];
	$productSystemReference = $productCombinationSql_res_fetch["systemReference"];
}else{
	echo "<script language=\"javascript\">window.location = 'productStock.php'</script>";exit;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Stock Entry</title>
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
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/plugins/hummingbird-treeview.css" >
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
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/hummingbird-treeview.js"></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/product.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
   <body class="w3-light-grey">
      <?php include('includes/header.php'); ?>
      <?php include('includes/sidebar.php'); ?>
      <div class="w3-main">
         <div id="productSectionHolder">
            <header class="w3-container" style="padding-top:22px">
               <h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_106">Stock Entry</span></b></h5>
            </header>
            <div class="w3-row-padding w3-margin-bottom">
				<?php if($productId > 0){ include('includes/productProgressTab.php'); } ?>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<h5 id="productTitle"><?php echo $productTitle." [".$productCode."]"?></h5>
					<div id="productCombination" class="marBot5"></div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly marBot5">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group marBot5">
									<span id="cms_107" class="input-group-addon">Stock Reference : </span>
									<input id="entryReference" name="entryReference" type="text" class="form-control" rel="cms_108" placeholder="Enter from where this stock came" autocomplete="off" value="">
								</div>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="cms_50" class="input-group-addon">Stock Volumn : </span>
										<input id="stockVol" name="stockVol" type="number" class="form-control" placeholder="Enter how much stock came" rel="cms_109" autocomplete="off" value="">
										<?php if(PRODUCTSTOCKINDIVIDUALIDENTITY){ ?>
										<span class="input-group-addon">
											<i class="fa fa-remove redText" onclick="productFunctionality.removeLastSystemRef()"></i>
											<i class="fa fa-plus greenText" onclick="productFunctionality.addOneMoreSystemRef()"></i>
										</span>
										<?php } ?>
									</div>
								</div>
								<?php if(PRODUCTSTOCKINDIVIDUALIDENTITY){ ?>
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
									<button id="populateInputs" type="button" class="btn btn-success pull-left marleft5" onclick="productFunctionality.populateInputs()" rel="cms_110">Populate Inputs</button>
								</div>
								<?php } ?>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<?php if(PRODUCTSTOCKINDIVIDUALIDENTITY){ ?>
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
									<button id="autoGenerateBarQrCode" type="button" class="btn btn-success pull-left" onclick="productFunctionality.autoGenerateBarQrCode()" rel="cms_111">Auto Generate Codes</button>
								</div>
								<?php } ?>
								<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
									<label class="pull-right marLeft5">
										<i id="barCode" class="fa fa-barcode f38 hide"></i>
										<i id="qrCode" class="fa fa-qrcode f38"></i>
									</label>
									<label id="barQr_switch" class="switch pull-right" onchange="productFunctionality.onBarQrSwitchChange()">
										<input id="barQr" name="barQr" type="checkbox" value="0">
										<span id="barQrSlider" class="slider"></span>
									</label>
									<?php if(PRODUCTSTOCKINDIVIDUALIDENTITY){ ?>
										<label class="pull-right">
											<i class="fa fa-camera f38 lightGreyText marRig5 hover" onclick="productFunctionality.openQrCodeScanner()"></i>
										</label>
									<?php } ?>
								</div>
							</div>
							<div id="barQrInputHTMLHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 noRightPaddingOnly marBot5">
							<div><b id="cms_112">Select Item Position : </b></div>
							<div id="treeview_container" class="hummingbird-treeview scrollX">
								<ul id="treeview" class="hummingbird-base padLeft16"></ul>
							</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5 text-center">
						<button type="submit" class="btn btn-success" rel="cms_113" onclick="productFunctionality.saveStock()">Submit</button>
						<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
						<input id="productCode" name="productCode" type="hidden" value='<?php echo $productCode; ?>'>
						<input id="productCombinationId" name="productCombinationId" type="hidden" value='<?php echo $productCombinationId; ?>'>
						<input id="productCombinationQR" name="productCombinationQR" type="hidden" value='<?php echo $productCombinationQR; ?>'>
						<input id="productSystemReference" name="productSystemReference" type="hidden" value='<?php echo $productSystemReference; ?>'>
						<input id="systemReferenceArray" name="systemReferenceArray" type="hidden" value=''>
						<input id="storageId" name="storageId" type="hidden" value=''>
					</div>
				</div>
            </div>
         </div>
         <br>
         <?php include('includes/footer.php'); ?>
      </div>
   </body>
</html>