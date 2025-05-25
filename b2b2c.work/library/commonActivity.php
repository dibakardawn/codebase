<?php
/*=============================================Deactivating Expired Product Offers=====================================*/
	$count = 0;
	$affected_ids = []; // Will store unique product IDs

	/*-----------------------------------------STEP:1 Start------------------------------------------------------------*/
	// Collect product IDs that will be updated in Step 1
	$sql_find_affected = "SELECT DISTINCT `productId` FROM `productOffer` 
						  WHERE (`RofferEndDate` <= NOW() AND `RofferPercentage` != 0)
						  OR (`WofferEndDate` <= NOW() AND `WofferPercentage` != 0)";
	$result = mysqli_query($dbConn, $sql_find_affected);
	while ($row = mysqli_fetch_assoc($result)) {
		$affected_ids[$row['productId']] = $row['productId']; // Using keys ensures uniqueness
	}

	// Update RofferPercentage and WofferPercentage
	$sql_OfferUpdate1 = "UPDATE `productOffer`
	SET 
		`RofferPercentage` = CASE 
			WHEN `RofferEndDate` <= NOW() THEN 0 
			ELSE `RofferPercentage` 
		END,
		`WofferPercentage` = CASE 
			WHEN `WofferEndDate` <= NOW() THEN 0 
			ELSE `WofferPercentage` 
		END";
	$sql_OfferUpdate1_res = mysqli_query($dbConn, $sql_OfferUpdate1);

	if ($sql_OfferUpdate1_res) {
		$count += (mysqli_affected_rows($dbConn) > 0) ? 1 : 0;
	} else {
		echo "Error in Step 1: " . mysqli_error($dbConn) . "<br>";
	}
	/*-----------------------------------------STEP:1 Ends-------------------------------------------------------------*/

	/*-----------------------------------------STEP:2 Start------------------------------------------------------------*/
	// Collect product IDs that will be updated in Step 2
	$sql_find_affected = "SELECT DISTINCT `productId` FROM `productOffer` 
						  WHERE `RofferPercentage` = 0 AND `WofferPercentage` = 0";
	$result = mysqli_query($dbConn, $sql_find_affected);
	while ($row = mysqli_fetch_assoc($result)) {
		$affected_ids[$row['productId']] = $row['productId']; // Ensures no duplicates
	}

	// Update status where both percentages are 0
	$sql_OfferUpdate2 = "UPDATE `productOffer` 
						 SET `status` = 0 
						 WHERE `RofferPercentage` = 0 AND `WofferPercentage` = 0";
	$sql_OfferUpdate2_res = mysqli_query($dbConn, $sql_OfferUpdate2);

	if ($sql_OfferUpdate2_res) {
		$count += (mysqli_affected_rows($dbConn) > 0) ? 1 : 0;
	} else {
		echo "Error in Step 2: " . mysqli_error($dbConn) . "<br>";
	}
	/*-----------------------------------------STEP:2 Ends-------------------------------------------------------------*/

	/*-----------------------------------------STEP:3 Start------------------------------------------------------------*/
	// Collect product IDs that will be deleted in Step 3
	$sql_find_affected = "SELECT DISTINCT `productId` FROM `productOffer`
						  WHERE `RofferEndDate` <= DATE_SUB(NOW(), INTERVAL 365 DAY)
						  AND `WofferEndDate` <= DATE_SUB(NOW(), INTERVAL 365 DAY)";
	$result = mysqli_query($dbConn, $sql_find_affected);
	while ($row = mysqli_fetch_assoc($result)) {
		$affected_ids[$row['productId']] = $row['productId']; // Still unique
	}

	// Delete old records
	$sql_OfferDelete = "DELETE FROM `productOffer`
						WHERE `RofferEndDate` <= DATE_SUB(NOW(), INTERVAL 365 DAY)
						AND `WofferEndDate` <= DATE_SUB(NOW(), INTERVAL 365 DAY)";
	$sql_OfferDelete_res = mysqli_query($dbConn, $sql_OfferDelete);

	if (!$sql_OfferDelete_res) {
		echo "Error in Step 3: " . mysqli_error($dbConn) . "<br>";
	}
	/*-----------------------------------------STEP:3 Ends-------------------------------------------------------------*/

	// Convert associative array back to indexed array (if needed)
	$affected_ids = array_values($affected_ids);

	/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
	if($count > 0){
		updateLiveTime($dbConn, 'PRODUCT');
		updateLiveTime($dbConn, 'PRODUCTLIVESTOCK');
		if (!empty($affected_ids)) {
			for($i = 0; $i < count($affected_ids); $i++) {
				populateProductPreCompiledData($dbConn, (int)$affected_ids[$i]);
			}
		}
	}
	/*-----------------------------------Populate Pre-compiled Product Offers---------------*/

/*=============================================Deactivating Expired Product Offers=====================================*/

/*=============================================Deleting Product Dispatched Stocks (status = 0) for 6 months============*/
//xxxx implementation pending, will do it later
/*=============================================Deleting Product Dispatched Stocks (status = 0) for 6 months============*/

/*=============================================Send and Update Mails===================================================*/
//xxxx implementation pending, will do it later
/*=============================================Send and Update Mails===================================================*/
?>