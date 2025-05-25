<?php include('includes/customerAuth.php'); ?>
<div id="individualProductContainer" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot24">
	<?php if(count($productMainImageArr) > 1){ ?>
	<div id="myCarousel" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 carousel carouselHolder slide" data-ride="carousel">
		<?php if(isset($sql_res_fetch["offerPercentage"])){  ?>
			<div class="ribbon ribbon-top-right"><span><?php echo $sql_res_fetch["offerPercentage"]; ?>% <b id="cms_420">Offer</b></span></div>
		<?php } ?>
		<!-- Indicators -->
		<ol id="carouselIndicators" class="carousel-indicators">
			<?php 
				for($i = 0; $i < (count($productMainImageArr)); $i++){
					if($i == 0){		
					?>
						<li data-target="#myCarousel" data-slide-to="0" class="active"></li>
						<?php }else{ ?>
						<li data-target="#myCarousel" data-slide-to="<?php echo $i; ?>"></li>
					<?php 
							}
				} 
			?>
		</ol>
		<!-- Indicators -->
		<!-- Wrapper for slides -->
		<div id="carouselInner" class="carousel-inner">
			<?php 
				for($i = 0; $i < (count($productMainImageArr)); $i++){
					if($i == 0){
					?>
					<div class="item active text-center">
						<img src="<?php echo PRODUCTIMAGEURL.$productMainImageArr[0]; ?>" alt="<?php echo $productMainImageArr[0]; ?>">
					</div>
					<?php }else{ ?>
					<div class="item text-center">
						<img src="<?php echo PRODUCTIMAGEURL.$productMainImageArr[$i]; ?>" alt="<?php echo $productMainImageArr[$i]; ?>">
					</div>
					<?php 
					}
				} ?>
		</div>
		<!-- Wrapper for slides -->
	</div>
	<?php }else{ ?>
	<div id="productImage" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 carouselHolder marBot24 text-center">
		<?php if(isset($sql_res_fetch["offerPercentage"])){ ?>
			<div class="ribbon ribbon-top-right"><span><?php echo $sql_res_fetch["offerPercentage"]; ?>% <b id="cms_420">Offer</b></span></div>
		<?php } ?>
		<img src="<?php echo PRODUCTIMAGEURL.$productMainImageArr[0]; ?>" alt="<?php echo $productMainImageArr[0]; ?>" class="maxH450 w100p" lowsrc="<?php echo SITEURL; ?>assets/images/loading.svg">
	</div>
	<?php } ?>
	<div id="productDetails" class="productDetails col-lg-6 col-md-12 col-sm-12 col-xs-12 marBot24">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
			<h2 id="productTitle" class="text-left">
				<?php echo ucfirst($sql_res_fetch["productTitle"]); ?> 
				<i class="fa fa-share-alt greenText hover" onclick="appCommonFunctionality.socialShare('<?php echo ucfirst($sql_res_fetch["productTitle"]); ?>', '<?php echo $actual_link; ?>', '')"></i>
			</h2>
			<div id="productDescActual" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
			<input type="hidden" id="productDesc" name="productDesc" value="<?php echo $sql_res_fetch["productDesc"]; ?>">
		</div>
	</div>
	<div id="productColorHolder_<?php echo $productId; ?>"></div>
	<div id="productCategoryHolder_<?php echo $productId; ?>"></div>
	<?php if(isset($_SESSION['customerId'])){ ?>
		<?php if(intval($sql_res_fetch["offerPercentage"]) > 0){ ?>
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
				<div class="col-lg-1 col-md-3 col-sm-3 col-xs-3 nopaddingOnly"><img src="<?php echo SITEURL; ?>assets/images/offerTag.png" alt="offerTag" class="w100Px"></div>
				<div class="col-lg-2 col-md-9 col-sm-9 col-xs-9 nopaddingOnly f60"><?php echo $sql_res_fetch["offerPercentage"]; ?>%</div>
				<div id="offerPercentageContainer" class="col-lg-2 col-md-12 col-sm-12 col-xs-12 f24">
					<div><span class="strikethrough">€ <?php echo $sql_res_fetch["productPrice"]; ?></span></div>
					<div>€ <span><?php echo number_format((float)($sql_res_fetch["productPrice"] - (($sql_res_fetch["productPrice"] * $sql_res_fetch["offerPercentage"]) / 100)), 2, '.', ''); ?></span></div>
					<?php $productPrice = ($sql_res_fetch["productPrice"] - (($sql_res_fetch["productPrice"] * $sql_res_fetch["offerPercentage"]) / 100)); ?>
				</div>
			</div>
		<?php }else{ $productPrice = $sql_res_fetch["productPrice"]; } ?>
		<div id="orderForm" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot24 scrollX">
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot24">
			<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
				<input id="productId" name="productId" type="hidden" value="<?php if(isset($productId)){ echo $productId; } ?>">
				<input id="productName" name="productName" type="hidden" value="<?php if(isset($sql_res_fetch["productTitle"])){ echo $sql_res_fetch["productTitle"]; } ?>">
				<input id="productImageHdn" name="productImageHdn" type="hidden" value="<?php if(isset($productMainImageArr[0])){ echo $productMainImageArr[0]; } ?>">
				<input id="productCode" name="productCode" type="hidden" value="<?php if(isset($sql_res_fetch["productCode"])){ echo $sql_res_fetch["productCode"]; } ?>">
				<input id="colorCodesHdn" name="colorCodesHdn" type="hidden" value="<?php if(isset($sql_res_fetch["productColors"])){ echo str_replace('"', "'", $sql_res_fetch["productColors"]); }else{ echo "[]"; } ?>">
				<input id="productPrice" name="productPrice" type="hidden" value="<?php if(isset($sql_res_fetch["productPrice"])){ echo $productPrice;} ?>">
				<input id="offerPercentage" name="offerPercentage" type="hidden" value="<?php if(isset($sql_res_fetch["offerPercentage"])){ echo $sql_res_fetch["offerPercentage"];} ?>">
				<input id="cartonUnitQuantity" name="cartonUnitQuantity" type="hidden" value="<?php echo $sql_res_fetch["cartonUnitQuantity"]; ?>">
				<input id="tax" name="tax" type="hidden" value="0"> <!--As tax is dependent on the delivery location so not using echo TAX; -->
				<input id="customerId" name="customerId" type="hidden" value="">
				<button id="addToCartBtn" type="button" class="btn btn-success pull-right"> 
					<span id="cms_40">Add to cart</span>
				</button>
			</div>
		</div>
	<?php } else{ ?>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center nopaddingOnly marBot24">
			<h4 id="cms_113">Please login in order to see the product price and to place an order</h4>
			<h4 id="cms_48" class="blueText hover" onclick="appCommonFunctionality.menuClick('login', true);">Login</h4>
		</div>
	<?php } ?>
	<!--<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
		<div id="qrCodeHolder" class="col-lg-3 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">
			<div class="barCodeHolder">
				<h3 class="text-center">QR Code : <a href="<?php //echo "../".UPLOADFOLDER."products/QRCode/".$sql_res_fetch["productCode"].".png"; ?>" download><i class="fa fa-download greenText hover"></i></a></h3>
				<div>
					<img src="<?php //echo "../".UPLOADFOLDER."products/QRCode/".$sql_res_fetch["productCode"].".png"; ?>" alt="<?php //echo $sql_res_fetch["productCode"]; ?>">
				</div>
			</div>
		</div>
	</div>-->
</div>