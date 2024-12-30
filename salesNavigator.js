const MENU_SELECTION_ITEM = "salesNavigator.php";
let HTMLEDITOR = false;

$(document).ready(function() {

    $('.w3-bar-block > a').each(function() {
        if ($(this).attr("href") === MENU_SELECTION_ITEM) {
            $(this).addClass("w3-blue");
        }
    });
	
	const pagePathName = window.location.pathname;
    const pageDocumentName = pagePathName.substring(pagePathName.lastIndexOf("/") + 1);

    if (pageDocumentName === "salesNavigator.php") {
        salesNavigatorFunctionality.initSalesNavigatorSearch();
    } else if (pageDocumentName === "salesNavigatorDetail.php") {
        salesNavigatorFunctionality.initSalesNavigatorDetail();
    }
    
});

const salesNavigatorFunctionality = (function(window, $) {
    const parent = {};

    parent.initSalesNavigatorSearch = function() {
        appCommonFunctionality.adjustMainContainerHight('salesNavigatorHolder');
		bindNavigatorItems();
		
    };
	
	const bindNavigatorItems = function() {
		$('input[id^="navigatorContentEncrypted_"]').each(function () {
			const number = this.id.split('_')[1];
			const decodedValue = decodeURI(window.atob(this.value));
			$(`#navigatorContent_${number}`).html(`<b>${decodedValue}</b>`);
		});
		salesNavigatorFunctionality.listFiles('displaySection');
	};
	
	parent.deleteSalesQuery = function(navigatorId){
		window.location = 'salesNavigator.php?ACTION=DELETESALESQUERY&navigatorId=' + navigatorId;
	};
	
	parent.submitQuery = function(){
		if(salesNavigatorFunctionality.validateNavigatorForm()){
			$("#navigatorForm").submit();
		}
	};
	
	parent.validateNavigatorForm = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Search Query Validation----------------------------------------*/
		var searchQuery = window.btoa(encodeURI($("#searchQuery").val()));
		if(searchQuery === ''){
			appCommonFunctionality.raiseValidation("searchQuery", "", true);
			errorCount++;
		} else { 
			$("#searchQueryEncrypted").val(searchQuery);
			appCommonFunctionality.removeValidation("searchQuery", "searchQuery", true);
		}
		/*----------------------------------------------------Search Query Validation----------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.initSalesNavigatorDetail = function() {
        appCommonFunctionality.adjustMainContainerHight('salesNavigatorHolder');
		bindNavigatorItems();
		/*-------------------------------------Quill Activity--------------------------------------------*/
		var refreshIntervalId = window.setInterval(function() {
			if($(".ql-toolbar").length === 0 && $('#salesAnswerBody').not('ql-container') && !HTMLEDITOR){
				if($("#salesAnswerBody").length){
					/*--------------------------------quill-------------------------------------------------------*/
					var toolbarOptions = [
						['bold', 'underline', 'strike'],        // toggled buttons
						['blockquote', 'code-block'],

						[{ 'header': 1 }],               // custom button values
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],
						[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
						[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
						[{ 'direction': 'rtl' }],                         // text direction

						[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

						[{ 'field5': [] }, { 'background': [] }],          // dropdown with defaults from theme
						[{ 'font': [] }],
						[{ 'align': [] }]
					];

					quill = new Quill('#salesAnswerBody', {
						modules: {
							toolbar: toolbarOptions
						},
						theme: 'snow'
					});
					/*--------------------------------quill-------------------------------------------------------*/
				}
			}else{
				HTMLEDITOR = true;
				$('.ql-editor').addClass('bgWhite');
				$('#submitBtn').removeClass('disabled');
				appCommonFunctionality.hideLoder();
				clearInterval(refreshIntervalId);
			}
		}, LOADTIME);
		/*-------------------------------------Quill Activity--------------------------------------------*/
    };
	
	parent.goToSalesQustions = function(){
		window.location = 'salesNavigator.php';
	};
	
	parent.validateSalesAnswerForm = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Product Description Validation----------------------------------*/
		var salesAnswerLength = quill.getLength(); // Includes the trailing newline character
        var salesAnswerLength = salesAnswerLength - 1;
		if (salesAnswerLength === 0) {
			appCommonFunctionality.raiseValidation("salesAnswerErrHolder", appCommonFunctionality.getCmsString(299), false);
			$("#salesAnswerBody").focus();
			errorCount++;
		} else {
			var salesAnswer = window.btoa(encodeURI(quill.root.innerHTML));
			$("#salesAnswerEncrypted").val(salesAnswer);
			appCommonFunctionality.removeValidation("salesAnswerErrHolder", "salesAnswerErrHolder", false);
		}
		/*----------------------------------------------------Product Description Validation----------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.listFiles = function(section){
		if (section === 'inputSection') {
			const fileInput = document.getElementById('supportingDocument');
			const files = fileInput.files;
			let str = '';
			for (let file of files) {
				const fileExtension = file.name.split('.').pop();
				str += `
					<div class="fileList">
						<img src="${PROJECTPATH}assets/images/fileIcons/${fileExtension}.png" alt="${file.name}" class="supportingDocFileIcon">
						<span class="f12">${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
					</div>
				`;
			}
			$("#FilesSelected").html(str);
		} else if (section === 'displaySection') {
			let str = '';
			$('[id^=navigatorFiles_]').each(function(index, element) {
				var elementId = element.id;
				var elementIdArr = elementId.split('_');
				const navigatorFiles = $("#" + element.id).val();
				if(navigatorFiles !== ''){
					const navigatorFilesArr = navigatorFiles.split(',');
					for(var i = 0; i < navigatorFilesArr.length; i++){
						const fileName = navigatorFilesArr[i];
						const fileExtension = fileName.split('.').pop();
						str += `
							<div class="fileList">
								<img src="${PROJECTPATH}assets/images/fileIcons/${fileExtension}.png" alt="${fileName}" class="supportingDocFileIcon">
								<span class="f12">${fileName}</span>
								<a href="${PROJECTPATH}uploads/salesQuestionSuppotingDocument/${fileName}" target="_blank"><i class="fa fa-download greenText marRig5"></i></a>
							</div>
						`;
					}
					$("#fileListHolder_" + elementIdArr[1]).html(str);
				}
				str = '';
			});
			
		}
	};

    return parent;
}(window, window.$));