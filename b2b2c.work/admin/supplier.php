<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SUPPLIER";
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Suppliers</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon" />
		<link rel="icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/adminStyle/adminW3.css">
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/adminStyle/adminStyle.css">
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/supplier.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="supplierSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_444">Suppliers</span>
						</b>
					</h5>
					<button type="button" class="btn btn-success pull-right marBot5" onClick="supplierFunctionality.addSupplier()" rel="cms_445">Add Supplier</button>
				</header>
				<div class="w3-row-padding w3-margin-bottom scrollX">
					<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">
						<tr>
							<td width="35%"><strong id="cms_446">Supplier Name</strong></td>
							<td width="25%"><strong id="cms_447">Contact person</strong></td>
							<td width="15%"><strong id="cms_448">Contact No</strong></td>
							<td width="15%"><strong>Email</strong></td>
							<td width="10%"><strong id="cms_449">Action</strong></td>
						</tr>
						<?php
							$qry = "SELECT 
							`supplierId`,
							`supplierName`,
							`supplierContactPerson`,
							`supplierContactNo`,
							`supplierEmail`
							FROM `supplier` WHERE 1 
							ORDER BY `supplierId` DESC";
							//echo $qry; exit;
							$qry_res = mysqli_query($dbConn, $qry);
							while($qry_res_fetch = mysqli_fetch_array($qry_res)){
								$str = "<tr>";
									$str = $str."<td><a href='supplierDetail.php?supplierId=".$qry_res_fetch["supplierId"]."' class='blueText'>".$qry_res_fetch["supplierName"]."</a></td>";
									$str = $str."<td><a href='supplierDetail.php?supplierId=".$qry_res_fetch["supplierId"]."' class='blueText'>".$qry_res_fetch["supplierContactPerson"]."</a></td>";
									$str = $str."<td>".$qry_res_fetch["supplierContactNo"]."</td>";
									$str = $str."<td><a href='mailto:".$qry_res_fetch["supplierEmail"]."'>".$qry_res_fetch["supplierEmail"]."</a></td>";
									$str = $str."<td>";
									if(isset($_SESSION['userRoleid'])){
										if(intval($_SESSION['userRoleid']) == 1){
											$str = $str."<i class=\"fa fa-pencil-square-o greenText marleft5 hover\" onclick=\"supplierFunctionality.editSupplier(".$qry_res_fetch["supplierId"].")\"></i>";
											//$str = $str."<i class=\"fa fa-trash-o redText marleft5 hover\" onclick=\"supplierFunctionality.deleteSupplier(".$qry_res_fetch["supplierId"].")\"></i>";
										}else{
											$str = $str."<i class=\"fa fa-pencil-square-o greenText marleft5 hover\" onclick=\"supplierFunctionality.editSupplier(".$qry_res_fetch["supplierId"].")\"></i>";
										}
									}
									$str = $str."<i class=\"fa fa-tv blueText marleft5 hover\" onclick=\"supplierFunctionality.gotoSupplierDetail(".$qry_res_fetch["supplierId"].")\"></i>";
									$str = $str."</td>";
								$str = $str."</tr>";
								echo $str;
								$str = "";
							} 
							?>
					</table>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>