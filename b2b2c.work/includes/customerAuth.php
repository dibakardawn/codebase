<?php
if(isset($_SESSION['customerId'])){
	$str = "<div id='customerAuthHeader' class='col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-right f14 marBot16'>";
		$str = $str."<span id='cms_103' onclick='appCommonFunctionality.customerOrders()' class='blueText hover'>Orders </span> ";
		$str = $str."<span> | </span>";
		$str = $str."<span id='cms_104'> Logged in as </span><span> ".ucfirst($_SESSION['buyerName'])." </span>";
		$str = $str."<span> | </span>";
		$str = $str."<span id='cms_105' onclick='appCommonFunctionality.customerLogout()' class='blueText hover'> Logout</span>";
	$str = $str."</div>";
	echo $str;
}
?>