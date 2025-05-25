<?php 
$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
$link_array = explode('/',$actual_link);
$linkLastPart = end($link_array);
//echo $linkLastPart; exit;
if($linkLastPart === 'products' && $link_array[3] === 'products' && count($link_array) === 4){ /*https://aa1baaron.de/products*/
	$sql = "SELECT 
	`productCollection`.`collectionId` AS 'id',
	`productCollection`.`collectionName` AS 'name',
	`productCollection`.`collectionSlug` AS 'slug',
	`productCollection`.`collectionImage` AS 'image',
	NULL AS `offerPercentage`,
	NULL AS `offerEndDate`
	FROM `productCollection` WHERE 1
	ORDER BY `productCollection`.`collectionId` DESC";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$imageUrl = PRODUCTCOLLECTIONIMAGEURL;
	$headerText = "<span id='cms_36'>Product Collections</span>";
	$url2ndPart = "products/";
	$totalRecordCount = 0;
}else if($linkLastPart === 'offeredProducts' && $link_array[3] === 'offeredProducts' && count($link_array) === 4){ /*https://aa1baaron.de/offeredProducts*/
	$offer_delete_sql = "DELETE FROM `offer` WHERE `endDate` < NOW()";
	//echo $offer_delete_sql; exit;
	$offer_delete_sql_res = mysqli_query($dbConn, $offer_delete_sql);
	$sql = "SELECT 
	`product`.`productId` AS 'id', 
	`product`.`productTitle` AS 'name',
	`product`.`productSlug` AS 'slug',
	`product`.`productMainImage` AS 'image',
	`offer`.`offerPercentage` AS 'offerPercentage',
	`offer`.`endDate` AS `offerEndDate`
	FROM `product` 
	INNER JOIN `offer`
	ON `offer`.`productId` = `product`.`productId`
	WHERE `product`.`Status` = 1
	ORDER BY `product`.`productTitle` ASC";
	/*`product`.`lastModifiedDate` DESC Removed on demand*/
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$imageUrl = PRODUCTIMAGEURL;
	$allproductCollections = "<span id='cms_37' class='hover' onclick='appCommonFunctionality.gotoProducts();'> All Product Collections </span> ";
	$allproductCollections = $allproductCollections."<span class='glyphicon glyphicon-menu-right'></span>";
	$headerText = $allproductCollections." <span id='cms_293'>Offered Products</span>";
	$url2ndPart = "productDetails/";
	$totalRecordCount = 0;
}else if($linkLastPart !== 'products' && $link_array[3] === 'products' && count($link_array) === 5){ /*https://aa1baaron.de/products/CAMPOBLACKGRAINEDLEATHER_41*/
	$linkLastPart_array = explode('_',$linkLastPart);
	$collectionId = intval($linkLastPart_array[count($linkLastPart_array) - 1]);
	$sql = "SELECT 
	`product`.`productId` AS 'id', 
	`product`.`productTitle` AS 'name',
	`product`.`productSlug` AS 'slug',
	`product`.`productMainImage` AS 'image',
	`offer`.`offerPercentage` AS 'offerPercentage',
	`offer`.`endDate` AS `offerEndDate`
	FROM `product` 
	LEFT JOIN `offer`
	ON `offer`.`productId` = `product`.`productId`
	WHERE `product`.`collectionId` = ".$collectionId."
	AND `product`.`Status` = 1
	ORDER BY `product`.`arrangementOrder` ASC
	LIMIT 0, ".INITIALPRODUCTLIMIT;
	/*`product`.`lastModifiedDate` DESC Removed on demand*/
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$imageUrl = PRODUCTIMAGEURL;
	$productCollection = "";
	for($i = 0; $i < (count($linkLastPart_array) -1); $i++){
		$productCollection = $productCollection." ".$linkLastPart_array[$i];
	}
	$allproductCollections = "<span id='cms_37' class='hover' onclick='appCommonFunctionality.gotoProducts();'> All Product Collections </span> ";
	$allproductCollections = $allproductCollections."<span class='glyphicon glyphicon-menu-right'></span>";
	$headerText = $allproductCollections.$productCollection." <span id='cms_38'>Products</span>";
	$url2ndPart = "productDetails/";
	
	$sql_product_count = "SELECT COUNT(`productId`) AS 'totalRecordCount' FROM `product` WHERE `collectionId` = ".$collectionId." AND `Status` = 1";
	//echo $sql_product_count; exit;
	$sql_product_count_res = mysqli_query($dbConn, $sql_product_count);
	if(mysqli_num_rows($sql_product_count_res) > 0){
		$sql_product_count_res_fetch = mysqli_fetch_array($sql_product_count_res);
		$totalRecordCount = intval($sql_product_count_res_fetch["totalRecordCount"]);
	}else{
		$totalRecordCount = 0;
	}
}else if($linkLastPart === 'category' && $link_array[3] === 'category' && count($link_array) === 4){ /*https://aa1baaron.de/category*/
	$sql = "SELECT 
	`category`.`categoryId` AS 'id',
	`category`.`category` AS 'name',
	`category`.`categorySlug` AS 'slug',
	`category`.`categoryImage` AS 'image',
	NULL AS `offerPercentage`,
	NULL AS `offerEndDate`
	FROM `category` WHERE 1
	ORDER BY `category`.`categoryId` DESC";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$imageUrl = SITEURL.UPLOADFOLDER."productCategory/";
	$headerText = "<span id='cms_413'>All Categories</span>";
	$url2ndPart = "category/";
	$totalRecordCount = 0;
}else if($linkLastPart !== 'category' && $link_array[3] === 'category' && count($link_array) === 5){ /*https://aa1baaron.de/category/Belt_18*/
	$linkLastPart_array = explode('_',$linkLastPart);
	$categoryId = intval($linkLastPart_array[count($linkLastPart_array) - 1]);
	$sql = "SELECT 
	`product`.`productId` AS 'id', 
	`product`.`productTitle` AS 'name',
	`product`.`productSlug` AS 'slug',
	`product`.`productMainImage` AS 'image',
	`offer`.`offerPercentage` AS 'offerPercentage',
	`offer`.`endDate` AS `offerEndDate`
	FROM `product` 
	LEFT JOIN `offer`
	ON `offer`.`productId` = `product`.`productId`
    INNER JOIN `productCategory`
    ON `productCategory`.`productId` = `product`.`productId`
    WHERE `productCategory`.`categoryId` = ".$categoryId."
	AND `product`.`Status` = 1
	ORDER BY `product`.`arrangementOrder` ASC
	LIMIT 0, ".INITIALPRODUCTLIMIT;
	/*`product`.`lastModifiedDate` DESC Removed on demand*/
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$imageUrl = PRODUCTIMAGEURL;
	$productCollection = "";
	for($i = 0; $i < (count($linkLastPart_array) -1); $i++){
		$productCollection = $productCollection." ".$linkLastPart_array[$i];
	}
	$allproductCollections = "<span id='cms_413' class='hover' onclick='appCommonFunctionality.gotoCategories();'> All Categories </span> ";
	$allproductCollections = $allproductCollections."<span class='glyphicon glyphicon-menu-right'></span>";
	$headerText = $allproductCollections.$productCollection." <span id='cms_38'>Products</span>";
	$url2ndPart = "productDetails/";
	$totalRecordCount = 0;
}
?>
<div class="productBody col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
	<?php include('includes/customerAuth.php'); ?>
	<div id="headerText" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot16">
		<?php echo $headerText; ?>
	</div>
	<?php
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$ImageArr = explode(",",$sql_res_fetch["image"]);
	?>
	<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 productItems marBot24">
		<?php if(isset($sql_res_fetch["offerPercentage"])){  ?>
			<div class="ribbon ribbon-top-right"><span><?php echo $sql_res_fetch["offerPercentage"]; ?>% <b id="cms_420">Offer</b></span></div>
		<?php } ?>
		<div class="carouselHolder">
			<a href="<?php echo SITEURL.$url2ndPart.$sql_res_fetch["slug"]; ?>">
				<?php if($ImageArr[0] == "noImages.png"){ ?>
					<img src="<?php echo SITEURL."assets/images/".$ImageArr[0]; ?>" alt="<?php echo $ImageArr[0]; ?>" class="w100p H250 hover">
				<?php }else{ ?>
					<img src="<?php echo $imageUrl.$ImageArr[0]; ?>" alt="<?php echo $ImageArr[0]; ?>" class="w100p H250 hover">
				<?php } ?>
			</a>
			<div id="productColorHolder_<?php echo $sql_res_fetch["id"]; ?>" class="productColorHolder"> <!--Max no of color circle 12-->
			</div>
			<h5 class="text-center">
				<a href="<?php echo SITEURL.$url2ndPart.$sql_res_fetch["slug"]; ?>" class="hover"><?php echo ucFirst(cutStringWithLength($sql_res_fetch["name"], 57)); ?></a>
			</h5>
			<?php 
				if($sql_res_fetch["offerEndDate"] != null){
					$datetime_1 = date("Y-m-d h:i:s"); 
					$datetime_2 = $sql_res_fetch["offerEndDate"]; 
					$start_datetime = new DateTime($datetime_1); 
					$diff = $start_datetime->diff(new DateTime($datetime_2));
			?>
				<div class="offerEndDate">
					<span class="glyphicon glyphicon-time"></span>
					<span id="cms_436">Offer left till</span> 
					<span><?php echo $diff->days; ?></span>
					<span id="cms_437"> Days</span> 
					<span><?php echo $diff->h; ?></span>
					<span id="cms_438"> Hours</span> 
					<span><?php echo $diff->i; ?></span>
					<span id="cms_439"> Minutes</span>
				</div>
			<?php }?>
		</div>
	</div>
	<?php } ?>
	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
		<button type="button" id="cms_296" class="btn btn-default loadMoreProducts hide hover" onclick="appCommonFunctionality.loadMoreProducts()"></button>
		<input type="hidden" id="totalRecordCount" name="totalRecordCount" value="<?php echo $totalRecordCount; ?>">
	</div>
</div>
<br clear="all">