<?php
include('../config/config.php');
include('auth.php');
$section = "ADMIN";
$page = "PRODUCT";

$productId=isset($_REQUEST['productId'])?intval($_REQUEST['productId']):0;
$productCombinationId=isset($_REQUEST['productCombinationId'])?intval($_REQUEST['productCombinationId']):0;
$groupIdentifire=isset($_REQUEST['groupIdentifire'])?$_REQUEST['groupIdentifire']:"";
$groupingData=isset($_REQUEST['groupingData'])?$_REQUEST['groupingData']:"";

/*echo "productId : ".$productId."<br>";
echo "productCombinationId : ".$productCombinationId."<br>";
echo "groupIdentifire : ".$groupIdentifire."<br>";
echo "groupingData : ".$groupingData."<br>";
exit;*/

if($productId > 0 && $productCombinationId > 0 && $groupIdentifire != "" && $groupingData != ""){
	$productSql = "SELECT `productTitle`, `productCode` FROM `product` WHERE `productId` = ".$productId;
	//echo $productSql; exit;
	$productSql_res = mysqli_query($dbConn, $productSql);
	$productSql_res_fetch = mysqli_fetch_array($productSql_res);
	//print_r($productSql_res_fetch);exit;
	$productTitle = $productSql_res_fetch["productTitle"];
	$productCode = $productSql_res_fetch["productCode"];
	
	$productPriceSql = "SELECT `RPrice`,`WPrice` FROM `productCombination` WHERE `productId` = ".$productId." AND `productCombinationId` = ".$productCombinationId;
	//echo $productPriceSql; exit;
	$productPriceSql_res = mysqli_query($dbConn, $productPriceSql);
	$productPriceSql_res_fetch = mysqli_fetch_array($productPriceSql_res);
	//print_r($productPriceSql_res_fetch);exit;
	$RPrice = $productPriceSql_res_fetch["RPrice"];
	$WPrice = $productPriceSql_res_fetch["WPrice"];
	
	$productStockSql = "SELECT `productStock`.`systemReference`,
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
			$productStockObject = (object) ['systemReference' => $productStockSql_res_fetch["systemReference"], 
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
		<title>Baaron GmbH Admin | <?php echo $productTitle; ?> [<?php echo $productCode; ?>] Qr-Bar Code Print</title>
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
	<body>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-left nopaddingOnly marTop3 f10 no-print">
			<button type="button" class="pull-left" onclick="window.print();">
				<span id="cms_133">Print</span> 
				<span class="glyphicon glyphicon-print"></span>
			</button>
		</div>
		<div id="stickerHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
		<?php 
		$sql = "SELECT `productCombination`.`systemReference`,
		`productCombination`.`RPrice`,
		`product`.`productCode`,
		`product`.`productTitle`
		FROM `productCombination` 
		INNER JOIN `product`
		ON `product`.`productId` = `productCombination`.`productId`
		WHERE `productCombination`.`productId` IN (9, 10, 11, 12, 13)";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		if(mysqli_num_rows($sql_res) > 0){
			$str = '';
			while($sql_res_fetch = mysqli_fetch_array($sql_res)){
				$str .= '<div class="sticker pull-left">';
				$str .= '    <div class="text-center">';
				$str .= '        <img src="http://educontrol.org/b2b2c/assets/images/logo.jpg" alt="logo" class="w24 pull-right">';
				$str .= '        <span>B2B2C</span>';
				$str .= '    </div>';
				$str .= '    <div class="text-center">';
				$str .= '        <span>'.$sql_res_fetch["productTitle"].' ['.$sql_res_fetch["productCode"].']</span>';
				$str .= '    </div>';
				$str .= '    <div class="text-center">';
				$str .= '        <img src="http://educontrol.org/b2b2c/api/qrcode.php?qr=B2B2C_'.$sql_res_fetch["systemReference"].'" alt="'.$sql_res_fetch["systemReference"].'" width="45px">';
				$str .= '    </div>';
				$str .= '    <div class="text-center">';
				$str .= '        <b>£'.$sql_res_fetch["RPrice"].'</b>';
				$str .= '    </div>';
				$str .= '</div>';
			}
			echo $str;
		}
		?>
		</div>
		<input id="productTitle" name="productTitle" type="hidden" value='<?php if(isset($productTitle)){ echo $productTitle; } ?>'>
		<input id="productCode" name="productCode" type="hidden" value='<?php if(isset($productCode)){ echo $productCode; } ?>'>
		<input id="RPrice" name="RPrice" type="hidden" value='<?php if(isset($RPrice)){ echo $RPrice; } ?>'>
		<input id="WPrice" name="WPrice" type="hidden" value='<?php if(isset($WPrice)){ echo $WPrice; } ?>'>
		<input id="productCombinationStockData" name="productCombinationStockData" type="hidden" value='<?php if(isset($productStockObjectArray)){ echo json_encode($productStockObjectArray); } ?>'>
		<input id="langData" name="langData" type="hidden" value='<?php if($section != "" && $page != ""){ echo readPreCompiledCmsData($section, $page); }?>'>
	</body>
</html>