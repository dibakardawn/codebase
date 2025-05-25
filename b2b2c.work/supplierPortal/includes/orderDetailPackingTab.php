<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly tabHeader">
	<?php if(basename($_SERVER['PHP_SELF']) == "orderDetails.php"){?>
	<div id="orderDetailsTab" class="pull-left tabBtnActive hover">
		<a href="orderDetails.php?orderId=<?php echo $orderId; ?>" id="cms_609" class="whiteText">Order Details</a>
	</div>
	<div id="purchaseOrderPackingDetailsTab" class="pull-left tabBtn hover">
		<a href="orderPackingDetails.php?orderId=<?php echo $orderId; ?>" id="cms_657">Order Packing Details</a>
	</div>
	<?php }else if(basename($_SERVER['PHP_SELF']) == "orderPackingDetails.php"){?>
	<div id="orderDetailsTab" class="pull-left tabBtn hover">
		<a href="orderDetails.php?orderId=<?php echo $orderId; ?>" id="cms_609">Order Details</a>
	</div>
	<div id="purchaseOrderPackingDetailsTab" class="pull-left tabBtnActive hover">
		<a href="orderPackingDetails.php?orderId=<?php echo $orderId; ?>" id="cms_657" class="whiteText">Order Packing Details</a>
	</div>
	<?php } ?>
</div>