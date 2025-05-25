<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";


if(count($_POST)){
	$storageName=isset($_REQUEST['storageName'])?$_REQUEST['storageName']:"";
	$parentId=isset($_REQUEST['parentId'])?(int)$_REQUEST['parentId']:0;

	/*echo "storageName : ".$storageName."<br>";
	echo "parentId : ".$parentId."<br>";
	exit;*/
	
	if($storageName != ""){
		$sql = "INSERT INTO `productStockStorage` (`storageId`, `storageName`, `parentId`) 
				VALUES (NULL, '".$storageName."', '".$parentId."')";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		updateLiveTime($dbConn, 'STOCKSTORAGE');
	}
	echo "<script language=\"javascript\">window.location = 'stockStorages.php'</script>";exit;
}else{
	/*--------------------------------------------Deleting Stock Storage Data-----------------------------------*/
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	if($ACTION == "DELETE"){
		$storageId=isset($_REQUEST['storageId'])?(int)$_REQUEST['storageId']:0;
		if($storageId > 0){
			$sqlDelete="DELETE FROM `productStockStorage` WHERE `productStockStorage`.`storageId` = ".$storageId;
			//echo $sqlDelete; exit;
			//$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
			//updateLiveTime($dbConn, 'STOCKSTORAGE');
		}
		echo "<script language=\"javascript\">window.location = 'stockStorages.php'</script>";exit;
	}
	/*--------------------------------------------Deleting Stock Storage Data-----------------------------------*/
	
	/*--------------------------------------------Populating Stock Storage Data---------------------------------*/
	$sql="SELECT `storageId`,`storageName`, `parentId` FROM `productStockStorage` WHERE 1";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$stockStorageObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$stockStorageObject = (object) [
										'storageId' => (int)$sql_res_fetch["storageId"], 
										'storageName' => $sql_res_fetch["storageName"],
										'parentId' => (int)$sql_res_fetch["parentId"]
									  ];
		//echo json_encode($stockStorageObject);exit;
		$stockStorageObjectArray[] = $stockStorageObject;
	}
	//echo json_encode($stockStorageObjectArray);exit;
	/*--------------------------------------------Populating Stock Storage Data---------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Stock Storages</title>
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
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/plugins/hummingbird-treeview.css" >
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
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/hummingbird-treeview.js"></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/settings.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="stockStorageSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_919">Product Stock Storages</span>
						</b>
					</h5>
					<button type="button" class="btn btn-success pull-right" onClick="settingsFunctionality.openStockStorageModal(0)">
						<span id="cms_920">Add Stock Storage as Parent</span>
					</button>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div id="treeview-container" class="hummingbird-treeview f12">
						<ul id="treeview" class="hummingbird-base">
						</ul>
					</div>
				</div>
				<!-- Payment Option Modal -->
				<div class="modal fade" id="stockStorageModal" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h5 id="cms_921" class="modal-title">Add Stock Storage</h5>
							</div>
							<form id="companyTypeForm" name="companyTypeForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return settingsFunctionality.validateStockStorageForm();">
								<div id="packingBoxDimensionModalBody" class="modal-body">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									
										<div class="input-group marBot5">
											<span id="widthSpan" class="input-group-addon">
												<span id="cms_922">Storage Name</span>: 
											</span>
											<input id="storageName" name="storageName" type="text" class="form-control" autocomplete="off" placeholder="Please Enter Stock Storage Name" value="" rel="cms_923">
										</div>

									</div>
									<br clear="all">
								</div>
								<div class="modal-footer">
									<input id="parentId" name="parentId" type="hidden" value="">
									<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_904">Close</button>
									<button id="stockStorageModalSaveBtn" type="submit" class="btn btn-success pull-right">
										<span id="cms_903">Save</span>
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<!-- Payment Option Modal -->
				<input id="stockStorageData" name="stockStorageData" type="hidden" value='<?php echo json_encode($stockStorageObjectArray); ?>'>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>