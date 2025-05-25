<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$productImagesArr = array();
$productVideosArr = array();
$productId=isset($_REQUEST['productId'])?(int)$_REQUEST['productId']:0;
//echo $productId; exit;
if($productId > 0){
	$sql_SelectProductImage = "SELECT `productImages` FROM `product` WHERE `productId` = ".$productId;
	//echo $sql_SelectProductImage; exit;
	$sql_SelectProductImage_res = mysqli_query($dbConn, $sql_SelectProductImage);
	$sql_CombinationImage_res_fetch = mysqli_fetch_array($sql_SelectProductImage_res);
	$productImagesArr = explode(",", $sql_CombinationImage_res_fetch["productImages"]);
	//print_r($productImagesArr);exit;
}

if(count($_POST)){
	if(intval($productId) > 0){
		$productVideo=isset($_REQUEST['productVideo'])?$_REQUEST['productVideo']:"";
		if ((isset($_FILES['productImages']) && !empty($_FILES['productImages']['name'][0])) || $productVideo != "") {
			$justUploadedImages = multiplefileUpload($productId, "uploads/products/", "productImage", "productImages", ALLOWEDEXTENSIONS);
			//echo $justUploadedImages; //exit;
			//echo $productVideo; exit;
			array_push($productVideosArr, $productVideo);
			
			$justUploadedImageArr = explode(',', $justUploadedImages);
			foreach ($justUploadedImageArr as $justUploadedImage) {
				/*------------------------------Check & make product image thumbnails-------------------------*/
				if (!file_exists("../uploads/products/64x64/$justUploadedImage")) {
					makeThumbnail("../uploads/products/$justUploadedImage", "../uploads/products/64x64/$justUploadedImage", 64, 64);
				}
				/*------------------------------Check & make product image thumbnails-------------------------*/
			}

			$productImagesArr = array_merge($productImagesArr, $justUploadedImageArr, $productVideosArr);
			$sql_UpdateImage = "UPDATE `product` SET `productImages` = '".stringAllTheFileNamePresentInTheArray($productImagesArr)."', `lastModifiedDate` = NOW() WHERE `product`.`productId` = ".$productId;
			//echo $sql_UpdateImage; exit;
			$sql_UpdateImage_res = mysqli_query($dbConn, $sql_UpdateImage);
			
			/*-----------------------------------Populate Pre-compiled Product Offers-----------------------*/
			updateLiveTime($dbConn, 'PRODUCT');
			populateProductPreCompiledData($dbConn, $productId);
			/*-----------------------------------Populate Pre-compiled Product Offers-----------------------*/
		}
		echo "<script language=\"javascript\">window.location = 'productImage.php?productId=".$productId."'</script>";exit;
	}
}else{
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	/*---------------------------------Delete product images------------------------------------------------*/
	if($ACTION == "DELETE"){
		$updateFileList = "";
		$imageFile = isset($_REQUEST['imageFile'])?$_REQUEST['imageFile']:"";
		$videoFile = isset($_REQUEST['videoFile'])?$_REQUEST['videoFile']:"";
		//print_r($productImagesArr);exit;
		if($imageFile != ""){
			/*-------------------------Deleting Main image-------------------------------------------------*/
			for($i = 0; $i < count($productImagesArr); $i++){
				$imageInArry = preg_replace('/\s+/', '', $productImagesArr[$i]);
				$imageFile = preg_replace('/\s+/', '', $imageFile);
				if($imageInArry != $imageFile){
					$updateFileList = $updateFileList.$productImagesArr[$i].",";
				}
			}
			$updateFileList = rtrim($updateFileList, ',');
			$sql_UpdateImage = "UPDATE `product` SET `productImages` = '".$updateFileList."', `lastModifiedDate` = NOW() WHERE `product`.`productId` = ".$productId;
			//echo $sql_UpdateImage; exit;
			$sql_UpdateImage_res = mysqli_query($dbConn, $sql_UpdateImage);
			deleteFile($imageFile, "uploads/products/");
			deleteFile($imageFile, "uploads/products/64x64/");
			/*-------------------------Deleting Main image-------------------------------------------------*/
			
			/*-------------------------Deleting Combination Associated image-------------------------------*/
			$sql_CombinationImage = "SELECT `productCombinationId`,`images` FROM `productCombination` WHERE `productId` = ".$productId;
			//echo $sql_CombinationImage; exit;
			$sql_CombinationImage_res = mysqli_query($dbConn, $sql_CombinationImage);
			while($sql_CombinationImage_res_fetch = mysqli_fetch_array($sql_CombinationImage_res)){
				if(isset($sql_CombinationImage_res_fetch["images"]) && $sql_CombinationImage_res_fetch["images"] !== null && strpos($sql_CombinationImage_res_fetch["images"], $imageFile) !== false) {
					$UpdateCombinationImage = "";
					$CombinationImage = $sql_CombinationImage_res_fetch["images"];
					$CombinationImageArray = explode(",", $CombinationImage);
					for($i = 0; $i < count($CombinationImageArray); $i++){
						if($CombinationImageArray[$i] != $imageFile){
							$UpdateCombinationImage = $UpdateCombinationImage.$CombinationImageArray[$i].",";
						}
					}
					$UpdateCombinationImage = rtrim($UpdateCombinationImage, ',');
					$sql_UpdateCombinationImage = "UPDATE `productCombination` SET `images` = '".$UpdateCombinationImage."' WHERE `productCombination`.`productId` = ".$productId." AND `productCombination`.`productCombinationId` = ".$sql_CombinationImage_res_fetch["productCombinationId"];
					//echo $sql_UpdateCombinationImage; exit;
					$sql_UpdateCombinationImage_res = mysqli_query($dbConn, $sql_UpdateCombinationImage);
				}
			}
			/*-------------------------Deleting Combination Associated image--------------------------------*/
			
			/*-----------------------------------Populate Pre-compiled Product Offers-----------------------*/
			updateLiveTime($dbConn, 'PRODUCT');
			populateProductPreCompiledData($dbConn, $productId);
			/*-----------------------------------Populate Pre-compiled Product Offers-----------------------*/
		}else if($videoFile != ""){
			/*-------------------------Deleting Video from Product Images-----------------------------------*/
			$indexFound = -1;
			for($i = 0; $i < count($productImagesArr); $i++){
				if(checkFileOrUrl($productImagesArr[$i]) == 'URL' && str_contains($productImagesArr[$i], $videoFile)){
					$indexFound = $i;
				}
			}
			if($indexFound > -1){
				array_splice($productImagesArr, $indexFound, 1);
			}
			$updateFileList = implode(',', $productImagesArr);
			$sql_UpdateImage = "UPDATE `product` SET `productImages` = '".$updateFileList."', `lastModifiedDate` = NOW() WHERE `product`.`productId` = ".$productId;
			//echo $sql_UpdateImage; exit;
			$sql_UpdateImage_res = mysqli_query($dbConn, $sql_UpdateImage);
			/*-------------------------Deleting Video from Product Images-----------------------------------*/
			
			/*-------------------------Deleting Combination Associated Video--------------------------------*/
			$sql_CombinationImage = "SELECT `productCombinationId`,`images` FROM `productCombination` WHERE `productId` = ".$productId;
			//echo $sql_CombinationImage; exit;
			$sql_CombinationImage_res = mysqli_query($dbConn, $sql_CombinationImage);
			while($sql_CombinationImage_res_fetch = mysqli_fetch_array($sql_CombinationImage_res)){
				if(strpos($sql_CombinationImage_res_fetch["images"], $videoFile) !== false) { 
					$UpdateCombinationImage = "";
					$CombinationImage = $sql_CombinationImage_res_fetch["images"];
					$CombinationImageArray = explode(",", $CombinationImage);
					for($i = 0; $i < count($CombinationImageArray); $i++){
						if (strpos($CombinationImageArray[$i], $videoFile) !== false) {
							// Do nothing, $UpdateCombinationImage remains unchanged
						} else {
							$UpdateCombinationImage .= $CombinationImageArray[$i] . ",";
						}
					}
					$UpdateCombinationImage = rtrim($UpdateCombinationImage, ',');
					$sql_UpdateCombinationImage = "UPDATE `productCombination` SET `images` = '".$UpdateCombinationImage."' WHERE `productCombination`.`productId` = ".$productId." AND `productCombination`.`productCombinationId` = ".$sql_CombinationImage_res_fetch["productCombinationId"];
					//echo $sql_UpdateCombinationImage; exit;
					$sql_UpdateCombinationImage_res = mysqli_query($dbConn, $sql_UpdateCombinationImage);
				}
			}
			/*-------------------------Deleting Combination Associated Video--------------------------------*/
			
			/*-----------------------------------Populate Pre-compiled Product Offers-----------------------*/
			updateLiveTime($dbConn, 'PRODUCT');
			populateProductPreCompiledData($dbConn, $productId);
			/*-----------------------------------Populate Pre-compiled Product Offers-----------------------*/
			
		}
		echo "<script language=\"javascript\">window.location = 'productImage.php?productId=".$productId."'</script>";exit;
	}
	/*---------------------------------Delete product images------------------------------------------------*/
	
	/*---------------------------------Update product combination associated images-------------------------*/
	if($ACTION == "UPDATEASSOCIATEDIMAGES"){
		$associatedImages = isset($_REQUEST['associatedImages'])?$_REQUEST['associatedImages']:"";
		$productCombinationId = isset($_REQUEST['productCombinationId'])?(int)$_REQUEST['productCombinationId']:0;
		if($productCombinationId > 0 && $associatedImages != ""){
			$sql_UpdateAssociatedImages = "UPDATE `productCombination` SET 
											`images` = '".$associatedImages."'								
											WHERE `productCombination`.`productCombinationId` = ".$productCombinationId."
											AND `productCombination`.`productId` = ".$productId;
			//echo $sql_UpdateAssociatedImages; exit;
			$sql_UpdateAssociatedImages_res = mysqli_query($dbConn, $sql_UpdateAssociatedImages);
			populateProductPreCompiledData($dbConn, $productId);
		}
		echo "<script language=\"javascript\">window.location = 'productImage.php?productId=".$productId."'</script>";exit;
	}
	/*---------------------------------Update product combination associated images-------------------------*/
	
	if(intval($productId) > 0){
		$sqlImage = "SELECT `productCode`, `productImages` FROM `product` WHERE `productId` = ".$productId;
		//echo $sqlImage; exit;
		$sqlImage_res = mysqli_query($dbConn, $sqlImage);
		$sqlImage_res_fetch = mysqli_fetch_array($sqlImage_res);
		//echo "<pre>"; print_r($sqlImage_res_fetch); echo "</pre>"; exit;
		$productImagesArr = explode(",",$sqlImage_res_fetch["productImages"]);
		//echo "<pre>"; print_r($productImagesArr); echo "</pre>"; exit;
		$productCode = $sqlImage_res_fetch["productCode"];
	}else{
		echo "<script language=\"javascript\">window.location = 'productEntry.php'</script>";exit;
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Images</title>
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
					<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_65">Product Images</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php include('includes/productProgressTab.php'); ?>
					<h5><?php if($productId > 0){ ?><span id="cms_73">Edit</span><?php }else{ ?><span id="cms_72">Add</span><?php } ?> <span id="cms_65">Product Images</span></h5>
					<form id="productImageForm" name="productImageForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return productFunctionality.validateProductImage();" enctype="multipart/form-data">
						<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<div class="input-group marBot5">
								<span id="productImagesSpan" class="input-group-addon"><span id="cms_65">Product Images</span> : </span>
								<input type="file" name="productImages[]" id="productImages" class="form-control" autocomplete="off" multiple accept=".png,.jpg,.jpeg">
								<span id="productImagesExtSpan" class="input-group-addon"><span id="cms_89">Image must be .jpg, .jpeg, .png</span></span>
							</div>
							<div id="cms_90" class="redText">Image sholud be 1200px x ~1200px or width height ratio sholud be 1.5:1 to 1:1</div>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="productVideoSpan" class="input-group-addon"><span id="cms_396">Product Videos</span> : </span>
								<input type="text" name="productVideo" id="productVideo" class="form-control" autocomplete="off">
								<span id="productVideoExtSpan" class="input-group-addon"><i class="fa fa-youtube-play redText"></i></span>
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
							<input type="hidden" id="productId" name="productId" value="<?php echo $productId; ?>">
							<input type="hidden" id="hdnproductImages" name="hdnproductImages" value="<?php echo $sqlImage_res_fetch["productImages"]; ?>">
							<button type="submit" class="btn btn-success marLeft5" rel="cms_113">Submit</button>
						</div>
					</form>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<h5><span id="cms_65">Product Images</span> :</h5>
						<br clear="all">
						<?php 
						for($i = 0; $i < count($productImagesArr); $i++){ 
							if($productImagesArr[$i] != ""){
								if(checkFileOrUrl($productImagesArr[$i]) == "FILE"){
									?>
										<div class="productImageBlock pull-left marRig5 marBot3">
											<img src="<?php echo PRODUCTIMAGEURL.$productImagesArr[$i]; ?>" alt="<?php echo $productImagesArr[$i]; ?>" onerror="appCommonFunctionality.onImgError(this)">
											<br>
											<div>
												<a href='productImage.php?ACTION=DELETE&imageFile=<?php echo $productImagesArr[$i]; ?>&productId=<?php echo $productId; ?>'>
													<i class="fa fa-trash-o pull-left redText hover f24"></i>
												</a>
												<a href='imageFilters.php?folder=products&imageFile=<?php echo $productImagesArr[$i]; ?>&productId=<?php echo $productId; ?>' target="_blank">
													<i class="fa fa-sliders pull-right greenText hover f24"></i>
												</a>
												<a href='imageManualCrop.php?folder=products&imageFile=<?php echo $productImagesArr[$i]; ?>&productId=<?php echo $productId; ?>' target="_blank">
													<i class="fa fa-crop pull-right greenText hover f24"></i>
												</a>
											</div>
										</div>
									<?php 
								}else if(checkFileOrUrl($productImagesArr[$i]) == "URL"){
									?>
										<div class="productImageBlock pull-left marRig5 marBot3">
											<iframe width="300" height="300" src="<?php echo $productImagesArr[$i]; ?>" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
											<br>
											<div>
												<a href='productImage.php?ACTION=DELETE&videoFile=<?php echo extractVideoId($productImagesArr[$i]); ?>&productId=<?php echo $productId; ?>'>
													<i class="fa fa-trash-o pull-left redText hover f24"></i>
												</a>
											</div>
										</div>
									<?php
								}
							}
						} 
						?>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop22">
						<button type="button" class="btn btn-success pull-left" onClick="window.open('https://www.iloveimg.com/crop-image', '_blank');" rel="cms_92">External Image cropping</button>
						<button type="button" class="btn btn-success pull-left marleft10" onClick="productFunctionality.gotoArrangeProductImages(appCommonFunctionality.getUrlParameter('productId'))" rel="cms_93">Arrange Images</button>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop22">
						<div id="productPriceMatrixTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
						<input id="productPreCompileData" name="productPreCompileData" type="hidden" value='<?php echo readProductPreCompiledData($productCode); ?>'>
						<input id="productCode" name="productCode" type="hidden" value='<?php echo $productCode; ?>'>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop22">
						<button type="button" class="btn btn-success pull-right" onClick="productFunctionality.gotoProductFeature(<?php echo $productId; ?>)" rel="cms_94">Go Next</button>
					</div>
					<!-- QR Modal -->
					<div class="modal fade" id="QRModal" role="dialog">
						<div class="modal-dialog modal-sm">
							<div class="modal-content">
								<div class="modal-header">
									<button type="button" class="close" data-dismiss="modal">&times;</button>
									<h4 id="QRModalHeader" class="modal-title"> </h4>
								</div>
								<div id="QRCodeModalBody" class="modal-body centerSection">
								</div>
								<!--<div class="modal-footer">
									<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
								</div>-->
							</div>
						</div>
					</div>
					<!-- QR Modal -->
					<!-- Combination Image Modal -->
					<div class="modal fade" id="combinationImageModal" role="dialog">
						<div class="modal-dialog modal-lg">
							<div class="modal-content">
								<div class="modal-header">
									<button type="button" class="close" data-dismiss="modal">&times;</button>
									<h4 id="cms_95" class="modal-title">Select Combination Images</h4>
								</div>
								<div id="combinationImageModalBody" class="modal-body">
								</div>
								<div class="modal-footer">
									<input type="hidden" id="productCombinationId" name="productCombinationId" value="0">
									<button type="button" class="btn btn-success" onClick="productFunctionality.saveCombinationImage()" rel="cms_87">Save</button>
								</div>
							</div>
						</div>
					</div>
					<!-- Combination Image Modal -->
				</div>
				<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>