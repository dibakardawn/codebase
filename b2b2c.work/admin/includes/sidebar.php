<nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style="z-index:3;width:0px;" id="mySidebar"><br>
  <div class="w3-container w3-row">
    <div class="w3-col s3">
	<?php if(isset($_SESSION['userImage'])){?>
		<img src="<?php echo SITEURL; ?>uploads/userImage/<?php echo $_SESSION['userImage']; ?>" class="w3-circle w3-margin-right" style="width:46px">
	<?php }else{ ?>
      <img src="<?php echo SITEURL; ?>/assets/images/avatar.png" class="w3-circle w3-margin-right" style="width:46px">
	<?php } ?>
    </div>
    <div class="w3-col s9 w3-bar">
      <div><span id="cms_24">Welcome,</span> <?php if(isset($_SESSION['name'])){ echo $_SESSION['name']; } ?></div><br>
      <a href="Settings.php" class="w3-bar-item w3-button"><i class="fa fa-cog"></i></a>
	  <a href="calendar.php" class="w3-bar-item w3-button"><i class="fa fa-calendar"></i></a>
	  <a href="logout.php" class="w3-bar-item w3-button"><i class="fa fa-power-off"></i></a>
    </div>
  </div>
  <hr>
  <div class="w3-container">
    <h5 id="cms_25">Control Panel</h5>
  </div>
  <div class="w3-bar-block">
	<a href="index.php" class="w3-bar-item w3-button w3-padding <?php if($pagename == 'index.php'){?> w3-blue <?php } ?>"><i class="fa fa-home fa-fw"></i>  Dashboard</a>
	<?php 
	for($i = 0; $i < COUNT($permissionPages); $i++){ 
		$menuData = "";
		for($j = 0; $j < COUNT($allPages); $j++){
			if($permissionPages[$i] == $allPages[$j][1]){
				$menuData = $allPages[$j];
			}
		}
		if(@$menuData[4] == 0){
		?>
		<a href="<?php echo $permissionPages[$i]; ?>" class="w3-bar-item w3-button w3-padding <?php if($pagename == $permissionPages[$i]){?> w3-blue <?php } ?>">
			<i class="fa <?php echo @$menuData[3]; ?> fa-fw"></i>  <?php echo @$menuData[2]; ?>
		</a>
		<?php
		}
	}
	$i = 0;
	$j = 0;
	?>
	<a href="logout.php" class="w3-bar-item w3-button w3-padding"><i class="fa fa-power-off fa-fw"></i>  Logout</a>
  </div>
</nav>