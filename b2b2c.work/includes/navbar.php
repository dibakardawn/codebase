<nav id="navbar" class="navbar navbar-default navbar-fixed-top">
	<div class="container-fluid">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle marLeft5" data-toggle="collapse" data-target="#myNavbar">
				<span class="icon-bar white"></span>
				<span class="icon-bar white"></span>
				<span class="icon-bar white"></span>                        
			</button>
			<a href="<?php echo SITEURL; ?>">
				<img src="<?php echo SITEURL; ?>assets/images/logo.jpg" alt="logo" class="headerLogo hover pull-left">
			</a>
			<a class="navbar-brand white" href="<?php echo SITEURL; ?>">
				<b id="cms_1">BAARON</b> 
				<span id="cms_2">GmbH</span>
			</a>
		</div>
		<div class="collapse navbar-collapse" id="myNavbar">
			<ul class="nav navbar-nav navbar-right">
				<li><a id="cms_4" href="<?php echo SITEURL; ?>" class="white">HOME</a></li>
				<li><a id="cms_5" href="<?php echo SITEURL."products"; ?>" class="white">Our Products</a></li>
				<li class="dropdown">
					<a class="dropdown-toggle white" data-toggle="dropdown" href="#"><span id="cms_422">Categories</span>
					<span class="caret"></span></a>
					<ul class="dropdown-menu navMenuDropDownTransparentBg">
						<li><a id="cms_423" href="<?php echo SITEURL."category"; ?>" class="white">All Categories</a></li>
						<?php
						$sql_category = "SELECT `categoryId`,`category`,`categorySlug` FROM `category` WHERE 1 LIMIT 0,10";
						//echo $sql_category; exit;
						$sql_category_res = mysqli_query($dbConn, $sql_category);
						while($sql_category_res_fetch = mysqli_fetch_array($sql_category_res)){
							?>
							<li>
								<a id="category_<?php echo $sql_category_res_fetch["categoryId"]; ?>" href="<?php echo SITEURL."category/".$sql_category_res_fetch["categorySlug"]; ?>" class="white">
									<?php echo $sql_category_res_fetch["category"]; ?>
								</a>
							</li>
							<?php
						}
						?>
					</ul>
				</li>
				<?php if(!isset($_SESSION['customerId'])){?>
				<li><a id="cms_6" href="<?php echo SITEURL."login"; ?>" class="white">Login</a></li>
				<?php }else{ ?>
				<li class="dropdown">
					<a class="dropdown-toggle white" data-toggle="dropdown" href="#"><span id="cms_421">My Profile</span>
					<span class="caret"></span></a>
					<ul class="dropdown-menu navMenuDropDownTransparentBg">
						<li><a id="cms_10" href="<?php echo SITEURL."orders"; ?>" class="white">Orders</a></li>
						<li><a id="cms_281" href="<?php echo SITEURL."deliveryAddress"; ?>" class="white">Delivery Address</a></li>
						<li><a id="cms_11" href="<?php echo SITEURL."cart"; ?>" class="white">Cart</a></li>
						<li><a id="cms_12" href="#" onclick="appCommonFunctionality.menuClick('logout', false);" class="white">Logout</a></li>
					</ul>
				</li>
				<?php } ?>
				<li><a id="cms_7" href="<?php echo SITEURL."#about"; ?>" class="white">About Us</a></li>
				<li><a id="cms_8" href="<?php echo SITEURL."#contact"; ?>" class="white">Contact</a></li>
				<li><a id="cms_9" href="<?php echo SITEURL."notice"; ?>" class="white">Legal Notice</a></li>
				<li><a href=""><span id="lang" class="lang"></span></a></li>
			</ul>
		</div>
	</div>
</nav>