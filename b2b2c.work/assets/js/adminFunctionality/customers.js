const MENUSELECTIONITEM = "customers.php";
let   COMPANYTYPEPRECOMPILEDDATA = [];
let   CUSTOMERGRADEPRECOMPILEDDATA = [];
let   COUNTRYPRECOMPILEDDATA = [];
let	  SEARCHCUSTOMERCRITERIA = {
		keyword: "",
		companyTypeId: "",
		customerGrade: "",
		customerId: 0,
		status: 1
};
let   CUSTOMERBALANCESHEETCRITERIA = {
		customerId: 0,
		toDate : "",
		fromDate: ""
};
let CUSTOMERBALANCESHEETVEWCRITERIA = {
	viewType: "ADMINVIEW"
};
let   FINANCEDATA = [];
const PAGEDOCNAME = appCommonFunctionality.getPageName();


$(document).ready(function() {
	/*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function() {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
    if (PAGEDOCNAME === "customers.php") {
		$.when(
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=COMPANYTYPE'),
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=CUSTOMERGRADE')
		).done(function(companyTypeResponse, customerGradeResponse) {
			// Both AJAX calls completed successfully
			appCommonFunctionality.hideLoader();
			customerFunctionality.initCustomers(companyTypeResponse[0], customerGradeResponse[0]);
		}).fail(function() {
			// One or both AJAX calls failed
			appCommonFunctionality.hideLoader();
			console.error('Error in one or both AJAX calls');
		});
    } else if (PAGEDOCNAME === "customerEntry.php") {
		$.when(
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=COMPANYTYPE'),
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=CUSTOMERGRADE'),
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=COUNTRY')
		).done(function(companyTypeResponse, customerGradeResponse, countryResponse) {
			// Both AJAX calls completed successfully
			appCommonFunctionality.hideLoader();
			customerFunctionality.initCustomerEntry(companyTypeResponse[0], customerGradeResponse[0], countryResponse[0]);
		}).fail(function() {
			// One or both AJAX calls failed
			appCommonFunctionality.hideLoader();
			console.error('Error in one or both AJAX calls');
		});
    } else if (PAGEDOCNAME === "customerDetail.php") {
		$.when(
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=COMPANYTYPE'),
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=COUNTRY')
		).done(function(companyTypeResponse, countryResponse) {
			// Both AJAX calls completed successfully
			appCommonFunctionality.hideLoader();
			customerFunctionality.initCustomerDetail(companyTypeResponse[0], countryResponse[0]);
		}).fail(function() {
			// One or both AJAX calls failed
			appCommonFunctionality.hideLoader();
			console.error('Error in one or both AJAX calls');
		});
    } else if (PAGEDOCNAME === "customerBalanceSheet.php") {
		customerFunctionality.initCustomerBalancesheet();
    } else if (PAGEDOCNAME === "customerBalanceSheetPrint.php") {
		customerFunctionality.initCustomerBalancesheetPrint();
    }

    appCommonFunctionality.cmsImplementationThroughID();
    appCommonFunctionality.cmsImplementationThroughRel();
	appCommonFunctionality.hideLoader();
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const customerFunctionality = (function(window, $) {
    const parent = {};

    parent.initCustomers = async function (companyTypeResponse, customerGradeResponse) {
        appCommonFunctionality.adjustMainContainerHight('customerSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		if (companyTypeResponse != null) {
			COMPANYTYPEPRECOMPILEDDATA = JSON.parse(companyTypeResponse);
		}
		if (customerGradeResponse != null) {
			CUSTOMERGRADEPRECOMPILEDDATA = JSON.parse(customerGradeResponse);
		}
        bindCompanyTypeDDL();
        bindCustomerGradeDDL();
        toggleSwitchInputs();
        appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, parent.populateCustomerGrid);
    };

    parent.populateCustomerGrid = function(customerData) {
        let str = '';
        customerData = JSON.parse(customerData);
        
        const createTableRow = (data) => `
            <tr>
                <td><span class="blueText hover f20" onclick="customerFunctionality.goToCustomerDetail(${data.customerId})">${data.companyName} (${data.compType}) [${data.customerGrade}]</span></td>
                <td class="f12">
                    <strong><span id="cms_194">Buying Manager</span>: </strong><span class="blueText hover" onclick="customerFunctionality.goToCustomerDetail(${data.customerId})">${data.buyerName}</span><br>
                    <strong><span id="cms_195">Contact person</span>: </strong><span class="blueText hover" onclick="customerFunctionality.goToCustomerDetail(${data.customerId})">${data.contactPerson}</span>
                </td>
                <td class="f12">
                    <i class="fa fa-phone blueText"></i> ${data.phone}<br>
                    <i class="fa fa-envelope greenText"></i> <span class="blueText hover" onclick="customerFunctionality.goToCustomerDetail(${data.customerId})">${data.email}</span>
                </td>
                <td>
                    <div class="spaceBetweenSection">
                        <i class="fa fa-tv marleft5 blueText hover" onclick="customerFunctionality.goToCustomerDetail(${data.customerId})"></i>
                        <i class="fa fa-pencil-square-o marleft5 greenText hover" onclick="customerFunctionality.editCustomer(${data.customerId})"></i>
                        <!--<i class="fa fa-trash-o marleft5 redText hover" onclick="customerFunctionality.deleteCustomer(${data.customerId})"></i>-->
                    </div>
                </td>
            </tr>
        `;

        str += '<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white minW842">';
        str += '<tr><td width="40%"><strong><span id="cms_193">Company Name</span></strong></td><td width="25%"><strong><span id="cms_275">Contacts</span></strong></td><td width="25%"><strong><span id="cms_196">Communication</span></strong></td><td width="10%"><strong><span id="cms_197">Action</span></strong></td></tr>';
        
        if (customerData.length > 0) {
            customerData.forEach(data => {
                str += createTableRow(data);
            });
        } else {
            str += '<tr><td colspan="4" class="text-center f20">No Data</td></tr>';
        }
        
        str += '</table>';
        $("#customerGrid").html(str);
    };
	
    parent.customerSearchModalFormReset = function() {
        $("#keyword").val('');
        $("#companyType, #customerGrade").val(0);
        $("#status_switch").trigger('change');
    };

    parent.customerSearchModalFormSubmit = function() {
        SEARCHCUSTOMERCRITERIA.keyword = $("#keyword").val();
        SEARCHCUSTOMERCRITERIA.companyTypeId = parseInt($("#companyType").val());
        SEARCHCUSTOMERCRITERIA.customerGrade = $("#customerGrade").val();
        SEARCHCUSTOMERCRITERIA.status = parseInt($("#status").val());
        $("#customerSearchModal").modal('hide');
        appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, parent.populateCustomerGrid);
    };

    parent.addCustomer = function() {
        window.location = 'customerEntry.php';
    };

    parent.goToCustomerDetail = function(customerId) {
        window.location = 'customerDetail.php?customerId=' + customerId;
    };

    parent.editCustomer = function(customerId) {
        window.location = 'customerEntry.php?customerId=' + customerId;
    };

    parent.deleteCustomer = function(customerId) {
        if (confirm(appCommonFunctionality.getCmsString(245))) {
            appCommonFunctionality.ajaxCall('DELETECUSTOMER&customerId=' + customerId, parent.initCustomers);
        }
    };
	
	parent.goToCustomers = function(){
		window.location = 'customers.php';
	},

    parent.initCustomerEntry = async function (companyTypeResponse, customerGradeResponse, countryResponse) {
        appCommonFunctionality.adjustMainContainerHight('customerSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		if (companyTypeResponse != null) {
			COMPANYTYPEPRECOMPILEDDATA = JSON.parse(companyTypeResponse);
		}
		if (customerGradeResponse != null) {
			CUSTOMERGRADEPRECOMPILEDDATA = JSON.parse(customerGradeResponse);
		}
		if (countryResponse != null) {
			COUNTRYPRECOMPILEDDATA = JSON.parse(countryResponse);
		}
        bindCompanyTypeDDL();
        bindCustomerGradeDDL();
        toggleSwitchInputs();
        appCommonFunctionality.bindCountryDropdown('country', 482);

        const customerId = appCommonFunctionality.getUrlParameter('customerId');
        if (customerId && parseInt(customerId) > 0) {
            appCommonFunctionality.ajaxCall('GETCUSTOMER&customerId=' + customerId, parent.mapCustomerDetails);
        }
    };

    parent.mapCustomerDetails = function(data) {
        const customerData = JSON.parse(data);
        if (customerData.length > 0) {
            if (PAGEDOCNAME === "customerEntry.php") {
                Object.keys(customerData[0]).forEach(key => {
					if(key === "bankDetails"){
						$("#" + key).val(JSON.stringify(customerData[0][key]));
					}else if(key === "additionalInformation"){
						$("#" + key).val(JSON.stringify(customerData[0][key]));
					}else if(key === "customerGrade"){
						$("#customerGrade option").filter(function() {
							return $(this).text() === customerData[0][key];
						}).prop("selected", true).change();
					}else if(key === "country"){
						$("#" + key).val(customerData[0][key]).change();
					}else if (key === "phone" || key === "mobile") {
						const countryId = parseInt(customerData[0]['country']);
						const fullPhone = customerData[0][key];
						const countryData = COUNTRYPRECOMPILEDDATA.find(c => c.countryId === countryId);
						let cleanedPhone = fullPhone;
						if (countryData) {
							const ext = countryData.telePhoneExt;
							const regex = new RegExp("^" + ext.replace("+", "\\+") + "\\s?");
							cleanedPhone = fullPhone.replace(regex, "");
						}
						$("#" + key).val(cleanedPhone);
					}else{
						$("#" + key).val(customerData[0][key]);
					}
                });
                mapBuyerName();
                mapContactPersonName();
				mapBankInformationFields();
				if (appCommonFunctionality.isMobile()) {
					$("#companyTypeHolder, #postCodeHolder").addClass('nopaddingOnly');
					$("#buyerFirstNameHolder, #buyerLastNameHolder, #contactPersonFirstnameHolder, #contactPersonSurnameHolder, #phoneHolder, #faxHolder, #mobileHolder, #existingIdHolder, #accountNoHolder, #sortCodeHolder").removeClass('noRightPaddingOnly').addClass('nopaddingOnly');
				}
            } else if (PAGEDOCNAME === "customerDetail.php") {
                const customer = customerData[0];
                $("#companyNameTypeGrade").html(`${customer.companyName} [${getCompanyType(customer.companyType)}] [${customer.customerGrade}]`);
				$("#companyName").val(customer.companyName);
                $("#buyerName").html(customer.buyerName);
                $("#contactPersonVal").html(customer.contactPerson);
                $("#existingId").html(customer.existingId);
                $("#phoneVal").html(customer.phone);
                $("#fax").html(customer.fax);
                $("#emailVal").html(customer.email).attr('href', 'mailto:' + customer.email);
                $("#mobile").html(customer.mobile);
                $("#website").html(`<a href="${customer.website}" target="_blank" class="blueText">${customer.website}</a>`);
                $("#registrationDate").html(customer.registrationDate);
                $("#lastLoginDate").html(customer.lastLoginDate);
                $("#addressVal").html(customer.address);
                $("#townVal").html(customer.town);
                $("#postCodeVal").html(customer.postCode);
                $("#countryHdn").val(customer.country);
                $("#countryVal").html(appCommonFunctionality.getCountryName(parseInt(customer.country), true));
                $("#bankDetails").val(JSON.stringify(customer.bankDetails));
                mapBankInformationFields();
                appCommonFunctionality.ajaxCall('GETDELIVERYADDRESSES&customerId=' + customer.customerId, parent.bindCustomerDeliveryAddressTable);
				if (appCommonFunctionality.isMobile()) {
					$('.modal-body .noLeftPaddingOnly, .modal-body .w84p').each(function() {
						if($(this).hasClass('noLeftPaddingOnly')) {
							$(this).removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
						}
						if($(this).hasClass('w84p')) {
							$(this).removeClass('w84p').addClass('w80p');
						}
						$('#sameAddressSwitchSection').addClass('spaceBetweenSection');
					});
				}
            }
        }
    };
	
	parent.keywordOnkeyup = function(e){
		var event = e || window.event;
		if(event.keyCode === 13 || event.key === 'Enter'){
			parent.customerSearchModalFormSubmit();
		}
	};

    parent.onSwitchChange = function(switchId) {
        const inputId = switchId.replace("_switch", "");
        const currentValue = parseInt($("#" + inputId).val());
        $("#" + inputId).val(currentValue ? 0 : 1);
        $("#" + inputId).prop('checked', !currentValue);
        $("#" + inputId + "_lbl_1").toggle(!currentValue);
        $("#" + inputId + "_lbl_0").toggle(currentValue);

        if (inputId === "accountHolderFlag") {
            $("#accountHolderName").val(currentValue ? '' : $("#companyName").val());
        }
    };

    parent.changeCountry = function() {
        const selectedOptionId = $('#country option:selected').attr('id');
        if (selectedOptionId.includes('_')) return;

        $("#flagImg").attr('src', COUNTRYFLAGURL + selectedOptionId.toLowerCase() + '.png');
		
        COUNTRYPRECOMPILEDDATA.forEach(data => {
            if (data.countryCode === selectedOptionId) {
                $("#phoneExtension").text(data.telePhoneExt);
                $("#mobileExtension").text(data.telePhoneExt);
            }
        });
    };

    parent.generateArbiteryEmail = function() {
        $("#email").val(`${SITETITLE}-customer.${Date.now()}@gmail.com`).focus();
    };

    parent.saveCustomer = function() {
        if (validateCustomerEntry(true)) {
            const customerData = {
                customerId: parseInt($("#customerId").val()),
                companyName: $("#companyName").val(),
                companyType: $("#companyType").val(),
                customerGrade: $("#customerGrade option:selected").text(),
                status: $("#status").val(),
                buyerName: $("#buyerName").val(),
                contactPerson: $("#contactPerson").val(),
                address: $("#address").val(),
                postCode: $("#postCode").val(),
                country: $("#country").val(),
                town: $("#town").val(),
                phone: $('#phoneExtension').text() + ' ' + $("#phone").val(),
                fax: $("#fax").val(),
                email: $("#email").val(),
                mobile: $('#mobileExtension').text() + ' ' +  $("#mobile").val(),
                website: $("#website").val(),
                existingId: $("#existingId").val(),
                bankDetails: $("#bankDetails").val(),
                additionalInformation: $("#additionalInformation").val(),
				selectedLang: $('#languageDDL').val()
            };
            appCommonFunctionality.ajaxCallLargeData('SAVECUSTOMER', customerData, parent.receiveResponseAfterSaveCustomerData);
        }
    };

    parent.receiveResponseAfterSaveCustomerData = function(data) {
        const parsedData = JSON.parse(data);
        parent.goToCustomerDetail(parsedData.customerId);
    };

    parent.initCustomerDetail = async function (companyTypeResponse, countryResponse) {
        appCommonFunctionality.adjustMainContainerHight('customerSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		if (companyTypeResponse != null) {
			COMPANYTYPEPRECOMPILEDDATA = JSON.parse(companyTypeResponse);
		}
		if (countryResponse != null) {
			COUNTRYPRECOMPILEDDATA = JSON.parse(countryResponse);
		}
        appCommonFunctionality.bindCountryDropdown('country', 482);
        const customerId = appCommonFunctionality.getUrlParameter('customerId');
        if (customerId && parseInt(customerId) > 0) {
            appCommonFunctionality.ajaxCall('GETCUSTOMER&customerId=' + customerId, parent.mapCustomerDetails);
        }
        $('#customerDeliveryAddressModal').modal('hide');
    };

    parent.bindCustomerDeliveryAddressTable = function(data) {
        const customerData = JSON.parse(data);
        let str = `<table id="customerDeliveryAddressTable" class="w3-table w3-striped w3-bordered w3-hoverable w3-white"><tbody><tr><td width="95%"><strong id="cms_248">Delivery Address</strong></td><td width="5%"></td></tr>`;
        
        if (customerData.length > 0) {
            customerData.forEach(data => {
                str += `<tr class="f12"><td width="90%"><b rel="cms_193">Company Name</b>: ${data.companyName} | <b rel="cms_195">Contact person</b>: ${data.contactPerson} | <b rel="cms_222">Phone</b>: ${data.phone} | <b>Email</b>: <a href="mailto: ${data.email}" class="blueText">${data.email}</a> | <b rel="cms_216">Address</b>: ${data.address} | <b rel="cms_220">Town</b>: ${data.town} | <b rel="cms_218">Postcode</b>: ${data.postCode} | <b rel="cms_249">Country</b>: <span>${appCommonFunctionality.getCountryName(data.country, true)}</span></td><td width="5%"><i class="fa fa-trash-o redText hover pull-right" onClick="customerFunctionality.deleteCustomerDeliveryAddress(${data.deliveryAddressId})"></i></td></tr>`;
            });
			$('#createOrder').prop('disabled', false);
        } else {
            str += '<tr class="f12"><td colspan="2">No Data</td></tr>';
			$('#createOrder').prop('disabled', true);
        }
        
        str += '</tbody></table>';
        $("#customerDeliveryAddressTableHolder").html(str);
    };

    parent.deleteCustomerDeliveryAddress = function(deliveryAddressId) {
        appCommonFunctionality.ajaxCall('DELETEDELIVERYADDRESS&deliveryAddressId=' + deliveryAddressId, parent.handleResponseNGoToCustomerDetail);
    };

    parent.submitDeliveryAddress = function() {
        if (validateDeliveryAddressForm()) {
            const customerDeliveryAddress = {
                companyName: $("#companyName").val(),
                contactPerson: $("#contactPerson").val(),
                phone: $('#phoneExtension').text() + ' ' + $("#phone").val(),
                email: $("#email").val(),
                address: $("#address").val(),
                postCode: $("#postCode").val(),
                town: $("#town").val(),
                country: $("#country").val(),
                customerId: $("#customerId").val()
            };
            resetCustomerDeliveryAddressForm();
            appCommonFunctionality.ajaxCallLargeData('ADDDELIVERYADDRESS', customerDeliveryAddress, parent.handleResponseNGoToCustomerDetail);
        }
    };
	
	parent.handleResponseNGoToCustomerDetail = function(response){
		parent.goToCustomerDetail(appCommonFunctionality.getUrlParameter('customerId'));
	}

    parent.openSignatureModal = function() {
        $('#signatureModal').modal('show');
        setTimeout(function() {
            if ($("#signatureModal").length > 0) {
                const signatureCanvasW = $('#signatureCanvas').width();
                const winH = screen.height;
                $("#signatureCanvas").html(`<canvas id='signature' width='${(signatureCanvasW * 98 / 100)}px' height='${(winH * 50 / 100)}px'></canvas>`);
                const canvas = document.getElementById("signature");
                const signaturePad = new SignaturePad(canvas);
                INITIALCUSTSIGNDATA = canvas.toDataURL();
            }
        }, 2000);
    };

    parent.processCustomerSignature = function() {
        const canvas = document.getElementById("signature");
        if (INITIALCUSTSIGNDATA === canvas.toDataURL()) {
            alert(appCommonFunctionality.getCmsString(260));
        } else {
            $('#signatureModal').modal('hide');
            $("#customerSignBase64").val(canvas.toDataURL());
            const customerSignData = {
                customerId: $("#customerId").val(),
                customerSignData: $("#customerSignBase64").val()
            };
            appCommonFunctionality.ajaxCallLargeData('CUSTOMERSIGNATURE', customerSignData, appCommonFunctionality.reloadPage);
        }
    };

    parent.deleteCustomerSignature = function(customerId) {
        appCommonFunctionality.ajaxCall('DELETECUSTOMERSIGNATURE&customerId=' + customerId, appCommonFunctionality.reloadPage);
    };
	
	parent.gotoSaleOrder = function(customerId){
		window.location = 'saleOrderEntry.php?customerId=' + customerId;
	};
	
	parent.searchOrder = function(customerId){
		window.location = 'saleOrders.php?customerId=' + customerId;
	};
	
	parent.gotoCustomerBalanceSheet = function(customerId){
		window.location = 'customerBalanceSheet.php?customerId=' + customerId;
	};
	
	parent.initCustomerBalancesheet = async function (){
		appCommonFunctionality.adjustMainContainerHight('customerSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		financeViewToggleFunctionality();
		const customerId = appCommonFunctionality.getUrlParameter('customerId');
		if(parseInt(customerId) > 0){
			CUSTOMERBALANCESHEETCRITERIA.customerId = parseInt(customerId);
			appCommonFunctionality.ajaxCallLargeData("CUSTOMERBALANCESHEET", CUSTOMERBALANCESHEETCRITERIA, receiveCustomerBalancesheetResponse);
		}else{
			parent.goToCustomers();
		}
	};
	
	const receiveCustomerBalancesheetResponse = function(balancesheetResponse) {
		FINANCEDATA = JSON.parse(balancesheetResponse);
		populateFinanceTable(CUSTOMERBALANCESHEETVEWCRITERIA.viewType);
		if(appCommonFunctionality.isMobile()){
			$('#financeViewHolder').removeClass('marRig5');
		}
	};
	
	const financeViewToggleFunctionality = function () {
		$('#financeView .option').on('click', function () {
			const selectedValue = $(this).data('value');
			$('#financeView .option').removeClass('selected');
			$(this).addClass('selected');
			CUSTOMERBALANCESHEETVEWCRITERIA.viewType = selectedValue;
			populateFinanceTable(CUSTOMERBALANCESHEETVEWCRITERIA.viewType);
		});
	};
	
	const populateFinanceTable = function(displaySetting) {
		const currencySymbol = appCommonFunctionality.getDefaultCurrency();
		const isCustomerView = displaySetting === 'CUSTOMERVIEW';
		let str = `
			<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white minW1180 f12">
				<thead>
					<tr>
						<th width="15%" id="cms_945">Date</th>
						<th width="5%" id="cms_946">Type</th>
						<th width="50%" id="cms_947">Narration</th>
						<th width="10%">${isCustomerView ? '<span id="cms_949">Paid Amount</span>' : '<span id="cms_950">Order Amount</span>'}</th>
						<th width="10%">${isCustomerView ? '<span id="cms_950">Order Amount</span>' : '<span id="cms_949">Paid Amount</span>'}</th>
						<th width="10%" id="cms_948">Balance</th>
					</tr>
				</thead>
				<tbody class="f12">`;
		let runningBalance = 0;
		FINANCEDATA.forEach(transaction => {
			const dateObj = new Date(transaction.transactionDate);
			const formattedDate = dateObj.toLocaleString('en-US', {
				month: 'short',
				day: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			}).replace(',', ' -');
			const displayDebit = isCustomerView ? transaction.Credit : transaction.Debit;
			const displayCredit = isCustomerView ? transaction.Debit : transaction.Credit;
			const displayType = isCustomerView ? 
				(transaction.narrationType === 'Debit' ? 'Credit' : 'Debit') : 
				transaction.narrationType;
			runningBalance += (transaction.Credit || 0) - (transaction.Debit || 0);
			const debitAmount = displayDebit ? `${currencySymbol}${displayDebit.toFixed(2)}` : '';
			const creditAmount = displayCredit ? `${currencySymbol}${displayCredit.toFixed(2)}` : '';
			const balanceAmount = `${currencySymbol}${Math.abs(runningBalance).toFixed(2)}`;
			const balanceClass = runningBalance >= 0 ? 'greenText' : 'redText';
			const balanceSign = runningBalance >= 0 ? '' : '-';
			str += `
				<tr>
					<td>${formattedDate}</td>
					<td>${displayType}</td>
					<td>${transaction.narration}</td>
					<td class="text-end ${isCustomerView ? 'greenText' : 'redText'}">${debitAmount}</td>
					<td class="text-end ${isCustomerView ? 'redText' : 'greenText'}">${creditAmount}</td>
					<td class="text-end ${balanceClass}"><b>${balanceSign}${balanceAmount}</b></td>
				</tr>`;
		});
		str += `
				</tbody>
			</table>`;
		$('#financeTableHolder').html(str);
	};
	
	parent.openFinanceSearchModal = function(){
		$('#searchModal').modal('show');
	};
	
	parent.financeStatementSearch = function(){
		let fromDate = $('#fromDate').val();
		let toDate = $('#toDate').val();
		$('#searchModal').modal('hide');
		CUSTOMERBALANCESHEETCRITERIA.fromDate = fromDate;
		CUSTOMERBALANCESHEETCRITERIA.toDate = toDate;
		appCommonFunctionality.ajaxCallLargeData("CUSTOMERBALANCESHEET", CUSTOMERBALANCESHEETCRITERIA, receiveCustomerBalancesheetResponse);
	};
	
	parent.resetFinanceStatementSearch = function(){
		$('#fromDate, #toDate').val('');
	};
	
	parent.printFinancialStatements = function(){
		localStorage.setItem('CUSTOMERBALANCESHEETCRITERIA', JSON.stringify(CUSTOMERBALANCESHEETCRITERIA));
		localStorage.setItem('CUSTOMERBALANCESHEETVEWCRITERIA', JSON.stringify(CUSTOMERBALANCESHEETVEWCRITERIA));
		window.open('customerBalanceSheetPrint.php', '_blank');
	};
	
	parent.initCustomerBalancesheetPrint = async function(){
		await appCommonFunctionality.adminCommonActivity();
		const retrieveCriteria = (key) => {
			const data = localStorage.getItem(key);
			if (!data) {
				parent.goToCustomers();
				return null;
			}
			localStorage.removeItem(key);
			return JSON.parse(data);
		};
		const searchCriteria = retrieveCriteria("CUSTOMERBALANCESHEETCRITERIA");
		const viewCriteria = retrieveCriteria("CUSTOMERBALANCESHEETVEWCRITERIA");
		if (!searchCriteria && !viewCriteria) return;
		CUSTOMERBALANCESHEETCRITERIA = searchCriteria;
		CUSTOMERBALANCESHEETVEWCRITERIA = viewCriteria;
		appCommonFunctionality.ajaxCallLargeData("CUSTOMERBALANCESHEET", CUSTOMERBALANCESHEETCRITERIA, receiveCustomerBalancesheetResponse);
	};
	
	/*--------------------------------Additioanl Functions----------------------------------------*/
	
	const bindDropdown = function(selector, data, valueField, textField) {
		if (data.length > 0) {
			const $dropdown = $(selector);
			data.forEach(option => {
				$dropdown.append($('<option>', {
					value: option[valueField] || option,
					text: option[textField] || option
				}));
			});
		}
	};

	const bindCompanyTypeDDL = function() {
		bindDropdown('#companyType', COMPANYTYPEPRECOMPILEDDATA, 'companyTypeId', 'companyType');
	};

	const bindCustomerGradeDDL = function() {
		bindDropdown('#customerGrade', CUSTOMERGRADEPRECOMPILEDDATA, 'customerGradeId', 'customerGrade');
	};

	parent.formatInputValue = function(inputId) {
		const inputMap = {
			companyName: /^[^a-z0-9 _@.,#&+-]/gi,
			buyerName: /^[^a-z0-9 ]/gi,
			contactPersonFirstname: /^[^a-z0-9 ]/gi,
			contactPersonSurname: /^[^a-z0-9 ]/gi,
			postCode: /^[^a-z0-9 ]/gi,
			phone: /^[^0-9 +]/gi,
			fax: /^[^0-9 +]/gi,
			email: /^[^a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
			mobile: /^[^0-9 +]/gi,
			bank: /^[^a-z0-9 /-]/gi,
			accountNo: /^[^0-9 ]/gi,
			sortCode: /^[^0-9 ]/gi
		};

		let value = $("#" + inputId).val();
		if (inputMap[inputId]) {
			if (inputId === "postCode") {
				value = value.toUpperCase(); // Postcode specific formatting
			}
			$("#" + inputId).val(value.replace(inputMap[inputId], ''));
		}
	};

	const toggleSwitchInputs = function() {
		$('.slider').each(function() {
			const inputId = this.id.replace("Slider", "");
			$("#" + inputId + "_lbl_1").toggle(parseInt($("#" + inputId).val()));
			$("#" + inputId + "_lbl_0").toggle(!parseInt($("#" + inputId).val()));
		});
	};

	const mapBuyerName = function() {
		const buyerName = $("#buyerName").val();
		if (buyerName) {
			const parts = buyerName.split(".");
			$("#buyerNameTitle").val(parts[0]);
			if (parts.length > 1) {
				const buyingManagerNameArr = parts[1].trim().split(" ");
				$("#buyerFirstName").val(buyingManagerNameArr.slice(0, -1).join(" "));
				$("#buyerLastName").val(buyingManagerNameArr[buyingManagerNameArr.length - 1]);
			} else {
				$("#buyerFirstName").val(buyerName);
			}
		}
	};

	const mapContactPersonName = function() {
		const contactPerson = $("#contactPerson").val();
		if (contactPerson) {
			const parts = contactPerson.split(".");
			$("#contactPersonTitle").val(parts[0]);
			if (parts.length > 1) {
				const contactPersonNameArr = parts[1].trim().split(" ");
				$("#contactPersonFirstname").val(contactPersonNameArr.slice(0, -1).join(" "));
				$("#contactPersonSurname").val(contactPersonNameArr[contactPersonNameArr.length - 1]);
			} else {
				$("#contactPersonFirstname").val(contactPerson);
			}
		}
	};

	const mapBankInformationFields = function() {
		let bankDetails = $("#bankDetails").val();
		if (bankDetails.length > 0) {
			bankDetails = bankDetails.replace(/'/g, '"');
			bankDetails = JSON.parse(bankDetails);
			if (bankDetails !== null) {
				if (bankDetails.hasOwnProperty("accountHolderName")) {
					if ($("#accountHolderName").is(':input')) {
						$("#accountHolderName").val(bankDetails.accountHolderName);
					} else {
						$("#accountHolderName").html(' ' + bankDetails.accountHolderName);
					}
				}
				if (bankDetails.hasOwnProperty("accountNo")) {
					if ($("#accountNo").is(':input')) {
						$("#accountNo").val(bankDetails.accountNo);
					} else {
						$("#accountNo").html(' ' + bankDetails.accountNo);
					}
				}
				if (bankDetails.hasOwnProperty("bank")) {
					if ($("#bank").is(':input')) {
						$("#bank").val(bankDetails.bank);
					} else {
						$("#bank").html(' ' + bankDetails.bank);
					}
				}
				if (bankDetails.hasOwnProperty("sortCode")) {
					if ($("#sortCode").is(':input')) {
						$("#sortCode").val(bankDetails.sortCode);
					} else {
						$("#sortCode").html(' ' + bankDetails.sortCode);
					}
				}
			}
		}
	};

	const validateCustomerEntry = function(focusEnabled) {
		let errorCount = 0;

		const validations = [
			{ id: "companyName", required: true },
			{ id: "companyType", required: true, type: "select", parse: parseInt },
			{ id: "customerGrade", required: true },
			{ id: "buyerFirstName", required: true },
			{ id: "contactPersonFirstname", required: true },
			{ id: "address", required: true },
			{ id: "postCode", required: true, parse: (val) => val.replace(/[^a-z0-9 ]/gi, '').toUpperCase() },
			{ id: "country", required: true },
			{ id: "phone", required: false, minLength: 9, maxLength: 17 },
			{ id: "email", required: false, regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
			{ id: "bankDetails", required: false }
		];

		validations.forEach(({ id, required, parse, minLength, maxLength, regex }) => {
			let value = $("#" + id).val();
			if (parse) value = parse(value);
			if (value === "" && required) {
				appCommonFunctionality.raiseValidation(id, "", false);
				if (focusEnabled) $("#" + id).focus();
				errorCount++;
			} else if (minLength && value.length < minLength) {
				appCommonFunctionality.raiseValidation(id, "", false);
				errorCount++;
			} else if (maxLength && value.length > maxLength) {
				appCommonFunctionality.raiseValidation(id, "", false);
				errorCount++;
			} else if (regex && !regex.test(value)) {
				appCommonFunctionality.raiseValidation(id, "", false);
				errorCount++;
			} else {
				appCommonFunctionality.removeValidation(id, id, false);
			}
		});
		
		$("#buyerName").val($("#buyerNameTitle").val() + '. ' + $("#buyerFirstName").val() + ' ' + $("#buyerLastName").val());
		$("#contactPerson").val($("#contactPersonTitle").val() + '. ' + $("#contactPersonFirstname").val() + ' ' + $("#contactPersonSurname").val());

		const bankDetails = {
			accountHolderName: $("#accountHolderName").val(),
			bank: $("#bank").val(),
			accountNo: $("#accountNo").val(),
			sortCode: $("#sortCode").val()
		};
		$("#bankDetails").val(JSON.stringify(bankDetails));

		return errorCount === 0;
	};

	parent.onSwitchSameAddress = function(switchId) {
		const inputId = switchId.replace("_switch", "");
		const isSameAddress = parseInt($("#" + inputId).val());

		$("#" + inputId).val(isSameAddress ? 0 : 1);
		$("#" + inputId).prop('checked', !isSameAddress);
		$("#" + inputId + "_lbl_1").toggle(!isSameAddress);
		$("#" + inputId + "_lbl_0").toggle(isSameAddress);

		const resetBillingFields = () => {
			$("#contactPerson, #phone, #email, #address, #postCode, #town").val('');
			$("#flagImg").attr('src', PROJECTPATH + 'assets/images/flag.jpg');
		};

		if (isSameAddress) {
			resetBillingFields();
		} else {
			$("#contactPerson").val($("#contactPersonVal").text());
			$("#phone").val($("#phoneVal").text());
			$("#email").val($("#emailVal").text());
			$("#address").val($("#addressVal").text());
			$("#postCode").val($("#postCodeVal").text());
			$("#town").val($("#townVal").text());
			appCommonFunctionality.bindCountryDropdown('country', 482);
			
			/*-------------------------Phone No allication with filter----------------------*/
			let phoneVal = $("#phoneVal").text().trim();
			let phoneExtension = $('#phoneExtension').text().trim();
			if (phoneVal.startsWith(phoneExtension)) {
				phoneVal = phoneVal.substring(phoneExtension.length).trim();
			}
			$("#phone").val(phoneVal); 
			/*-------------------------Phone No allication with filter----------------------*/
		}
	};

	const resetCustomerDeliveryAddressForm = function() {
		$("#companyName, #contactPerson, #phone, #email, #address, #postCode, #town").val('');
		$("#country").prop("selectedIndex", 0);
	};

	const validateDeliveryAddressForm = function() {
		let errorCount = 0;

		const validations = [
			{ id: "companyName", required: true },
			{ id: "contactPerson", required: true },
			{ id: "phone", required: false, minLength: 9, maxLength: 17 },
			{ id: "email", required: false, regex: /^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,63}$/ },
			{ id: "address", required: true },
			{ id: "postCode", required: true },
			{ id: "country", required: true },
			{ id: "town", required: true }
		];

		validations.forEach(({ id, required, minLength, maxLength, regex }) => {
			const value = $("#" + id).val();
			if (required) {
				if (value === "") {
					appCommonFunctionality.raiseValidation(id, "", false);
					errorCount++;
				}
			} else {
				if (minLength && value.length < minLength) {
					appCommonFunctionality.raiseValidation(id, "", false);
					errorCount++;
				} else if (maxLength && value.length > maxLength) {
					appCommonFunctionality.raiseValidation(id, "", false);
					errorCount++;
				} else if (regex && !regex.test(value)) {
					appCommonFunctionality.raiseValidation(id, "", false);
					errorCount++;
				} else {
					appCommonFunctionality.removeValidation(id, id, false);
				}
			}
		});

		return errorCount === 0;
	};

	const getCompanyType = function(companyTypeId) {
		const companyType = COMPANYTYPEPRECOMPILEDDATA.find(item => parseInt(item.companyTypeId) === parseInt(companyTypeId));
		return companyType ? companyType.companyType : '';
	};
	
	const setDefaultCountryOnLoad = function(countryId){
		$('#country').val(countryId).trigger('change');
	};
	/*--------------------------------Additioanl Functions----------------------------------------*/

    return parent;
}(window, window.$));

