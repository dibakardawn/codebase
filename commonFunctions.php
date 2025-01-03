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

function multiplefileUpload($targetFolder, $fieldName, $allowedExtentions){
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
				$newFileName = uniqid() . '.' . $fileExtension;
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

function makeThumbnail($src, $dest, $desired_width, $desired_height) {
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
/*----------------------------------------------Common Functions---------------------------------------------*/

/*------------extra------------*/
function getOrderStatusTypeId($orderStatusCode){
	$orderStatusTypeId = 99;
	for($i = 0; $i < count(ORDERTYPES); $i++){
		if(ORDERTYPES[$i][0] == $orderStatusCode){
			$orderStatusTypeId = intval(ORDERTYPES[$i][1]);
		}
	}
	return $orderStatusTypeId;
}

function getOrderStatus($orderTypeId){
	$orderType = "";
	for($i = 0; $i < count(ORDERTYPES); $i++){
		if(intval(ORDERTYPES[$i][1]) == intval($orderTypeId)){
			$orderType = ORDERTYPES[$i][0];
		}
	}
	return $orderType;
}

function getInstructionStatusTypeId($instructionStatusCode){
	$instructionStatusTypeId = 99;
	for($i = 0; $i < count(INSTRUCTIONTYPES); $i++){
		if(INSTRUCTIONTYPES[$i][0] == $instructionStatusCode){
			$instructionStatusTypeId = intval(INSTRUCTIONTYPES[$i][1]);
		}
	}
	return $instructionStatusTypeId;
}

function getInstructionStatus($instructionTypeId){
	$instructionType = "";
	for($i = 0; $i < count(INSTRUCTIONTYPES); $i++){
		if(intval(INSTRUCTIONTYPES[$i][1]) == intval($instructionTypeId)){
			$instructionType = INSTRUCTIONTYPES[$i][0];
		}
	}
	return $instructionType;
}

function generateInstructionHTML($dbConn, $instructionId, $template){
	if(isset($_SESSION['userId']) && isset($_SESSION['permissions'])){
		/*---------------------Sql for PDF & Mail Starts---------------------*/
		$sql_instruction = "SELECT 
		`instructionMaster`.`incCode`,
		`instructionMaster`.`GUID`,
		`instructionMaster`.`styleNo`,
		`instructionMaster`.`desc1`,
		`instructionMaster`.`supplierId`,
		`supplier`.`supplierName`,
		`supplier`.`supplierContactPerson`,
		`supplier`.`supplierAddress`,
		`supplier`.`supplierPostCode`,
		`supplier`.`supplierVat`,
		`supplier`.`supplierContactNo`,
		`supplier`.`supplierEmail`,
		`supplier`.`supplierFax`,
		`instructionMaster`.`creationDate`,
		`instructionMaster`.`deliveryDate`,
		`instructionMaster`.`deliveryText`,
		`instructionMaster`.`desc2`,
		`instructionMaster`.`instructionItemObj`,
		`instructionMaster`.`vat`,
		`instructionMaster`.`freight`,
		`instructionMaster`.`tnc`,
		`instructionMaster`.`clauses`,
		`instructionMaster`.`status`
		FROM `instructionMaster` 
		INNER JOIN `supplier`
		ON `instructionMaster`.`supplierId` = `supplier`.`supplierId`
		WHERE `instructionMaster`.`instructionId` = ".$instructionId;
		//echo $sql_instruction; exit;
		$sql_instruction_res = mysqli_query($dbConn, $sql_instruction);
		$sql_instruction_res_fetch = mysqli_fetch_array($sql_instruction_res);
		//print_r($sql_instruction_res_fetch);exit;

		$instructionItemObj = base64_decode($sql_instruction_res_fetch["instructionItemObj"]);
		$instructionItemObj = urldecode($instructionItemObj);
		$instructionItemStruct = json_decode($instructionItemObj);
		//echo '<pre>', var_dump($instructionItemStruct), '</pre>'; exit;
		
		$clauseItemStruct = json_decode($sql_instruction_res_fetch["clauses"]);
		//echo '<pre>', var_dump($clauseItemStruct), '</pre>'; exit;
		/*---------------------Sql for PDF & Mail ends-----------------------*/
		
		$instructionInnerHTML = '<div style="padding: 16px;">';
			$instructionInnerHTML = $instructionInnerHTML.'<div>';
				/*-----------------Instruction upper table information starts--------------*/
				$instructionInnerHTML = $instructionInnerHTML.'<table style="width:100%;">';
					$instructionInnerHTML = $instructionInnerHTML.'<thead>';
						$instructionInnerHTML = $instructionInnerHTML.'<tr>';
							$instructionInnerHTML = $instructionInnerHTML.'<th style="width:55%;">';
								$instructionInnerHTML = $instructionInnerHTML.'<div><img src="'.SITEURL.'assets/images/logo.jpg" alt="logo" style="width: 140px;"></div>';
								$instructionInnerHTML = $instructionInnerHTML.'<div style="font-size:12px;">'.BAARONADDRESS.'<br><br><b>Tel:</b> '.BAARONTEL.'<br><b>Fax:</b> '.BAARONFAX.'<br>'.BAARONUSTID.'&nbsp;'.BAARONUSTEU.'<br>'.BAARONHRB.'<br><b>e-Mail:</b> '.ADMINEMAIL.'<br><b>Website:</b> '.SITEURL.'</div>';
							$instructionInnerHTML = $instructionInnerHTML.'</th>';
							$instructionInnerHTML = $instructionInnerHTML.'<th style="width:45%;">';
								$instructionInnerHTML = $instructionInnerHTML.'<div style="text-align:right;">';
									if($template == "INCDETAILS" || $template == "INCMAIL"){
										$instructionInnerHTML = $instructionInnerHTML.'<a href="'.SITEURL.UPLOADFOLDER.'instruction/'.$sql_instruction_res_fetch["incCode"].'.pdf" target="_blank"><img src="'.SITEURL.'assets/images/report.png" alt="report" style="width: 124px;"></a>';
									}
									$instructionInnerHTML = $instructionInnerHTML.'<img src="'.SITEURL.'uploads/instruction/QRCode/'.$sql_instruction_res_fetch["incCode"].'.png" alt="'.$sql_instruction_res_fetch["incCode"].'" style="width: 124px;">';
								$instructionInnerHTML = $instructionInnerHTML.'</div>';
								$instructionInnerHTML = $instructionInnerHTML.'<p style="font-size:15px;"><b>PURCHASE ORDER</b></p>';
								$instructionInnerHTML = $instructionInnerHTML.'<p style="font-size:12px;"><b>Order No:</b> '.$sql_instruction_res_fetch["incCode"].'<br><b>Style No:</b> '.$sql_instruction_res_fetch["styleNo"].'<br><b>Description:</b> '.$sql_instruction_res_fetch["desc1"].'</p>';
							$instructionInnerHTML = $instructionInnerHTML.'</th>';
						$instructionInnerHTML = $instructionInnerHTML.'</tr>';
					$instructionInnerHTML = $instructionInnerHTML.'</thead>';
				$instructionInnerHTML = $instructionInnerHTML.'</table>';
				/*-----------------Instruction upper table information ends--------------*/
				$instructionInnerHTML = $instructionInnerHTML.'<br><br>';
				/*-----------------Instruction Supplier information starts---------------*/
				$instructionInnerHTML = $instructionInnerHTML.'<table style="width:100%; font-size:11px; border:1px Solid #000;">';
					$instructionInnerHTML = $instructionInnerHTML.'<thead>';
						$instructionInnerHTML = $instructionInnerHTML.'<tr>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:16.66%; border:1px Solid #000; background-color: bisque;"><b>Supplier Name :</b></td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:33.34%; border:1px Solid #000;">'.$sql_instruction_res_fetch["supplierName"].'</td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:16.66%; border:1px Solid #000; background-color: bisque;"><b>Contact Person :</b></td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:33.34%;border:1px Solid #000;">'.$sql_instruction_res_fetch["supplierContactPerson"].'</td>';
						$instructionInnerHTML = $instructionInnerHTML.'</tr>';
						$instructionInnerHTML = $instructionInnerHTML.'<tr>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:16.66%; border:1px Solid #000; background-color: bisque;"><b>Contact No :</b></td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:33.34%; border:1px Solid #000;">'.$sql_instruction_res_fetch["supplierContactNo"].'</td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:16.66%; border:1px Solid #000; background-color: bisque;"><b>Email :</b></td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:33.34%; border:1px Solid #000;">'.$sql_instruction_res_fetch["supplierEmail"].'</td>';
						$instructionInnerHTML = $instructionInnerHTML.'</tr>';
						$instructionInnerHTML = $instructionInnerHTML.'<tr>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:16.66%; border:1px Solid #000; background-color: bisque;"><b>Address :</b></td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:83.33%; border:1px Solid #000;">'.$sql_instruction_res_fetch["supplierAddress"].'</td>';
						$instructionInnerHTML = $instructionInnerHTML.'</tr>';
						$instructionInnerHTML = $instructionInnerHTML.'<tr>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:16.66%; border:1px Solid #000; background-color: bisque;"><b>Post Code :</b></td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:33.34%; border:1px Solid #000;">'.$sql_instruction_res_fetch["supplierPostCode"].'</td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:16.66%; border:1px Solid #000; background-color: bisque;"><b>VAT :</b></td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:33.34%; border:1px Solid #000;">'.$sql_instruction_res_fetch["supplierVat"].'</td>';
						$instructionInnerHTML = $instructionInnerHTML.'</tr>';
						$instructionInnerHTML = $instructionInnerHTML.'<tr>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:16.66%; border:1px Solid #000; background-color: bisque;"><b>FAX :</b></td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:33.34%; border:1px Solid #000;">'.$sql_instruction_res_fetch["supplierFax"].'</td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:16.66%; border:1px Solid #000; background-color: bisque;"><b>Delivery Date :</b></td>';
							$instructionInnerHTML = $instructionInnerHTML.'<td style="width:33.34%; border:1px Solid #000;">'.$sql_instruction_res_fetch["deliveryDate"].' ['.$sql_instruction_res_fetch["deliveryText"].']</td>';
						$instructionInnerHTML = $instructionInnerHTML.'</tr>';
					$instructionInnerHTML = $instructionInnerHTML.'</thead>';
				$instructionInnerHTML = $instructionInnerHTML.'</table>';
				/*-----------------Instruction Supplier information ends-----------------*/
				$instructionInnerHTML = $instructionInnerHTML.'<p style="font-size:12px;">'.$sql_instruction_res_fetch["desc2"]."</p>";
				/*-----------------Instruction Supplier Product information starts-------*/
				$instructionInnerHTML = $instructionInnerHTML.'<table style="width:100%; border: 1px solid black; border-collapse: collapse; font-size:11px;">';
					$instructionInnerHTML = $instructionInnerHTML.'<thead style="background-color: bisque;">';
						$instructionInnerHTML = $instructionInnerHTML.'<tr style="border: 1px solid black;border-collapse: collapse; background-color: bisque;">';
							$instructionInnerHTML = $instructionInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="20%"><b>Art No</b></th>';
							$instructionInnerHTML = $instructionInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="22%"><b>Instruction</b></th>';
							$instructionInnerHTML = $instructionInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="32%"><b>Beschreibung</b></th>';
							$instructionInnerHTML = $instructionInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="6%"><b>Qty</b></th>';
							$instructionInnerHTML = $instructionInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="10%"><b>Preis</b></th>';
							$instructionInnerHTML = $instructionInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="10%"><b>Gesamt</b></th>';
						$instructionInnerHTML = $instructionInnerHTML.'</tr>';
					$instructionInnerHTML = $instructionInnerHTML.'</thead>';
					$instructionInnerHTML = $instructionInnerHTML.'<tbody>';
					$subTotal = 0.00;
					$qtyTotal = 0;
					if($instructionItemStruct != null){
						for($i = 0; $i < count($instructionItemStruct); $i++){
							$instructionInnerHTML = $instructionInnerHTML.'<tr style="border: 1px solid black;border-collapse: collapse;">';
								$instructionInnerHTML = $instructionInnerHTML.'<td style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="20%">';
									$instructionInnerHTML = $instructionInnerHTML.$instructionItemStruct[$i]->productName.' ['.$instructionItemStruct[$i]->productCode.']';
									$instructionInnerHTML = $instructionInnerHTML.'<br>';
									$instructionInnerHTML = $instructionInnerHTML.'<img src="'.PRODUCTIMAGEURL.'QRCode/'.$instructionItemStruct[$i]->productCode.'.png" alt="'.$instructionItemStruct[$i]->productCode.'" width="36px" style="border:4px solid '.$instructionItemStruct[$i]->colorId.';">';
									$instructionInnerHTML = $instructionInnerHTML.'<br>';
									if(isset($instructionItemStruct[$i]->barCode)){
										$instructionInnerHTML = $instructionInnerHTML.'<img src="'.PRODUCTIMAGEURL.'Barcode/'.$instructionItemStruct[$i]->productCode.'/'.$instructionItemStruct[$i]->barCode.'.png" alt="'.$instructionItemStruct[$i]->barCode.'" width="136px">';
									}
								$instructionInnerHTML = $instructionInnerHTML.'</td>';
								$instructionInnerHTML = $instructionInnerHTML.'<td style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="22%">';
									if(isset($instructionItemStruct[$i]->productImage)){
										$instructionInnerHTML = $instructionInnerHTML.'<img src="'.PRODUCTIMAGEURL.$instructionItemStruct[$i]->productImage.'" width="100px">';
									}
									$instructionInnerHTML = $instructionInnerHTML.'<br>';
									$instructionInnerHTML = $instructionInnerHTML.$instructionItemStruct[$i]->instruction;
								$instructionInnerHTML = $instructionInnerHTML.'</td>';
								$instructionInnerHTML = $instructionInnerHTML.'<td style="border: 1px solid black;border-collapse: collapse;" width="32%">'.$instructionItemStruct[$i]->beschreibung.'</td>';
								$instructionInnerHTML = $instructionInnerHTML.'<td style="border: 1px solid black;border-collapse: collapse;" width="6%">'.$instructionItemStruct[$i]->qty.'</td>';
								$instructionInnerHTML = $instructionInnerHTML.'<td style="border: 1px solid black;border-collapse: collapse;" width="10%">€'.$instructionItemStruct[$i]->price.'/-</td>';
								$instructionInnerHTML = $instructionInnerHTML.'<td style="border: 1px solid black;border-collapse: collapse;" width="10%">€'.number_format((floatVal($instructionItemStruct[$i]->price) * intval($instructionItemStruct[$i]->qty)), 2, '.', '').'/-</td>';
								$subTotal = $subTotal + (floatVal($instructionItemStruct[$i]->price) * intval($instructionItemStruct[$i]->qty));
								$qtyTotal = $qtyTotal + intval($instructionItemStruct[$i]->qty);
							$instructionInnerHTML = $instructionInnerHTML.'</tr>';
						}
					}
					$instructionInnerHTML = $instructionInnerHTML.'</tbody>';
				$instructionInnerHTML = $instructionInnerHTML.'</table>';
				/*-----------------Instruction Supplier Product information ends---------*/
				$instructionInnerHTML = $instructionInnerHTML.'<br><br>';
				/*-----------------Instruction Calculation starts------------------------*/
				$instructionInnerHTML = $instructionInnerHTML.'<table style="width:100%; border: 1px solid black; border-collapse: collapse; background-color: #acb3bd;">';
					$instructionInnerHTML = $instructionInnerHTML.'<tr style="border: 1px solid black;border-collapse: collapse;">';
						$instructionInnerHTML = $instructionInnerHTML.'<td style="border: 1px solid black;border-collapse: collapse; font-size:9px;" colspan="3"><b>Delivery Date : '.$sql_instruction_res_fetch["deliveryDate"].' ['.$sql_instruction_res_fetch["deliveryText"].']</b> '.$sql_instruction_res_fetch["tnc"].'</td>';
						$instructionInnerHTML = $instructionInnerHTML.'<td style="border: 1px solid black;border-collapse: collapse;" colspan="3">';
							$instructionInnerHTML = $instructionInnerHTML.'<table style="width:100%;">';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;"><b>GESAMT : </b> </td>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;">€'.number_format(floatVal($subTotal), 2, '.', '').'/-</td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;"><b>VAT : </b></td>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;">'.floatVal($sql_instruction_res_fetch["vat"]).'%</td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;"><b>FREIGHT : </b></td>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;">'.$sql_instruction_res_fetch["freight"].'</td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;"><b>RECHNUNGS BETRAG : </b> </td>';
									$totalAmount = floatVal($subTotal + (($subTotal * floatVal($sql_instruction_res_fetch["vat"]))/100));
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;">€'.number_format($totalAmount, 2, '.', '').'/-</td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;"><b>BETRAG IN WORTEN : </b> </td>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;">'.AmountInWords($totalAmount).'</td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;"><b>TOTAL QUANTITY : </b> </td>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:12px;">'.$qtyTotal.' Items</td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:9px; text-align: center;" colspan="2"><br><br><b>SIGNATURE OF CONFIRMATION OF THE TERMS AND CONDITIONS OF THIS ORDER SUPPLIE : </b><br><br></td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="text-align: center;" colspan="2"><img src="'.SITEURL.'assets/images/barronSign.png" alt="Barron Signature" width="300px" height="200px"></td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:9px; text-align: center;" colspan="2"><b>DATUM: : </b> '.date("Y-m-d").'</td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
								$instructionInnerHTML = $instructionInnerHTML.'<tr>';
									$instructionInnerHTML = $instructionInnerHTML.'<td style="font-size:9px; text-align: center;" colspan="2">Disputes by the Purchaser (Baaron GmbH Nidda) and the Seller shall be determined by court of Frankfurt am Main Germany applying German Laws</td>';
								$instructionInnerHTML = $instructionInnerHTML.'</tr>';
							$instructionInnerHTML = $instructionInnerHTML.'</table>';
						$instructionInnerHTML = $instructionInnerHTML.'</td>';
					$instructionInnerHTML = $instructionInnerHTML.'</tr>';
				$instructionInnerHTML = $instructionInnerHTML.'</table>';
				/*-----------------Instruction Calculation ends--------------------------*/
				$instructionInnerHTML = $instructionInnerHTML.'<br><br>';
				/*-----------------Instruction Extra clauses starts----------------------*/
				$instructionInnerHTML = $instructionInnerHTML.'<table style="width:100%; border: 1px solid black; border-collapse: collapse; font-size:11px;">';
					$instructionInnerHTML = $instructionInnerHTML.'<thead style="background-color: bisque;">';
						$instructionInnerHTML = $instructionInnerHTML.'<tr style="border: 1px solid black;border-collapse: collapse; background-color: bisque;">';
							$instructionInnerHTML = $instructionInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="100%"><b>Clauses</b></th>';
						$instructionInnerHTML = $instructionInnerHTML.'</tr>';
					$instructionInnerHTML = $instructionInnerHTML.'</thead>';
					$instructionInnerHTML = $instructionInnerHTML.'<tbody>';
					if($clauseItemStruct != null){
						for($i = 0; $i < count($clauseItemStruct); $i++){
							$instructionInnerHTML = $instructionInnerHTML.'<tr style="border: 1px solid black;border-collapse: collapse;">';
								$instructionInnerHTML = $instructionInnerHTML.'<td style="border: 1px solid black;border-collapse: collapse;" width="100%">';
									$instructionInnerHTML = $instructionInnerHTML.$clauseItemStruct[$i];
								$instructionInnerHTML = $instructionInnerHTML.'</td>';
							$instructionInnerHTML = $instructionInnerHTML.'</tr>';
						}
					}
					$instructionInnerHTML = $instructionInnerHTML.'</tbody>';
				$instructionInnerHTML = $instructionInnerHTML.'</table>';
				/*-----------------Instruction Extra clauses ends----------------------*/
				
			$instructionInnerHTML = $instructionInnerHTML.'</div>';
		$instructionInnerHTML = $instructionInnerHTML.'</div>';
		//echo $instructionInnerHTML; exit;
		return $instructionInnerHTML;
	}else{
		return "";
	}
}

function generateInvoiceHTML($dbConn, $orderId, $template){
	/*------------------------------------------Sql for PDF--------------------------------*/
	$sql_order_approval = "SELECT 
	`orderMaster`.`orderCode`,
	`orderMaster`.`customerId`,
	`orderMaster`.`deliveryAddressId`,
	`orderMaster`.`deliveryNote`,
	`orderMaster`.`orderItemObj`,
	`orderMaster`.`status`,
	`orderMaster`.`orderDate`,
	`orderMaster`.`deliveryDate`,
	`customer`.`companyName`,
	`customer`.`buyerName`,
	`customer`.`contactPerson`,
	`customer`.`email`
	FROM `orderMaster` 
	INNER JOIN `customer`
	ON `customer`.`customerId` = `orderMaster`.`customerId`
	WHERE `orderMaster`.`orderId` = ".$orderId;
	//echo $sql_order_approval; exit;
	$sql_order_approval_res = mysqli_query($dbConn, $sql_order_approval);
	$sql_order_approval_res_fetch = mysqli_fetch_array($sql_order_approval_res);
	$orderStatus = getOrderStatus($sql_order_approval_res_fetch["status"]);
	$orderDate = $sql_order_approval_res_fetch["orderDate"];
	$deliveryDate = $sql_order_approval_res_fetch["deliveryDate"];
	$orderItemObj = base64_decode($sql_order_approval_res_fetch["orderItemObj"]);
	$orderItemObj = urldecode($orderItemObj);
	$orderItemStruct = json_decode($orderItemObj);
	//echo '<pre>', var_dump($orderItemStruct), '</pre>'; exit;
	
	if(intval($sql_order_approval_res_fetch["customerId"]) > 0){
		$sql1 = "SELECT 
		`customer`.`customerId`,
		`customer`.`companyName`,
		`customer`.`companyType`,
		`companyType`.`companyType` as 'compType',
		`customer`.`buyerName`,
		`customer`.`contactPerson`,
		`customer`.`customerGrade`,
		`customer`.`address`,
		`customer`.`phone`,
		`customer`.`fax`,
		`customer`.`email`,
		`customer`.`mobile`,
		`customer`.`vat`,
		`customer`.`tax`,
		`customer`.`registrationForm`,
		`customer`.`registrationDate`,
		`customer`.`lastLoginDate`,
		`customer`.`status`
		FROM 
		`customer` 
		INNER JOIN `companyType`
		ON `companyType`.`companyTypeId` = `customer`.`companyType`
		WHERE `customer`.`customerId` = ".intval($sql_order_approval_res_fetch["customerId"]);
		//echo $sql1; exit;
		$sql1_res = mysqli_query($dbConn, $sql1);
		$sql1_res_fetch = mysqli_fetch_array($sql1_res);
		
		$sql2 = "SELECT
		`customerDeliveryAddress`.`companyName`,
		`customerDeliveryAddress`.`contactPerson`,
		`customerDeliveryAddress`.`phone`,
		`customerDeliveryAddress`.`email`,
		`customerDeliveryAddress`.`address`,
		`customerDeliveryAddress`.`postCode`,
		`customerDeliveryAddress`.`country`,
		`customerDeliveryAddress`.`town`
		FROM `customerDeliveryAddress`
		WHERE `customerDeliveryAddress`.`customerId` = ".intval($sql_order_approval_res_fetch["customerId"])."
		AND `customerDeliveryAddress`.`deliveryAddressId` = ".intval($sql_order_approval_res_fetch["deliveryAddressId"]);
		//echo $sql2; exit;
		$sql2_res = mysqli_query($dbConn, $sql2);
		$sql2_res_fetch = mysqli_fetch_array($sql2_res);
	}
	/*------------------------------------------Sql for PDF--------------------------------*/
	
	$invoiceInnerHTML = '<div>';
		/*-----------------Invoice upper table information starts--------------*/
		$invoiceInnerHTML = $invoiceInnerHTML.'<div>';
			$invoiceInnerHTML = $invoiceInnerHTML.'<table style="width:100%;">';
				$invoiceInnerHTML = $invoiceInnerHTML.'<thead>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<th style="width:60%; text-align:left;">';
							if($template == "PDF"){
								$invoiceInnerHTML = $invoiceInnerHTML.'<img src="'.SITEURL.'assets/images/logo.jpg" alt="logo" style="width: 164px;">';
							}
							$invoiceInnerHTML = $invoiceInnerHTML.'<div style="font-size:12px;">'.BAARONADDRESS.'<br><b>Tel:</b> '.BAARONTEL.'<br><b>Fax:</b> '.BAARONFAX.'<br>'.BAARONUSTID.'&nbsp;'.BAARONUSTEU.'<br>'.BAARONHRB.'<br><b>e-Mail:</b> '.ADMINEMAIL.'<br><b>Website:</b> '.SITEURL.'</div>';
						$invoiceInnerHTML = $invoiceInnerHTML.'</th>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<th style="width:40%; text-align:right;">';
							if($template == "PDF"){
								$invoiceInnerHTML = $invoiceInnerHTML.'<img src="'.SITEURL.'uploads/invoice/QRCode/'.$sql_order_approval_res_fetch["orderCode"].'.png" alt="'.$sql_order_approval_res_fetch["orderCode"].'" style="width: 164px;">';
							}
							$invoiceInnerHTML = $invoiceInnerHTML.'<div style="font-size:16px;"><b>'.$sql_order_approval_res_fetch["orderCode"].'</b></div>';
							$invoiceInnerHTML = $invoiceInnerHTML.'<div style="font-size:12px;"><b>Order Status:</b>'.$orderStatus.'<br><b>Order Date:</b>'.$orderDate.'<br><b>Delivery Date:</b>'.$deliveryDate.'</div>';
						$invoiceInnerHTML = $invoiceInnerHTML.'</th>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
				$invoiceInnerHTML = $invoiceInnerHTML.'</thead>';
			$invoiceInnerHTML = $invoiceInnerHTML.'</table>';
		$invoiceInnerHTML = $invoiceInnerHTML.'</div>';
		/*-----------------Invoice upper table information ends--------------*/
		/*-----------------Invoice Customer Data-----------------------------*/
		$invoiceInnerHTML = $invoiceInnerHTML.'<div>';
			$invoiceInnerHTML = $invoiceInnerHTML.'<table style="width:100%; border:1px solid black; border-collapse:collapse; font-size:11px;">';
				$invoiceInnerHTML = $invoiceInnerHTML.'<thead>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr style="background-color: bisque;">';
						$invoiceInnerHTML = $invoiceInnerHTML.'<th colspan="3"><b>Customer Information : </b></th>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
				$invoiceInnerHTML = $invoiceInnerHTML.'</thead>';
				$invoiceInnerHTML = $invoiceInnerHTML.'<tbody>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="width:33.33%; border:1px solid #CCC;">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Company Name :</b> '.$sql1_res_fetch["companyName"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="width:33.33%; border:1px solid #CCC;">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Company Type :</b> '.$sql1_res_fetch["compType"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="width:33.33%; border:1px solid #CCC;">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Buyer Name : </b> '.$sql1_res_fetch["buyerName"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="33.33%">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Contact Person :</b> '.$sql1_res_fetch["contactPerson"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="33.33%">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Phone :</b> '.$sql1_res_fetch["phone"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="33.33%">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Fax : </b> '.$sql1_res_fetch["fax"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="33.33%">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Email :</b> '.$sql1_res_fetch["email"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="33.33%">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Mobile :</b> '.$sql1_res_fetch["mobile"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="33.33%">';
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr style="background-color: bisque;">';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="100%" colspan="3">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Billing Address :</b>';
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="100%" colspan="3">';
							$invoiceInnerHTML = $invoiceInnerHTML.' '.$sql1_res_fetch["address"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr style="background-color: bisque;">';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="100%" colspan="3">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Delivery Address :</b>';
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="100%" colspan="3">';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Company Name :</b> '.$sql2_res_fetch["companyName"].' | ';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Contact Person :</b> '.$sql2_res_fetch["contactPerson"].' | ';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Phone :</b> '.$sql2_res_fetch["phone"].' | ';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>e-mail :</b> '.$sql2_res_fetch["email"].' | ';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Address :</b> '.$sql2_res_fetch["address"].' | ';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Post Code :</b> '.$sql2_res_fetch["postCode"].' | ';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Country :</b> '.$sql2_res_fetch["country"].' | ';
							$invoiceInnerHTML = $invoiceInnerHTML.'<b>Town :</b> '.$sql2_res_fetch["town"];
						$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
				$invoiceInnerHTML = $invoiceInnerHTML.'</tbody>';
			$invoiceInnerHTML = $invoiceInnerHTML.'</table>';
		$invoiceInnerHTML = $invoiceInnerHTML.'</div>';
		/*-----------------Invoice Customer Data-----------------------------*/
		$productWiseTotal = 0.00;
		$totalPrice = 0.00;
		$totalPriceWithTax = 0.00;
		/*-----------------Invoice inner table starts-----------------------*/
		$invoiceInnerHTML = $invoiceInnerHTML.'<div style="font-size:11px;">';
			$invoiceInnerHTML = $invoiceInnerHTML.'<table style="width:100%;border: 1px solid black;border-collapse: collapse;">';
				$invoiceInnerHTML = $invoiceInnerHTML.'<thead style="background-color: bisque;">';
					$invoiceInnerHTML = $invoiceInnerHTML.'<tr style="border: 1px solid black;border-collapse: collapse; background-color: bisque;">';
						$invoiceInnerHTML = $invoiceInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="50%">Product</th>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="40%">Order</th>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<th style="border: 1px solid black;border-collapse: collapse; text-align: center;" width="10%">Price</th>';
					$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
				$invoiceInnerHTML = $invoiceInnerHTML.'</thead>';
				$invoiceInnerHTML = $invoiceInnerHTML.'<tbody>';
					for($i = 0; $i < count($orderItemStruct); $i++){
						$productCode = 'P'.sprintf("%04d", $orderItemStruct[$i]->productId);
						$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
							$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="50%">';
								$invoiceInnerHTML = $invoiceInnerHTML.'<div>'.$orderItemStruct[$i]->productName.' ['.$orderItemStruct[$i]->productCode.']</div>';
								$invoiceInnerHTML = $invoiceInnerHTML.'<div>';
									$invoiceInnerHTML = $invoiceInnerHTML.'<table>';
										$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
											$invoiceInnerHTML = $invoiceInnerHTML.'<th width="20%"><img src="'.PRODUCTIMAGEURL.'QRCode/'.$orderItemStruct[$i]->productCode.'.png" alt="'.$orderItemStruct[$i]->productCode.'" width="38px" height="38px" style="float:left; border: 6px solid '.$orderItemStruct[$i]->colorId.'; padding: 2px;"/></th>';
											$invoiceInnerHTML = $invoiceInnerHTML.'<th width="40%"><img src="'.PRODUCTIMAGEURL.'Barcode/'.$orderItemStruct[$i]->productCode.'/'.$orderItemStruct[$i]->barCode.'.png" height="50px" style="float:left;" /></th>';
											$invoiceInnerHTML = $invoiceInnerHTML.'<th width="40%"><img src="'.PRODUCTIMAGEURL.$orderItemStruct[$i]->productImage.'" width="100px" height="86px" style="float:left;" /></th>';
										$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
									$invoiceInnerHTML = $invoiceInnerHTML.'</table>';
								$invoiceInnerHTML = $invoiceInnerHTML.'</div>';
							$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
							$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="40%">';
								$invoiceInnerHTML = $invoiceInnerHTML.'<div>Quantity : '.$orderItemStruct[$i]->qty.'</div>';
								$invoiceInnerHTML = $invoiceInnerHTML.'<div>Cartons : '.$orderItemStruct[$i]->cartons.'</div>';
								$invoiceInnerHTML = $invoiceInnerHTML.'<div>Unit Price € : '.$orderItemStruct[$i]->price.'</div>';
							$invoiceInnerHTML = $invoiceInnerHTML.'</td>';
							$productWiseTotal = (($orderItemStruct[$i]->qty + ($orderItemStruct[$i]->cartons * $orderItemStruct[$i]->cartonUnitQuantity)) * $orderItemStruct[$i]->price);
							$invoiceInnerHTML = $invoiceInnerHTML.'<td style="border:1px solid #CCC;" width="10%">€ '.$productWiseTotal.'/-</td>';
						$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
						$totalPrice = $totalPrice + $productWiseTotal;
					}
				$invoiceInnerHTML = $invoiceInnerHTML.'</tbody>';
			$invoiceInnerHTML = $invoiceInnerHTML.'</table>';
			$totalPriceWithTax = ($totalPrice + ($totalPrice * (TAX / 100)));
			$invoiceInnerHTML = $invoiceInnerHTML.'<div><br><b>Total Price : </b> € '.$totalPrice.'/-<br><b>Tax : </b> '.TAX.'%<br><b>Total Price including Tax : </b> € '.$totalPriceWithTax.'/-</div>';
		$invoiceInnerHTML = $invoiceInnerHTML.'</div>';
		/*-----------------Invoice inner table starts-----------------------*/
		
		/*-----------------Invoice footer informations starts---------------*/
		if(file_exists("../".UPLOADFOLDER."customerSignature/CUST-SIGN_".$sql_order_approval_res_fetch["customerId"].".jpeg")){
			$invoiceInnerHTML = $invoiceInnerHTML.'<table style="width:100%">';
				$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
					$invoiceInnerHTML = $invoiceInnerHTML.'<th>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<span style="font-size:11px;">Customer Signature :</span><br>';
						$invoiceInnerHTML = $invoiceInnerHTML.'<img src="'.SITEURL.'uploads/customerSignature/CUST-SIGN_'.$sql_order_approval_res_fetch["customerId"].'.jpeg" alt="'.$sql_order_approval_res_fetch["orderCode"].'-CUSTOMER_SIGN" style="width: 500px;">';
					$invoiceInnerHTML = $invoiceInnerHTML.'</th>';
				$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
			$invoiceInnerHTML = $invoiceInnerHTML.'</table>';
		}
		$invoiceInnerHTML = $invoiceInnerHTML.'<table style="width:100%">';
			$invoiceInnerHTML = $invoiceInnerHTML.'<tr>';
				$invoiceInnerHTML = $invoiceInnerHTML.'<th style="font-size:11px;">'.BAARONINVOICEFOOTERTEXT.'</th>';
			$invoiceInnerHTML = $invoiceInnerHTML.'</tr>';
		$invoiceInnerHTML = $invoiceInnerHTML.'</table>';
		/*-----------------Invoice footer informations ends-----------------*/
		
	$invoiceInnerHTML = $invoiceInnerHTML.'</div>';
	//echo $invoiceInnerHTML; exit;
	return $invoiceInnerHTML;
	/*------------------------------------------Generate PDF Starts--------------------------------------*/
}

function generateInvoiceMailHTML($buyerName, $companyName, $orderCode, $GUID, $totalPrice, $orderDate, $deliveryDate, $format){
	$message = "";
	$message = $message.'<html>';
		$message = $message.'<body>';
			$message = $message.BAARONMAILTEMPLATEHEADER;
			switch ($format) {
				
				case "SYSTEMTOADMIN": //Sending a copy to Admin when customer places an order by himself
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Hi Admin,</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' | <b>Order Date :</b> '.$orderDate.' | <b>Delivery Date :</b> '.$deliveryDate.'</p>';
						$message = $message.'<p style="font-size:12px;">Dear Admin,</p>';
						$message = $message.'<p style="font-size:12px;">'.$buyerName.' ['.$companyName.']  Have placed an order in Baaron GmbH Admin</p>';
						$message = $message.'<p style="font-size:12px;">Please login and see the order : <a href="'.SITEURL.'admin/orders.php" target="_blank">See this Order</a></p>';
						$message = $message.'<p style="font-size:12px;">You can see the Invoice of this order : <a href="'.SITEURL.UPLOADFOLDER.'/invoice/'.$orderCode.'.pdf" target="_blank">See Order Invoice</a></p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
				
				case "SYSTEMTOCUSTOMER": //Sending a copy to customer when customer places an order by himself
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Hi '.$buyerName.' ['.$companyName.'],</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' | <b>Order Date :</b> '.$orderDate.' | <b>Delivery Date :</b> '.$deliveryDate.'</p>';
						$message = $message.'<p style="font-size:12px;">Dear Customer,</p>';
						$message = $message.'<p style="font-size:12px;">You have placed an order in Baaron GmbH.</p>';
						$message = $message.'<p style="font-size:12px;">Please login and see your order : <a href="'.SITEURL.'orderDetails/'.$orderCode.'" target="_blank">See Your Order</a></p>';						
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Admin will approve your order shortly</p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
				
				case "ADMINTOCUSTOMERAPPROVED": //When Order is approved by Admin
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Dear '.$buyerName.' ['.$companyName.'],</p>';
						$message = $message.'<p style="font-size:12px;">Thank you for your order please accept our final confirmation.</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' | <b>Order Date :</b> '.$orderDate.' | <b>Delivery Date :</b> '.$deliveryDate.'</p>';
						$message = $message.'<p style="font-size:12px;">Your order has been approved by Baaron GmbH Admin</p>';
						$message = $message.'<p style="font-size:12px;">You can see the delivery note : <a href="'.SITEURL.'orderDeliveryNote/'.$GUID.'" target="_blank">See Your Delivery Note</a></p>';
						$message = $message.'<p style="font-size:12px;">You can see the Invoice : <a href="'.SITEURL.'orderInvoice/'.$GUID.'" target="_blank">See Your Order Invoice</a></p>';
						$message = $message.'<p style="font-size:12px;">Now please make your payment, in mentioed account</p>';
						$message = $message.'<p style="font-size:12px;"><b>Amount :</b> €'.$totalPrice.'/- <b></p>';
						$message = $message.'<p style="font-size:12px;"><b>Name :</b> '.ACCOUNTNAME.'</p>';
						$message = $message.'<p style="font-size:12px;"><b>Bank Name :</b> '.BANKNAME.'</p>';
						$message = $message.'<p style="font-size:12px;"><b>Account Number :</b> '.BANKACCOUNTNO.'</p>';
						$message = $message.'<p style="font-size:12px;"><b>Sort Code :</b> '.ACCOUNTSORTCODE.'</p>';
						$message = $message.'<p style="font-size:12px;"><b>Reference :</b> '.$orderCode.'</p>';
						$message = $message.'<p style="font-size:12px;">Please use mentioned reference while payment.</p>';
						$message = $message.'<p style="font-size:12px;">After your payment, Please go to the <a href="'.SITEURL.'orderDetails/'.$orderCode.'" target="_blank">ORDER</a> and mark as payment completed</p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
				
				case "PAIDBYCUSTOMER": //When paid by customer notify to admin
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Hi Admin,</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' </p>';
						$message = $message.'<p style="font-size:12px;">Customer has paid for this, please check.</p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
				
				case "SHIPPED": //When initiated shipment by Admin
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Hi '.$buyerName.' ['.$companyName.'],</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' | <b>Order Date :</b> '.$orderDate.' | <b>Delivery Date :</b> '.$deliveryDate.'</p>';
						$message = $message.'<p style="font-size:12px;">Dear Customer,</p>';
						$message = $message.'<p style="font-size:12px;">Shipment for your order has been initiated by Baaron GmbH</p>';
						$message = $message.'<p style="font-size:12px;">Please login and see your order status : <a href="'.SITEURL.'orderDetails/'.$orderCode.'" target="_blank">See Your Order</a></p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
				
				case "PARTALLYDELIVERED": //When partially delivered by Admin
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Hi '.$buyerName.' ['.$companyName.'],</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' | <b>Order Date :</b> '.$orderDate.' | <b>Delivery Date :</b> '.$deliveryDate.'</p>';
						$message = $message.'<p style="font-size:12px;">Dear Customer,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH partially delivered this order '.$orderCode.'</p>';
						$message = $message.'<p style="font-size:12px;">Please login and see your order status : <a href="'.SITEURL.'orderDetails/'.$orderCode.'" target="_blank">See Your Order</a></p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
				
				case "DELIVERED": //When delivered by Admin
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Hi '.$buyerName.' ['.$companyName.'],</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' | <b>Order Date :</b> '.$orderDate.' | <b>Delivery Date :</b> '.$deliveryDate.'</p>';
						$message = $message.'<p style="font-size:12px;">Dear Customer,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH delivered this order '.$orderCode.'</p>';
						$message = $message.'<p style="font-size:12px;">Please login and see your order status in : <a href="'.SITEURL.'orderDetails/'.$orderCode.'" target="_blank">See Your Order</a></p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
				
				case "COMPLETED": //When Completed by Admin
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Hi '.$buyerName.' ['.$companyName.'],</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' | <b>Order Date :</b> '.$orderDate.' | <b>Delivery Date :</b> '.$deliveryDate.'</p>';
						$message = $message.'<p style="font-size:12px;">Dear Customer,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH completed this order '.$orderCode.'</p>';
						$message = $message.'<p style="font-size:12px;">Thank you for maintaining relationship with us</p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
				
				case "CANCELLEDBYCUSTOMERTOCUSTOMER": //When order cancelled by customer and mailing to customer for cancelletion confirmation
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Hi '.$buyerName.' ['.$companyName.'],</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' | <b></p>';
						$message = $message.'<p style="font-size:12px;">Dear Customer,</p>';
						$message = $message.'<p style="font-size:12px;">Your order '.$orderCode.' has been cancelled sucessfully.</p>';
						$message = $message.'<p style="font-size:12px;">Please login and see your order status : <a href="'.SITEURL.'orderDetails/'.$orderCode.'" target="_blank">See Your Order</a></p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
				
				case "CANCELLEDBYCUSTOMERTOADMIN": //When order cancelled by customer and mailing to Admin for cancelletion confirmation
				{
					$message = $message.'<div style="width:100%; float:left;">';
						$message = $message.'<p style="font-size:12px;">Hi Admin,</p>';
						$message = $message.'<p style="font-size:12px;"><b>Order code :</b> '.$orderCode.' | <b></p>';
						$message = $message.'<p style="font-size:12px;">The order '.$orderCode.' has been cancelled by customer.</p>';
						$message = $message.'<p style="font-size:12px;"></p>';
						$message = $message.'<p style="font-size:12px;">Thanks,</p>';
						$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
					$message = $message.'</div>';
					break;
				}
			}
		$message = $message.'</body>';
	$message = $message.'</html>';
	//echo $message;exit;
	return $message;
}

function convertToStock($dbConn, $packingSummeryObj, $instructionId){
	$packingSummeryObjB64 = base64_decode($packingSummeryObj);
	//echo '<pre>', var_dump($packingSummeryObjB64), '</pre>'; exit;
	$packingSummeryObjURLEN = urldecode($packingSummeryObjB64);
	//echo '<pre>', var_dump($packingSummeryObjURLEN), '</pre>'; exit;
	$packingSummeryStruct = json_decode($packingSummeryObjURLEN);
	//echo '<pre>', var_dump($packingSummeryStruct), '</pre>'; exit;
	for($i = 0; $i < count($packingSummeryStruct->cartons); $i++){
		$cartonObj = $packingSummeryStruct->cartons[$i];
		//echo '<pre>', var_dump($cartonObj), '</pre>'; exit;
		for($j = 0; $j < count($cartonObj->insideProductDetails); $j++){
			$insideProductDetailsObj =$cartonObj->insideProductDetails[$j];
			//echo '<pre>', var_dump($insideProductDetailsObj), '</pre>'; exit;
			if((intval($insideProductDetailsObj->convertToStock) == 1) && $insideProductDetailsObj->itemPosition != ""){
				//echo $insideProductDetailsObj->convertToStock; exit;
				$itemQty = intval($insideProductDetailsObj->distributeAmt);
				if(property_exists($insideProductDetailsObj, 'defectiveItems')){
					for($k = 0; $k < count($insideProductDetailsObj->defectiveItems); $k++){
						$itemQty = $itemQty - intval($insideProductDetailsObj->defectiveItems[$k]->noOfDefectiveItem);
					}
				}
				/*echo "itemQty : ".$itemQty."<br>";
				echo "productId : ".intval($insideProductDetailsObj->productId)."<br>";
				echo "barCode : ".intval($insideProductDetailsObj->barCode)."<br>"; exit;*/
				for($l = 0; $l < intval($itemQty); $l++){
					$sql_product_stock = "INSERT INTO `productStock` (
										 `stockId`, 
										 `productId`, 
										 `barCode`, 
										 `QRInfo`,
										 `itemPosition`,
										 `entryDate`, 
										 `dispatchDate`, 
										 `entryReference`, 
										 `dispatchReference`, 
										 `status`) 
										 VALUES (
										 NULL, 
										 '".intval($insideProductDetailsObj->productId)."', 
										 '".intval($insideProductDetailsObj->barCode)."', 
										 '".bin2hex(openssl_random_pseudo_bytes(16))."', 
										 '".$insideProductDetailsObj->itemPosition."', 
										 NOW(), 
										 NULL, 
										 (SELECT `incCode` FROM `instructionMaster` WHERE `instructionId` = ".$instructionId."), 
										 NULL, 
										 '1'
										 )";
					//echo $sql_product_stock; exit;
					$sql_product_stock_res = mysqli_query($dbConn, $sql_product_stock);
				}
				$insideProductDetailsObj->convertToStock = 2;
				/*-------------------------------------------Check if the rack is registered-------------------------*/
				$sql_rack = "SELECT COUNT(`productStockRackId`) AS 'RackId' FROM `productStockRack` WHERE `productStockRackName` = '".$insideProductDetailsObj->itemPosition."'";
				//echo $sql_rack; exit;
				$sql_rack_res = mysqli_query($dbConn, $sql_rack);
				if(mysqli_num_rows($sql_rack_res) == 0){
					$sql_rack_insert = "INSERT INTO `productStockRack` (`productStockRackName`) VALUE ('".$insideProductDetailsObj->itemPosition."')";
					//echo $sql_rack_insert; exit;
					$sql_rack_insert_res = mysqli_query($dbConn, $sql_rack_insert);
				}
				/*-------------------------------------------Check if the rack is registered-------------------------*/
			}
		}
	}
	return base64_encode(urlencode(json_encode($packingSummeryStruct)));
}

function addressFormatter($address){
	$addressArr = explode(",",$address);
	$addressHTML = "";
	for($i = 0; $i < count($addressArr); $i++){
		$addressHTML = $addressHTML.ucfirst($addressArr[$i])."<br>";
	}
	return $addressHTML;
}

function getPageBootstrapIcon($allPages, $pageName){
	$bootstrapIcon = "";
	if(count($allPages) > 0){
		for($i = 0; $i < count($allPages); $i++){
			if($allPages[$i][1] == $pageName){
				$bootstrapIcon = $allPages[$i][3];
			}
		}
	}
	return $bootstrapIcon;
}
/*------------extra------------*/

/*----------------------------------------------Common Mail Functions----------------------------------------*/
function sendMail(){
	
}

function insertMail($dbConn, $toEmail, $fromEmail, $subject, $body, $reference){
	if($toEmail != "" && $fromEmail != "" && $subject != "" && $body != ""){
		$sqlInsertMail = "INSERT INTO `mail` (`mailId`, `toEmail`, `fromEmail`, `subject`, `body`, `reference`, `createdTimeStamp`, `deliveryTimeStamp`, `sent`) 
						  VALUES (NULL, '".$toEmail."', '".$fromEmail."', '".$subject."', '".base64_encode($body)."', '".$reference."', NOW(), NULL, 0)";
		//echo $sqlInsertMail; exit;
		$sqlInsertMail_res = mysqli_query($dbConn, $sqlInsertMail);
	}
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
			while($sql_Brands_res_fetch = mysqli_fetch_array($sql_Brands_res)){
				$productBrandObject = (object) ['brandId' => $sql_Brands_res_fetch["brandId"], 
												'brandName' => ucfirst($sql_Brands_res_fetch["brandName"]),
												'brandImage' => $sql_Brands_res_fetch["brandImage"],
												'products' => $sql_Brands_res_fetch["products"],
												'parentId' => $sql_Brands_res_fetch["parentId"]];
				//echo json_encode($productBrandObject);exit;
				$productBrandObjectArray[] = $productBrandObject;
			}
			//echo json_encode($productBrandObjectArray);exit;
			/*-------------------------------Populate Overall Brand Data-----------------------------------*/
			$brandFile = fopen("../api/preCompiledData/brand.json", "w") or die("Unable to open Brand file!");
			fwrite($brandFile, json_encode($productBrandObjectArray));
			fclose($brandFile);
			//echo "Pre-compiled Brand data populated";
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
			//echo json_encode($catObjectArray);exit;
			/*-------------------------------Populate Overall Category Data-----------------------------------*/
			$categoryFile = fopen("../api/preCompiledData/category.json", "w") or die("Unable to open Category file!");
			fwrite($categoryFile, json_encode($catObjectArray));
			fclose($categoryFile);
			//echo "Pre-compiled Category data populated";
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
			GROUP_CONCAT(`productCategory`.`categoryId`) AS 'categoryIds',
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
			WHERE `product`.`Status` = 1
			GROUP BY `product`.`productId`";
			//echo $sql_products; exit;
			$sql_products_res = mysqli_query($dbConn, $sql_products);
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
			//echo json_encode($productObjectArray);exit;
			/*-------------------------------Populate Overall Product Data-----------------------------------*/
			$productFile = fopen("../api/preCompiledData/product.json", "w") or die("Unable to open Product file!");
			if(isset($productObjectArray)){
				fwrite($productFile, json_encode($productObjectArray));
				fclose($productFile);
				//echo "Pre-compiled Product data populated";
			}
			break;
		}
		
		case "PRODUCTLIVESTOCK":{
			/*-------------------------------Populate Overall Product Live Stock Data-----------------------*/
			$sql_productLiveStock = "SELECT `productId`,`productCombinationId`,`productCombinationQR`,`systemReference` FROM `productStock` WHERE `status` = 1";
			//echo $sql_productLiveStock; exit;
			$sql_productLiveStock_res = mysqli_query($dbConn, $sql_productLiveStock);
			while($sql_productLiveStock_res_fetch = mysqli_fetch_array($sql_productLiveStock_res)){
				$productLiveStockObject = (object) ['productId' => (int)$sql_productLiveStock_res_fetch["productId"], 
													'productCombinationId' => $sql_productLiveStock_res_fetch["productCombinationId"],
													'productCombinationQR' => $sql_productLiveStock_res_fetch["productCombinationQR"],
													'systemReference' => $sql_productLiveStock_res_fetch["systemReference"]
													];
				//echo json_encode($productLiveStockObject);exit;
				$productLiveStockObjectArray[] = $productLiveStockObject;
			}
			//echo json_encode($productLiveStockObjectArray);exit;
			/*-------------------------------Populate Overall Product Live Stock Data-----------------------*/
			$productLiveStockFile = fopen("../api/preCompiledData/productLiveStock.json", "w") or die("Unable to open Product Live Stock file!");
			if(isset($productLiveStockObjectArray)){
				fwrite($productLiveStockFile, json_encode($productLiveStockObjectArray));
				fclose($productLiveStockFile);
				//echo "Pre-compiled Product Live stock data populated";
			}
			break;
		}
		
		case "STOCKSTORAGE":{
			/*-------------------------------Populate Overall Stock Storage Data----------------------------*/
			$sql_StockStorage = "SELECT `storageId`,`storageName`,`parentId` FROM `productStockStorage` WHERE 1";
			//echo $sql_StockStorage; exit;
			$sql_StockStorage_res = mysqli_query($dbConn, $sql_StockStorage);
			while($sql_StockStorage_res_fetch = mysqli_fetch_array($sql_StockStorage_res)){
				$stockStorageObject = (object) ['storageId' => $sql_StockStorage_res_fetch["storageId"], 
												'storageName' => ucfirst($sql_StockStorage_res_fetch["storageName"]),
												'parentId' => $sql_StockStorage_res_fetch["parentId"]];
				//echo json_encode($stockStorageObject);exit;
				$stockStorageObjectArray[] = $stockStorageObject;
			}
			//echo json_encode($stockStorageObjectArray);exit;
			/*-------------------------------Populate Overall Stock Storage Data----------------------------*/
			$stockStorageFile = fopen("../api/preCompiledData/stockStorage.json", "w") or die("Unable to open Stock Storage file!");
			fwrite($stockStorageFile, json_encode($stockStorageObjectArray));
			fclose($stockStorageFile);
			//echo "Pre-compiled Stock Storage data populated";
			break;
		}
		
		case "LANGUAGE":{
			/*-------------------------------Populate Language Data----------------------------*/
			$sql_lang = "SELECT `langId`,`language`,`sign`,`isDefault` FROM `language` WHERE 1";
			//echo $sql_lang; exit;
			$sql_lang_res = mysqli_query($dbConn, $sql_lang);
			while($sql_lang_res_fetch = mysqli_fetch_array($sql_lang_res)){
				$langObject = (object) ['langId' => $sql_lang_res_fetch["langId"], 
												'language' => $sql_lang_res_fetch["language"],
												'sign' => $sql_lang_res_fetch["sign"],
												'isDefault' => (int)$sql_lang_res_fetch["isDefault"]];
				//echo json_encode($langObject);exit;
				$langObjectArray[] = $langObject;
			}
			//echo json_encode($langObjectArray);exit;
			/*-------------------------------Populate Language Data----------------------------*/
			$langFile = fopen("../api/preCompiledData/lang.json", "w") or die("Unable to open Language file!");
			fwrite($langFile, json_encode($langObjectArray));
			fclose($langFile);
			//echo "Pre-compiled language data populated";
			break;
		}
		
		case "COUNTRY":{
			/*-------------------------------Populate Country Data----------------------------*/
			$sql_country = "SELECT `countryId`,`country`,`countryCode`,`telePhoneExt`,`isDefault` FROM `country` WHERE 1";
			//echo $sql_country; exit;
			$sql_country_res = mysqli_query($dbConn, $sql_country);
			while($sql_country_res_fetch = mysqli_fetch_array($sql_country_res)){
				$countryObject = (object) ['countryId' => (int)$sql_country_res_fetch["countryId"], 
										   'country' => $sql_country_res_fetch["country"],
										   'countryCode' => $sql_country_res_fetch["countryCode"],
										   'telePhoneExt' => $sql_country_res_fetch["telePhoneExt"],
										   'isDefault' => (int)$sql_country_res_fetch["isDefault"]];
				//echo json_encode($countryObject);exit;
				$countryObjectArray[] = $countryObject;
			}
			//echo json_encode($countryObjectArray);exit;
			/*-------------------------------Populate Country Data----------------------------*/
			$countryFile = fopen("../api/preCompiledData/country.json", "w") or die("Unable to open Country file!");
			fwrite($countryFile, json_encode($countryObjectArray));
			fclose($countryFile);
			//echo "Pre-compiled Country data populated";
			break;
		}
		
		case "COMPANYTYPE":{
			/*-------------------------------Populate Company Type Data----------------------------*/
			$sql_companyType = "SELECT `companyTypeId`,`companyType` FROM `companyType` WHERE 1";
			//echo $sql_companyType; exit;
			$sql_companyType_res = mysqli_query($dbConn, $sql_companyType);
			while($sql_companyType_res_fetch = mysqli_fetch_array($sql_companyType_res)){
				$companyTypeObject = (object) ['companyTypeId' => (int)$sql_companyType_res_fetch["companyTypeId"], 
										       'companyType' => $sql_companyType_res_fetch["companyType"]];
				//echo json_encode($companyTypeObject);exit;
				$companyTypeObjectArray[] = $companyTypeObject;
			}
			//echo json_encode($companyTypeObjectArray);exit;
			/*-------------------------------Populate Company Type Data----------------------------*/
			$companyTypeFile = fopen("../api/preCompiledData/companyType.json", "w") or die("Unable to open company type file!");
			fwrite($companyTypeFile, json_encode($companyTypeObjectArray));
			fclose($companyTypeFile);
			//echo "Pre-compiled Company Type data populated";
			break;
		}
		
		default:{
			echo "Type is missed for pre-compiled data population";
		}
	}
}

function readPreCompliedData($type){
	switch ($type) {

		case "BRAND":{
			return file_get_contents("../api/preCompiledData/brand.json"); 
			break;
		}
		
		case "CATEGORY":{
			return file_get_contents("../api/preCompiledData/category.json");
			break;
		}
		
		case "PRODUCT":{
			return file_get_contents("../api/preCompiledData/product.json");
			break;
		}
		
		case "PRODUCTLIVESTOCK":{
			return file_get_contents("../api/preCompiledData/productLiveStock.json");
			break;
		}
		
		case "PRODUCTDESCTIONHELPER":{
			return file_get_contents("../api/preCompiledData/productDescriptionHelper.json");
			break;
		}
		
		case "STOCKSTORAGE":{
			return file_get_contents("../api/preCompiledData/stockStorage.json"); 
			break;
		}
		
		case "LANGUAGE":{
			return file_get_contents("../api/preCompiledData/lang.json"); 
			break;
		}
		
		case "COUNTRY":{
			return file_get_contents("../api/preCompiledData/country.json"); 
			break;
		}
		
		case "COMPANYTYPE":{
			return file_get_contents("../api/preCompiledData/companyType.json"); 
			break;
		}
		
		case "CUSTOMERGRADE":{
			return file_get_contents("../api/preCompiledData/customerGrade.json"); 
			break;
		}

		default:{
			echo "Type is missed to read pre-compiled data";
		}
	}
}

function populateProductPreCompiledData($dbConn, $productId){
	/*-------------------------------Populate Perticuler Product Combination Data-----------------------*/
	$productCombinations = array();
	$sql_productCombination = "SELECT `productCombination`.`productCombinationId`,
	`productCombination`.`QRText`,
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
		//echo json_encode($cmsObject);exit;
		$cmsArray[] = $cmsObject;
	}
	//echo json_encode($cmsArray);exit;
	$cmsFile = fopen("../api/preCompiledData/contents/".$section."_".$page.".json", "w") or die("Unable to open CMS file!");
	fwrite($cmsFile, json_encode($cmsArray));
	fclose($cmsFile);
}

function readPreCompiledCmsData($section, $page){
	if($page == "COMMON"){
		return file_get_contents("../api/preCompiledData/contents/".$section."_COMMON.json"); 
	}else{
		$target_file = "../api/preCompiledData/contents/".$section."_".$page.".json";
		$common_file = "../api/preCompiledData/contents/".$section."_COMMON.json";
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
		}
	}
}
/*----------------------------------------------preCompiled Data---------------------------------------------*/
?>