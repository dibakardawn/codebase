<div class="progress-container">
	<?php 
	$orderProgressBarStr = "";
	switch (intval($sql_order_res_fetch["status"])) {
	
		case ORDERTYPES[0][1]:{
			$orderProgressBarStr = $orderProgressBarStr.'<div class="progress" id="progress"></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[0][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[1][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[2][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[3][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[4][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[5][0])).'</span></div>';
			break;
		}
		  
		case ORDERTYPES[1][1]:{
			$orderProgressBarStr = $orderProgressBarStr.'<div class="progress" id="progress" style="width:20% !important;"></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[0][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[1][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[2][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[3][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[4][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[5][0])).'</span></div>';
			break;
		}
		
		case ORDERTYPES[2][1]:{
			$orderProgressBarStr = $orderProgressBarStr.'<div class="progress" id="progress" style="width:40% !important;"></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[0][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[1][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[2][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[3][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[4][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[5][0])).'</span></div>';
			break;
		}
		
		case ORDERTYPES[3][1]:{
			$orderProgressBarStr = $orderProgressBarStr.'<div class="progress" id="progress" style="width:60% !important;"></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[0][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[1][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[2][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[3][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[4][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[5][0])).'</span></div>';
			break;
		}
		
		case ORDERTYPES[4][1]:{
			$orderProgressBarStr = $orderProgressBarStr.'<div class="progress" id="progress" style="width:80% !important;"></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[0][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[1][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[2][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[3][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[4][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[5][0])).'</span></div>';
			break;
		}
		
		case ORDERTYPES[5][1]:{
			$orderProgressBarStr = $orderProgressBarStr.'<div class="progress" id="progress" style="width:100% !important;"></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[0][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[1][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[2][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[3][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[4][0])).'</span></div>';
			$orderProgressBarStr = $orderProgressBarStr.'<div class="circle active"><span class="stepText">'.ucfirst(strtolower(ORDERTYPES[5][0])).'</span></div>';
			break;
		}
	}
	echo $orderProgressBarStr;
	?>
</div>