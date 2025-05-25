<?php 
include('config/config.php');
$section = "FRONT";
$page = "PRINTABLEORDER";

$actual_link = "https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$type = isset($_REQUEST['type']) ? trim($_REQUEST['type']) : "";
$orderGUID = isset($_REQUEST['orderGUID']) ? trim($_REQUEST['orderGUID']) : "";

/*echo "type : ".$type."<br/>";
echo "orderGUID : ".$orderGUID."<br/>";
exit;*/

$orderCode = "";

if($type == "SALEINVOICE" && $orderGUID != "") {
    $sql = "SELECT `orderCode` FROM `orderSale` WHERE `GUID` = '".mysqli_real_escape_string($dbConn, $orderGUID)."'";
    $sql_res = mysqli_query($dbConn, $sql);
    if($sql_res && mysqli_num_rows($sql_res) > 0) {
        $sql_res_fetch = mysqli_fetch_array($sql_res);
        $orderCode = $sql_res_fetch["orderCode"];
    }
} 
else if($type == "PURCHASEINVOICE" && $orderGUID != "") {
    $sql = "SELECT `purchaseOrderCode` FROM `orderPurchase` WHERE `GUID` = '".mysqli_real_escape_string($dbConn, $orderGUID)."'";
    $sql_res = mysqli_query($dbConn, $sql);
    if($sql_res && mysqli_num_rows($sql_res) > 0) {
        $sql_res_fetch = mysqli_fetch_array($sql_res);
        $orderCode = $sql_res_fetch["purchaseOrderCode"];
    }
}
else {
    echo "<script language=\"javascript\">window.location = '".SITEURL."'</script>";exit;
}
?>
<!DOCTYPE html>
<html>
<title><?php echo SITENAME; ?> - <?php echo $orderCode; ?></title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="<?php echo THEMECOLOR; ?>" />
<meta name="keywords" content="<?php echo $orderCode; ?>" />
<meta name="description" content="<?php echo $orderCode; ?>" />
<link rel="shortcut icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon" />
<link rel="icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon">

<!-------------------------------------------------Social Media Meta Elements---------------------------------------------->
<link rel="canonical" href="<?php echo $actual_link; ?>"/>
<meta property="og:url" content="<?php echo $actual_link; ?>"/>
<meta property="og:type" content="product"/>
<meta property="og:title" content="<?php echo SITENAME; ?>"/>
<meta property="og:description" content="<?php echo SITECOMMONDESCRIPTION; ?>"/>
<meta property="og:image" content="<?php echo SITEURL; ?>assets/images/logo.jpg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<link rel="image_src" type="image/jpeg" href="<?php echo SITEURL; ?>assets/images/logo.jpg">
<!-------------------------------------------------Social Media Meta Elements---------------------------------------------->

<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->

<!-------------------------------------------------Common CSS-------------------------------------------------------------->
<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/styles.css">
<!-------------------------------------------------Common CSS-------------------------------------------------------------->

<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->

<!-------------------------------------------------Application Common JS--------------------------------------------------->
<script src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
<!-------------------------------------------------Application Common JS--------------------------------------------------->

<!-------------------------------------------------Frontend Functionality JS----------------------------------------------->
<script src="<?php echo SITEURL; ?>assets/js/frontendFunctionality/frontendFunctionality.js"></script>
<!-------------------------------------------------Frontend Functionality JS----------------------------------------------->
<body>
	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly no-print">
			<button type="button" class="btn btn-xs btn-success pull-left marTop3" onclick="window.print();">
				<i class="fa fa-print"></i>
				<span>Print</span>
			</button>
			<button type="button" class="btn btn-xs btn-success pull-left marLeft5 marTop3" onclick="appCommonFunctionality.socialShare('<?php echo $orderCode; ?>', '<?php echo $actual_link; ?>', '');">
				<i class="fa fa-share-alt"></i>
			</button>
			<select id="languageDDL" class="pull-right marTop3" onChange="appCommonFunctionality.changeLang(this.value);">
			</select>
		</div>
		<!-------------------------------------------------1st Copy------------------------------------------------------>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly printabaleOrderSection marTop16 marBot10">
			<div><img src="<?php echo SITECOMMONIMAGE; ?>" alt="logo" class="printabaleOrderLogo"></div>
			<div id="pritableOrderInformation1" class="text-center"></div>
			<div>
				<img id="printabaleOrderQR1" src="" alt="" class="printabaleOrderQR">
			</div>
		</div>
		<div id="pritableOrderTable1_1" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10 minHTable">
			<div id="cartTableHolder1">
			</div>
			<div class="printabaleOrderSection">
				<div id="printableOrderPaymentInformation1" class="w350px">
				</div>
				<div class="w350px">
					<table class="table table-bordered table-striped">
						<tr>
							<td id="cms_718">Total price:</td>
							<td class="text-right" id="totalBeforeTax1"></td>
						</tr>
						<tr>
							<td id="cms_719">Packing Cost:</td>
							<td class="text-right" id="packingCost1"></td>
						</tr>
						<tr>
							<td id="cms_720">Discount:</td>
							<td class="text-right" id="specialDiscount1"></td>
						</tr>
						<!--NC Removing on Demand-->
						<!--<tr>
							<td id="cms_721">Tax:</td>
							<td class="text-right" id="taxAmount1"></td>
						</tr>-->
						<!--NC Removing on Demand-->
						<tr>
							<td><strong id="cms_722">Grand Total:</strong></td>
							<td class="text-right"><b id="totalPrice1"></b></td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<div id="printabaleOrderTnC1" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10 f12"></div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly printabaleOrderSectionFooter marBot10">
			<div>
				<div id="cms_723">Scan To Pay</div>
				<div>UPI ID : <span id="upiid"></span></div>
				<img src="<?php echo SITEURL; ?>assets/images/QRCode.png" alt="logo" class="printabaleOrderLogo">
			</div>
			<div class="signatureBox">
				<div><span id="cms_848">Signature from</span> <?php echo SITENAME; ?></div>
				
			</div>
			<div><img src="<?php echo SITEURL; ?>assets/images/sign.png" alt="logo" class="printabaleSign"></div>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10 text-center">
			<span>Designed and Delivered by <a href="http://educontrol.org/b2b2c/">B2B2C</a> - Journey From Business to Business to Brilliant.</span>
		</div>
		<!-------------------------------------------------1st Copy------------------------------------------------------>
		
		<div class="pagebreak"></div>
		
		<!-------------------------------------------------2nd Copy------------------------------------------------------>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly printabaleOrderSection marTop16 marBot10">
			<div><img src="<?php echo SITEURL; ?>assets/images/logoBW.jpg" alt="logo" class="printabaleOrderLogo"></div>
			<div id="pritableOrderInformation2" class="text-center"></div>
			<div>
				<img id="printabaleOrderQR2" src="" alt="" class="printabaleOrderQR">
			</div>
		</div>
		<div id="pritableOrderTable1_2" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10 minHTable">
			<div id="cartTableHolder2">
			</div>
			<div class="printabaleOrderSection">
				<div id="printableOrderPaymentInformation2" class="w350px">
				</div>
				<div class="w350px">
					<table class="table table-bordered table-striped">
						<tr>
							<td id="cms_718">Total price:</td>
							<td class="text-right" id="totalBeforeTax2"></td>
						</tr>
						<tr>
							<td id="cms_719">Packing Cost:</td>
							<td class="text-right" id="packingCost2"></td>
						</tr>
						<tr>
							<td id="cms_720">Discount:</td>
							<td class="text-right" id="specialDiscount2"></td>
						</tr>
						<!--NC Removing on Demand-->
						<!--<tr>
							<td id="cms_721">Tax:</td>
							<td class="text-right" id="taxAmount2"></td>
						</tr>-->
						<!--NC Removing on Demand-->
						<tr>
							<td><strong id="cms_722">Grand Total:</strong></td>
							<td class="text-right"><b id="totalPrice2"></b></td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<div id="printabaleOrderTnC2" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10 f12"></div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly printabaleOrderSectionFooter marBot10">
			<div>
				<div id="cms_723">Scan To Pay</div>
				<div>UPI ID : <span id="upiid"></span></div>
				<img src="<?php echo SITEURL; ?>assets/images/QRCode.png" alt="logo" class="printabaleOrderLogo">
			</div>
			<div class="signatureBox">
				<div>
					<span id="cms_848">Signature from</span> 
					<span id="signingAuthority"></span>
				</div>
			</div>
			<div><img src="<?php echo SITEURL; ?>assets/images/signBW.png" alt="logo" class="printabaleSign"></div>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10 text-center">
			<span>Designed and Delivered by <a href="http://educontrol.org/b2b2c/">B2B2C</a> - Journey From Business to Business to Brilliant.</span>
		</div>
		<!-------------------------------------------------2nd Copy------------------------------------------------------>

		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center no-print">
			<button type="button" class="btn btn-xs btn-success marTop3" onclick="window.print();">
				<i class="fa fa-print"></i>
				<span>Print</span>
			</button>
			<button type="button" class="btn btn-xs btn-success marLeft5" onclick="appCommonFunctionality.socialShare('<?php echo $orderCode; ?>', '<?php echo $actual_link; ?>', '');">
				<i class="fa fa-share-alt"></i>
			</button>
		</div>
		<br clear="all">
		<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
		<input id="tncData" name="tncData" type="hidden" value='<?php echo readPreCompliedData("TNC"); ?>'>
		<input id="CMSDATA" name="CMSDATA" type="hidden" value='<?php if($section != "" && $page != ""){ echo readPreCompiledCmsData($section, $page); }?>'>
	</div>
</body>
</html>
