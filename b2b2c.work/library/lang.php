<?php
$sql_lang = "SELECT * FROM `cms`";
//echo $qry; exit;
$qry_res = mysqli_query($dbConn, $qry);
$str = "";
while($qry_res_fetch = mysqli_fetch_array($qry_res)){
	$str = $str.'{ "cmsId" : '.$qry_res_fetch["cmsId"].', "section" : "'.$qry_res_fetch["section"].'", "page" : '.$qry_res_fetch["page"].', "	content_en" : "'.$qry_res_fetch["content_en"].'", "content_gm" : "'.$qry_res_fetch["content_gm"].'"}';
}
?>
<input type="hidden" id="lang" name="lang" value="<?php echo $str; ?>">