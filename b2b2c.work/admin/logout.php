<?php
session_start();
unset($_SESSION['userId']);
unset($_SESSION['name']);
unset($_SESSION['userType']);
unset($_SESSION['userType']);
unset($_SESSION['userImage']);
unset($_SESSION['permissions']);
session_destroy();
header('location:login.php');
?>
