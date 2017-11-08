var redeemmutualfund = (function(window, $) {
	var replaceNonNumeric = new RegExp("[^0-9]+$"); //regular expression for numeric
	var maxLengthAmount = 18; //(18,2)
	var blnIsValidAmt=true;
	var replaceNonAmtChars = new RegExp("[^0-9,.]+$"); //regular expression for amt validations  

	return {
		initialize: initialize,
		contextPath: '',
		errTitleEmpty: '',
		errTitleInValid: '',
		errAmountEmpty: '',
		errAmountInValid: '',
		isValidInteger: isValidInteger,
		onkeypressAmt: onkeypressAmt,
		formatAmount: formatAmount,
		clearancePeriod: '',
		CAperiod: '',
		SP: '',
		Hrs: '',
		dynamicHelpBubble: '',
		staticHelpBubble: '',
		sourceAccSize : 0,
		productSize : 0
	};
	
    function initialize(pageName){
		if(pageName=="input"){
			setClearancePeriod();

			if($('#sourceAccountList').val() >-1 || redeemmutualfund.sourceAccSize == 1){
				$('#investmentProductSection').show();
				$("[data-buble=true]").attr('data-type',redeemmutualfund.dynamicHelpBubble);
			}

			addHelpBubble();

			if($('#investmentProduct').val() >-1 || redeemmutualfund.productSize == 1){
				$('#withdrawalBySection').show();
			}

			if($('#rdTypOper2').is(":checked")==true){
				$('#sourceAccountSection').show();
			}

			$('#rdTypOper1').click(function(){
				window.location.replace(redeemmutualfund.contextPath + '/apps/investmentbuymutualfund/flow.action');
			})
			
			$('#sourceAccountList').change(function(){
				//$('#investmentProductSection').show();
				if($(this).val() >- 1){
					$('#invRedeemMutualFundForm').submit();
				}
				else{
					$('#investmentProductSection').hide();
					$('#withdrawalBySection').hide();
					$('#redeemMutualFundSection').hide();
					$("[data-buble=true]").attr('data-type',redeemmutualfund.staticHelpBubble);
					$("#tt_container #text").html(redeemmutualfund.staticHelpBubble)
				}
			});

			$('#investmentProduct').change(function(){
				if($(this).val() >- 1){
					$('#evtName').val('goToRetrieveDetailsProduct');
					$('#invRedeemMutualFundForm').submit();
				}
				else{
					$('#withdrawalBySection').hide();
					$('#redeemMutualFundSection').hide();
				}
			});

			$('input[name="context.customerInputData.selectedRedeenById"]').click(function(){
				$('#txtAmount').val('');
				$('#txtTitle').val('');
				destroyTooltip('txtAmount');
				destroyTooltip('txtTitle');
				$('#redeemMutualFundSection').show();
				if($(this).attr('id')=='rdRedeemBy1'){
					$('#partialAmtSection').show();
					//$('#noOfAmt').show();
					$('#partialTitleSection').hide();
					//$('#titleToRedeem').hide();
				}
				else{
					//$('#titleToRedeem').show();
					$('#partialTitleSection').show();
					$('#partialAmtSection').hide();
					//$('#noOfAmt').hide();
				}
			});
			

			$('#btnContinue').click(function(){
				goToRecap();
			});
		}
		else if(pageName=='recap'){
			$('#btnContinue').click(function(){
				$.openHardToken('defaultOverlay', redeemmutualfund.contextPath+'/apps/investmentredeemmutualfund/flow.action', $('#fek').val(), 'confirmation');
			});
			$('#link_gpBack').click(function(){
				$('#evtId').val('back');
				$('#invRedeemMutualFundRecapForm').submit();
			});
		}
	}

	function setClearancePeriod(){
	 	var clearancePeriod = $.trim(redeemmutualfund.clearancePeriod);
	    if(clearancePeriod == "CA") {
	    	$('#clearancePeriod').html(redeemmutualfund.CAperiod);
	    } 
	    else if(clearancePeriod == "SP") {
	        $('#clearancePeriod').html(redeemmutualfund.SP);
	    } 
	    else{
			$('#clearancePeriod').html(clearancePeriod + " " + redeemmutualfund.Hrs);
	    }
    	$('#clearancePeriodID').val($('#clearancePeriod').html());
	}

	function goToRecap(){
		
		if($('#rdRedeemBy1').is(":checked")==true){
			//amount validation
			$('#txtAmount').trigger('blur');
			destroyTooltip('txtAmount');
			var val = $.trim($("#txtAmount").val());
			if(val == ''){
				tooltip('txtAmount',redeemmutualfund.errAmountEmpty);
			}
			else{
				if(getAmtDigits(val) == 0){
					tooltip('txtAmount',redeemmutualfund.errAmountInValid);
				}
				else{
					
					$('#txtTitle').remove();
					$('#evtName').val('goToRecap');
					$('#invRedeemMutualFundForm').submit();
				}
			}
		}
		else{
			//title validation

			destroyTooltip('txtTitle');
			var val = $.trim($("#txtTitle").val());
			
			if(val == ""){
				tooltip('txtTitle',redeemmutualfund.errTitleEmpty);
			}
			else if((parseInt(val) == 0) || (replaceNonNumeric.test(val) == true )){
				tooltip('txtTitle',redeemmutualfund.errTitleInValid);
			}
			else{
				//submit form
				$('#txtAmount').remove();
				$('#evtName').val('goToRecap');
				$('#invRedeemMutualFundForm').submit();
			}
		}
	}

	function addHelpBubble(){
		$("[data-buble=true]").click(function(eve){
			eve.preventDefault();
	 		var cont = $('<div id="tt_container" style="right: auto !important" class="medium" ><div class="tt_top" style="top: -10px"></div><a href="#" class="tt_close">x</a><div class="clear"></div><p class="p_tooltip" id="text"></p></div>');
	 	 	$(cont).find('#text').html($(this).attr('data-type'));
			
	 		$(cont).css({
	 			'top':$(eve.target).offset().top+$(this).height()+8,
	 			'width':'150px'
	 		});
			$(this).parent().append(cont);
	 		

	 		$('.tt_close').click(function(event){
	 			event.preventDefault();
	 			$(this).parent().remove();

	 		});
 		});
	}

	function isValidInteger(e) {
		var verified = (e.which == 8 || e.which == undefined || e.which == 0) ? null : String.fromCharCode(e.which).match(replaceNonNumeric);
		if (verified) {e.preventDefault();}
	}

	function getAmtDigits(amt){
		amt =  amt.replace(/\$/g , "").replace(/\ /g , "").replace(/,/g , "");
		amt = parseFloat(amt);
		return amt;
	}

	function tooltip(id, msj){
		if(!$('#'+id).hasClass('error')){
			$('#'+id).addClass('error');
		}
	 	$('#'+id).qtip({
			content: {
				//prerender : false,
			   	text: msj
			},
			hide: {
			        event: false
			    },
			position: {
				my: 'center left',  // Position my top left...
				at: 'right center' // at the bottom right of...
			},
			show: { 
	            ready: true, 
	            solo: true // Only show one tooltip at a time
	         },
			style: {
				classes: 'ui-tooltip-shadow',
				tip: {  
					width:9,
					height:17
				}
			}
		});
	
	}

	function destroyTooltip(id){
		$('#'+id).qtip('destroy');
		$('#'+id).attr('title', '');
		classes = $('#'+id).attr("class");
		if (classes != null) {
            clas = classes.split("error");
            $('#'+id).attr("class", clas[0]);
        }
		
	}

	function onkeypressAmt(evt) {
		
		var e = evt || window.event;
		var keyCode = e.keyCode || e.which;
		
		var amt = $(evt.target).val(); 
		if(amt.indexOf('.') >- 1 && keyCode==46){
			// already contains a dot
			return false;
		}
		
		var verified = (evt.which == 8 || evt.which == undefined || evt.which == 0) ? null : String.fromCharCode(evt.which).match(replaceNonAmtChars);
		if(verified){
			return false;
		}
	  
	  //check maxlength
	    //.replace(/\./g , "")
	    amt=amt.replace(/,/g , "").replace(/ /g , "");
	    var x = amt.split('.');
		var x1 = x[0];
		if(x1.length >= maxLengthAmount){
			return false;
		}
		return true;
	}
	
	function formatAmount(evt){
		var numb=$(evt.target).val();
		if($.trim(numb) != ""){
			if (numb !='') {
				while (numb.indexOf(",") != -1) {
					numb = numb.toString().replace(",","");	
				}
			}	
			if (numb !='' && numb.indexOf(",") == -1) {
				var number = parseFloat(numb).toFixed(2);
				number += '';
				var x = number.split('.');
				var x1 = x[0];
				var x2 = x.length > 1 ? '.' + x[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
				}
				$(evt.target).val(x1 + x2);
				destroyTooltip(evt.target.id);
			}	
		}
		
	}

	function isValidAmount(amt){
		var dotIndex = amt.indexOf('.');
		if(dotIndex > -1){
			//remove decimal places
			var x = amt.split('.');
			var x1 = x[0];
			var x2 = x.length > 1 ? '.' + x[1] : '';
			amt = x1; 
		}
				
		if(amt.indexOf(',') >- 1){
			var x = amt.split(',');
			if(x[0]==''){
				//comma is the first character in the input
				return false;
			}
			for(var i=1;i<x.length;i++){
				var str = x[i];
				if(str.length!=3){
				    return false;
				}
			}
		}
		amt = amt+x2;
		if(isNaN(parseFloat(amt))){
			return false;
		}
		return true;
	}
   
}(window, window.jQuery));