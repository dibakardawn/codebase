<div class="w3-container">
	<h2 id="cms_14" class="w3-border-bottom w3-border-light-grey text-center">Our Product collections</h2>
</div>
<!--<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 pull-left text-left">
	<a href="<?php //echo SITEURL."products"; ?>"><h4 id="cms_15">See all product collection >></h4></a>
</div>-->
<div class="w3-padding w100p">
	<div id="productCollectionCarousel" class="carousel slide productCarousel" data-ride="carousel">
		<div class="carousel-inner">
			<?php
				$sql = "SELECT 
				`collectionId` AS 'id',
				`collectionName` AS 'name',
				`collectionSlug` AS 'slug',
				`collectionImage` AS 'image',
				`collectionDesc` AS 'desc'
				FROM `productCollection` WHERE 1 
				ORDER BY `productCollection`.`collectionId` DESC
				LIMIT 0, 5";
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				$count = 0;
				while($sql_res_fetch = mysqli_fetch_array($sql_res)){
					$ImageArr = explode(",",$sql_res_fetch["image"]);
					?>
					<div class="item col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly <?php if($count == 0){ ?>active<?php } ?>">
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<!--<a href="<?php //echo SITEURL."login"; ?>">-->
							<a href="<?php echo SITEURL."products/".$sql_res_fetch["slug"]; ?>">
								<img src="<?php echo PRODUCTCOLLECTIONIMAGEURL.$ImageArr[0]; ?>" alt="<?php echo $ImageArr[0]; ?>" class="w100p bannerImg2">
								<div id="productCollectionCaption" class="carouselCaptionSmall">
									<h4><?php echo $sql_res_fetch["name"]; ?></h4>
								</div>
							</a>
						</div>
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 hidden-md hidden-sm hidden-xs nopaddingOnly">
							<h2 class="text-center"><?php echo $sql_res_fetch["name"]; ?></h2>
							<div id="productCollectionDesc_<?php echo $sql_res_fetch["id"]; ?>" class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
							<input id="productCollectionDescHdn_<?php echo $sql_res_fetch["id"]; ?>" name="productCollectionDescHdn_<?php echo $sql_res_fetch["id"]; ?>" type="hidden" value="<?php echo $sql_res_fetch["desc"]; ?>">
						</div>
					</div>
					<?php
					$count++;
				}
			?>
		</div>
		<a class="left carousel-control" href="#productCollectionCarousel" data-slide="prev">
			<span class="glyphicon glyphicon-chevron-left"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="right carousel-control" href="#productCollectionCarousel" data-slide="next">
			<span class="glyphicon glyphicon-chevron-right"></span>
			<span class="sr-only">Next</span>
		</a>
	</div>
</div>