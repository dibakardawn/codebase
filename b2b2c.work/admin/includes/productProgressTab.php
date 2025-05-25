<?php 
   $productStr = "";
   $productId=isset($_REQUEST['productId'])?(int)$_REQUEST['productId']:0;
   if(intval($productId) > 0){
		$productStr = "?productId=".$productId;
   }
   ?>
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
   <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly tabHeader">
   
      <?php if(basename($_SERVER['PHP_SELF']) == "productEntry.php"){ ?>
      <div class="pull-left tabBtnActive hover"><a id="cms_64" href="productEntry.php<?php echo $productStr; ?>">Initial Product Data</a></div>
      <?php } else { ?>
      <div class="pull-left tabBtn hover"><a id="cms_64" href="productEntry.php<?php echo $productStr; ?>">Initial Product Data</a></div>
      <?php } ?>
	  
      <?php if(basename($_SERVER['PHP_SELF']) == "productImage.php"){ ?>
      <div class="pull-left tabBtnActive hover"><a id="cms_65" href="productImage.php<?php echo $productStr; ?>">Product Images</a></div>
      <?php } else { ?>
      <div class="pull-left tabBtn hover"><a id="cms_65" href="productImage.php<?php echo $productStr; ?>">Product Images</a></div>
      <?php } ?>
	  
	  <?php if(basename($_SERVER['PHP_SELF']) == "productFeature.php"){ ?>
      <div class="pull-left tabBtnActive hover"><a id="cms_66" href="productFeature.php<?php echo $productStr; ?>">Product Feature</a></div>
      <?php } else { ?>
      <div class="pull-left tabBtn hover"><a id="cms_66" href="productFeature.php<?php echo $productStr; ?>">Product Feature</a></div>
      <?php } ?>
	  
	  <?php if(basename($_SERVER['PHP_SELF']) == "productPriceMatrix.php"){ ?>
      <div class="pull-left tabBtnActive hover"><a id="cms_67" href="productPriceMatrix.php<?php echo $productStr; ?>">Product Price Matrix</a></div>
      <?php } else { ?>
      <div class="pull-left tabBtn hover"><a id="cms_67" href="productPriceMatrix.php<?php echo $productStr; ?>">Product Price Matrix</a></div>
      <?php } ?>
	  
	  <?php if(basename($_SERVER['PHP_SELF']) == "productOffer.php"){ ?>
      <div class="pull-left tabBtnActive hover"><a id="cms_68" href="productOffer.php<?php echo $productStr; ?>">Product Offer</a></div>
      <?php } else { ?>
      <div class="pull-left tabBtn hover"><a id="cms_68" href="productOffer.php<?php echo $productStr; ?>">Product Offer</a></div>
      <?php } ?>
	  
	  <?php if(basename($_SERVER['PHP_SELF']) == "productSuppliers.php"){ ?>
      <div class="pull-left tabBtnActive hover"><a id="cms_69" href="productSuppliers.php<?php echo $productStr; ?>">Product Suppliers</a></div>
      <?php } else { ?>
      <div class="pull-left tabBtn hover"><a id="cms_69" href="productSuppliers.php<?php echo $productStr; ?>">Product Suppliers</a></div>
      <?php } ?>
	  
	  <?php if(basename($_SERVER['PHP_SELF']) == "productStock.php" || basename($_SERVER['PHP_SELF']) == "stockEntry.php" || basename($_SERVER['PHP_SELF']) == "stockDetails.php" || basename($_SERVER['PHP_SELF']) == "orphanStocksMapping.php"){ ?>
      <div class="pull-left tabBtnActive hover"><a id="cms_70" href="productStock.php<?php echo $productStr; ?>" >Product Stock</a></div>
	  <?php } else { ?>
	  <div class="pull-left tabBtn hover"><a id="cms_70" href="productStock.php<?php echo $productStr; ?>">Product Stock</a></div>
	  <?php } ?>

	  <?php if(basename($_SERVER['PHP_SELF']) == "productDetail.php"){ ?>
      <div class="pull-left tabBtnActive hover"><a id="cms_71" href="productDetail.php<?php echo $productStr; ?>">Product Details</a></div>
	  <?php } else { ?>
	  <div class="pull-left tabBtn hover"><a id="cms_71" href="productDetail.php<?php echo $productStr; ?>">Product Details</a></div>
	  <?php } ?>
	
   </div>
   <!--<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5">
      <div class="progress">
        <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="5"
        aria-valuemin="0" aria-valuemax="100" style="width:5%">
      	5% Complete (success)
        </div>
      </div>
      </div>-->
</div>