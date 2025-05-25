<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";

if(count($_POST)){
	$packetName=isset($_REQUEST['packetName'])?$_REQUEST['packetName']:"";
	$packetNumber=isset($_REQUEST['packetNumber'])?(int)$_REQUEST['packetNumber']:0;
	$dimention=isset($_REQUEST['dimention'])?$_REQUEST['dimention']:NULL;

	/*echo "packetName : ".$packetName."<br>";
	echo "packetNumber : ".$packetNumber."<br>";
	echo "dimention : ".$dimention."<br>";
	exit;*/
	
	if($packetName != "" && $packetNumber != ""){
		$sql = "INSERT INTO `packet` (`packetId`, `packetName`, `packetNumber`, `dimention`) 
				VALUES (NULL, '".$packetName."', '".$packetNumber."', '".$dimention."')";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
	}
	echo "<script language=\"javascript\">window.location = 'packingBoxes.php'</script>";exit;
}else{
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	
	/*--------------------------------------------Deleting Packing Box Data-----------------------------------*/
	if($ACTION == "DELETE"){
		$packetId=isset($_REQUEST['packetId'])?(int)$_REQUEST['packetId']:0;
		if($packetId > 0){
			$sqlDelete="DELETE FROM `packet` WHERE `packet`.`packetId` = ".$packetId;
			//echo $sqlDelete; exit;
			$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
		}
		echo "<script language=\"javascript\">window.location = 'packingBoxes.php'</script>";exit;
	}
	/*--------------------------------------------Deleting Packing Box Data-----------------------------------*/
	
	/*--------------------------------------------Add Dimention Packing Box Data------------------------------*/
	if($ACTION == "ADDPACKINGBOXDIMENSION"){
		$packetId = isset($_REQUEST['packetId']) ? (int)$_REQUEST['packetId'] : 0;
		if ($packetId > 0) {
			$width = isset($_REQUEST['width']) ? (int)$_REQUEST['width'] : 0;
			$height = isset($_REQUEST['height']) ? (int)$_REQUEST['height'] : 0;
			$length = isset($_REQUEST['length']) ? (int)$_REQUEST['length'] : 0;
			$sqlSelect = "SELECT `dimention` FROM `packet` WHERE `packetId` = $packetId";
			$result = mysqli_query($dbConn, $sqlSelect);
			if ($result && mysqli_num_rows($result) > 0) {
				$row = mysqli_fetch_assoc($result);
				$currentDimensions = json_decode($row['dimention'], true) ?: [];
				$newDimension = [
					'width' => $width,
					'height' => $height,
					'length' => $length
				];
				$currentDimensions[] = $newDimension;
				$newDimensionsJson = mysqli_real_escape_string($dbConn, json_encode($currentDimensions));
				$sqlUpdate = "UPDATE `packet` SET `dimention` = '$newDimensionsJson' WHERE `packetId` = $packetId";
				//echo $sqlUpdate; exit;
				$sqlUpdate_res = mysqli_query($dbConn, $sqlUpdate);
			}
		}
		echo "<script language=\"javascript\">window.location = 'packingBoxes.php'</script>";exit;
	}
	/*--------------------------------------------Add Dimention Packing Box Data------------------------------*/
	
	/*--------------------------------------------Delete Dimention Packing Box Data---------------------------*/
	if ($ACTION == "DELETEPACKINGBOXDIMENSION") {
		$packetId = isset($_REQUEST['packetId']) ? (int)$_REQUEST['packetId'] : 0;
		$index = isset($_REQUEST['index']) ? (int)$_REQUEST['index'] : 0;
		if ($packetId > 0) {
			$sqlSelect = "SELECT `dimention` FROM `packet` WHERE `packetId` = $packetId";
			$result = mysqli_query($dbConn, $sqlSelect);
			if ($result && mysqli_num_rows($result) > 0) {
				$row = mysqli_fetch_assoc($result);
				$currentDimensions = json_decode($row['dimention'], true) ?: [];
				if (isset($currentDimensions[$index])) {
					array_splice($currentDimensions, $index, 1);
					$newDimensionsJson = mysqli_real_escape_string($dbConn, json_encode($currentDimensions));
					$sqlUpdate = "UPDATE `packet` SET `dimention` = '$newDimensionsJson' WHERE `packetId` = $packetId";
					$sqlUpdate_res = mysqli_query($dbConn, $sqlUpdate);
				}
			}
		}
		echo "<script language=\"javascript\">window.location = 'packingBoxes.php'</script>";exit;
	}
	/*--------------------------------------------Delete Dimention Packing Box Data---------------------------*/
	
	/*--------------------------------------------Populating Packing Box Data---------------------------------*/
	$sql="SELECT `packetId`,`packetName`,`packetNumber`,`dimention` FROM `packet` WHERE 1";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$packingBoxObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$packingBoxObject = (object) [
										'packetId' => (int)$sql_res_fetch["packetId"], 
										'packetName' => $sql_res_fetch["packetName"],
										'packetNumber' => (int)$sql_res_fetch["packetNumber"],
										'dimention' => $sql_res_fetch["dimention"]
									  ];
		//echo json_encode($packingBoxObject);exit;
		$packingBoxObjectArray[] = $packingBoxObject;
	}
	//echo json_encode($packingBoxObjectArray);exit;
	/*--------------------------------------------Populating Packing Box Data---------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Packing Boxes</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/settings.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="packingBoxSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_895">Packing Boxes</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<form id="packingBoxForm" name="packingBoxForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return settingsFunctionality.validatePackingBoxForm();">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20">
						
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_896">Packet Name</span>
									<input type="text" id="packetName" name="packetName" class="form-control" value="" placeholder="Please Enter Packet Name" rel="cms_897">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
								<div class="input-group input-group-md marBot5">
									<span class="input-group-addon" id="cms_898">Packet Number</span>
									<input type="number" id="packetNumber" name="packetNumber" class="form-control" value="" placeholder="Please Enter Packet Number" rel="cms_899">
								</div>
							</div>
							
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<button id="submitBtn" type="submit" class="btn btn-success pull-left" rel="cms_832">Submit</button>
							</div>
							
						</div>
					</form>
					<h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_900">List of Packets</span>
						</b>
					</h5>
					<div id="packetTableContainer" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
				</div>
				<!-- Payment Option Modal -->
				<div class="modal fade" id="packingBoxDimensionModal" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h5 id="cms_905" class="modal-title">Add Packing Box Dimension</h5>
							</div>
							<div id="packingBoxDimensionModalBody" class="modal-body">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								
									<div class="input-group marBot5">
										<span id="widthSpan" class="input-group-addon">
											<span id="cms_906">Width</span>: 
										</span>
										<input id="width" name="width" type="number" class="form-control" autocomplete="off" value="0">
									</div>
									
									<div class="input-group marBot5">
										<span id="heightSpan" class="input-group-addon">
											<span id="cms_907">Height</span>: 
										</span>
										<input id="height" name="height" type="number" class="form-control" autocomplete="off" value="0">
									</div>
									
									<div class="input-group marBot5">
										<span id="lengthSpan" class="input-group-addon">
											<span id="cms_908">Length</span>: 
										</span>
										<input id="length" name="length" type="number" class="form-control" autocomplete="off" value="0">
									</div>

								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<input id="packetIdHdn" name="packetIdHdn" type="hidden" value="">
								<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_904">Close</button>
								<button id="packingBoxDimensionModalSaveBtn" type="button" class="btn btn-success pull-right" onclick="settingsFunctionality.addPackingBoxDimension()">
									<span id="cms_903">Save</span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Payment Option Modal -->
				<input id="packetData" name="packetData" type="hidden" value='<?php echo json_encode($packingBoxObjectArray); ?>'>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>