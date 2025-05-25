<nav class="navbar navbar-inverse">
	<div class="container-fluid">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#supplierPortalNavbar">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>                        
			</button>
			<a class="navbar-brand" href="index.php" id="cms_597">Supplier Portal</a>
		</div>
		<div id="supplierPortalNavbar" class="collapse navbar-collapse">
			<ul class="nav navbar-nav">
				<?php if(basename($_SERVER['PHP_SELF']) == "profile.php"){?>
					<li><a href="index.php" id="cms_598">Home</a></li>
					<li class="active"><a href="profile.php" id="cms_599">My Profile</a></li>
				<?php } else { ?>
					<li class="active"><a href="index.php" id="cms_598">Home</a></li>
					<li><a href="profile.php" id="cms_599">My Profile</a></li>
				<?php } ?>
			</ul>
			<ul class="pull-right">
				<li class="marTop16">
					<a href="logout.php" class="whiteText">
						<i class="fa fa-power-off"></i> 
						<span id="cms_600">Logout</span>
					</a>
				</li>
			</ul>
			<ul class="pull-right">
				<li>
					<select id="languageDDL" class="marTop16" onchange="appCommonFunctionality.changeLang(this.value);">
						<option value="en">English</option>
						<option value="de">German</option>
						<option value="eo">Spanish</option>
						<option value="it">Italian</option>
					</select>
				</li>
			</ul>
		</div>
	</div>
</nav>