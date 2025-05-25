<?php 
$orderStr = "";
$purchaseOrderId=isset($_REQUEST['purchaseOrderId'])?(int)$_REQUEST['purchaseOrderId']:0;
if(intval($purchaseOrderId) > 0){
	$orderStr = "?purchaseOrderId=".$purchaseOrderId;
}
?>
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
	<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly tabHeader">

		<?php if(basename($_SERVER['PHP_SELF']) == "purchaseOrderDetails.php"){ ?>
		<div id="purchaseOrderDetailsTab" class="pull-left tabBtnActive hover">
			<a href="purchaseOrderDetails.php<?php echo $orderStr; ?>" id="cms_561">Purchase Order Details</a>
		</div>
		<?php } else { ?>
		<div id="purchaseOrderDetailsTab" class="pull-left tabBtn hover">
			<a href="purchaseOrderDetails.php<?php echo $orderStr; ?>" id="cms_561">Purchase Order Details</a>
		</div>
		<?php } ?>

		<?php if(basename($_SERVER['PHP_SELF']) == "purchaseOrderPackingDetails.php"){ ?>
		<div id="purchaseOrderPackingDetailsTab" class="pull-left tabBtnActive hover">
			<a href="purchaseOrderPackingDetails.php<?php echo $orderStr; ?>" id="cms_574">Purchase Order Packing Details</a>
		</div>
		<?php } else { ?>
		<div id="purchaseOrderPackingDetailsTab" class="pull-left tabBtn hover">
			<a href="purchaseOrderPackingDetails.php<?php echo $orderStr; ?>" id="cms_574">Purchase Order Packing Details</a>
		</div>
		<?php } ?>
	  
	</div>
</div>