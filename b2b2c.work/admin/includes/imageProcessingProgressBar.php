<?php 
$paranName = "";
if($folder == "products"){
	$paranName = "productId";
}else if($folder == "brand"){
	$paranName = "brandId";
}else if($folder == "productScroller"){
	
}else if($folder == "userImage"){
	$paranName = "userId";
}
$productStr = "?folder=".$folder."&imageFile=".$imageFile."&".$paranName."=".$id;
?>
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
   <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly tabHeader">
   
      <?php if(basename($_SERVER['PHP_SELF']) == "imageManualCrop.php"){ ?>
      <div class="pull-left tabBtnActive hover">
		<a href="imageManualCrop.php<?php echo $productStr; ?>" id="cms_924">Image Manual Crop</a>
	  </div>
      <?php } else { ?>
      <div class="pull-left tabBtn hover">
		<a href="imageManualCrop.php<?php echo $productStr; ?>" id="cms_924">Image Manual Crop</a>
	  </div>
      <?php } ?>

	  <?php if(basename($_SERVER['PHP_SELF']) == "imageFilters.php"){ ?>
      <div class="pull-left tabBtnActive hover">
		<a href="imageFilters.php<?php echo $productStr; ?>" id="cms_926">Image Filters</a>
	  </div>
	  <?php } else { ?>
	  <div class="pull-left tabBtn hover">
		<a href="imageFilters.php<?php echo $productStr; ?>" id="cms_926">Image Filters</a>
	  </div>
	  <?php } ?>
	  
   </div>
</div>