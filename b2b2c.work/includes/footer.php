<?php
$sql_lang = "SELECT * FROM `cms` WHERE `section` = 'FRONT'";
//echo $qry; exit;
$qry_res = mysqli_query($dbConn, $sql_lang);
while($qry_res_fetch = mysqli_fetch_array($qry_res)){
	$langObject = (object) ['cmsId' => $qry_res_fetch["cmsId"], 
							'section' => $qry_res_fetch["section"], 
							'page' => $qry_res_fetch["page"], 
							'content_en' => $qry_res_fetch["content_en"],
							'content_gm' => $qry_res_fetch["content_gm"]
							];
	$langObjectArray[] = $langObject;
}
//print_r($langObjectArray);
?>
<input type="hidden" id="langData" name="langData" value="<?php echo str_replace('"', "'", json_encode($langObjectArray)); ?>">
<div id="footer" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
	<footer class="w3-center w3-theme w3-padding-16">
		<p><span id="cms_35">Copyright 2021 | All Rights Reserved by</span> <a href="<?php echo SITEURL; ?>">Baaron</a></p>
	</footer>
</div>