contextPath = '/MXGCB';

var makeLoanPayment = (function(window, $) {
	var replaceNonNumeric = new RegExp("[^0-9]+$"); //variables
	 

	return {
		contextPath: '',
		initialize: initialize,
		overlayClose:overlayClose,
		captureSubmit:captureSubmit,
		returnToCapture:returnToCapture,
		recapSubmit:recapSubmit,
		printLink:printLink,
		makeAnotherPayment:makeAnotherPayment,
		errorSubmit:errorSubmit,
		print:print,
		save:save,
		footerMsgLink:footerMsgLink,
		footerCancelLink:footerCancelLink
	};
	//--------------------------------------Functions-------------------------------------
	function initialize(pageName){
		
		if(pageName==="input"){
			latamMex.forms.radio.initialize();
			$(".scrollable").slimScroll({height:'220px',railVisible: true,alwaysVisible: true});
			$(".slimScrollRail").css("height","100%");
			 $(".slimScrollBar, .slimScrollRail").css('margin-right', '0px');


			
		}else if(pageName==="recap"){
			
		}else if(pageName==="confirm"){
			
		}else if(pageName==="error"){
			
		}else if(pageName==="print"){
			
		}
	}
	
	function overlayClose(){
		
	}
	
	function captureSubmit(){
		alert(1);
		tooltipAndPaint(document.getElementById("txtAmount"),'Amount greater than allowed.', "error", true);
		return;
		var dataObj = {'_eventId':'submit','_flowExecutionKey':$('#flowExecutionKey').val()}
		ajaxSubmit('/apps/makeloanpayment/flow.action', dataObj);
	}
	
	function returnToCapture(){
		
	}
	
	function recapSubmit(){
		var dataObj = {'_eventId':'submit','_flowExecutionKey':$('#flowExecutionKey').val()}
		ajaxSubmit('/apps/makeloanpayment/flow.action', dataObj);
	}
	
	function printLink(){
		
	}
	
	function makeAnotherPayment(){
		var actualPath = '/apps/makeloanpayment/inputAction.action';
		var dataObj = {}
		ajaxSubmit('/apps/makeloanpayment/flow.action', dataObj);
	}
	
	function errorSubmit(){
		
	}
	
	function print(){
		
	}
	
	function save(){
		
	}
	
	function footerMsgLink(){
		
	}
	
	function footerCancelLink(){
		
	}
	
	function ajaxSubmit(actualPath, dataObj){
		$.ajax({
				url: contextPath + actualPath,
				type: 'post',
				data : dataObj,
				async: true,
				success: function (data) {
					//alert(data);
					$("#mkd9854128").html(data);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					alert(JSON.stringify(jqXHR));
				}
			});
	}
	//--------------------------------------Functions-------------------------------------
}(window, window.jQuery));