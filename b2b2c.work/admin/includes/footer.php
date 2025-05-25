<input id="CMSDATA" name="CMSDATA" type="hidden" value='<?php if($section != "" && $page != ""){ echo readPreCompiledCmsData($section, $page); }?>'>
<footer class="w3-container w3-padding-16 w3-light-grey footerBoxShadow">
    <h4><span id="cms_2">from</span> <?php echo SITETITLE ; ?> <span id="cms_3">Team</spn></h4>
    <p><span id="cms_4">All rights reserved for</span> <?php echo "$_SERVER[HTTP_HOST]"; ?></p>
</footer>