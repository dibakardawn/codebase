<div class="w3-bar w3-top w3-black w3-large" style="z-index:4">
  <span class="w3-bar-item w3-left hover"><i id="adminHeaderHamburgerMenu" class="fa fa-close marTop5" onclick="appCommonFunctionality.toggleSidebar();"></i></span>
  <span class="w3-bar-item w3-left"><a href="index.php"><?php echo SITETITLE; ?> <span id="cms_1">Admin</span></a></span>
  <span class="w3-bar-item w3-right hover rightIcon"><a href="logout.php"><i class="fa fa-power-off marTop5"></i></a></span>
  <span class="w3-bar-item w3-right hover rightIcon"><a href="calendar.php"><i class="fa fa-calendar marTop5"></i></a></span>
  <select id="languageDDL" class="languageDDL" onChange="appCommonFunctionality.changeLang(this.value);">
  </select>
</div>

<!--<h3 class="text-center redText">Work In progress...</h3>-->