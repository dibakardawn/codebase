<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
if($ACTION == "DELETE"){
	$magazineId=isset($_REQUEST['magazineId'])?(int)$_REQUEST['magazineId']:0;
	if(intval($magazineId) > 0){
		$sqlDelete = "DELETE FROM `productMagazine` WHERE `productMagazine`.`magazineId` = ".$magazineId;
		//echo $sqlDelete; exit;
		$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
	}
	echo "<script language=\"javascript\">window.location = 'productMagazine.php'</script>";exit;
}else if($ACTION == "COPYMAGAZINE"){
	$magazineId=isset($_REQUEST['magazineId'])?(int)$_REQUEST['magazineId']:0;
	$sqlCopyMagazine = "INSERT into `productMagazine` (  
													`magazine`,
													`products`,
													`createdDate`,
													`status`
												)
						SELECT `magazine`, `products`, NOW(), 0 FROM `productMagazine` WHERE `magazineId` = ".$magazineId;
	//echo $sqlCopyMagazine; exit;
	$sqlCopyMagazine_res = mysqli_query($dbConn, $sqlCopyMagazine);
	$inserted_magazineId = mysqli_insert_id($dbConn);
	//echo $inserted_productId; exit;
	echo "<script language=\"javascript\">window.location = 'shareProductMagazine.php?magazineId=".$inserted_magazineId."'</script>";exit;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Magazines</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/productMagazine.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="productMagazineSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_171">Product Magazines</span></b></h5>
					<button type="button" class="pull-right btn btn-success" onClick="productMagazineFunctionality.gotoCreateProductMagazine()" rel="cms_174">Create Product Magazine</button>
				</header>
				<div class="w3-row-padding w3-margin-bottom scrollX">
					<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white minW720">
						<tr>
							<td width="30%"><strong id="cms_172">Magazine</strong></td>
							<td width="35%"><strong id="cms_173">Shared with Clients</strong></td>
							<td width="15%"><strong id="cms_137">Date</strong></td>
							<td width="20%"><strong id="cms_138">Action</strong></td>
						</tr>
						<?php
							$qry = "SELECT 
							`productMagazine`.`magazineId`, 
							`productMagazine`.`magazine`, 
							`productMagazine`.`products`,
							`productMagazine`.`customerIds`,
							`productMagazine`.`externalEmailIds`,
							DATE_FORMAT(`productMagazine`.`createdDate`,'%d-%m-%Y') as 'createdDate',
							`productMagazine`.`status` 
							FROM `productMagazine` 
							WHERE `productMagazine`.`magazineId` > 0
							ORDER BY `productMagazine`.`createdDate` DESC";
							//echo $qry; exit;
							$qry_res = mysqli_query($dbConn, $qry);
							while($qry_res_fetch = mysqli_fetch_array($qry_res)){
								$magCode = "MAG_".sprintf("%04d", $qry_res_fetch["magazineId"]);
								$str = "<tr>";
									$str = $str."<td>";
										$str = $str.$qry_res_fetch["magazine"]." ";
										$str = $str." <a href='".SITEURL."magazine/".$magCode."' target='_blank'>Link <i class='fa fa-external-link'></i></a>";
									$str = $str."</td>";
									
									if(@strlen($qry_res_fetch["customerIds"]) > 0){
										$sqlMagazineClients = "SELECT GROUP_CONCAT(`companyName` separator '<br>') AS 'customers' FROM `customer` WHERE `customerId` IN (".$qry_res_fetch["customerIds"].")";
										//echo $sqlMagazineClients; exit;
										$sqlMagazineClients_res = mysqli_query($dbConn, $sqlMagazineClients);
										$sqlMagazineClients_res_fetch = mysqli_fetch_array($sqlMagazineClients_res);
										$str = $str."<td class='f10'>";
											$str = $str.$sqlMagazineClients_res_fetch["customers"];
											//$str = $str.$qry_res_fetch["emailId"]; //Open if need to see the list of emails & extra emails
										$str = $str."</td>";
									}else{
										$str = $str."<td class='f10'></td>";
									}
									
									$str = $str."<td>".$qry_res_fetch["createdDate"]."</td>";
									
									$str = $str."<td>";
										$str = $str."<button type='button' class='btn btn-success btn-xs' onclick=\"productMagazineFunctionality.copyMagazine(".$qry_res_fetch["magazineId"].")\">Re-Send</button>";
										$str = $str."<i class=\"fa fa-share-alt greenText marleft5 hover\" onclick=\"appCommonFunctionality.socialShare('".$magCode."', '".SITEURL."magazine/".$magCode."', '".$qry_res_fetch["magazine"]."')\"></i>";
										$str = $str."<i class=\"fa fa-envelope blueText marleft5 hover\" onclick=\"productMagazineFunctionality.gotoMails('".$magCode."')\"></i>";
										if(isset($_SESSION['userRoleid'])){
											if(intval($_SESSION['userRoleid']) == 1){
												$str = $str."<i class=\"fa fa-pencil-square-o greenText marleft5 hover\" onclick=\"productMagazineFunctionality.editMagazine(".$qry_res_fetch["magazineId"].")\"></i>";
												$str = $str."<i class=\"fa fa-trash-o redText marleft5 hover\" onclick=\"productMagazineFunctionality.deleteMagazine(".$qry_res_fetch["magazineId"].")\"></i>";
											}
										}
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