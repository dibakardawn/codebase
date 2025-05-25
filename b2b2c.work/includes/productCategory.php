<div id="products" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"> 
	<h2 id="cms_5" class="text-center">Our Products</h2>
</div>

<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
	<?php 
	$sqlProductCategory = "SELECT `categoryId`,`category`,`categorySlug`,`categoryImage` FROM `category` WHERE 1 ORDER BY `categoryId` DESC";
	//echo $sqlProductCategory; exit;
	$sqlProductCategory_res = mysqli_query($dbConn, $sqlProductCategory);
	while($sqlProductCategory_res_fetch = mysqli_fetch_array($sqlProductCategory_res)){
	?>
	<div class="col-lg-2 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-center hover categoryImageHolder">
		<a href="<?php echo SITEURL."category/".$sqlProductCategory_res_fetch["categorySlug"]; ?>">
			<img src="<?php echo SITEURL.UPLOADFOLDER."productCategory/".$sqlProductCategory_res_fetch["categoryImage"]; ?>" alt="<?php echo $sqlProductCategory_res_fetch["categoryImage"]; ?>" class="categoryImage">
		</a>
		<h4>
			<a href="<?php echo SITEURL."category/".$sqlProductCategory_res_fetch["categorySlug"]; ?>">
				<?php echo $sqlProductCategory_res_fetch["category"]; ?>
			</a>
		</h4>
	</div>
	<?php } ?>
</div>