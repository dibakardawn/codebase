const MENUSELECTIONITEM = "salesSearch.php";
let HTMLEDITOR = false;
const PAGEDOCNAME = appCommonFunctionality.getPageName();

$(document).ready(function() {
	/*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function() {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
	if (PAGEDOCNAME === "salesSearch.php") {
		salesSearchFunctionality.initSalesSearch();
	} else if (PAGEDOCNAME === "salesQueryDetail.php") {
		salesSearchFunctionality.initSalesQueryDetail();
	}
	
	appCommonFunctionality.cmsImplementationThroughID();
    appCommonFunctionality.cmsImplementationThroughRel();
	appCommonFunctionality.hideLoader();
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const salesSearchFunctionality = (function(window, $) {
    const parent = {};

    parent.initSalesSearch = async function () {
        appCommonFunctionality.adjustMainContainerHight('salesSearchHolder');
		await appCommonFunctionality.adminCommonActivity();
        bindSalesSearchItems();
    };

    const bindSalesSearchItems = function() {
        $('input[id^="salesSearchContentEncrypted_"]').each(function() {
            const number = this.id.split('_')[1];
            const decodedValue = decodeURI(window.atob(this.value));
            $(`#salesSearchContent_${number}`).html(`<b>${decodedValue}</b>`);
        });
        parent.listFiles('displaySection');
    };

    parent.deleteSalesQuery = function(salesSearchId) {
        window.location = `salesSearch.php?ACTION=DELETESALESQUERY&salesSearchId=${salesSearchId}`;
    };

    parent.submitQuery = function() {
        if (parent.validateSalesSearchForm()) {
            $("#salesSearchForm").submit();
        }
    };

    parent.validateSalesSearchForm = function() {
        let errorCount = 0;
		/*-------------------Search Query Validation----------------------------*/
        const searchQuery = window.btoa(encodeURI($("#searchQuery").val()));
        if (searchQuery === '') {
            appCommonFunctionality.raiseValidation("searchQuery", "", true);
            errorCount++;
        } else {
            $("#searchQueryEncrypted").val(searchQuery);
            appCommonFunctionality.removeValidation("searchQuery", "searchQuery", true);
        }
		/*-------------------Search Query Validation----------------------------*/
		
		$('#selectedLang').val($('#languageDDL').val());
        return errorCount === 0;
    };

    parent.initSalesQueryDetail = async function () {
        appCommonFunctionality.adjustMainContainerHight('salesSearchHolder');
		await appCommonFunctionality.adminCommonActivity();
        bindSalesSearchItems();
        initializeQuillEditor();
		if(appCommonFunctionality.isMobile()){
			$("#supportingDocumentHolder").removeClass('noRightPaddingOnly').addClass('nopaddingOnly');
		}
    };

    const initializeQuillEditor = function() {
        const refreshIntervalId = setInterval(() => {
            if ($(".ql-toolbar").length === 0 && $('#salesAnswerBody').not('ql-container') && !HTMLEDITOR) {
                if ($("#salesAnswerBody").length) {
                    const toolbarOptions = [
                        ['bold', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'font': [] }],
                        [{ 'align': [] }]
                    ];

                    quill = new Quill('#salesAnswerBody', {
                        modules: { toolbar: toolbarOptions },
                        theme: 'snow'
                    });
                }
            } else {
                HTMLEDITOR = true;
                $('.ql-editor').addClass('bgWhite');
				$('#salesAnswerBody').css('height', '300px');
                $('#submitBtn').removeClass('disabled');
                appCommonFunctionality.hideLoader();
                clearInterval(refreshIntervalId);
            }
        }, LOADTIME);
    };

    parent.goToSalesQueries = function() {
        window.location = 'salesSearch.php';
    };

    parent.validateSalesAnswerForm = function() {
        let errorCount = 0;
        const salesAnswerLength = quill.getLength() - 1;
		
		/*---------------------------------------Validate Sales Answer-------------------------------------*/
        if (salesAnswerLength === 0) {
            appCommonFunctionality.raiseValidation("salesAnswerErrHolder", appCommonFunctionality.getCmsString(299), false);
            $("#salesAnswerBody").focus();
            errorCount++;
        } else {
            const salesAnswer = window.btoa(encodeURI(quill.root.innerHTML));
            $("#salesAnswerEncrypted").val(salesAnswer);
            appCommonFunctionality.removeValidation("salesAnswerErrHolder", "salesAnswerErrHolder", false);
        }
		/*---------------------------------------Validate Sales Answer-------------------------------------*/
		
		$('#selectedLang').val($('#languageDDL').val());
        return errorCount === 0;
    };

    parent.listFiles = function(section) {
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
            $('[id^=supportingDocuments_]').each(function() {
                const supportingDocuments = $(this).val();
				const [prefix, number] = this.id.split('_');
                if (supportingDocuments !== '') {
                    const supportingDocumentsArr = supportingDocuments.split(',');
                    let str = '';
                    supportingDocumentsArr.forEach(fileName => {
                        const fileExtension = fileName.split('.').pop();
                        str += `
                            <div class="fileList">
                                <img src="${PROJECTPATH}assets/images/fileIcons/${fileExtension}.png" alt="${fileName}" class="supportingDocFileIcon">
                                <span class="f12">${fileName}</span>
                                <a href="${PROJECTPATH}uploads/salesQuestionSuppotingDocument/${fileName}" target="_blank"><i class="fa fa-download greenText marRig5"></i></a>
                            </div>
                        `;
                    });
					$("#fileListHolder_" + number).html(str);
                }
            });
        }
    };

    return parent;
}(window, window.$));