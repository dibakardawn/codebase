const MENUSELECTIONITEM = "finance.php";

/*-----------------Pre-Compiled Variables---------------------------------*/
let EXPENSETYPEPRECOMPILEDDATA = [];
let EARNINGTYPEPRECOMPILEDDATA = [];
/*-----------------Pre-Compiled Variables---------------------------------*/

/*-----------------Commonly Used Variables--------------------------------*/
let FINANCEDATA = [];
let CALENDAR_DATA = [];
/*-----------------Commonly Used Variables--------------------------------*/

/*-----------------Search & Selected Variables----------------------------*/
let FINANCESEARCHCRITERIA = {
    fromDate: "",
    toDate: "",
    trxType: "",
    customerId: 0,
	supplierId: 0,
	financeCategoryId: 0,
	finKeyword: ""
};
let FINANCEVEWCRITERIA = {
	viewType: "TABLE"
};
let SEARCHCUSTOMERCRITERIA = {
    keyword: "",
    companyTypeId: "",
    customerGrade: "",
    status: 1
};
let SEARCHSUPPLIERCRITERIA = {
	keyword : ''
}
/*-----------------Search & Selected Variables----------------------------*/

const PAGEDOCNAME = appCommonFunctionality.getPageName();

$(document).ready(function () {
	
	/*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function () {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
	switch (PAGEDOCNAME) {
		
        case "finance.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=EXPENSETYPE'),
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=EARNINGTYPE')
			).done(function(expenseTypeResponse, earningTypeResponse) {
				// Both AJAX calls completed successfully
				appCommonFunctionality.hideLoader();
				financeFunctionality.initFinance(expenseTypeResponse[0], earningTypeResponse[0]);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
		case "financeEntry.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=EXPENSETYPE'),
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=EARNINGTYPE')
			).done(function(expenseTypeResponse, earningTypeResponse) {
				// Both AJAX calls completed successfully
				appCommonFunctionality.hideLoader();
				financeFunctionality.initFinanceEntry(expenseTypeResponse[0], earningTypeResponse[0]);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
		case "financeDetails.php":{
			financeFunctionality.initFinanceDetail();
            break;
		}
		
		case "financialReport.php":{
			financeFunctionality.initFinancialReport();
            break;
		}
    }
	
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const financeFunctionality = (function (window, $) {
	const parent = {};

	parent.initFinance = async function (expenseTypeResponse, earningTypeResponse){
		try {
			appCommonFunctionality.adjustMainContainerHight('financeSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			EXPENSETYPEPRECOMPILEDDATA = JSON.parse(expenseTypeResponse);
			EARNINGTYPEPRECOMPILEDDATA = JSON.parse(earningTypeResponse);
			financeViewToggleFunctionality();
			debitCreditToggleFunctionality();
			bindFinanceCategoryDropdown();
			/*----------------------Customer Search implementation-----------------------------*/
			$("#customerSearch").on('keyup', function () {
				const customerSearchKeyword = $(this).val();
				if (customerSearchKeyword.length > 2) {
					SEARCHCUSTOMERCRITERIA.keyword = customerSearchKeyword;
					$('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
					appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
				} else {
					$('#customerSearchResult').html('');
				}
			});
			/*----------------------Customer Search implementation-----------------------------*/
			/*----------------------Supplier Search implementation----------------------------*/
			$("#supplierSearch").on('keyup', function () {
				const supplierSearchKeyword = $(this).val();
				if (supplierSearchKeyword.length > 2) {
					SEARCHSUPPLIERCRITERIA.keyword = supplierSearchKeyword;
					$('#supplierGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
					appCommonFunctionality.ajaxCallLargeData('GETSUPPLIERS', SEARCHSUPPLIERCRITERIA, populateSupplierSuggestionBox);
				} else {
					$('#customerSearchResult').html('');
				}
			});
			/*----------------------Supplier Search implementation----------------------------*/
			appCommonFunctionality.ajaxCallLargeData(
				"FINANCESTATEMENT",
				FINANCESEARCHCRITERIA,
				receiveFinanceResponse
			);
			
			if (appCommonFunctionality.isMobile()) {
				$('.modal-body .noRightPaddingOnly').each(function() {
					if ($(this).hasClass('noRightPaddingOnly')) {
						$(this).removeClass('noRightPaddingOnly').addClass('nopaddingOnly');
					}
				});
			}
		} catch (error) {
			console.error('Error during finance initialization:', error);
		}
	};
	
	const financeViewToggleFunctionality = function () {
		const viewMap = {
			TABLE: {
				selector: '#financeTableHolder',
				callback: null
			},
			BAR: {
				selector: '#financeBarChartHolder',
				callback: populateBarChart
			},
			LINE: {
				selector: '#financeLineChartHolder',
				callback: populateLineChart
			},
			PIE: {
				selector: '#financePieChartHolder',
				callback: populatePieChart
			},
			CALENDER: {
				selector: '#financeCalenderHolder',
				callback: populateCalenderView
			}
		};

		$('#financeView .option').on('click', function () {
			const selectedValue = $(this).data('value');
			$('#financeView .option').removeClass('selected');
			$(this).addClass('selected');
			$('.financeViewSection').addClass('hide');
			const view = viewMap[selectedValue];
			if (view) {
				$(view.selector).removeClass('hide');
				if (typeof view.callback === 'function') {
					view.callback();
				}
				FINANCEVEWCRITERIA.viewType = selectedValue;
			}
		});
	};

	const debitCreditToggleFunctionality = function(){
		$('#debitCreditToggle .option').on('click', function () {
			$('#debitCreditToggle .option').removeClass('selected');
			$(this).addClass('selected');
			const selectedValue = $(this).data('value');
			FINANCESEARCHCRITERIA.trxType = selectedValue;
			$('#trxType').val(selectedValue);
		});
	};
	
	const bindFinanceCategoryDropdown = function () {
		const $dropdown = $('#financeCategoryDDL');
		const combinedData = [
			...EARNINGTYPEPRECOMPILEDDATA.map(item => ({
				value: item.earningTypeId,
				text: item.earningTypeTitle
			})),
			...EXPENSETYPEPRECOMPILEDDATA.map(item => ({
				value: item.expenseTypeId,
				text: item.expenseTypeTitle
			}))
		];
		combinedData.forEach(item => {
			$dropdown.append($('<option>', {
				value: item.value,
				text: item.text
			}));
		});
	};

	const bindExpenseTypeDropdown = function () {
		const $dropdown = $('#expenseTypeDDL');
		$.each(EXPENSETYPEPRECOMPILEDDATA, function (index, item) {
			$dropdown.append(`<option value="${item.expenseTypeId}">${item.expenseTypeTitle}</option>`);
		});
	};
	
	const bindEarningTypeDropdown = function () {
		const $dropdown = $('#earningTypeDDL');
		$.each(EARNINGTYPEPRECOMPILEDDATA, function (index, item) {
			$dropdown.append(`<option value="${item.earningTypeId}">${item.earningTypeTitle}</option>`);
		});
	};

	const populateCustomerSuggestionBox = function (data) {
        $('#customerGroupAddonIcon').removeClass('fa-spinner fa-spin').addClass('fa-search');
        const customerData = JSON.parse(data);
        const customerResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        let str = '';
        if (customerData.length > 0) {
            customerData.forEach(customer => {
                const customerId = customer.customerId;
                const customerGrade = customer.customerGrade;
                str += `<div id="customerResultItem_${customerId}" class="${customerResultItemClass} hover" onclick="financeFunctionality.onSelectingCustomer(${customerId}, '${customerGrade}')">`;
                str += `<div class="f16">${customer.companyName} [${customerGrade}]</div>
                            <div class="f12">
                                <strong><span id="cms_741">${appCommonFunctionality.getCmsString(741)}</span>: </strong>
                                <span class="blueText">${customer.buyerName}</span><br>
                                <strong><span id="cms_740">${appCommonFunctionality.getCmsString(740)}</span>: </strong>
                                <span class="blueText">${customer.contactPerson}</span>
                            </div>`;
				if (!appCommonFunctionality.isMobile()) {
					str += `<div class="f12">
								<i class="fa fa-phone blueText"></i> ${customer.phone}<br>
								<i class="fa fa-envelope greenText"></i> <span class="blueText">${customer.email}</span>
							</div>`;
				}
                str += `</div>`;
            });
        } else {
            str += '<div class="customerResultItem">No Data</div>';
        }

        $("#customerSearchResult").html(str);
        $("#selectedCustomerTitle, #saleOrderControlButtonHolder").addClass('hide');
		//$('#placeOrderBtn').attr('disabled', true);
        $("#selectedCustomerSection, #customerDeliveryAddressTableHolder").html('');
    };

    parent.onSelectingCustomer = function (customerId, customerGrade) {
		FINANCESEARCHCRITERIA.customerId = customerId;
		$("#selectedCustomerId").val(customerId);
        const customerResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        $("#selectedCustomerSection").html($(`#customerResultItem_${customerId}`).html()).addClass(customerResultItemClass);
        $("#selectedCustomerTitle").removeClass('hide');
        $('#customerSearchResult').html('');
    };
	
	const populateSupplierSuggestionBox = function(responseData){
		$('#supplierGroupAddonIcon').removeClass('fa-spinner fa-spin').addClass('fa-search');
		const supplierData = JSON.parse(responseData);
		const supplierResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        let str = '';
        if (supplierData.length > 0) {
            supplierData.forEach(supplier => {
                const supplierId = supplier.supplierId;
				str = str + '<div id="supplierResultItem_' + supplierId + '" class="customerResultItem hover" onclick="financeFunctionality.onSelectingSupplier(' + supplierId + ')">';
					str = str + '<div class="f16">' + supplier.supplierName + ' (' + supplier.supplierContactPerson + ')</div>';
				str = str + '</div>';
            });
        } else {
            str += '<div class="supplierResultItem">No Data</div>';
        }

        $("#supplierSearchResult").html(str);
        $("#selectedSupplierTitle, #purchaseOrderControlButtonHolder").addClass('hide');
        $("#selectedsupplierSection").html('');
	};
	
	parent.onSelectingSupplier = function (supplierId) {
		FINANCESEARCHCRITERIA.supplierId = supplierId;
		$("#selectedSupplierId").val(supplierId);
        const supplierResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        $("#selectedSupplierSection").html($(`#supplierResultItem_${supplierId}`).html()).addClass(supplierResultItemClass);
        $("#selectedSupplierTitle, #purchaseOrderControlButtonHolder").removeClass('hide');
        $('#supplierSearchResult').html('');
		$('#supplierSearch').val('');
    };
	
	parent.onChangeFinanceCategory = function(){
		const financeCategoryId = $('#financeCategoryDDL').val();
		FINANCESEARCHCRITERIA.financeCategoryId = parseInt(financeCategoryId);
	};
	
	parent.selectORDType = function(ORDType){
		$('#keywordSpan').text(ORDType + '_');
	};
	
	parent.formatKeyword = function(){
		var value = $('#keyword').val().trim();
        if (/^\d+$/.test(value)) {
            $('#keyword').val(value.padStart(4, '0'));
        }else if (/^[a-zA-Z]+$/.test(value)) {
            $('#keyword').val(value.toUpperCase());
        }
	};

	const receiveFinanceResponse = function (financeResponse) {
		try {
			FINANCEDATA = JSON.parse(financeResponse);
			const viewType = FINANCEVEWCRITERIA.viewType;
			$('.financeViewSection').addClass('hide');
			const viewActions = {
				TABLE: { action: populateFinanceTable, selector: '#financeTableHolder' },
				BAR: { action: () => setTimeout(populateBarChart, LOADTIME), selector: '#financeBarChartHolder' },
				LINE: { action: () => setTimeout(populateLineChart, LOADTIME), selector: '#financeLineChartHolder' },
				PIE: { action: () => setTimeout(populatePieChart, LOADTIME), selector: '#financePieChartHolder' },
				CALENDER: { action: () => setTimeout(populateCalenderView, LOADTIME), selector: '#financeCalenderHolder' }
			};
			if (viewActions[viewType]) {
				viewActions[viewType].action();
				$(viewActions[viewType].selector).removeClass('hide');
			}
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
		} catch (error) {
			console.error('Error processing finance response:', error);
		}
	};

	const populateFinanceTable = function () {
		if (!Array.isArray(FINANCEDATA) || FINANCEDATA.length === 0) {
			$('#financeTableHolder').html('<p>No Data</p>');
			return;
		}
		let tableClass = "w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white";
		if (PAGEDOCNAME === "finance.php") {
			tableClass += " minW1180";
		}
		let str = `
			<table class="${tableClass}">
				<thead>
					<tr>
						<th width="15%">
							<i class="fa fa-sort-amount-asc hover marRig5 no-print" onclick="financeFunctionality.sortFinanceTable('ASC')"></i>
							<span id="cms_748">${appCommonFunctionality.getCmsString(748)}</span>
							<i class="fa fa-sort-amount-desc hover marleft5 no-print" onclick="financeFunctionality.sortFinanceTable('DESC')"></i>
						</th>
						<th width="5%" id="cms_749">${appCommonFunctionality.getCmsString(749)}</th>
						<th width="50%" id="cms_750">${appCommonFunctionality.getCmsString(750)}</th>
						<th width="10%" id="cms_751">${appCommonFunctionality.getCmsString(751)}</th>
						<th width="10%" id="cms_752">${appCommonFunctionality.getCmsString(752)}</th>
						<th width="10%" id="cms_753">${appCommonFunctionality.getCmsString(753)}</th>
					</tr>
				</thead>
				<tbody class="f12">
		`;
		let runningBalance = 0;
		const balances = [];
		for (let i = FINANCEDATA.length - 1; i >= 0; i--) {
			const row = FINANCEDATA[i];
			const debit = parseFloat(row.Debit);
			const credit = parseFloat(row.Credit);
			runningBalance += credit - debit;
			balances[i] = runningBalance;
		}
		FINANCEDATA.forEach((row, i) => {
			const date = new Date(row.transactionDate).toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false
			}).replace(',', ' -');
			const debit = parseFloat(row.Debit).toFixed(2);
			const credit = parseFloat(row.Credit).toFixed(2);
			const balance = balances[i].toFixed(2);
			const narrationCell = PAGEDOCNAME === "finance.php"
				? `<a href="${generateNarrationLink(row.narrationCode)}" target="_blank">${row.narrationCode}</a> - ${row.narration}`
				: `${row.narrationCode} - ${row.narration}`;

			str += `
				<tr>
					<td>${date}</td>
					<td>${row.narrationType}</td>
					<td>${narrationCell}</td>
					<td class="text-end redText">${debit !== '0.00' ? appCommonFunctionality.getDefaultCurrency() + debit : ''}</td>
					<td class="text-end greenText">${credit !== '0.00' ? appCommonFunctionality.getDefaultCurrency() +credit : ''}</td>
					<td class="text-end ${balance < 0 ? 'redText' : 'greenText'}"><b>${appCommonFunctionality.getDefaultCurrency()}${balance}</b></td>
				</tr>
			`;
		});
		str += `
				</tbody>
			</table>
		`;
		$('#financeTableHolder').html(str);
	};
	
	parent.sortFinanceTable = function (order) {
		if (!Array.isArray(FINANCEDATA) || FINANCEDATA.length === 0) return;
		FINANCEDATA.sort((a, b) => {
			const dateA = new Date(a.transactionDate);
			const dateB = new Date(b.transactionDate);

			if (order === 'ASC') return dateA - dateB;
			else return dateB - dateA;
		});
		populateFinanceTable();
	};
	
	const generateNarrationLink = function(code) {
		if (!code) return '#';
		let id = code.split('_')[1];
		id = parseInt(id, 10);
		if (code.startsWith('ORDS')) {
			return `saleOrderDetails.php?orderId=${id}`;
		} else if (code.startsWith('ORDP')) {
			return `purchaseOrderDetails.php?purchaseOrderId=${id}`;
		} else if (code.startsWith('FIN')) {
			return `financeDetails.php?financeId=${id}`;
		}
		return '#';
	};

	const getGroupedFinanceData = () => {
		const grouped = {};
		FINANCEDATA.forEach(({ transactionDate, Debit, Credit }) => {
			const date = transactionDate.split(' ')[0];
			if (!grouped[date]) {
				grouped[date] = { Debit: 0, Credit: 0 };
			}
			grouped[date].Debit += Debit;
			grouped[date].Credit += Credit;
		});
		return grouped;
	};

	const prepareChartData = (grouped) => {
		const categories = Object.keys(grouped).sort();
		const debitData = categories.map(date => +grouped[date].Debit.toFixed(2));
		const creditData = categories.map(date => +grouped[date].Credit.toFixed(2));
		return { categories, debitData, creditData };
	};

	const getTooltipConfig = () => ({
		shared: true,
		valueDecimals: 2,
		valuePrefix: appCommonFunctionality.getDefaultCurrency()
	});

	const populateBarChart = () => {
		const grouped = getGroupedFinanceData();
		const { categories, debitData, creditData } = prepareChartData(grouped);

		Highcharts.chart('financeBarChartHolder', {
			chart: { type: 'column' },
			title: { text: appCommonFunctionality.getCmsString(781) },
			xAxis: {
				categories,
				crosshair: true
			},
			yAxis: {
				min: 0,
				title: { text: appCommonFunctionality.getCmsString(774) }
			},
			tooltip: getTooltipConfig(),
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0
				}
			},
			series: [
				{ name: appCommonFunctionality.getCmsString(751), data: debitData, color: '#f45b5b' },
				{ name: appCommonFunctionality.getCmsString(752), data: creditData, color: '#90ed7d' }
			]
		});
	};

	const populateLineChart = () => {
		const grouped = getGroupedFinanceData();
		const { categories, debitData, creditData } = prepareChartData(grouped);

		Highcharts.chart('financeLineChartHolder', {
			chart: { type: 'line' },
			title: { text: appCommonFunctionality.getCmsString(782) },
			xAxis: {
				categories,
				title: { text: appCommonFunctionality.getCmsString(748) }
			},
			yAxis: {
				title: { text: appCommonFunctionality.getCmsString(774) }
			},
			tooltip: getTooltipConfig(),
			series: [
				{ name: appCommonFunctionality.getCmsString(751), data: debitData, color: '#f45b5b' },
				{ name: appCommonFunctionality.getCmsString(752), data: creditData, color: '#90ed7d' }
			]
		});
	};
	
	const populatePieChart = () => {
		const totals = FINANCEDATA.reduce((acc, { Debit, Credit }) => {
			acc.Debit += Debit;
			acc.Credit += Credit;
			return acc;
		}, { Debit: 0, Credit: 0 });

		Highcharts.chart('financePieChartHolder', {
			chart: { type: 'pie' },
			title: { text: appCommonFunctionality.getCmsString(783) },
			tooltip: {
				pointFormat: '{series.name}: <b>{point.y:.2f}</b> ({point.percentage:.1f}%)'
			},
			accessibility: {
				point: { valueSuffix: '%' }
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: `<b>{point.name}</b>: ${appCommonFunctionality.getDefaultCurrency()}{point.y:.2f} ({point.percentage:.1f}%)`
					}
				}
			},
			series: [{
				name: 'Amount',
				colorByPoint: true,
				data: [
					{ name: appCommonFunctionality.getCmsString(751), y: +totals.Debit.toFixed(2), color: '#f45b5b' },
					{ name: appCommonFunctionality.getCmsString(752), y: +totals.Credit.toFixed(2), color: '#90ed7d' }
				]
			}]
		});
	};
	
	const populateCalenderView = function() {
		const groupedByDate = {};
		FINANCEDATA.forEach(item => {
			const date = item.transactionDate.split(' ')[0];
			if (!groupedByDate[date]) {
				groupedByDate[date] = { totalDebit: 0, totalCredit: 0 };
			}
			groupedByDate[date].totalDebit += item.Debit;
			groupedByDate[date].totalCredit += item.Credit;
		});
		for (const date in groupedByDate) {
			const { totalDebit, totalCredit } = groupedByDate[date];
			let title = '';

			if (totalCredit > 0) {
				title += `<b style="color:green;"> ${appCommonFunctionality.getCmsString(752)}: ${appCommonFunctionality.getDefaultCurrency()}${totalCredit.toFixed(2)}</b> <br>`;
			}
			if (totalDebit > 0) {
				title += `<b style="color:red;"> ${appCommonFunctionality.getCmsString(751)}: ${appCommonFunctionality.getDefaultCurrency()}${totalDebit.toFixed(2)}</b>`;
			}
			CALENDAR_DATA.push({
				id: Math.floor(Math.random() * 1000000),
				title: title.trim(),
				start: date,
				end: date,
				allDay: true
			});
		}
		populateFullCalendar();
	};

	const populateFullCalendar = function() {
		const calendarEl = document.getElementById('financeCalenderHolder');
		const today = moment().format('YYYY-MM-DD');

		const calendar = new FullCalendar.Calendar(calendarEl, {
			headerToolbar: {
				left: appCommonFunctionality.isMobile() ? 'prev,next' : 'prevYear,prev,next,nextYear today',
				center: 'title',
				right: 'timeGridDay,dayGridWeek,dayGridMonth'
			},
			initialDate: today,
			initialView: 'dayGridMonth',
			navLinks: false,
			editable: false,
			dayMaxEvents: true,
			visibleRange: {
				start: financeFunctionality.getCalculatedDate('START'),
				end: financeFunctionality.getCalculatedDate('END'),
			},
			events: CALENDAR_DATA,
			eventClick: function(info) {},
			eventContent: function(arg) {
				const customEl = document.createElement('div');
				customEl.innerHTML = arg.event.title;
				return { domNodes: [customEl] };
			},
			eventDidMount: function(info) {
				info.el.classList.remove('fc-h-event');
			}
		});

		calendar.render();
		if (appCommonFunctionality.isMobile()) {
			$("#fc-dom-1").css('font-size', '1.1em');
			$(".fc-toolbar-title").html('');
		}
	};
	
	parent.getCalculatedDate = function(direction) {
        const today = moment();
        let calculatedDate = direction === 'START' ? today.subtract(6, 'months') : today.add(12, 'months');
        return calculatedDate.format('YYYY-MM-DD');
    };

	parent.openFinanceSearchModal = function(){
		$('#searchModal').modal('show');
	};
	
	parent.financeStatementSearch = function(){
		if(validateFinanceStatementSearch()){
			FINANCESEARCHCRITERIA.fromDate = $("#fromDate").val();
			FINANCESEARCHCRITERIA.toDate = $("#toDate").val();
			FINANCESEARCHCRITERIA.trxType = $("#trxType").val();
			FINANCESEARCHCRITERIA.customerId = parseInt($("#selectedCustomerId").val());
			FINANCESEARCHCRITERIA.supplierId = parseInt($("#selectedSupplierId").val());
			FINANCESEARCHCRITERIA.financeCategoryId = parseInt($("#financeCategoryDDL").val());
			FINANCESEARCHCRITERIA.finKeyword = $("#keywordSpan").text() + $('#keyword').val();
			$('#searchModal').modal('hide');
			appCommonFunctionality.ajaxCallLargeData(
				"FINANCESTATEMENT",
				FINANCESEARCHCRITERIA,
				receiveFinanceResponse
			);
		}
	};
	
	const validateFinanceStatementSearch = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------FromDate & ToDate Validation----------------------------------------*/
		var fromDate = $("#fromDate").val();
		var toDate = $("#toDate").val();
		if(Date.parse(fromDate) > Date.parse(toDate)){
		   appCommonFunctionality.raiseValidation("fromDate", "", true);
		   appCommonFunctionality.raiseValidation("toDate", "", true);
		   errorCount++
		   alert(appCommonFunctionality.getCmsString(747));
		   appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(747), appCommonFunctionality.getLang());
		}else{
		   appCommonFunctionality.removeValidation("fromDate", "fromDate", true);
		   appCommonFunctionality.removeValidation("toDate", "toDate", true);
		}
		/*----------------------------------------------------FromDate & ToDate Validation----------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.resetFinanceStatementSearch = function(){
		$("#fromDate, #toDate, #keyword, #customerSearch, #supplierSearch, #trxType").val('');
		$('#debitCreditToggle .option').removeClass('selected');
		$('#debitCreditToggle .option').first().addClass('selected');
		$('#financeCategoryDDL, #selectedCustomerId, #selectedSupplierId').val(0);
		$('#keywordSpan, #customerSearchResult, #selectedCustomerSection, #supplierSearchResult, #selectedSupplierSection').html('');
		$('#selectedCustomerTitle, #selectedSupplierTitle').addClass('hide');
	};
	
	parent.gotoAddExpense = function(){
		window.location = `financeEntry.php`;
	};
	
	parent.initFinanceEntry = async function (expenseTypeResponse, earningTypeResponse){
		try {
			appCommonFunctionality.adjustMainContainerHight('financeSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			
			/*-------------------Expense types pre-compiled data manipulation--------------------*/
			EXPENSETYPEPRECOMPILEDDATA = JSON.parse(expenseTypeResponse);
			EXPENSETYPEPRECOMPILEDDATA = $.grep(EXPENSETYPEPRECOMPILEDDATA, function(item) {
				return item.expenseTypeId !== financeCategoryORDP;
			});
			bindExpenseTypeDropdown(); 
			/*-------------------Expense types pre-compiled data manipulation--------------------*/
			
			/*-------------------Earning types pre-compiled data manipulation--------------------*/
			EARNINGTYPEPRECOMPILEDDATA = JSON.parse(earningTypeResponse);
			EARNINGTYPEPRECOMPILEDDATA = $.grep(EARNINGTYPEPRECOMPILEDDATA, function(item) {
				return item.earningTypeId !== financeCategoryORDS;
			});
			bindEarningTypeDropdown(); 
			/*-------------------Earning types pre-compiled data manipulation--------------------*/
			
			$('#financeDate').val(appCommonFunctionality.getCurrentDatetime());
			if (appCommonFunctionality.isMobile()) {
				$("#financeTypeDDLHolder, #financeDateHolder, #expenseTypeDDLHolder, #totalexpenseHolder, #earningTypeDDLHolder, #earningTitleHolder, #totalEarningHolder").removeClass('noLeftPaddingOnly').addClass('noPaddingOnly');
				$("#financeTypeDDL, #expenseTypeDDL, #earningTypeDDL").removeClass('w240').addClass('w100p');
				$("#expenseDescriptionHolder, #earningDescriptionHolder").removeClass('noRightPaddingOnly').addClass('noPaddingOnly');
				$('#expenseDescription, #earningDescription').attr('rows', 5);
			}
		}catch (error) {
			console.error('Error during finance initialization:', error);
		}
	};
	
	parent.onChangeFinanceType = function () {
		const financeType = parseInt($('#financeTypeDDL').val(), 10);
		if (!isNaN(financeType)) {
			const isExpense = financeType === 0;
			$('#expenseSection').toggleClass('hide', !isExpense);
			$('#earningSection').toggleClass('hide', isExpense);
			if (isExpense) {
				parent.resetSectionInputs('earningSection');
			} else {
				parent.resetSectionInputs('expenseSection');
			}
			const isAnySectionVisible = !$('#expenseSection').hasClass('hide') || !$('#earningSection').hasClass('hide');
			$('#submitSection').toggleClass('hide', !isAnySectionVisible);
		} else {
			parent.resetSectionInputs('expenseSection');
			parent.resetSectionInputs('earningSection');
			$('#expenseSection, #earningSection, #submitSection').addClass('hide');
		}
	};

	parent.resetSectionInputs = function (sectionId) {
		const $section = $('#' + sectionId);
		$section.find('input').each(function () {
			const type = $(this).attr('type');
			if (type === 'file') {
				$(this).val('');
			} else {
				$(this).val('');
			}
		});
		$section.find('select').prop('selectedIndex', 0);
		$section.find('div[id$="FilesSelected"]').html('');
	};

	parent.listFiles = function (section, element) {
		if (section === 'inputSection') {
			const fileInput = element;
			const files = fileInput.files;
			const inputId = fileInput.id;
			const targetMap = {
				expenseDocument: 'expenseFilesSelected',
				earningDocument: 'earningFilesSelected'
			};
			const targetId = targetMap[inputId];
			if (!targetId) return;
			let str = '';
			for (let file of files) {
				const fileExtension = file.name.split('.').pop().toLowerCase();
				str += `
					<div class="fileList">
						<img src="${PROJECTPATH}assets/images/fileIcons/${fileExtension}.png" alt="${file.name}" class="supportingDocFileIcon">
						<span class="f12">${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
					</div>
				`;
			}
			$('#' + targetId).html(str);
		} else if (section === 'displaySection') {
			$('[id^=supportingDocuments_]').each(function () {
				const supportingDocuments = $(this).val();
				const [_, number] = this.id.split('_');
				if (supportingDocuments !== '') {
					const supportingDocumentsArr = supportingDocuments.split(',');
					let str = '';
					supportingDocumentsArr.forEach(fileName => {
						const fileExtension = fileName.split('.').pop().toLowerCase();
						str += `
							<div class="fileList">
								<img src="${PROJECTPATH}assets/images/fileIcons/${fileExtension}.png" alt="${fileName}" class="supportingDocFileIcon">
								<span class="f12">${fileName}</span>
								<a href="${PROJECTPATH}uploads/salesQuestionSuppotingDocument/${fileName}" target="_blank">
									<i class="fa fa-download greenText marRig5"></i>
								</a>
							</div>
						`;
					});
					$("#fileListHolder_" + number).html(str);
				}
			});
		}
	};
	
	validateFinanceEntryForm = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Finance Type Validation------------------------------*/
		if($("#financeTypeDDL").val() === ''){
			appCommonFunctionality.raiseValidation("financeTypeDDL", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("financeTypeDDL", "financeTypeDDL", true);
		}
		/*----------------------------------------------------Finance Type Validation------------------------------*/
		
		/*----------------------------------------------------Finance Date Validation------------------------------*/
		if($("#financeDate").val() === ''){
			appCommonFunctionality.raiseValidation("financeDate", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("financeDate", "financeDate", true);
		}
		/*----------------------------------------------------Finance Date Validation------------------------------*/
		
		if($("#financeTypeDDL").val() !== ''){
			if(parseInt($("#financeTypeDDL").val()) === 0){ //Expense Validation
				/*----------------------------------------------------Expense Type Validation------------------------------*/
				if($("#expenseTypeDDL").val() === ''){
					appCommonFunctionality.raiseValidation("expenseTypeDDL", "", true);
					errorCount++;
				} else { 
					appCommonFunctionality.removeValidation("expenseTypeDDL", "expenseTypeDDL", true);
				}
				/*----------------------------------------------------Expense Type Validation------------------------------*/
				
				/*----------------------------------------------------Expense Title Validation-----------------------------*/
				if($("#expenseTitle").val() === ''){
					appCommonFunctionality.raiseValidation("expenseTitle", "", true);
					errorCount++;
				} else { 
					appCommonFunctionality.removeValidation("expenseTitle", "expenseTitle", true);
				}
				/*----------------------------------------------------Expense Title Validation-----------------------------*/
				
				/*----------------------------------------------------Expense Amount Validation----------------------------*/
				if($("#totalexpense").val() === ''){
					appCommonFunctionality.raiseValidation("totalexpense", "", true);
					errorCount++;
				} else { 
					appCommonFunctionality.removeValidation("totalexpense", "totalexpense", true);
				}
				/*----------------------------------------------------Expense Amount Validation----------------------------*/
			}else if(parseInt($("#financeTypeDDL").val()) === 1){ //Earning Validation
				/*----------------------------------------------------Earning Type Validation------------------------------*/
				if($("#earningTypeDDL").val() === ''){
					appCommonFunctionality.raiseValidation("earningTypeDDL", "", true);
					errorCount++;
				} else { 
					appCommonFunctionality.removeValidation("earningTypeDDL", "earningTypeDDL", true);
				}
				/*----------------------------------------------------Earning Type Validation------------------------------*/
				
				/*----------------------------------------------------Earning Title Validation-----------------------------*/
				if($("#earningTitle").val() === ''){
					appCommonFunctionality.raiseValidation("earningTitle", "", true);
					errorCount++;
				} else { 
					appCommonFunctionality.removeValidation("earningTitle", "earningTitle", true);
				}
				/*----------------------------------------------------Earning Title Validation-----------------------------*/
				
				/*----------------------------------------------------Earning Amount Validation----------------------------*/
				if($("#totalEarning").val() === ''){
					appCommonFunctionality.raiseValidation("totalEarning", "", true);
					errorCount++;
				} else { 
					appCommonFunctionality.removeValidation("totalEarning", "totalEarning", true);
				}
				/*----------------------------------------------------Earning Amount Validation----------------------------*/
			}
		}
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.submitFinanceRecord = async function() {
		if (!validateFinanceEntryForm()) return;
		const formData = new FormData();
		const financeTypeDDL = parseInt($('#financeTypeDDL').val());
		const isIncome = financeTypeDDL === 1;
		const paymentInfo = isIncome ? {
			financeTypeDDL: 1,
			earningTypeDDL: parseInt($('#earningTypeDDL').val()),
			earningTitle: $('#earningTitle').val().trim(),
			financeDate: $('#financeDate').val(),
			debit: 0.00,
			totalEarning: parseFloat($('#totalEarning').val()) || 0,
			earningDescription: $('#earningDescription').val().trim(),
			paymentMode: 'CASH',
			paymentDetails: window.btoa(encodeURI('{}'))
		} : {
			financeTypeDDL: 0,
			expenseTypeDDL: parseInt($('#expenseTypeDDL').val()),
			expenseTitle: $('#expenseTitle').val().trim(),
			financeDate: $('#financeDate').val(),
			credit: 0.00,
			totalexpense: parseFloat($('#totalexpense').val()) || 0,
			expenseDescription: $('#expenseDescription').val().trim(),
			paymentMode: 'CASH',
			paymentDetails: window.btoa(encodeURI('{}'))
		};
		Object.entries(paymentInfo).forEach(([key, value]) => {
			formData.append(key, value);
		});
		const fileInputId = isIncome ? 'earningDocument' : 'expenseDocument';
		const fileInput = document.getElementById(fileInputId);
		const fileFieldName = isIncome ? 'earningDocument[]' : 'expenseDocument[]';
		if (fileInput.files.length > 0) {
			Array.from(fileInput.files).forEach(file => {
				formData.append(fileFieldName, file);
			});
		}
		try {
			const response = await new Promise((resolve, reject) => {
				appCommonFunctionality.ajaxFormDataUpload(
					"FINANCEENTRY", 
					formData, 
					resolve, 
					{ error: reject }
				);
			});
			
			const financeId = parseInt(JSON.parse(response)?.msg.financeId) || 0;
			if (financeId > 0) {
				window.location = `financeDetails.php?financeId=${financeId}`;
			} else {
				console.error('Invalid response format:', response);
			}
		} catch (error) {
			console.error('Finance submission error:', error);
		}
	};
	
	parent.initFinanceDetail = async function (){
		try {
			appCommonFunctionality.adjustMainContainerHight('financeSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			$('#defaultCurrency').html(appCommonFunctionality.getDefaultCurrency());
			const supportingDocuments = $('#supportingDocuments').val();
			renderFilePreview(supportingDocuments);
		} catch (error) {
			console.error('Error during finance initialization:', error);
		}
	};
	
	const renderFilePreview = function(fileUrls) {
		const $container = $('#filePreview');
		$container.empty();
		if (!fileUrls) return;
		const files = fileUrls.split(',');
		files.forEach(fileUrl => {
			fileUrl = fileUrl.trim();
			if (!fileUrl) return;
			const ext = fileUrl.split('.').pop().toLowerCase();
			let previewHtml = '';
			if (['png', 'jpg', 'jpeg'].includes(ext)) {
				previewHtml = `<div class="marBot5"><img src="${PROJECTPATH}uploads/financeSuppotingDocument/${fileUrl}" alt="Image" style="max-width: 100%; height: auto;"></div>`;
			} else if (ext === 'pdf') {
				previewHtml = `<div class="marBot5"><iframe src="${PROJECTPATH}uploads/financeSuppotingDocument/${fileUrl}" width="100%" height="400px"></iframe></div>`;
			} else if (['xls', 'xlsx', 'csv', 'doc', 'docx', 'txt'].includes(ext)) {
				previewHtml = `<div class="marBot5"><a href="${PROJECTPATH}uploads/financeSuppotingDocument/${fileUrl}" target="_blank" download>Download File (${ext.toUpperCase()})</a></div>`;
			} else {
				previewHtml = `<div class="marBot5"><a href="${PROJECTPATH}uploads/financeSuppotingDocument/${fileUrl}" target="_blank" download>Download File</a></div>`;
			}
			$container.append(previewHtml);
		});
	};
	
	parent.deleteFinanceRecord = function(financeId){
		window.location = `financeDetails.php?ACTION=DELETE&financeId=` + financeId;
	};

	parent.printFinancialStatements = function(){
		localStorage.setItem('FINANCESEARCHCRITERIA', JSON.stringify(FINANCESEARCHCRITERIA));
		localStorage.setItem('FINANCEVEWCRITERIA', JSON.stringify(FINANCEVEWCRITERIA));
		window.open('financialReport.php', '_blank');
	};
	
	parent.initFinancialReport = async function () {
		await appCommonFunctionality.adminCommonActivity();
		const retrieveCriteria = (key) => {
			const data = localStorage.getItem(key);
			if (!data) {
				window.location.href = "finance.php";
				return null;
			}
			localStorage.removeItem(key);
			return JSON.parse(data);
		};
		const searchCriteria = retrieveCriteria("FINANCESEARCHCRITERIA");
		const viewCriteria = retrieveCriteria("FINANCEVEWCRITERIA");
		if (!searchCriteria || !viewCriteria) return;
		FINANCESEARCHCRITERIA = searchCriteria;
		FINANCEVEWCRITERIA = viewCriteria;
		appCommonFunctionality.ajaxCallLargeData(
			"FINANCESTATEMENT",
			FINANCESEARCHCRITERIA,
			receiveFinanceResponse
		);
	};

	return parent;
})(window, jQuery);
