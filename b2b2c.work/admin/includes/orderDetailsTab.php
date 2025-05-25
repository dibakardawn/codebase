<?php 
$orderStr = "";
$orderId=isset($_REQUEST['orderId'])?(int)$_REQUEST['orderId']:0;
if(intval($orderId) > 0){
$orderStr = "?orderId=".$orderId;
}
?>
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
   <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly tabHeader">
   
		<?php if(basename($_SERVER['PHP_SELF']) == "saleOrderDetails.php"){ ?>
		<div id="orderDetailsTab" class="pull-left tabBtnActive hover">
			<a href="saleOrderDetails.php<?php echo $orderStr; ?>" id="cms_357">Sale Order Details</a>
		</div>
		<?php } else { ?>
		<div id="orderDetailsTab" class="pull-left tabBtn hover">
			<a href="saleOrderDetails.php<?php echo $orderStr; ?>" id="cms_357">Sale Order Details</a>
		</div>
		<?php } ?>

		<?php if(basename($_SERVER['PHP_SELF']) == "saleOrderPackingDetails.php"){ ?>
		<div id="orderPackingDetailsTab" class="pull-left tabBtnActive hover">
			<a href="saleOrderPackingDetails.php<?php echo $orderStr; ?>" id="cms_437">Sale Order Packing Details</a>
		</div>
		<?php } else { ?>
		<div id="orderPackingDetailsTab" class="pull-left tabBtn hover">
			<a href="saleOrderPackingDetails.php<?php echo $orderStr; ?>" id="cms_437">Sale Order Packing Details</a>
		</div>
		<?php } ?>
   </div>
</div>