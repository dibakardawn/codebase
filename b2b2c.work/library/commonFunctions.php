<?php 
/*----------------------------------------------Common Functions---------------------------------------------*/
function clean($string) {
   $string = str_replace(' ', '_', $string); // Replaces all spaces with hyphens.
   return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

function getExt($fileName){
	$fileArr = explode(".",$fileName);
	return $fileArr[count($fileArr) - 1];
}

function fileUpload($Id, $targetFolder, $imagePrefix, $fieldName, $allowedExtentions){
	$target_dir = "../".$targetFolder;
	$target_fileName = $imagePrefix."_".$Id."_".basename($_FILES[$fieldName]["name"]);
	$target_file = $target_dir.$target_fileName;
	//echo $target_file;exit;
	$allowedExtArr = explode(",",$allowedExtentions);
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	//echo $imageFileType;exit;
	if(in_array($imageFileType, $allowedExtArr)){
		move_uploaded_file($_FILES[$fieldName]['tmp_name'], $target_file);
		return $target_fileName;
	}else{
		return "";
	}
}

function multiplefileUpload($Id, $targetFolder, $imagePrefix, $fieldName, $allowedExtentions){
	$result = "";
	if (isset($_FILES[$fieldName])) {
		$targetDir = "../".$targetFolder;
		//echo $targetDir; exit;
		$allowedExtensions = explode(",",$allowedExtentions);
		//print_r($allowedExtensions); exit;
		foreach ($_FILES[$fieldName]['name'] as $key => $filename) {
			$fileTmpPath = $_FILES[$fieldName]['tmp_name'][$key];
			$fileExtension = pathinfo($filename, PATHINFO_EXTENSION);
			if (in_array(strtolower($fileExtension), $allowedExtensions)) {
				$newFileName = $imagePrefix.'_'.$Id.'_'.uniqid().'.'.$fileExtension;
				$targetFilePath = $targetDir . $newFileName;
				if (move_uploaded_file($fileTmpPath, $targetFilePath)) {
					$result = $result.$newFileName.",";
				} else {
					$result = ""; //"Error uploading file $filename."
				}
			} else {
				$result = ""; //"File type not allowed for $filename."
			}
		}
	} else {
		$result = ""; //"No files uploaded."
	}
	$result = rtrim($result, ',');
	//echo $result; exit;
	return $result;
}

function makeThumbnail1($src, $dest, $desired_width, $desired_height) {
	$srcFileArr = explode("/", $src);
	$srcImageOriginalName = $srcFileArr[count($srcFileArr) - 1];
	if($srcImageOriginalName != NOIMAGEFILE){
		$srcFileExt = getExt($srcImageOriginalName);
		switch ($srcFileExt) {
			
			case "jpg":{
				$source_image = @imagecreatefromjpeg($src);
				$width = @imagesx($source_image);
				$height = @imagesy($source_image);
				$virtual_image = imagecreatetruecolor($desired_width, $desired_height);
				@imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
				imagejpeg($virtual_image, $dest, 90);
				break;
			}
			
			case "jpeg":{
				$source_image = @imagecreatefromjpeg($src);
				$width = @imagesx($source_image);
				$height = @imagesy($source_image);
				$virtual_image = imagecreatetruecolor($desired_width, $desired_height);
				@imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
				imagejpeg($virtual_image, $dest, 90);
				break;
			}
			
			case "png":{
				$source_image = @imagecreatefrompng($src);
				$width = @imagesx($source_image);
				$height = @imagesy($source_image);
				$virtual_image = imagecreatetruecolor($desired_width, $desired_height);
				@imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);
				@imagepng($virtual_image, $dest);
				break;
			}
		}
	}
}

function makeThumbnail($src, $dest, $desired_width, $desired_height) {
    $srcFileArr = explode("/", $src);
    $srcImageOriginalName = $srcFileArr[count($srcFileArr) - 1];
    if ($srcImageOriginalName != NOIMAGEFILE) {
        $srcFileExt = getExt($srcImageOriginalName);
        $source_image = false;

        switch ($srcFileExt) {
            case "jpg":
            case "jpeg":
                $source_image = @imagecreatefromjpeg($src);
                break;

            case "png":
                $source_image = @imagecreatefrompng($src);
                break;
        }

        if ($source_image !== false) {
            $width = imagesx($source_image);
            $height = imagesy($source_image);
            $virtual_image = imagecreatetruecolor($desired_width, $desired_height);
            imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);

            switch ($srcFileExt) {
                case "jpg":
                case "jpeg":
                    imagejpeg($virtual_image, $dest, 90);
                    break;

                case "png":
                    imagepng($virtual_image, $dest);
                    break;
            }

            // Free up memory
            imagedestroy($source_image);
            imagedestroy($virtual_image);
        }
    }
}

function base64ToJpeg($base64Data, $folderName, $fileName){
	$ifp = fopen('../'.UPLOADFOLDER.$folderName.'/'.$fileName.'.jpeg', 'wb');
    $base64DataArr = explode( ',', $base64Data );
    fwrite($ifp, base64_decode($base64DataArr[1]));
	fclose($ifp);
}

function deleteFile($file, $targetFolder){
	$target_dir = "../".$targetFolder;
	$target_file = $target_dir.$file;
	//echo $target_file."<br>";
	//echo file_exists($target_file)."<br>";
	if(file_exists($target_file)){
		//echo $target_file; exit;
		unlink($target_file);
	}
}

function deleteAllFileofFolder($targetFolder){
	$files = glob($targetFolder.'*');
	foreach($files as $file){
	  if(is_file($file)) {
		unlink($file);
	  }
	}
}

function dateFormate($dateStr){
	$modifiedDateArr = explode("-",$dateStr);
	$monthName = date('F', mktime(0, 0, 0, $modifiedDateArr[1], 10));
	return $modifiedDateArr[2]." ".$monthName.", ".$modifiedDateArr[0];
}

function getTitlePart(){
	$actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
	$urlArr = explode("/",$actual_link);
	$titlePart = "";
	for($i = 0; $i < count($urlArr); $i++){
		if($i > 2){
			if($i === (count($urlArr) - 1)){
				$titlePart = $titlePart.$urlArr[$i];
			}else{
				$titlePart = $titlePart.$urlArr[$i]." | ";
			}
		}
	}
	return $titlePart;
}

function AmountInWords(float $amount){
   $amount_after_decimal = round($amount - ($num = floor($amount)), 2) * 100;
   // Check if there is any number after decimal
   $amt_hundred = null;
   $count_length = strlen($num);
   $x = 0;
   $string = array();
   $change_words = array(0 => '', 1 => 'One', 2 => 'Two',
     3 => 'Three', 4 => 'Four', 5 => 'Five', 6 => 'Six',
     7 => 'Seven', 8 => 'Eight', 9 => 'Nine',
     10 => 'Ten', 11 => 'Eleven', 12 => 'Twelve',
     13 => 'Thirteen', 14 => 'Fourteen', 15 => 'Fifteen',
     16 => 'Sixteen', 17 => 'Seventeen', 18 => 'Eighteen',
     19 => 'Nineteen', 20 => 'Twenty', 30 => 'Thirty',
     40 => 'Forty', 50 => 'Fifty', 60 => 'Sixty',
     70 => 'Seventy', 80 => 'Eighty', 90 => 'Ninety');
    $here_digits = array('', 'Hundred','Thousand','Lakh', 'Crore');
    while( $x < $count_length ) {
      $get_divider = ($x == 2) ? 10 : 100;
      $amount = floor($num % $get_divider);
      $num = floor($num / $get_divider);
      $x += $get_divider == 10 ? 1 : 2;
      if ($amount) {
       $add_plural = (($counter = count($string)) && $amount > 9) ? 's' : null;
       $amt_hundred = ($counter == 1 && $string[0]) ? ' and ' : null;
       $string [] = ($amount < 21) ? $change_words[$amount].' '. $here_digits[$counter]. $add_plural.' 
       '.$amt_hundred:$change_words[floor($amount / 10) * 10].' '.$change_words[$amount % 10]. ' 
       '.$here_digits[$counter].$add_plural.' '.$amt_hundred;
        }
   else $string[] = null;
   }
   $implode_to_Euroes = implode('', array_reverse($string));
   $get_cent = ($amount_after_decimal > 0) ? "And " . ($change_words[$amount_after_decimal / 10] . " 
   " . $change_words[$amount_after_decimal % 10]) . ' Cent' : '';
   return ($implode_to_Euroes ? $implode_to_Euroes . 'Euroes ' : '') . $get_cent;
}

function cutStringWithLength($str, $limit){
	if (strlen($str) > intval($limit)){
		$str = substr($str, 0, intval($limit)) . '...';
	}
	return $str;
}

function checkFileOrUrl($str) {
    // Check if the string is a valid URL
    if (filter_var($str, FILTER_VALIDATE_URL)) {
        return 'URL';
    }

    // Check if the string has an allowed file extension
    $allowedExtensions = explode(',', ALLOWEDEXTENSIONS);
    $fileExtension = pathinfo($str, PATHINFO_EXTENSION);

    if (in_array(strtolower($fileExtension), $allowedExtensions)) {
        return 'FILE';
    }

    // If neither, return ''
    return '';
}

function extractVideoId($url) {
    $pattern = '/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/';
    if (preg_match($pattern, $url, $matches)) {
        return $matches[1];
    }
    return null;
}

function checkReferer() {
    return isset($_SERVER['HTTP_REFERER']) && str_contains($_SERVER['HTTP_REFERER'], SITEURL);
}

function checkRefererForSupplierPortal() {
    if (!isset($_SERVER['HTTP_REFERER'])) {
        return false;
    }
    $referer = $_SERVER['HTTP_REFERER'];
    $refererParts = parse_url($referer);
    $siteUrlParts = parse_url(SITEURL);
    $refererHostPath = $refererParts['host'] . $refererParts['path'];
    $siteUrlHostPath = $siteUrlParts['host'] . $siteUrlParts['path'];
    return strpos($refererHostPath, $siteUrlHostPath) !== false && strpos($refererHostPath, 'supplierPortal') !== false;
}

function generateOtp() {
    return str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
}

function generateTableScript($tableName, $dbConn) { //It will generate the Table SQL script - Not in Use
    // 1. Get table creation SQL
	$result = $dbConn->query("SHOW CREATE TABLE `".$tableName."`");
	$createTable = $result->fetch_assoc();
	$tableSql = $createTable['Create Table'] . ";\n\n";

	// 2. Get table data (MySQLi version)
	$result = $dbConn->query("SELECT * FROM `".$tableName."`");
	$dataSql = "\n\n";

	while ($row = $result->fetch_assoc()) {
		$columns = array_map(function($col) { return "`$col`"; }, array_keys($row));
		$values = array_map(function($val) use ($dbConn) { 
			return "'" . $dbConn->real_escape_string($val) . "'"; 
		}, array_values($row));
		
		$dataSql .= "INSERT INTO `".$tableName."` (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $values) . ");\n";
	}
	$dataSql .= "\n\n";

	// 3. Dynamic indexes and auto_increment
	$metaSql = "";

	// Get primary key information
	$result = $dbConn->query("
		SELECT COLUMN_NAME 
		FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
		WHERE TABLE_NAME = '".$tableName."' 
		AND CONSTRAINT_NAME = 'PRIMARY' 
		AND TABLE_SCHEMA = '$dbName'
	");

	$primaryKeys = [];
	while ($row = $result->fetch_assoc()) {
		$primaryKeys[] = $row['COLUMN_NAME'];
	}

	if (!empty($primaryKeys)) {
		$metaSql .= "\n\n";
		$metaSql .= "ALTER TABLE `".$tableName."`\n  ADD PRIMARY KEY (`" . implode('`, `', $primaryKeys) . "`);\n\n";
	}

	// Get auto_increment information
	$result = $dbConn->query("
		SELECT AUTO_INCREMENT 
		FROM INFORMATION_SCHEMA.TABLES 
		WHERE TABLE_NAME = '".$tableName."' 
		AND TABLE_SCHEMA = '$dbName'
	");
	$autoIncrement = $result->fetch_assoc();

	if ($autoIncrement && $autoIncrement['AUTO_INCREMENT'] !== null) {
		// Get the auto_increment column name
		$result = $dbConn->query("SHOW COLUMNS FROM `".$tableName."` WHERE `Extra` = 'auto_increment'");
		$aiColumn = $result->fetch_assoc();
		
		if ($aiColumn) {
			$metaSql .= "\n\n";
			$metaSql .= "ALTER TABLE `".$tableName."`\n  MODIFY `{$aiColumn['Field']}` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT={$autoIncrement['AUTO_INCREMENT']};\n";
		}
	}

	$metaSql .= "COMMIT;\n";

	// Combine all SQL parts
	$fullSql = $tableSql . $dataSql . $metaSql;
	
	return $fullSql;
}

function getAllTables($dbConn) {
    $tables = array();
    if (!is_object($dbConn)) {
        return ['success' => false, 'message' => 'Invalid database connection'];
    }
    try {
        $result = $dbConn->query("SHOW TABLES");
        if (!$result) {
            return ['success' => false, 'message' => 'Query failed: ' . $dbConn->error];
        }
        while ($row = $result->fetch_array()) {
            $tables[] = $row[0];
        }
        return [
            'success' => true,
            'tables' => $tables,
            'count' => count($tables)
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function generateTableCSV($tableName, $dbConn, $dirPath) {
    if (empty($tableName) || !is_object($dbConn) || empty($dirPath)) {
        return ['success' => false, 'message' => 'Invalid parameters'];
    }
    if (!file_exists($dirPath) && !mkdir($dirPath, 0755, true)) {
        return ['success' => false, 'message' => 'Failed to create directory'];
    }
    $csvFilePath = "{$dirPath}/{$tableName}.csv";
    try {
        $result = $dbConn->query("SELECT * FROM `{$dbConn->real_escape_string($tableName)}`");
        if (!$result) {
            return ['success' => false, 'message' => 'Query failed: ' . $dbConn->error];
        }
        $fileHandle = fopen($csvFilePath, 'w');
        if ($fileHandle === false) {
            return ['success' => false, 'message' => 'Failed to create CSV file'];
        }
        $headers = array_map(function($field) {
            return $field->name;
        }, $result->fetch_fields());
        fputcsv($fileHandle, $headers);
        $recordCount = 0;
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                fputcsv($fileHandle, $row);
                $recordCount++;
            }
        }
        fclose($fileHandle);
        return [
            'success' => true,
            'message' => $recordCount > 0 ? 'CSV generated successfully' : 'Empty CSV generated (no records)',
            'filePath' => $csvFilePath,
            'recordCount' => $recordCount
        ];
    } catch (Exception $e) {
        if (isset($fileHandle)) {
            fclose($fileHandle);
            if (file_exists($csvFilePath)) {
                unlink($csvFilePath);
            }
        }
        return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    }
}

function copyFolder($src, $dst) {
    if (!is_dir($src)) {
        echo "Source folder does not exist.";
        return false;
    }
    if (!file_exists($dst)) {
        mkdir($dst, 0755, true);
    }
    $dir = opendir($src);
    while (($file = readdir($dir)) !== false) {
        if ($file === '.' || $file === '..') {
            continue;
        }
        $srcPath = $src . DIRECTORY_SEPARATOR . $file;
        $dstPath = $dst . DIRECTORY_SEPARATOR . $file;
        if (is_dir($srcPath)) {
            copyFolder($srcPath, $dstPath);
        } else {
            copy($srcPath, $dstPath);
        }
    }
    closedir($dir);
    return true;
}

function zipFolder($folderPath, $zipFilePath) {
    $zip = new ZipArchive();
    if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        die("Cannot create zip file at $zipFilePath");
    }
    $folderPath = realpath($folderPath);
    if (is_dir($folderPath)) {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($folderPath),
            RecursiveIteratorIterator::LEAVES_ONLY
        );
        
        foreach ($files as $name => $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($folderPath) + 1);
                $zip->addFile($filePath, $relativePath);
            }
        }
    } else {
        die("$folderPath is not a valid directory.");
    }
    $zip->close();
    //echo "Zip file created successfully at $zipFilePath";
}

function deleteFolder($folder) {
    if (!is_dir($folder)) {
        echo "Folder does not exist.";
        return false;
    }
    $items = scandir($folder);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }
        $path = $folder . DIRECTORY_SEPARATOR . $item;
        if (is_dir($path)) {
            deleteFolder($path);
        } else {
            @unlink($path);
        }
    }
    return rmdir($folder);
}
/*----------------------------------------------Common Functions---------------------------------------------*/

/*----------------------------------------------Extra Functions in use---------------------------------------*/
function getOrderSaleStatus($dbConn, $orderStatusId){
	$sql="SELECT `orderStatus` FROM `orderSaleStatus` WHERE `orderStatusId` = ".$orderStatusId;
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$sql_res_fetch = mysqli_fetch_array($sql_res);
	return $sql_res_fetch["orderStatus"];
}

function getOrderSaleStatusId($dbConn, $saleOrderStatus){
	$sql="SELECT `orderStatusId` FROM `orderSaleStatus` WHERE `orderStatus` = '".$saleOrderStatus."'";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$sql_res_fetch = mysqli_fetch_array($sql_res);
	return $sql_res_fetch["orderStatusId"];
}

function getOrderPurchaseStatus($dbConn, $purchaseOrderStatusId){
	$sql="SELECT `purchaseOrderStatus` FROM `orderPurchaseStatus` WHERE `purchaseOrderStatusId` = ".$purchaseOrderStatusId;
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$sql_res_fetch = mysqli_fetch_array($sql_res);
	return $sql_res_fetch["purchaseOrderStatus"];
}

function getOrderPurchaseStatusId($dbConn, $purchaseOrderStatus){
	$sql="SELECT `purchaseOrderStatusId` FROM `orderPurchaseStatus` WHERE `purchaseOrderStatus` = '".$purchaseOrderStatus."'";
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$sql_res_fetch = mysqli_fetch_array($sql_res);
	return $sql_res_fetch["purchaseOrderStatusId"];
}

function getPageBootstrapIcon($allPages, $pageName){
	$bootstrapIcon = "";
	if ($allPages === null) {
        return $bootstrapIcon;
    }
	if(count($allPages) > 0){
		for($i = 0; $i < count($allPages); $i++){
			if($allPages[$i][1] == $pageName){
				$bootstrapIcon = $allPages[$i][3];
			}
		}
	}
	return $bootstrapIcon;
}

function stringAllTheFileNamePresentInTheArray($productImagesArr){ //used in Product Image : Product Module
	$allActualFileNames = "";
	for($i = 0; $i < count($productImagesArr); $i++){
		if($productImagesArr[$i] != NOIMAGEFILE && $productImagesArr[$i] != ""){
			$allActualFileNames = $allActualFileNames.$productImagesArr[$i].",";
		}
	}
	return ltrim(rtrim($allActualFileNames, ','), ',');
}
/*----------------------------------------------Extra Functions in use---------------------------------------*/

/*----------------------------------------------Common Mail Functions----------------------------------------*/
function insertMail($dbConn, $toEmail, $fromEmail, $subject, $body, $reference){
	if($toEmail != "" && $fromEmail != "" && $subject != "" && $body != ""){
		$encodedBody = base64_encode(mb_convert_encoding($body, 'UTF-8', 'auto'));
		$sqlInsertMail = "INSERT INTO `mail` (`mailId`, `toEmail`, `fromEmail`, `subject`, `body`, `reference`, `createdTimeStamp`, `deliveryTimeStamp`, `sent`) 
						  VALUES (NULL, '".$toEmail."', '".$fromEmail."', '".$subject."', '".$encodedBody."', '".$reference."', NOW(), NULL, 0)";
		//echo $sqlInsertMail; exit;
		$sqlInsertMail_res = mysqli_query($dbConn, $sqlInsertMail);
	}
}

function sendMail(){
	//xxxx implementation pending, will do it later
}

function updateMailStatus($dbConn, $mailId){
	$sqlUpdateMail = "UPDATE `mail` SET `deliveryTimeStamp` = NOW(), `sent` = 1 WHERE `mail`.`mailId` = ".$mailId;
	//echo $sqlUpdateMail; exit;
	$sqlUpdateMail_res = mysqli_query($dbConn, $sqlUpdateMail);
}
/*----------------------------------------------Common Mail Functions----------------------------------------*/

/*----------------------------------------------preCompiled Data---------------------------------------------*/
function populatePreCompiledData($dbConn, $type){
	switch ($type) {

		case "BRAND":{
			/*-------------------------------Populate Overall Brand Data-----------------------------------*/
			$sql_Brands = "SELECT 
						  `brand`.`brandId`,
						  `brand`.`brandName`,
						  `brand`.`brandImage`,
						  `brand`.`parentId`,
						  (SELECT COUNT(`product`.`productId`) FROM `product` WHERE `product`.`brandId` = `brand`.`brandId`) as 'products'
						  FROM `brand`
						  WHERE 1";
			//echo $sql_Brands; exit;
			$sql_Brands_res = mysqli_query($dbConn, $sql_Brands);
			$productBrandObjectArray = array();
			while($sql_Brands_res_fetch = mysqli_fetch_array($sql_Brands_res)){
				$productBrandObject = (object) ['brandId' => $sql_Brands_res_fetch["brandId"], 
												'brandName' => ucfirst($sql_Brands_res_fetch["brandName"]),
												'brandImage' => $sql_Brands_res_fetch["brandImage"],
												'products' => $sql_Brands_res_fetch["products"],
												'parentId' => $sql_Brands_res_fetch["parentId"]];
				//echo json_encode($productBrandObject);exit;
				$productBrandObjectArray[] = $productBrandObject;
			}
			echo json_encode($productBrandObjectArray);exit;
			/*-------------------------------Populate Overall Brand Data-----------------------------------*/
			break;
		}

		case "CATEGORY":{
			/*-------------------------------Populate Overall Category Data-----------------------------------*/
			$sql_Cat = "SELECT 
						  `category`.`categoryId`,
						  `category`.`category`,
						  `category`.`categoryImage`,
						  (SELECT COUNT(`productCategory`.`productId`) FROM `productCategory` WHERE `productCategory`.`categoryId` = `category`.`categoryId`) AS 'products',
						  `category`.`parentId` 
						  FROM `category` 
						  WHERE 1";
			//echo $sql_Cat; exit;
			$sql_Cat_res = mysqli_query($dbConn, $sql_Cat);
			$catObjectArray = array();
			while($sql_Cat_res_fetch = mysqli_fetch_array($sql_Cat_res)){
				$catObject = (object) ['categoryId' => $sql_Cat_res_fetch["categoryId"], 
										'category' => ucfirst($sql_Cat_res_fetch["category"]),
										'categoryImage' => $sql_Cat_res_fetch["categoryImage"],
										'products' => $sql_Cat_res_fetch["products"],
										'parentId' => $sql_Cat_res_fetch["parentId"]
									  ];
				//echo json_encode($catObject);exit;
				$catObjectArray[] = $catObject;
			}
			echo json_encode($catObjectArray);exit;
			/*-------------------------------Populate Overall Category Data-----------------------------------*/
			break;
		}
		
		case "PRODUCT":{
			/*-------------------------------Populate Overall Product Data-----------------------------------*/
			$sql_products = "SELECT 
			`product`.`productId`,
			`product`.`productCode`,
			`product`.`productTitle`,
			`product`.`productImages`,
			`product`.`productSlug`,
			`product`.`metaKeyWords`,
			`product`.`brandId`, 
			`product`.`createdDate`, 
			`product`.`lastModifiedDate`, 
			`product`.`minStockVol`, 
			GROUP_CONCAT(DISTINCT `productCategory`.`categoryId`) AS 'categoryIds',
			(
				SELECT COUNT(`productStock`.`stockId`) 
				FROM `productStock` 
				WHERE `productStock`.`productId` = `product`.`productId`
				AND `productStock`.`status` = 1
			) AS 'productStock',
			(
				SELECT COUNT(`productCombination`.`productCombinationId`) 
				FROM `productCombination` 
				WHERE `productCombination`.`productId` = `product`.`productId`
			) AS 'productCombinations',
			(
				SELECT COUNT(`productOffer`.`offerId`) 
				FROM `productOffer` 
				WHERE `productOffer`.`productId` = `product`.`productId`
			) AS 'productOffer'
			FROM `product` 
			INNER JOIN `productCategory`
			ON `productCategory`.`productId` = `product`.`productId`
			LEFT JOIN `productCombination`
			ON `productCombination`.`productId` = `product`.`productId`
			WHERE `product`.`Status` = 1
			GROUP BY `product`.`productId`";
			//echo $sql_products; exit;
			$sql_products_res = mysqli_query($dbConn, $sql_products);
			$productObjectArray = array();
			while($sql_products_res_fetch = mysqli_fetch_array($sql_products_res)){
				$productImageArr = explode(',', $sql_products_res_fetch["productImages"]);
				$productObject = (object) ['productId' => (int)$sql_products_res_fetch["productId"], 
										   'productCode' => $sql_products_res_fetch["productCode"],
										   'productTitle' => ucfirst($sql_products_res_fetch["productTitle"]),
										   'productImage' => $productImageArr[0],
										   'productSlug' => $sql_products_res_fetch["productSlug"],
										   'metaKeyWords' => $sql_products_res_fetch["metaKeyWords"],
										   'brandId' => (int)$sql_products_res_fetch["brandId"],
										   'createdDate' => $sql_products_res_fetch["createdDate"],
										   'lastModifiedDate' => $sql_products_res_fetch["lastModifiedDate"],
										   'minStockVol' => (int)$sql_products_res_fetch["minStockVol"],
										   'categoryIds' => $sql_products_res_fetch["categoryIds"],
										   'productStock' => (int)$sql_products_res_fetch["productStock"],
										   'productCombinations' => (int)$sql_products_res_fetch["productCombinations"],
										   'productOffer' => (int)$sql_products_res_fetch["productOffer"]
									      ];
				//echo json_encode($productObject);exit;
				$productObjectArray[] = $productObject;
			}
			echo json_encode($productObjectArray);exit;
			/*-------------------------------Populate Overall Product Data-----------------------------------*/
			break;
		}
		
		case "PRODUCTLIVESTOCK":{
			/*-------------------------------Populate Overall Product Live Stock Data-----------------------*/
			$sql_productLiveStock = "SELECT `product`.`productId`,
			`product`.`productTitle`,
			`product`.`productCode`,
			`productCombination`.`productCombinationId`,
			`productCombination`.`QRText`,
			`productCombination`.`systemReference`,
			`productCombination`.`PPrice`,
			`productCombination`.`RPrice`,
			`productOffer`.`RofferPercentage`,
			`productCombination`.`WPrice`,
			`productOffer`.`WofferPercentage`
			FROM `productCombination` 
			INNER JOIN `product`
			ON `product`.`productId` = `productCombination`.`productId`
			LEFT JOIN `productOffer`
			ON (`productOffer`.`productCombinationId` = `productCombination`.`productCombinationId` AND `productOffer`.`status` = 1)
			WHERE `product`.`Status` = 1";
			//echo $sql_productLiveStock; exit;
			$sql_productLiveStock_res = mysqli_query($dbConn, $sql_productLiveStock);
			$productLiveStockObjectArray = array();
			while($sql_productLiveStock_res_fetch = mysqli_fetch_array($sql_productLiveStock_res)){
				$productLiveStockObject = (object) ['productId' => (int)$sql_productLiveStock_res_fetch["productId"], 
													'productTitle' => $sql_productLiveStock_res_fetch["productTitle"], 
													'productCode' => $sql_productLiveStock_res_fetch["productCode"], 
													'productCombinationId' => (int)$sql_productLiveStock_res_fetch["productCombinationId"],
													'productCombinationQR' => $sql_productLiveStock_res_fetch["QRText"],
													'systemReference' => $sql_productLiveStock_res_fetch["systemReference"],
													'PPrice' => (float)$sql_productLiveStock_res_fetch["PPrice"],
													'RPrice' => (float)$sql_productLiveStock_res_fetch["RPrice"],
													'RofferPercentage' => (float)$sql_productLiveStock_res_fetch["RofferPercentage"],
													'WPrice' => (float)$sql_productLiveStock_res_fetch["WPrice"],
													'WofferPercentage' => (float)$sql_productLiveStock_res_fetch["WofferPercentage"]
													];
				//echo json_encode($productLiveStockObject);exit;
				$productLiveStockObjectArray[] = $productLiveStockObject;
			}
			echo json_encode($productLiveStockObjectArray);exit;
			/*-------------------------------Populate Overall Product Live Stock Data-----------------------*/
			break;
		}
		
		case "STOCKSTORAGE":{
			/*-------------------------------Populate Overall Stock Storage Data----------------------------*/
			$sql_StockStorage = "SELECT `storageId`,`storageName`,`parentId` FROM `productStockStorage` WHERE 1";
			//echo $sql_StockStorage; exit;
			$sql_StockStorage_res = mysqli_query($dbConn, $sql_StockStorage);
			$stockStorageObjectArray = array();
			while($sql_StockStorage_res_fetch = mysqli_fetch_array($sql_StockStorage_res)){
				$stockStorageObject = (object) ['storageId' => $sql_StockStorage_res_fetch["storageId"], 
												'storageName' => ucfirst($sql_StockStorage_res_fetch["storageName"]),
												'parentId' => $sql_StockStorage_res_fetch["parentId"]];
				//echo json_encode($stockStorageObject);exit;
				$stockStorageObjectArray[] = $stockStorageObject;
			}
			echo json_encode($stockStorageObjectArray);exit;
			/*-------------------------------Populate Overall Stock Storage Data----------------------------*/
			break;
		}
		
		case "LANGUAGE":{
			/*-------------------------------Populate Language Data----------------------------*/
			$sql_lang = "SELECT `langId`,`language`,`sign`,`isDefault` FROM `language` WHERE 1";
			//echo $sql_lang; exit;
			$sql_lang_res = mysqli_query($dbConn, $sql_lang);
			$langObjectArray = array();
			while($sql_lang_res_fetch = mysqli_fetch_array($sql_lang_res)){
				$langObject = (object) ['langId' => $sql_lang_res_fetch["langId"], 
												'language' => $sql_lang_res_fetch["language"],
												'sign' => $sql_lang_res_fetch["sign"],
												'isDefault' => (int)$sql_lang_res_fetch["isDefault"]];
				//echo json_encode($langObject);exit;
				$langObjectArray[] = $langObject;
			}
			echo json_encode($langObjectArray);exit;
			/*-------------------------------Populate Language Data----------------------------*/
			break;
		}
		
		case "COUNTRY":{
			/*-------------------------------Populate Country Data----------------------------*/
			$sql_country = "SELECT `countryId`,`country`,`countryCode`,`telePhoneExt`,`isDefault` FROM `country` WHERE 1";
			//echo $sql_country; exit;
			$sql_country_res = mysqli_query($dbConn, $sql_country);
			$countryObjectArray = array();
			while($sql_country_res_fetch = mysqli_fetch_array($sql_country_res)){
				$countryObject = (object) ['countryId' => (int)$sql_country_res_fetch["countryId"], 
										   'country' => $sql_country_res_fetch["country"],
										   'countryCode' => $sql_country_res_fetch["countryCode"],
										   'telePhoneExt' => $sql_country_res_fetch["telePhoneExt"],
										   'isDefault' => (int)$sql_country_res_fetch["isDefault"]];
				//echo json_encode($countryObject);exit;
				$countryObjectArray[] = $countryObject;
			}
			echo json_encode($countryObjectArray);exit;
			/*-------------------------------Populate Country Data----------------------------*/
			break;
		}
		
		case "COMPANYTYPE":{
			/*-------------------------------Populate Company Type Data----------------------------*/
			$sql_companyType = "SELECT `companyTypeId`,`companyType` FROM `companyType` WHERE 1";
			//echo $sql_companyType; exit;
			$sql_companyType_res = mysqli_query($dbConn, $sql_companyType);
			$companyTypeObjectArray = array();
			while($sql_companyType_res_fetch = mysqli_fetch_array($sql_companyType_res)){
				$companyTypeObject = (object) ['companyTypeId' => (int)$sql_companyType_res_fetch["companyTypeId"], 
										       'companyType' => $sql_companyType_res_fetch["companyType"]];
				//echo json_encode($companyTypeObject);exit;
				$companyTypeObjectArray[] = $companyTypeObject;
			}
			echo json_encode($companyTypeObjectArray);exit;
			/*-------------------------------Populate Company Type Data----------------------------*/
			break;
		}
		
		case "ORDERSALESTATUS":{
			/*-------------------------------Populate Order Sale Status Data-----------------------*/
			$sql_orderSaleStatus = "SELECT * FROM `orderSaleStatus` WHERE 1";
			//echo $sql_orderSaleStatus; exit;
			$sql_orderSaleStatus_res = mysqli_query($dbConn, $sql_orderSaleStatus);
			$orderSaleStatusObjectArray = array();
			while($sql_orderSaleStatus_res_fetch = mysqli_fetch_array($sql_orderSaleStatus_res)){
				$orderSaleStatusObject = (object) ['orderStatusId' => (int)$sql_orderSaleStatus_res_fetch["orderStatusId"], 
										       'orderStatus' => $sql_orderSaleStatus_res_fetch["orderStatus"],
											   'orderStatusCmsId' => $sql_orderSaleStatus_res_fetch["orderStatusCmsId"],
											   'redirectionOrderStatusIds' => $sql_orderSaleStatus_res_fetch["redirectionOrderStatusIds"],
											   'color' => $sql_orderSaleStatus_res_fetch["color"]
											   ];
				//echo json_encode($orderSaleStatusObject);exit;
				$orderSaleStatusObjectArray[] = $orderSaleStatusObject;
			}
			echo json_encode($orderSaleStatusObjectArray);exit;
			/*-------------------------------Populate Order Sale Status Data-----------------------*/
			break;
		}
		
		case "CUSTOMERGRADE":{
			/*-------------------------------Populate Customer Grade Data--------------------------*/
			echo json_encode(CUSTOMERGRADE);
			/*-------------------------------Populate Customer Grade Data--------------------------*/
			break;
		}
		
		case "ORDERPURCHASESTATUS":{
			/*-------------------------------Populate Order Purchase Status Data-------------------*/
			$sql_orderPurchaseStatus = "SELECT * FROM `orderPurchaseStatus` WHERE 1";
			//echo $sql_orderPurchaseStatus; exit;
			$sql_orderPurchaseStatus_res = mysqli_query($dbConn, $sql_orderPurchaseStatus);
			$orderPurchaseStatusObjectArray = array();
			while($sql_orderPurchaseStatus_res_fetch = mysqli_fetch_array($sql_orderPurchaseStatus_res)){
				$orderPurchaseStatusObject = (object) ['purchaseOrderStatusId' => (int)$sql_orderPurchaseStatus_res_fetch["purchaseOrderStatusId"], 
												   'purchaseOrderStatus' => $sql_orderPurchaseStatus_res_fetch["purchaseOrderStatus"],
											       'purchaseOrderStatusCmsId' => $sql_orderPurchaseStatus_res_fetch["purchaseOrderStatusCmsId"],
											       'redirectionPurchaseOrderStatusIds' => $sql_orderPurchaseStatus_res_fetch["redirectionPurchaseOrderStatusIds"],
											       'color' => $sql_orderPurchaseStatus_res_fetch["color"]
											   ];
				//echo json_encode($orderPurchaseStatusObject);exit;
				$orderPurchaseStatusObjectArray[] = $orderPurchaseStatusObject;
			}
			echo json_encode($orderPurchaseStatusObjectArray);exit;
			/*-------------------------------Populate Order Purchase Status Data-------------------*/
			break;
		}
		
		case "PACKAGE":{
			/*-------------------------------Populate Package Data--------------------------------*/
			$sql_package = "SELECT `packetId`,`packetName`,`packetNumber`,`dimention` FROM `packet` WHERE 1";
			//echo $sql_package; exit;
			$sql_package_res = mysqli_query($dbConn, $sql_package);
			$packageObjectArray = array();
			while($sql_package_res_fetch = mysqli_fetch_array($sql_package_res)){
				$packageObject = (object) [
											'packetId' => (int)$sql_package_res_fetch["packetId"], 
											'packetName' => $sql_package_res_fetch["packetName"],
											'packetNumber' => (int)$sql_package_res_fetch["packetNumber"],
											'dimention' => json_decode($sql_package_res_fetch["dimention"])
											];
				//echo json_encode($packageObject);exit;
				$packageObjectArray[] = $packageObject;
			}
			echo json_encode($packageObjectArray);exit;
			/*-------------------------------Populate Package Data--------------------------------*/
			break;
		}
		
		case "EXPENSETYPE":{
			/*-------------------------------Populate Expense Type--------------------------------*/
			$sql_expenseType = "SELECT `expenseTypeId`,`expenseTypeTitle` FROM `expenseType` WHERE 1";
			//echo $sql_expenseType; exit;
			$sql_expenseType_res = mysqli_query($dbConn, $sql_expenseType);
			$expenseTypeObjectArray = array();
			while($sql_expenseType_res_fetch = mysqli_fetch_array($sql_expenseType_res)){
				$expenseTypeObject = (object) [
											'expenseTypeId' => (int)$sql_expenseType_res_fetch["expenseTypeId"], 
											'expenseTypeTitle' => $sql_expenseType_res_fetch["expenseTypeTitle"]
										  ];
				//echo json_encode($expenseTypeObject);exit;
				$expenseTypeObjectArray[] = $expenseTypeObject;
			}
			echo json_encode($expenseTypeObjectArray);exit;
			/*-------------------------------Populate Expense Type--------------------------------*/
			break;
		}
		
		case "EARNINGTYPE":{
			/*-------------------------------Populate Earning Type--------------------------------*/
			$sql_earningType = "SELECT `earningTypeId`,`earningTypeTitle` FROM `earningType` WHERE 1";
			//echo $sql_earningType; exit;
			$sql_earningType_res = mysqli_query($dbConn, $sql_earningType);
			$earningTypeObjectArray = array();
			while($sql_earningType_res_fetch = mysqli_fetch_array($sql_earningType_res)){
				$earningTypeObject = (object) [
											'earningTypeId' => (int)$sql_earningType_res_fetch["earningTypeId"], 
											'earningTypeTitle' => $sql_earningType_res_fetch["earningTypeTitle"]
										  ];
				//echo json_encode($earningTypeObject);exit;
				$earningTypeObjectArray[] = $earningTypeObject;
			}
			echo json_encode($earningTypeObjectArray);exit;
			/*-------------------------------Populate Earning Type--------------------------------*/
			break;
		}
		
		case "LIVETIME":{
			/*-------------------------------Populate Live Time Data-------------------------------*/
			$sql_liveTime = "SELECT * FROM `liveTime` WHERE 1";
			//echo $sql_liveTime; exit;
			$sql_liveTime_res = mysqli_query($dbConn, $sql_liveTime);
			$liveTimeObjectArray = array();
			while($sql_liveTime_res_fetch = mysqli_fetch_array($sql_liveTime_res)){
				$liveTimeObject = (object) [
											'liveTimeId' => (int)$sql_liveTime_res_fetch["liveTimeId"], 
											'objectName' => $sql_liveTime_res_fetch["objectName"],
											'objectId' => $sql_liveTime_res_fetch["objectId"],
											'lastUpdatedTime' => $sql_liveTime_res_fetch["lastUpdatedTime"]
											];
				//echo json_encode($liveTimeObject);exit;
				$liveTimeObjectArray[] = $liveTimeObject;
			}
			echo json_encode($liveTimeObjectArray);exit;
			/*-------------------------------Populate Live Time Data-------------------------------*/
			break;
		}

		default:{
			echo "Type is missed for pre-compiled data population";
		}
	}
}

function readPreCompliedData($type){
	switch ($type) {

		case "PRODUCTDESCTIONHELPER":{
			return file_get_contents($_SERVER['DOCUMENT_ROOT']."/api/preCompiledData/productDescriptionHelper.json");
			break;
		}
		
		case "PROJECTINFORMATION":{
			return file_get_contents($_SERVER['DOCUMENT_ROOT']."/api/preCompiledData/projectInformations.json");
			break;
		}
		
		case "TNC":{
			return file_get_contents($_SERVER['DOCUMENT_ROOT']."/api/preCompiledData/tnc.json");
			break;
		}
		
		default:{
			echo "Type is missed to read pre-compiled data";
		}
	}
}

function overWritePreCompileData($type, $data) {
    switch ($type) {
		
        case "PROJECTINFORMATION": {
            array_walk_recursive($data, function(&$value) {
                if (is_string($value)) {
                    if (!mb_check_encoding($value, 'UTF-8')) {
                        $value = mb_convert_encoding($value, 'UTF-8');
                    }
                }
            });
            try {
                $jsonData = json_encode($data, 
                    JSON_UNESCAPED_UNICODE | 
                    JSON_THROW_ON_ERROR
                );
                $filePath = "../api/preCompiledData/projectInformations.json";
                if (!file_exists(dirname($filePath))) {
                    mkdir(dirname($filePath), 0755, true);
                }
                $result = file_put_contents($filePath, $jsonData);
                if ($result === false) {
                    throw new RuntimeException("Failed to write to file");
                }
            } catch (JsonException $e) {
                error_log("JSON Encoding Error: " . $e->getMessage());
                die("Error encoding JSON data: " . $e->getMessage());
            } catch (Exception $e) {
                error_log("File Error: " . $e->getMessage());
                die("Error saving file: " . $e->getMessage());
            }
            break;
        }
        
        default: {
            echo "Type is missed to read pre-compiled data";
        }
    }
}

function populateProductPreCompiledData($dbConn, $productId){
	/*-------------------------------Populate Perticuler Product Combination Data-----------------------*/
	$productCombinations = array();
	$sql_productCombination = "SELECT `productCombination`.`productCombinationId`,
	`productCombination`.`QRText`,
	`productCombination`.`systemReference`,
	`productCombination`.`featureCombination`,
	`productCombination`.`RPrice`,
	`productCombination`.`WPrice`,
	`productCombination`.`PPrice`,
	`productCombination`.`images`,
	(	SELECT COUNT(`productStock`.`productCombinationId`) 
		FROM `productStock` 
		WHERE `productStock`.`productCombinationId` = `productCombination`.`productCombinationId`
		AND `productStock`.`status` = 1
	) AS 'stockVolumn'
	FROM `productCombination` 
	WHERE `productCombination`.`productId` = ".$productId;
	//echo $sql_productCombination; exit;
	$sql_productCombination_res = mysqli_query($dbConn, $sql_productCombination);
	while($sql_productCombination_res_fetch = mysqli_fetch_array($sql_productCombination_res)){
		$featureCombinationArray = json_decode($sql_productCombination_res_fetch["featureCombination"]);
		$productCombinationObject = (object) ['productCombinationId' => (int)$sql_productCombination_res_fetch["productCombinationId"],
											  'QRText' => $sql_productCombination_res_fetch["QRText"],
											  'systemReference' => $sql_productCombination_res_fetch["systemReference"],
											  'featureCombination' => $featureCombinationArray,
											  'RPrice' => (double)$sql_productCombination_res_fetch["RPrice"],
											  'WPrice' => (double)$sql_productCombination_res_fetch["WPrice"],
											  'PPrice' => (double)$sql_productCombination_res_fetch["PPrice"],
											  'images' => $sql_productCombination_res_fetch["images"],
											  'stockVolumn' => (int)$sql_productCombination_res_fetch["stockVolumn"],
											  'offers' => getProductCombinationOffers($dbConn, (int)$productId, (int)$sql_productCombination_res_fetch["productCombinationId"])
									    ];
		//echo json_encode($productCombinationObject);exit;
		$productCombinationArray[] = $productCombinationObject;
	}
	if(!isset($productCombinationArray)){
		$productCombinations = null;
	}else{
		$productCombinations = $productCombinationArray;
	}
	//echo json_encode($productCombinations);exit;
	/*-------------------------------Populate Perticuler Product Combination Data-----------------------*/
	
	/*-------------------------------Populate Perticuler Product Data-----------------------------------*/
	$sql_product = "SELECT
	`product`.`productCode`,
	`product`.`productTitle`,
	`product`.`productFeature`,
	`product`.`productDesc`,
	`product`.`productImages`,
	`product`.`productSlug`,
	`product`.`metaKeyWords`,
	`product`.`metaDesc`,
	`product`.`brandId`, 
	`product`.`suppliers`,
	`product`.`createdDate`,
	`product`.`lastModifiedDate`,
	`product`.`minStockVol`,
	`product`.`additionalInformation`,
	`product`.`Status`,
	GROUP_CONCAT(`productCategory`.`categoryId`) AS 'categoryIds'
	FROM `product` 
	INNER JOIN `productCategory`
	ON `productCategory`.`productId` = `product`.`productId`
	WHERE `product`.`productId` = ".$productId."
	GROUP BY `product`.`productId`";
	//echo $sql_product; exit;
	$sql_product_res = mysqli_query($dbConn, $sql_product);
	$sql_product_res_fetch = mysqli_fetch_array($sql_product_res);
	$productObject = (object) ['productId' => $productId, 
								'productCode' => $sql_product_res_fetch["productCode"],
								'productTitle' => ucfirst($sql_product_res_fetch["productTitle"]),
								'productFeature' => json_decode($sql_product_res_fetch["productFeature"]),
								'productCombinations' => $productCombinations,
								'productDesc' => $sql_product_res_fetch["productDesc"],
								'productImages' => $sql_product_res_fetch["productImages"],
								'productSlug' => $sql_product_res_fetch["productSlug"],
								'metaKeyWords' => $sql_product_res_fetch["metaKeyWords"],
								'metaDesc' => $sql_product_res_fetch["metaDesc"],
								'brandId' => $sql_product_res_fetch["brandId"],
								'suppliers' => $sql_product_res_fetch["suppliers"],
								'createdDate' => $sql_product_res_fetch["createdDate"],
								'lastModifiedDate' => $sql_product_res_fetch["lastModifiedDate"],
								'minStockVol' => (int)$sql_product_res_fetch["minStockVol"],
								'additionalInformation' => json_decode($sql_product_res_fetch["additionalInformation"]),
								'categoryIds' => $sql_product_res_fetch["categoryIds"],
								'status' => (int)$sql_product_res_fetch["Status"]
							];
	//echo json_encode($productObject);exit;
	/*-------------------------------Populate Perticuler Product Data-----------------------------------*/
	$productFile = fopen("../api/preCompiledData/products/".$sql_product_res_fetch["productCode"].".json", "w") or die("Unable to open Product file!");
	fwrite($productFile, json_encode($productObject));
	fclose($productFile);
}

function getProductCombinationOffers($dbConn, $productId, $productCombinationId){
	/*-------------------------------Populate Perticuler Product Offer Data-----------------------------*/
	$productOffers = array();
	$sql_productOffer = "SELECT 
	`productOffer`.`offerId`,
	`productOffer`.`RofferPercentage`,
	`productOffer`.`RofferStartDate`,
	`productOffer`.`RofferEndDate`,
	`productOffer`.`WofferPercentage`,
	`productOffer`.`WofferStartDate`,
	`productOffer`.`WofferEndDate` 
	FROM `productOffer` 
	WHERE `productOffer`.`productId` = ".$productId."
	AND `productOffer`.`productCombinationId` = ".$productCombinationId."
	AND `productOffer`.`status` = 1";
	//echo $sql_productOffer; exit;
	$sql_productOffer_res = mysqli_query($dbConn, $sql_productOffer);
	while($sql_productOffer_res_fetch = mysqli_fetch_array($sql_productOffer_res)){
		$productOfferObject = (object) ['offerId' => (int)$sql_productOffer_res_fetch["offerId"],
										'RofferPercentage' => (double)$sql_productOffer_res_fetch["RofferPercentage"],
										'RofferStartDate' => $sql_productOffer_res_fetch["RofferStartDate"],
										'RofferEndDate' => $sql_productOffer_res_fetch["RofferEndDate"],
										'WofferPercentage' => (double)$sql_productOffer_res_fetch["WofferPercentage"],
										'WofferStartDate' => $sql_productOffer_res_fetch["WofferStartDate"],
										'WofferEndDate' => $sql_productOffer_res_fetch["WofferEndDate"]
									   ];
		//echo json_encode($productOfferObject);exit;
	}
	if(!isset($productOfferObject)){
		$productOffers = null;
	}else{
		$productOffers = $productOfferObject;
	}
	//echo json_encode($productOffers);exit;
	/*-------------------------------Populate Perticuler Product Offer Data-----------------------------*/
	return $productOffers;
}

function readProductPreCompiledData($productCode){
	return file_get_contents("../api/preCompiledData/products/".$productCode.".json"); 
}

function populateCmsData($dbConn, $section, $page){
	try{
		$dynamicLangs = "";
		$sql_lang = "SELECT `sign` FROM `language` WHERE 1";
		//echo $sql_lang; exit;
		$sql_lang_res = mysqli_query($dbConn, $sql_lang);
		while($sql_lang_res_fetch = mysqli_fetch_array($sql_lang_res)){
			$dynamicLangs = $dynamicLangs."`content_".$sql_lang_res_fetch["sign"]."`,";
		}
		$dynamicLangs = rtrim($dynamicLangs, ",");
			
		$sql_cms_content = "SELECT `cmsId`,".$dynamicLangs." FROM `cms` WHERE `section` = '".$section."' AND `page` = '".$page."'";
		//echo $sql_cms_content; exit;
		$sql_cms_content_res = mysqli_query($dbConn, $sql_cms_content);
		while($sql_cms_content_res_fetch = mysqli_fetch_array($sql_cms_content_res)){
			$cms_content_res_keys = array_keys($sql_cms_content_res_fetch);
			//print_r($cms_content_res_keys);exit;
			$cmsObject = (object) ['cmsId' => (int)$sql_cms_content_res_fetch["cmsId"]];
			for($i = 3; $i < count($cms_content_res_keys); $i++){
				if ($i % 2 != 0) {
					$dynamicAttributeName = $cms_content_res_keys[$i];
					$cmsObject->$dynamicAttributeName = $sql_cms_content_res_fetch[$dynamicAttributeName];
				}
			}
			//echo json_encode($cmsObject);//exit;
			$cmsArray[] = $cmsObject;
		}
		//print_r($cmsArray);
		//echo json_encode($cmsArray);exit;
		$cmsFile = fopen("../api/preCompiledData/contents/".$section."_".$page.".json", "w") or die("Unable to open CMS file!");
		fwrite($cmsFile, json_encode($cmsArray));
		fclose($cmsFile);
	}catch(ex){
		echo "Error : ".ex;
	}
}

function readPreCompiledCmsData($section, $page){
	if($page == "COMMON"){
		return file_get_contents($_SERVER['DOCUMENT_ROOT']."/api/preCompiledData/contents/".$section."_COMMON.json"); 
	}else{
		$target_file = $_SERVER['DOCUMENT_ROOT']."/api/preCompiledData/contents/".$section."_".$page.".json";
		$common_file = $_SERVER['DOCUMENT_ROOT']."/api/preCompiledData/contents/".$section."_COMMON.json";
		if(file_exists($target_file) && file_exists($common_file)){
			$targetJson = json_decode(file_get_contents($target_file));
			$commonJson = json_decode(file_get_contents($common_file));
			if (json_last_error() !== JSON_ERROR_NONE) {
				die("Error decoding JSON file 1: " . json_last_error_msg());
			}
			
			// Merge the two arrays
			$mergedArray = array_merge_recursive($commonJson, $targetJson);

			// Optionally, encode the merged array back to JSON
			return json_encode($mergedArray);
		}else if(file_exists($target_file) && !file_exists($common_file)){
			$targetJson = json_decode(file_get_contents($target_file));
			if (json_last_error() !== JSON_ERROR_NONE) {
				die("Error decoding JSON file 1: " . json_last_error_msg());
			}
			return json_encode($targetJson);
		}
	}
}

function updateLiveTime($dbConn, $type){
	$sql_liveTime = "UPDATE `liveTime` SET `lastUpdatedTime` = NOW() WHERE `liveTime`.`objectName` = '".$type."'";
	//echo $sql_liveTime; exit;
	$sql_liveTime_res = mysqli_query($dbConn, $sql_liveTime);
}
/*----------------------------------------------preCompiled Data---------------------------------------------*/
?>