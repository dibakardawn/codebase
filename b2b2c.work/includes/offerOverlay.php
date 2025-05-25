<?php
$sql_offer = "SELECT COUNT(`offerId`) AS 'OFFERCOUNT' FROM `offer` WHERE 1";
//echo $sql_offer; exit;
$sql_offer_res = mysqli_query($dbConn, $sql_offer);
$sql_offer_res_fetch = mysqli_fetch_array($sql_offer_res);
if(intval($sql_offer_res_fetch['OFFERCOUNT']) > 0){
?>
	<div id="offerOverlay" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 offerOverlay" onclick="hideOfferOverlay()">
		<div class="text-center offerOverlayHolder">
			<!--<img src="https://aa1baaron.de/assets/images/specialOffer-Eng.png" alt="special offer" class="w100p" />-->
			<!--<img src="https://aa1baaron.de/assets/images/specialOffer-Gem.png" alt="special offer" class="w100p" />-->
			<h1 class="specialOfferText1"><a id="cms_294" href="<?php echo SITEURL."offeredProducts"; ?>" class="hover">SALE</a></h1>
			<h5 class="specialOfferText2"><a id="cms_295" href="<?php echo SITEURL."offeredProducts"; ?>" class="hover">Click Here</a></h5>
		</div>
	</div>
<?php } ?>