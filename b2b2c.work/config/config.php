<?php
session_start();
ob_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/*----------------------------------------------Connection @educontrol.org------------------------------*/
$dbName = 'b2b2c';
$dbHost = 'localhost';
$dbUser = 'b2b';
$dbPass = 'Z{zTff+jxFFp';

$dbConn = mysqli_connect($dbHost, $dbUser, $dbPass) or die ('MySQL connect failed. ' . mysql_error());
mysqli_select_db($dbConn, $dbName) or die('Cannot select database. ' . mysql_error());
/*----------------------------------------------Connection @educontrol.org------------------------------*/

define('SITEURL','https://b2b2c.work/');
define('SITETITLE', 'B2B2C');
define('SITENAME', 'B2B2C Trading');
define('THEMECOLOR', '#401A00');
define('SITECOMMONKEYWORDS', '#B2B, #Leather Products, #Best in kolkata, #Best in Garmany, #Europe');
define('SITECOMMONDESCRIPTION', 'Armed with innovation, raw materials and skills, B2B believes that success is a joint effort. Success, according to us, is meant to be inclusive and continous effort to server our clients');
define('SITECOMMONIMAGE', SITEURL.'assets/images/logo.jpg');
define('QRURL', SITEURL.'api/qrcode.php?qr=');
define('ADMINEMAIL','dibakardawn@gmail.com ');
define('SYSTEMEMAIL','noreply@b2b2c.com ');
define('UPLOADFOLDER', 'uploads/');
define('ALLOWEDEXTENSIONS', 'jpg,jpeg,png,webp');
define('ALLOWEDSALESSUPPORTINGDOCEXTENSIONS', 'pdf,xls,xlsx,csv,doc,docx,text,png,jpg,jpeg');
define('CUSTREGFORMALLOWEDEXTENSIONS', 'pdf,jpg,jpeg,png');
define('PRODUCTIMAGEURL', SITEURL.'uploads/products/');
define('BRANDIMAGEURL', SITEURL.'uploads/brand/');
define('NOIMAGEFILE', 'noImages.png');
define('INITIALPRODUCTLIMIT', 20);
define('financeCategoryORDS', 4);
define('financeCategoryORDP', 11);
define('PRODUCTSTOCKINDIVIDUALIDENTITY', false);
define('ALFANUMERICREGEX', '/[^A-Za-z0-9 ]/i');
define('NUMERICREGEX', '/[^0-9 ]/i');
define('EMAILREGEX', '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/');
define('DATETIMEREGEX', '/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/');
define('ENCODEDATOBREGEX', '/^[\x20-\x7E]*$/');
define('CUSTOMERGRADE', [
    [
        "customerGradeId" => 1,
        "customerGrade" => "R"
    ],
    [
        "customerGradeId" => 2,
        "customerGrade" => "W"
    ]
]);

// echo $_SERVER['REQUEST_URI'];
// echo $_SERVER['DOCUMENT_ROOT'];
include($_SERVER['DOCUMENT_ROOT'].'/library/commonFunctions.php');
include($_SERVER['DOCUMENT_ROOT'].'/library/commonActivity.php');
?>