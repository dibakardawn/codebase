const MENUSELECTIONITEM = "saleOrders.php";
/*-----------------Pre-Compiled Variables---------------------------------*/
let COMPANYTYPEPRECOMPILEDDATA = [];
let ORDERSALESTATUSPRECOMPILEDDATA = [];
let COUNTRYPRECOMPILEDDATA = [];
let PRODUCTLIVESTOCKPRECOMPILEDDATA = [];
let PRODUCTPRECOMPILEDDATA = [];
let BRANDPRECOMPILEDDATA = [];
let CATEGORYPRECOMPILEDDATA = [];
let PACKAGEPRECOMPILEDDATA = [];
let DEFAULTTAX = 0;
let DEFAULTADDRESS = '';
let DEFAULTPHONE = '';
let VATNUMBER = '';
/*-----------------Pre-Compiled Variables---------------------------------*/

/*-----------------Commonly Used Variables--------------------------------*/
let ORDER = {};
let ORDEROBJ = [];
let NEWORDEROBJ = []; //for Order Splitting
let PACKINGOBJ = [];
let PAYMENTOBJ = [];
let ADDITIONALDATAOBJ = {};
/*-----------------Commonly Used Variables--------------------------------*/

/*-----------------Search & Selected Variables----------------------------*/
let SEARCHCUSTOMERCRITERIA = {
    keyword: "",
    companyTypeId: "",
    customerGrade: "",
	customerId: 0,
    status: 1
};
let SELECTEDCATEGORYIDARR = [];
let SEARCHSALEORDERCRITERIA = {
    orderId: 0,
	customerId: 0,
    status: 0,
	startDate : '',
	endDate : ''
};
let productQtyObj = {
	value : 0,
	productCombinationId : 0
};
/*-----------------Search & Selected Variables----------------------------*/

/*-----------------QR Code Scanner Camera Popup Variables-----------------*/
let qrCodeScannerCameraPopupWindow;
let qrCodeScannerCameraPopupCheckInterval;
const qrScannerCameraUrl = 'qrCodeScannerCamera.html';
let scannerQRCodes = [];
/*-----------------QR Code Scanner Camera Popup Variables-----------------*/

const inputDelay = 500;
let ORDERGUID = '';
let TAXP = 0;
const BARQRREGEX = new RegExp(`^${SITETITLE}_?`);
let isCoCOrder = false;
const phoneRegex = new RegExp(`^(\\+\\d{1,3}\\s?)?[\\d\\s]{10,}$`);
const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`);
const WEIGHTSIGN = 'Weight:';
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
		
        case "saleOrders.php":{
			saleOrderFunctionality.initSaleOrder();
            break;
		}
		
        case "saleOrderEntry.php":{
            saleOrderFunctionality.initSaleOrdersEntry();
            break;
		}
		
        case "saleOrderDetails.php":{
            saleOrderFunctionality.initSaleOrderDetail(true);
            break;
		}
		
		case "saleOrderSplit.php":{
            saleOrderFunctionality.initSaleOrdersSplit();
            break;
		}
		
		case "saleOrderPackingDetails.php":{
            saleOrderFunctionality.initSaleOrderPackingDetails();
            break;
		}
		
		case "saleOrderCartonDataPrint.php":{
            saleOrderFunctionality.initSaleOrderCartonDataPrint();
            break;
		}
    }
	
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const saleOrderFunctionality = (function (window, $) {
    const parent = {};

    parent.initSaleOrder = async function () {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		ORDERSALESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERSALESTATUS'));
		const customerId = appCommonFunctionality.getUrlParameter('customerId') || 0;
		if(parseInt(customerId) > 0){
			SEARCHSALEORDERCRITERIA.customerId = customerId;
		}
		appCommonFunctionality.ajaxCallLargeData("ORDERS", SEARCHSALEORDERCRITERIA, receiveOrdersResponse);
		
		/*----------------------Customer Search implementation-----------------------------*/
		$("#customerSearch").on('keyup', function () {
			const customerSearchKeyword = $(this).val();
			if (customerSearchKeyword.length > 2) {
				isCoCOrder = false;
				SEARCHCUSTOMERCRITERIA.keyword = customerSearchKeyword;
				$('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
				appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
			} else {
				$('#customerSearchResult').html('');
			}
		});
		/*----------------------Customer Search implementation-----------------------------*/
    };
	
	const receiveOrdersResponse = function (responseData) {
		ORDEROBJ = JSON.parse(responseData)?.msg || [];
		populateOrderTable(ORDEROBJ);
	};
	
	const populateOrderTable = function (parsedData) {
		if (!parsedData.length) {
			$('#saleOrderTableHolder').html('<p>No Data.</p>');
			return;
		}
		const getSortIcon = (field, cmsId) => `
			<i class="fa fa-sort-amount-asc hover marRig5" onclick="saleOrderFunctionality.sortOrderTable('ASC', '${field}')"></i>
			<strong id="cms_${cmsId}">${appCommonFunctionality.getCmsString(cmsId)}</strong>
			<i class="fa fa-sort-amount-desc hover marleft5" onclick="saleOrderFunctionality.sortOrderTable('DESC', '${field}')"></i>
		`;
		const getActionIcons = (orderId, orderStatus) => {
			let editOrderButton = '';
			let splitOrderButton = '';
			if (orderStatus <= getOrderStatusId('PLACED')) {
				editOrderButton = `<i class="fa fa-pencil-square-o marleft5 greenText hover" onclick="saleOrderFunctionality.editOrder(${orderId})"></i>`;
			}
			if (orderStatus <= getOrderStatusId('APPROVED')) {
				splitOrderButton = `<i class="fa fa-code-fork marleft5 blueText hover" onclick="saleOrderFunctionality.gotoSplitOrder(${orderId})"></i>`;
			}
			return `
				<div class="spaceBetweenSection">
					${editOrderButton}
					${splitOrderButton}
					<i class="fa fa-tv marleft5 blueText hover" onclick="saleOrderFunctionality.gotoOrderDetails(${orderId})"></i>
				</div>
			`;
		};
		const rows = parsedData.map(order => {
			const totalPrice = Number(order.totalPrice);
			const paidAmount = Number(order.paidAmount);
			const currency = appCommonFunctionality.getDefaultCurrency();
			const paidAmountClass = totalPrice > paidAmount ? 'redText' : 'greenText';
			return `
				<tr>
					<td>
						<a href="saleOrderDetails.php?orderId=${order.orderId}" class="blueText">${order.orderCode}</a><br>
						<span class="f12 greenText">${currency}${totalPrice.toFixed(2)}</span> 
						<span class="f12">/</span>
						<span class="f12 ${paidAmountClass}">${currency}${paidAmount.toFixed(2)}</span>
					</td>
					<td>${order.companyName} [ ${order.customerGrade} ] - ${order.buyerName}</td>
					<td>${getOrderStatus(order.status)}</td>
					<td>${order.orderDate}</td>
					<td>${order.deliveryDate}</td>
					<td>${getActionIcons(order.orderId, order.status)}</td>
				</tr>
			`;
		}).join('');
		const table = `
			<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white minW1180">
				<tbody>
					<tr>
						<td width="10%">${getSortIcon('totalPrice', 364)}</td>
						<td width="40%"><strong id="cms_365">${appCommonFunctionality.getCmsString(365)}</strong></td>
						<td width="10%"><strong id="cms_366">${appCommonFunctionality.getCmsString(366)}</strong></td>
						<td width="15%">${getSortIcon('orderDate', 360)}</td>
						<td width="15%">${getSortIcon('deliveryDate', 353)}</td>
						<td width="10%"><strong id="cms_367">${appCommonFunctionality.getCmsString(367)}</strong></td>
					</tr>
					${rows}
				</tbody>
			</table>
		`;
		$('#saleOrderTableHolder').html(table);
	};

	const getOrderStatus = function(orderStatusId) {
		if (typeof ORDERSALESTATUSPRECOMPILEDDATA !== 'undefined' && 
			ORDERSALESTATUSPRECOMPILEDDATA !== null && 
			ORDERSALESTATUSPRECOMPILEDDATA.length > 0) {
			const status = ORDERSALESTATUSPRECOMPILEDDATA.find(item => item.orderStatusId === orderStatusId);
			return status ? `<b style="color:${status.color}">${status.orderStatus}</b>` : "";
		}
		return "";
	};
	
	const extractStatusText = function(purchaseOrderStatusHTML){
		const regex = />([^<]+)</;
		const match = purchaseOrderStatusHTML.match(regex);
		return match && match[1] ? match[1].trim() : "";
	};
	
	const getOrderStatusId = function (orderStatus) {
		if (typeof ORDERSALESTATUSPRECOMPILEDDATA !== 'undefined' && 
			ORDERSALESTATUSPRECOMPILEDDATA !== null && 
			ORDERSALESTATUSPRECOMPILEDDATA.length > 0) {
				const status = ORDERSALESTATUSPRECOMPILEDDATA.find(item => item.orderStatus === orderStatus);
				return status ? status.orderStatusId : 0;
		}
		return 0;
    };
	
	parent.sortOrderTable = function (order, field) {
        const orderData = ORDEROBJ;
        orderData.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];
            if (!isNaN(valueA) && !isNaN(valueB)) {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }
            if (order === "ASC") return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            if (order === "DESC") return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        });
        populateOrderTable(orderData);
    };
	
	const bindSaleOrderStatusDDL = function(){
		let str = '';
		str = str + '<option value="0">' + appCommonFunctionality.getCmsString(494) + '</option>'
		for(let i = 0; i < ORDERSALESTATUSPRECOMPILEDDATA.length; i++){
			str = str + '<option value="' + ORDERSALESTATUSPRECOMPILEDDATA[i].orderStatusId + '">' + appCommonFunctionality.getCmsString(parseInt(ORDERSALESTATUSPRECOMPILEDDATA[i].orderStatusCmsId)) + '</option>';
		}
		$('#orderStatusDDL').html(str);
	};

    parent.addSaleOrder = function () {
        window.location = `saleOrderEntry.php`;
    };
	
	parent.searchSaleOrderModal = function(){
		$("#saleOrderSearchModal").modal('show');
		bindSaleOrderStatusDDL();
		if(appCommonFunctionality.isMobile()){
			$('#orderCode, #startDate').parent().parent().toggleClass('noLeftPaddingOnly nopaddingOnly');
		}
	};
	
	parent.getQRforSearch = function(){
		$('#orderCode').focus();
		$('#barcodeScannerHolder').removeClass('hide');
	};
	
	parent.orderQRCodeSearch = function(e){
		if (e.which === 13) { // Enter key pressed
			saleOrderFunctionality.saleOrderSearch();
		}
	};
	
	parent.searchSaleOrderFormReset = function(){
		$('#orderCode, #startDate, #endDate, #customerSearch').val('');
		$('#orderStatusDDL').prop('selectedIndex', 0);
		$('#customerSearchResult, #selectedCustomerSection').html('');
		$('#barcodeScannerHolder, #selectedCustomerTitle').addClass('hide');
	};
	
	parent.saleOrderSearch = function() {
		if (validateSaleOrderSearchForm()) {
			const orderCode = orderCodeSign($('#orderCode').val());
			SEARCHSALEORDERCRITERIA.orderId = parseInt(orderCode, 10) || 0;
			SEARCHSALEORDERCRITERIA.customerId = parseInt($('#selectedCustomerId').val(), 10) || 0;
			SEARCHSALEORDERCRITERIA.status = parseInt($('#orderStatusDDL').val(), 10) || 0;
			SEARCHSALEORDERCRITERIA.startDate = $('#startDate').val();
			SEARCHSALEORDERCRITERIA.endDate = $('#endDate').val();
			saleOrderFunctionality.searchSaleOrderFormReset();
			$("#saleOrderSearchModal").modal('hide');
			appCommonFunctionality.ajaxCallLargeData("ORDERS", SEARCHSALEORDERCRITERIA, receiveOrdersResponse);
		}
	};
	
	const validateSaleOrderSearchForm = function(){
		const startDate = $('#startDate').val();
		const endDate = $('#endDate').val();
		if ((startDate && !endDate) || (!startDate && endDate)) {
			appCommonFunctionality.raiseValidation("startDate", "", true);
			appCommonFunctionality.raiseValidation("endDate", "", true);
			return false;
		}else{
			appCommonFunctionality.removeValidation("startDate", "startDate", true);
			appCommonFunctionality.removeValidation("endDate", "endDate", true);
		}
		return true;
	};
	
	const orderCodeSign = function(input){
		if (/^\d+$/.test(input)) {
			return input;
		}
		const firstPart = input.includes('|') ? input.split('|')[0] : input;
		const ordsMatch = firstPart.match(/(?:ORDS_)?(\d+)$/);
		if (ordsMatch) {
			return ordsMatch[1];
		}
		return firstPart;
	};
	
	parent.editOrder = function (orderId) {
		if(PAGEDOCNAME === 'saleOrderDetails.php'){
			orderId = appCommonFunctionality.getUrlParameter('orderId');
		}
        window.location = `saleOrderEntry.php?orderId=` + orderId;
    };
	
	parent.gotoSplitOrder = function (orderId) {
		if(PAGEDOCNAME === 'saleOrderDetails.php'){
			orderId = appCommonFunctionality.getUrlParameter('orderId');
		}
        window.location = `saleOrderSplit.php?orderId=` + orderId;
    };
	
	parent.deleteOrder = function (orderId) {
		if(PAGEDOCNAME === 'saleOrderDetails.php'){
			orderId = appCommonFunctionality.getUrlParameter('orderId');
			appCommonFunctionality.ajaxCall("DELETEORDER&orderId=" + orderId, saleOrderFunctionality.gotoOrders);
		}
        appCommonFunctionality.ajaxCall("DELETEORDER&orderId=" + orderId, saleOrderFunctionality.initSaleOrder);
    };
	
	parent.gotoOrderDetails = function (orderId) {
        window.location = `saleOrderDetails.php?orderId=` + orderId;
    };

    parent.initSaleOrdersEntry = async function () {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();

		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		COMPANYTYPEPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COMPANYTYPE'));
		ORDERSALESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERSALESTATUS'));
		COUNTRYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COUNTRY'));
		PRODUCTLIVESTOCKPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCTLIVESTOCK'));
		PRODUCTPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCT'));
		BRANDPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('BRAND'));
		CATEGORYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('CATEGORY'));
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		/*----------------------Edit Sale Order implementation----------------------------*/
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if (orderId) {
			$('#orderId').val(orderId);
			appCommonFunctionality.ajaxCall('ORDERDETAILS&orderId=' + orderId, receiveOrderDeatilsData);
		}
		/*----------------------Edit Sale Order implementation----------------------------*/
		
		/*----------------------Customer Search by CustomerId-----------------------------*/
		const customerId = appCommonFunctionality.getUrlParameter('customerId');
		if(customerId && PAGEDOCNAME === 'saleOrderEntry.php'){
			SEARCHCUSTOMERCRITERIA.customerId = customerId;
			appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
		}
		/*----------------------Customer Search by CustomerId-----------------------------*/
		
		/*----------------------Customer Search implementation-----------------------------*/
		$("#customerSearch").on('keyup', function () {
			const customerSearchKeyword = $(this).val();
			if (customerSearchKeyword.length > 2) {
				isCoCOrder = false;
				SEARCHCUSTOMERCRITERIA.keyword = customerSearchKeyword;
				$('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
				appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
			} else {
				$('#customerSearchResult').html('');
			}
		});
		/*----------------------Customer Search implementation-----------------------------*/

		/*----------------------Scanner device implementation-----------------------------*/
		let debounceTimer;
		$('#scannerGunData').on('input', function () {
			clearTimeout(debounceTimer);
			const scannerGunDataValue = $(this).val().replace(BARQRREGEX, '');
			debounceTimer = setTimeout(() => {
				captureProductCombinationFromBarQrCode(scannerGunDataValue);
			}, inputDelay);
		});
		/*----------------------Scanner device implementation-----------------------------*/
		
		if(!appCommonFunctionality.isMobile()){
			$('#addProductQRScannerCam').prop('disabled', true);
		}else{
			$('#searchCatSection').removeClass('noRightPaddingOnly').addClass('nopaddingOnly'); //for productSearchModal
		}
		
		/*----------------------#productKeyword on enter product serach-----------------------------*/
		$('#productKeyword').keypress(function(event) {
			// Check if the Enter key (key code 13) is pressed
			if (event.which === 13) {
				// Prevent the default action (form submission, etc.)
				event.preventDefault();
				// Trigger the product search function
				saleOrderFunctionality.productSearch();
			}
		});
		/*----------------------#productKeyword on enter product serach-----------------------------*/
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
                str += `<div id="customerResultItem_${customerId}" class="${customerResultItemClass} hover" onclick="saleOrderFunctionality.onSelectingCustomer(${customerId}, '${customerGrade}')">`;

                if (customer.companyName.toLowerCase() === COMPANYTYPECoC.toLowerCase()) {
                    str += `<div id="cutomerCompNTG" class="f16">${customer.companyName} [${customerGrade}]</div>`;
                } else {
                    str += `<div id="cutomerCompNTG" class="f16">${customer.companyName} (${getCompanyType(customer.companyType)}) [${customerGrade}]</div>
                            <div class="f12">
                                <strong><span id="cms_314">${appCommonFunctionality.getCmsString(314)}</span>: </strong>
                                <span class="blueText">${customer.buyerName}</span><br>
                                <strong><span id="cms_315">${appCommonFunctionality.getCmsString(315)}</span>: </strong>
                                <span class="blueText">${customer.contactPerson}</span>
                            </div>`;
                    if (!appCommonFunctionality.isMobile()) {
                        str += `<div id="cutomerCompPE" class="f12">
                                    <i class="fa fa-phone blueText"></i> ${customer.phone}<br>
                                    <i class="fa fa-envelope greenText"></i> <span class="blueText">${customer.email}</span>
                                </div>`;
                    }
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
		
		/*----------------------CoC Order Go through------------------------------*/
        if (isCoCOrder) {
            $('div[id^="customerResultItem_"]').trigger('click');
			saleOrderFunctionality.populateCart();
			saleOrderFunctionality.populateNewOrderCart();
			$('#tempCustomerDataEditBtn').removeClass('hide');
        }
		/*----------------------CoC Order Go through------------------------------*/
		
		/*----------------------External CustomerId Go through--------------------*/
		const customerId = appCommonFunctionality.getUrlParameter('customerId');
		if(customerId && PAGEDOCNAME === 'saleOrderEntry.php'){
			$('div[id^="customerResultItem_"]').trigger('click');
			saleOrderFunctionality.populateCart();
			saleOrderFunctionality.populateNewOrderCart();
		}
		/*----------------------External CustomerId Go through--------------------*/
    };

    parent.onSelectingCustomer = function (customerId, customerGrade) {
        $("#selectedCustomerId").val(customerId);
        $("#selectedCustomerGrade").val(customerGrade);
		const customerResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
		$("#selectedCustomerSection").html($(`#customerResultItem_${customerId}`).html()).addClass(customerResultItemClass);
		$("#selectedCustomerTitle").removeClass('hide');
		$('#customerSearchResult').html('');
		if(PAGEDOCNAME === 'saleOrderEntry.php'){
			appCommonFunctionality.ajaxCall(`GETDELIVERYADDRESSES&customerId=${customerId}`, bindCustomerDeliveryAddressTable);
		}
    };

    const bindCustomerDeliveryAddressTable = function (data) {
		const customerDeliveryAddressData = JSON.parse(data);
		let str = `<table id="customerDeliveryAddressTable" class="w3-table w3-striped w3-bordered w3-hoverable w3-white"><tbody><tr><td width="100%"><strong id="cms_316">${appCommonFunctionality.getCmsString(316)}</strong></td></tr>`;
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		let deliveryAddressId = $('#selectedCustomerDeliveryAddressId').val();
		if (customerDeliveryAddressData.length > 0) {
			if (customerDeliveryAddressData[0].companyName.toLowerCase() === COMPANYTYPECoC.toLowerCase()) {
				const data = customerDeliveryAddressData[0];
				str += `<tr class="f12"><td width="100%">${data.companyName}</td></tr>`;
				$("#selectedCustomerDeliveryAddressId").val(data.deliveryAddressId);
			} else {
				let isFirst = true; // Track the first item
				customerDeliveryAddressData.forEach((data, index) => {
					// Check if the orderId exists
					if (orderId) {
						// If the deliveryAddressId is already set and matches the current ID, mark it as selected
						if (parseInt(deliveryAddressId) > 0 && parseInt(deliveryAddressId) === parseInt(data.deliveryAddressId)) {
							isFirst = false; // Override the first-item logic
						}
					} else {
						// If no orderId, set the first item as selected
						if (isFirst) {
							$('#selectedCustomerDeliveryAddressId').val(data.deliveryAddressId);
						}
					}

					// Create the table row
					str += `<tr class="f12"><td width="100%">
						<input type="radio" id="deliveryAddress_${data.deliveryAddressId}" name="deliveryAddress_${data.companyName}" 
							class="marRig5" value="${data.deliveryAddressId}" 
							${parseInt(deliveryAddressId) === parseInt(data.deliveryAddressId) ? 'checked' : isFirst ? 'checked' : ''} 
							onchange="saleOrderFunctionality.onSelectCustomerDeliveryAddressId(${data.deliveryAddressId})">
						<b rel="cms_322">${appCommonFunctionality.getCmsString(322)}</b>: ${data.companyName} | 
						<b rel="cms_323">${appCommonFunctionality.getCmsString(323)}</b>: ${data.contactPerson} | 
						<b rel="cms_324">Phone</b>: ${data.phone} | 
						<b>Email</b>: <a href="mailto: ${data.email}" class="blueText">${data.email}</a> | 
						<b rel="cms_325">${appCommonFunctionality.getCmsString(325)}</b>: ${data.address} | 
						<b rel="cms_326">${appCommonFunctionality.getCmsString(326)}</b>: ${data.town} | 
						<b>Postcode</b>: ${data.postCode} | 
						<b rel="cms_327">${appCommonFunctionality.getCmsString(327)}</b>: <span>${appCommonFunctionality.getCountryName(data.country, true)}</span>
					</td></tr>`;
					isFirst = false; // Ensure only the first row initially sets this value
				});
			}
		} else {
			str += '<tr class="f12"><td colspan="2">No Data</td></tr>';
		}
		str += '</tbody></table>';
		$("#customerDeliveryAddressTableHolder").html(str);
		$("#saleOrderControlButtonHolder").removeClass('hide');
		saleOrderFunctionality.populateCart();
		saleOrderFunctionality.populateNewOrderCart();
		saleOrderFunctionality.mapTypeOfOrder();
	};

    parent.onSelectCustomerDeliveryAddressId = function (deliveryAddressId) {
        $("#selectedCustomerDeliveryAddressId").val(deliveryAddressId);
		saleOrderFunctionality.populateCart();
		saleOrderFunctionality.populateNewOrderCart();
    };

    parent.mapCoCOrder = function () {
        isCoCOrder = true;
        SEARCHCUSTOMERCRITERIA.keyword = COMPANYTYPECoC;
        $("#customerSearch").val('');
        $('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
        appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
    };
	
	parent.openTempCustomerDataModal = function(){
		if(ORDER?.additionalData){
			ADDITIONALDATAOBJ = JSON.parse(decodeURI(window.atob(ORDER?.additionalData)));
			let tempCustData = ADDITIONALDATAOBJ?.tempCustData;
			$('#custName').val(tempCustData?.custName);
			$('#custPhone').val(tempCustData?.custPhone);
			$('#custEmail').val(tempCustData?.custEmail);
		}
		$('#editTempCustomerDataModal').modal('show');
	};
	
	parent.saveTempCustomerData = function(){
		if(validateTempCustomerData()){
			let custName = $('#custName').val();
			let custPhone = $('#custPhone').val();
			let custEmail = $('#custEmail').val();
			let tempCustData = {
				'custName' : custName,
				'custPhone' : custPhone,
				'custEmail' : custEmail
			};
			ADDITIONALDATAOBJ.tempCustData = tempCustData;
			populateTempCustData();
		}
	};
	
	const validateTempCustomerData = function(){
		var errorCount = 0;
		
		/*-------------------------------------Temp Customer Name Validation---------------------------*/
		if($("#custName").val() === ''){
			appCommonFunctionality.raiseValidation("custName", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("custName", "custName", true);
		}
		/*-------------------------------------Temp Customer Name Validation---------------------------*/
		
		/*-------------------------------------Temp Customer Phone Validation---------------------------*/
		if($("#custPhone").val() !== ''){
			let custPhone = $("#custPhone").val();
			if(!phoneRegex.test(custPhone)){
				appCommonFunctionality.raiseValidation("custPhone", "", true);
				errorCount++;
			}else{
				appCommonFunctionality.removeValidation("custPhone", "custPhone", true);
			}
		}
		/*-------------------------------------Temp Customer Phone Validation---------------------------*/
		
		/*-------------------------------------Temp Customer Email Validation---------------------------*/
		if($("#custEmail").val() !== ''){
			let custEmail = $("#custEmail").val();
			if(!emailRegex.test(custEmail)){
				appCommonFunctionality.raiseValidation("custEmail", "", true);
				errorCount++;
			}else{
				appCommonFunctionality.removeValidation("custEmail", "custEmail", true);
			}
		}
		/*-------------------------------------Temp Customer Email Validation---------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const populateTempCustData = function() {
		const orderId = parseInt(appCommonFunctionality.getUrlParameter('orderId')) || 0;
		const tempCustData = ADDITIONALDATAOBJ?.tempCustData;
		if (PAGEDOCNAME !== 'saleOrderEntry.php' && PAGEDOCNAME !== 'saleOrderDetails.php' && PAGEDOCNAME !== 'saleOrderSplit.php') {
			$('#editTempCustomerDataModal').modal('hide');
			return;
		}
		if (tempCustData?.custName) {
			if (orderId > 0){
				$('#cutomerCompNTG').html(tempCustData.custName + ' (' + COMPANYTYPECoC + ') [' + ORDER?.customerGrade + ']');
			}else{
				$('#cutomerCompNTG').html(tempCustData.custName + ' (' + COMPANYTYPECoC + ')');
			}
		}
		if (orderId > 0 && (tempCustData?.custPhone || tempCustData?.custEmail)) {
			let phoneHtml = '';
			let emailHtml = '';
			if (tempCustData?.custPhone) {
				phoneHtml = `<i class="fa fa-phone blueText"></i> ${tempCustData.custPhone}<br>`;
			}
			if (tempCustData?.custEmail) {
				emailHtml = `<i class="fa fa-envelope greenText"></i> <span class="blueText">${tempCustData.custEmail}</span>`;
			}
			$('#cutomerCompPE').html(`${phoneHtml}${emailHtml}`);
		}
		$('#editTempCustomerDataModal').modal('hide');
	};
	
	const receiveOrderDeatilsData = function(orderDetailsData){
		ORDER = JSON.parse(orderDetailsData)?.msg?.[0];
		
		/*-----------------------------------Check if CoC Order-----------------------------------------*/
		if(ORDER?.buyerName?.toLowerCase() === COMPANYTYPECoC.toLowerCase() || ORDER?.companyName?.toLowerCase() === COMPANYTYPECoC.toLowerCase() || ORDER?.contactPerson?.toLowerCase() === COMPANYTYPECoC.toLowerCase()){
			isCoCOrder = true;
			$('#tempCustomerDataEditBtn').removeClass('hide');
		}
		/*-----------------------------------Check if CoC Order-----------------------------------------*/
		
		const customerResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
		const str = `
			<div id="cutomerCompNTG" class="f16">${ORDER.companyName} (${getCompanyType(ORDER.companyType)}) [${ORDER.customerGrade}]</div>
			<div class="f12">
			  <strong><span id="cms_314">${appCommonFunctionality.getCmsString(314)}</span>: </strong>
			  <span class="blueText">${ORDER.buyerName}</span><br>
			  <strong><span id="cms_315">${appCommonFunctionality.getCmsString(315)}</span>: </strong>
			  <span class="blueText">${ORDER.contactPerson}</span>
			</div>
			<div id="cutomerCompPE" class="f12">
			  <i class="fa fa-phone blueText"></i> ${ORDER.phone}<br>
			  <i class="fa fa-envelope greenText"></i> <span class="blueText">${ORDER.email}</span>
			</div>
		  `;
		$('#selectedCustomerSection').html(str).addClass(customerResultItemClass);
		$("#selectedCustomerTitle").removeClass('hide');
		$('#customerSearchResult').html('');
		$('#selectedCustomerId').val(ORDER.customerId);
		$('#selectedCustomerGrade').val(ORDER.customerGrade);
		$('#selectedCustomerDeliveryAddressId').val(ORDER.deliveryAddressId);
        appCommonFunctionality.ajaxCall(`GETDELIVERYADDRESSES&customerId=${ORDER.customerId}`, bindCustomerDeliveryAddressTable);
		if (ORDER?.packingObj) {
			const decodedOrderPackingObj = JSON.parse(decodeURI(window.atob(ORDER.packingObj)) || "[]");
			if (Array.isArray(decodedOrderPackingObj) && decodedOrderPackingObj.length) {
				PACKINGOBJ = decodedOrderPackingObj;
			}
		}
		if (ORDER?.orderObj) {
			const decodedOrderObj = JSON.parse(decodeURI(window.atob(ORDER.orderObj)));
			const finalOrderObj = JSON.parse(decodedOrderObj?.orderObj || "[]");
			if (Array.isArray(finalOrderObj) && finalOrderObj.length) {
				ORDEROBJ = finalOrderObj;
				saleOrderFunctionality.populateCart();
			}
		}
		if(ORDER?.additionalData){
			ADDITIONALDATAOBJ = JSON.parse(decodeURI(window.atob(ORDER?.additionalData)));
			populateTempCustData();
		}
	};

    const getCompanyType = function (companyTypeId) {
        const companyType = COMPANYTYPEPRECOMPILEDDATA.find(item => parseInt(item.companyTypeId) === parseInt(companyTypeId));
        return companyType ? companyType.companyType : '';
    };

    parent.scannerGun = function () {
        $("#scannerGunData").val('').focus();
    };
	
	parent.scannerGunDataInputFocus = function(){
		$('#barcodeScannerHolder').removeClass('hide');
	};
	
	parent.scannerGunDataInputFocusOut = function(){
		$('#barcodeScannerHolder').addClass('hide');
	};

    const captureProductCombinationFromBarQrCode = function (scannerGunDataValue) {
        let productFound = false;
        if (PRODUCTLIVESTOCKPRECOMPILEDDATA.length > 0 && scannerGunDataValue !== '') {
            PRODUCTLIVESTOCKPRECOMPILEDDATA.some(product => {
                if (product.systemReference && scannerGunDataValue && typeof product.systemReference === 'string' && typeof scannerGunDataValue === 'string' && product.systemReference.toLowerCase() === scannerGunDataValue.toLowerCase()) {
                    ORDEROBJ.push(product);
                    productFound = true;
                    saleOrderFunctionality.scannerGun();
                    return true;
                }
                return false;
            });
            if (!productFound) {
                $("#productScannerErr").html('* ' + appCommonFunctionality.getCmsString(328));
				appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(328), appCommonFunctionality.getLang());
				setTimeout(function() {
					$('#productScannerErr').html('');
				}, 3000);
                saleOrderFunctionality.scannerGun();
            }
            saleOrderFunctionality.populateCart();
        }
    };
	
	parent.populateCart = function () {
		let hasCreditNote = false;
		const orderSummary = getOrderSummary();
		const displayOrderArr = (orderSummary?.orderCartData && orderSummary.orderCartData.length > 0) ? orderSummary.orderCartData : [];

		let wideTableStyle = '';
		if (PAGEDOCNAME === 'saleOrderEntry.php') {
			wideTableStyle = 'minW720';
		}
		let str = `<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder ${wideTableStyle}"><tbody><tr><td width="75%" class="text-left"><b id="cms_329">${appCommonFunctionality.getCmsString(329)}</b></td><td width="10%" class="text-right"><b>Qty</b></td><td width="15%" class="text-right"><b id="cms_330">${appCommonFunctionality.getCmsString(330)}</b></td></tr>`;

		if (displayOrderArr.length > 0) {
			displayOrderArr.forEach(item => {
				let rowBgClass = item.creditNote ? 'bgLightRed' : '';
				const offerText = item.offerText;
				const effectivePrice = item.effectivePrice;
				let editPriceBtnHTML = '';
				if (PAGEDOCNAME === 'saleOrderEntry.php') {
					editPriceBtnHTML = `<i class="fa fa-pencil-square-o marleft5 greenText hover" onclick="saleOrderFunctionality.openEditProductPriceModal(${item.productId},${item.productCombinationId})"></i>`;
				}
				let QRTextHtml = getQRTextHtml(item.productCombinationQR, item.productCode);
				let weightInputHtml = '';
				if (QRTextHtml.indexOf(WEIGHTSIGN) != -1 && PAGEDOCNAME === 'saleOrderEntry.php') {
					weightInputHtml = `<div class="input-group input-group-md">
						<input type="number" id="productItemWeight_${item.productCombinationId}" name="productItemWeight_${item.productCombinationId}" oninput="saleOrderFunctionality.calcQtyOnWeight(this.value, ${item.productCombinationId})" value="0" autocomplete="off" class="marleft5 maxW64">
						<span class="input-group-addon">
							<i class="fa fa-balance-scale redText hover"></i>
						</span>
					</div>`;
				}

				let qtyInputHTML = ``;
				if (PAGEDOCNAME === 'saleOrderEntry.php') {
					qtyInputHTML = `<div class="input-group input-group-md">
						<span class="input-group-addon" onclick="saleOrderFunctionality.changeQty('-', ${item.productCombinationId})">
							<i class="fa fa-minus redText"></i>
						</span>
						<input type="number" id="productItemQty_${item.productCombinationId}" name="productItemQty_${item.productCombinationId}" value="${item.qty}" step="1" min="0" autocomplete="off" onfocus="saleOrderFunctionality.storeProductItemQty(this.value, ${item.productCombinationId})"
						onchange="saleOrderFunctionality.productItemQtyInputKeyUp(this.value, ${item.productCombinationId})" class="maxW64">
						<span class="input-group-addon greenText" onclick="saleOrderFunctionality.changeQty('+', ${item.productCombinationId})">
							<i class="fa fa-plus greenText"></i>
						</span>
					</div>`;
				} else if (PAGEDOCNAME === 'saleOrderDetails.php') {
					qtyInputHTML = item.creditNote ? `-${item.qty}` : `${item.qty}`;
				} else if (PAGEDOCNAME === 'saleOrderSplit.php') {
					qtyInputHTML = `${item.qty} <i class="fa fa-hand-o-right greenText marleft5 hover" onclick="saleOrderFunctionality.transferToNewOrder(${item.productCombinationId})"></i>`;
				}

				let deleteBtnHTML = '';
				if (PAGEDOCNAME === 'saleOrderEntry.php') {
					deleteBtnHTML = `<i class="fa fa-trash redText marleft5 hover" onclick="saleOrderFunctionality.removeFromCart(${item.productCombinationId})"></i>`;
				}

				str += `<tr class="${rowBgClass}">
					<td class="text-left">
						<div class="pull-left f12">
							<span>${item.productTitle} [${item.productCode}] ${offerText} ${editPriceBtnHTML}</span><br>
							<span>[${item.productCombinationId}] - ${QRTextHtml}</span>
						</div>
						<div class="pull-left">${weightInputHtml}</div>
					</td>
					<td class="text-right">${qtyInputHTML}</td>
					<td class="text-right">
						<span>${item.creditNote ? '-' : ''}${appCommonFunctionality.getDefaultCurrency()}${(effectivePrice * item.qty).toFixed(2)}</span>
						${deleteBtnHTML}
					</td>
				</tr>`;
			});
		} else {
			str += '<tr><td colspan="3">No Data</td></tr>';
		}

		str += '</tbody></table>';
		$("#cartTableHolder").html(str);

		if (displayOrderArr.length > 0) {
			$("#totalCalcSection").removeClass('hide');
			$("#totalBeforeTax").html(appCommonFunctionality.getDefaultCurrency() + orderSummary.totalBeforeTax.toFixed(2));
			$("#packingCost").html(appCommonFunctionality.getDefaultCurrency() + orderSummary.packingCost.toFixed(2));
			if (PAGEDOCNAME === 'saleOrderEntry.php') {
				$("#specialDiscount").val((parseFloat(orderSummary?.specialDiscount) || 0).toFixed(2));
			}else if(PAGEDOCNAME === 'saleOrderDetails.php'){
				$("#specialDiscount").html(appCommonFunctionality.getDefaultCurrency() + (parseFloat(orderSummary?.specialDiscount) || 0).toFixed(2));
			}
			$("#taxP").html(orderSummary.tax);
			$("#totalPrice").html(appCommonFunctionality.getDefaultCurrency() + orderSummary.total.toFixed(2));
			if (orderSummary.hasCreditNote) {
				$('#creditNote').html('<span id="cms_372">' + appCommonFunctionality.getCmsString(372) + '</span> : <a href="' + PROJECTPATH + 'saleInvoice/' + ORDERGUID + '" target="_blank"><i class="fa fa-file-text redText"></i></a>');
			}
			$('#placeOrderBtn').attr('disabled', false);
		} else {
			$("#totalCalcSection").addClass('hide');
			$("#totalBeforeTax").html('');
			$("#packingCost").html('');
			if (PAGEDOCNAME === 'saleOrderEntry.php') {
				$("#specialDiscount").val(0.00);
			}else if(PAGEDOCNAME === 'saleOrderDetails.php'){
				$("#specialDiscount").html('');
			}
			$("#taxP").html('');
			$("#totalPrice").html('');
			$('#placeOrderBtn').attr('disabled', true);
		}
	};

	const getOrderSummary = function () {
		const summaryMap = {};
		let hasCreditNote = false;
		const selectedCustomerGrade = (ORDER && ORDER.customerGrade) ? ORDER.customerGrade.toLowerCase() : ($('#selectedCustomerGrade').val()).toLowerCase();
		
		let specialDiscount = 0.00;
		if (ORDER?.orderObj) {
			const decodedOrderObj = JSON.parse(decodeURI(window.atob(ORDER.orderObj)));
			specialDiscount = decodedOrderObj?.specialDiscount != null && !isNaN(parseFloat(decodedOrderObj.specialDiscount)) ? parseFloat(decodedOrderObj.specialDiscount) : parseFloat($('#specialDiscount').val()) || 0.00;
		}else{
			specialDiscount = parseFloat($('#specialDiscount').val());
		}
		
		const getEffectivePrice = (price, offer) => {
			return (offer > 0) ? price - (price * offer / 100) : price;
		};

		const getOfferText = (price, offer) => {
			if (offer > 0) {
				const discounted = price - (price * offer / 100);
				return `<span class="lineThrough">${appCommonFunctionality.getDefaultCurrency()}${price.toFixed(2)}</span> ${offer}% off ${appCommonFunctionality.getDefaultCurrency()}${discounted.toFixed(2)}`;
			}
			return `${appCommonFunctionality.getDefaultCurrency()}${price.toFixed(2)}`;
		};

		ORDEROBJ.forEach(item => {
			const baseKey = `${item.productId}-${item.productCombinationId}`;
			const normalKey = `${baseKey}-normal`;
			const creditKey = `${baseKey}-creditNote`;

			if (item.creditNote) {
				hasCreditNote = true;
				if (!summaryMap[creditKey]) {
					summaryMap[creditKey] = {
						...item,
						qty: 0,
						creditNote: true
					};
				}
				summaryMap[creditKey].qty += 1;
			} else {
				if (!summaryMap[normalKey]) {
					summaryMap[normalKey] = {
						...item,
						qty: 0,
						creditNote: false
					};
				}
				summaryMap[normalKey].qty += 1;
			}
		});

		const orderCartData = Object.values(summaryMap).map(item => {
			const price = selectedCustomerGrade === 'r' ? item.RPrice : item.WPrice;
			const offer = selectedCustomerGrade === 'r' ? item.RofferPercentage : item.WofferPercentage;
			const effectivePrice = getEffectivePrice(price, offer);
			const offerText = getOfferText(price, offer);
			return {
				...item,
				effectivePrice,
				offerText
			};
		});

		const totalBeforeTax = orderCartData.reduce((total, item) => {
			return total + (item.effectivePrice * item.qty * (item.creditNote ? -1 : 1));
		}, 0);

		const packingCost = PACKINGOBJ.reduce((total, packet) => total + packet.price, 0);
		const subtotal = totalBeforeTax + packingCost - specialDiscount;
		const totalWithTax = subtotal + (subtotal * DEFAULTTAX / 100);

		return {
			orderCartData,
			totalBeforeTax,
			packingCost,
			specialDiscount,
			tax: DEFAULTTAX,
			total: totalWithTax,
			hasCreditNote
		};
	};

    const getQRTextHtml = function (QRText, productCode) {
        var str = '';
		var QRTextArr1 = QRText.split('_');
		QRText = QRTextArr1[0].replace((productCode + '-'), '');
		var QRTextArr2 = QRText.split('X');
		for(var i = 0; i < QRTextArr2.length; i++){
			if(QRTextArr2[i] !== ''){
				var featureValArr = QRTextArr2[i].split(':');
				if(featureValArr[0].toLowerCase() === 'color'){
					str = str + featureValArr[0] + ' : <i class="fa fa-square marRig5 marleft5" style="color:#' + featureValArr[1] + '"></i>';
				}else{
					str = str + featureValArr[0] + ': ' + featureValArr[1];
				}
				if((i < (QRTextArr2.length - 1)) && (QRTextArr2[i + 1] !== '')){
					str = str + '<i class="fa fa fa-remove blueText marRig5 marleft5"></i>';
				}
			}
		}
		return str;
    };
	
	parent.calcQtyOnWeight = function(weightValue, productCombinationId){
		alert(weightValue, productCombinationId);
		//xxxx need to get 500grms # make another function from QR text
	};
	
	parent.changeQty = function (operation, productCombinationId) {
		productCombinationId = parseInt(productCombinationId);
		if (operation === '+') {
			if(PRODUCTSTOCKINDIVIDUALIDENTITY){
				const existingReferences = new Set(ORDEROBJ.map(item => item.systemReference));
				const newItem = PRODUCTLIVESTOCKPRECOMPILEDDATA.find(item => 
					item.productCombinationId === productCombinationId &&
					!existingReferences.has(item.systemReference)
				);
				if (newItem) {
					ORDEROBJ.push(newItem);
				} else {
					alert(appCommonFunctionality.getCmsString(351));
				}
			}else{
				const newItem = PRODUCTLIVESTOCKPRECOMPILEDDATA.find(item => 
					item.productCombinationId === productCombinationId);
				if (newItem) {
					ORDEROBJ.push(newItem);
				} else {
					alert(appCommonFunctionality.getCmsString(351));
				}
			}
		} else if (operation === '-') {
			const indexToRemove = ORDEROBJ.slice().reverse().findIndex(item => 
				item.productCombinationId === productCombinationId
			);

			if (indexToRemove !== -1) {
				ORDEROBJ.splice(ORDEROBJ.length - 1 - indexToRemove, 1);
			}
		}
		saleOrderFunctionality.populateCart();
	};
	
	parent.storeProductItemQty = function(qtyVal, productCombinationId){
		productQtyObj.value = parseInt(qtyVal);
		productQtyObj.productCombinationId = parseInt(productCombinationId);
	};
	
	parent.productItemQtyInputKeyUp = function (qtyVal, productCombinationId) {
		qtyVal = parseInt(qtyVal, 10);
		productCombinationId = parseInt(productCombinationId, 10);
		if (productQtyObj.productCombinationId === productCombinationId) {
			const qtyDifference = qtyVal - productQtyObj.value;
			if (qtyDifference !== 0) {
				const operation = qtyDifference > 0 ? '+' : '-';
				const iterations = Math.abs(qtyDifference);
				for (let i = 0; i < iterations; i++) {
					saleOrderFunctionality.changeQty(operation, productCombinationId);
				}
				productQtyObj.value = qtyVal;
			}
		}
	};

	parent.removeFromCart = function(productCombinationId){
		ORDEROBJ = ORDEROBJ.filter(item => item.productCombinationId !== productCombinationId);
		saleOrderFunctionality.populateCart();
	};
	
	parent.openEditProductPriceModal = function(productId, productCombinationId){
		$('#editPriceModal').modal('show');
		const selectedCustomerGrade = $('#selectedCustomerGrade').val().toLowerCase();
		const matchedProduct = ORDEROBJ.find(obj => 
			obj.productId === productId && obj.productCombinationId === productCombinationId
		);
		let productPrice = null;
		if (matchedProduct) {
			if (selectedCustomerGrade === 'r') {
				productPrice = matchedProduct.RPrice;
			} else if (selectedCustomerGrade === 'w') {
				productPrice = matchedProduct.WPrice;
			}
		}
		$('#alteredProductPrice').val(productPrice);
		$('#productId').val(productId);
		$('#productCombinationId').val(productCombinationId);
	};
	
	parent.saveAlteredProductPrice = function () {
		const productId = parseInt($('#productId').val());
		const productCombinationId = parseInt($('#productCombinationId').val());
		const selectedCustomerGrade = $('#selectedCustomerGrade').val().toLowerCase();
		const alteredProductPrice = parseFloat($('#alteredProductPrice').val());

		const updatePriceInDataset = (dataset, keys) => {
			const item = dataset.find(obj =>
				obj[keys.productIdKey] === productId &&
				obj[keys.productCombinationIdKey] === productCombinationId
			);

			if (item) {
				if (selectedCustomerGrade === 'r') {
					item[keys.rPriceKey] = alteredProductPrice;
				} else if (selectedCustomerGrade === 'w') {
					item[keys.wPriceKey] = alteredProductPrice;
				}
			}
		};

		updatePriceInDataset(ORDEROBJ, {
			productIdKey: 'productId',
			productCombinationIdKey: 'productCombinationId',
			rPriceKey: 'RPrice',
			wPriceKey: 'WPrice'
		});

		updatePriceInDataset(PRODUCTLIVESTOCKPRECOMPILEDDATA, {
			productIdKey: 'productId',
			productCombinationIdKey: 'productCombinationId',
			rPriceKey: 'RPrice',
			wPriceKey: 'WPrice'
		});

		$('#editPriceModal').modal('hide');
		parent.populateCart();
	};
	
	parent.openQrScannerCamera = function() {
		const top = 50;
		const left = 16;
		const width = ($(window).width() - (left * 2)) * 0.9;
		const height = 348;
		const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`;
		let qrCodeScannerCameraPopupWindow = window.open(qrScannerCameraUrl, "qrCodeScannerCameraPopupWindow", features);
		let qrCodeScannerCameraPopupCheckInterval = setInterval(() => {
			if (qrCodeScannerCameraPopupWindow.closed) {
				clearInterval(qrCodeScannerCameraPopupCheckInterval);
				let scannerQRCodes = JSON.parse(localStorage.getItem("scannerQRCodes")) || [];
				//alert(JSON.stringify(scannerQRCodes)); //alert whole array of scanned codes
				if (scannerQRCodes.length > 0) {
					if(PAGEDOCNAME === 'saleOrderEntry.php'){
						scannerQRCodes.forEach(code => {
							let scannerQRCode = code.replace(BARQRREGEX, '');
							//alert(scannerQRCode); //alert individual scanned code
							captureProductCombinationFromBarQrCode(scannerQRCode);
						});
					}else if(PAGEDOCNAME === 'saleOrders.php'){
						const scannedString = scannerQRCodes[0];
						$('#orderCode').val(scannedString);
						parent.saleOrderSearch();
					}
				}
				localStorage.removeItem("scannerQRCodes");
			}
		}, 500);
	};
	
	parent.openProductSearchModal = function(){
		$("#productSearchModal").modal('show').on('shown.bs.modal', function () {
            $('#productKeyword').focus();
        });
	};
	
	parent.brandPredictiveSearch = function(searchedText) {
		$('#searchBrandIconSpan').html('<span class="fa fa-spinner fa-spin hover"></span>');
		if (BRANDPRECOMPILEDDATA.length > 0 && searchedText.length > 2) {
			const searchedBrandObjArray = BRANDPRECOMPILEDDATA.filter(brand => brand.brandName.toLowerCase().includes(searchedText.toLowerCase()));
			const str = searchedBrandObjArray.map(brand => `
				<div class="searchedItem hover" onclick="saleOrderFunctionality.onBrandSelection(${brand.brandId})">
					<span class="padLeft4">${brand.brandName}</span>
				</div>
			`).join('');
			$('#searchedBrands').html(str).removeClass('hide');
			$('#searchBrandIconSpan').html('<span class="fa fa-search hover"></span>');
		} else {
			$('#searchedBrands').html('').addClass('hide');
			$('#searchBrandIconSpan').html('<span class="fa fa-search hover"></span>');
		}
	};

	parent.onBrandSelection = function(brandId) {
		$('#brandId').val(brandId);
		$('#searchedBrands').html('').addClass('hide');
		$('#searchBrand').val('');
		saleOrderFunctionality.populateSelectedBrand(brandId);
	};

	parent.populateSelectedBrand = function(brandId) {
		const brand = BRANDPRECOMPILEDDATA.find(b => parseInt(b.brandId) === parseInt(brandId));
		if (brand) {
			const str = `
				<div id="cms_45">Selected Brand : </div>
				<div class="selectedBrandItem">
					<div>
						<span class="marleft5"><b>${brand.brandName}</b></span>
					</div>
					<div>
						<span class="pull-right fa fa-remove redText hover" onclick="saleOrderFunctionality.removeBrandSelection();"></span>
					</div>
				</div>
			`;
			$('#selectedBrandItem').html(str);
		}
	};

	parent.removeBrandSelection = function() {
		$('#brandId').val(0);
		$('#selectedBrandItem').html('');
		$('#searchBrand').focus();
	};

	parent.categoryPredictiveSearch = function(searchedText) {
		$('#searchCatIconSpan').html('<span class="fa fa-spinner fa-spin hover"></span>');
		if (CATEGORYPRECOMPILEDDATA.length > 0 && searchedText.length > 2) {
			const searchedCatObjArray = CATEGORYPRECOMPILEDDATA.filter(cat => cat.category.toLowerCase().includes(searchedText.toLowerCase()));
			const str = searchedCatObjArray.map(cat => `
				<div class="searchedItem hover" onclick="saleOrderFunctionality.onCatSelection(${parseInt(cat.categoryId)}, this)">
					<span class="padLeft4">${cat.category}</span>
				</div>
			`).join('');
			$('#searchedCats').html(str).removeClass('hide');
			$('#searchCatIconSpan').html('<span class="fa fa-close redText hover" onClick="saleOrderFunctionality.resetSearchCatField();"></span><span class="fa fa-search marleft5 hover"></span>');
		} else if (searchedText.length === 0) {
			$('#searchedCats').html('').addClass('hide');
			$('#searchCat').val('');
			$('#searchCatIconSpan').html('<span class="fa fa-search hover"></span>');
		}
	};

	parent.resetSearchCatField = function() {
		$("#searchCat").val('');
		$('#searchedCats').html('').addClass('hide');
	};

	parent.onCatSelection = function(catId, selfObj) {
		if (catId > 0 && !SELECTEDCATEGORYIDARR.includes(parseInt(catId))) {
			SELECTEDCATEGORYIDARR.push(parseInt(catId));
			$("#categoryIds").val(SELECTEDCATEGORYIDARR.toString());
			if (selfObj !== null) {
				$(selfObj).hide();
			}
			populateSelectedCategories();
		}
	};

	const populateSelectedCategories = function() {
		const str = CATEGORYPRECOMPILEDDATA.filter(cat => SELECTEDCATEGORYIDARR.includes(parseInt(cat.categoryId)))
			.map(cat => `
				<div class="selectedCatItem">
					<span class="fa fa-tags darkGreyText"></span>
					<span class="marleft5">${cat.category}</span>
					<span class="fa fa-remove redText hover marleft5" onclick="saleOrderFunctionality.removeCatSelection(${parseInt(cat.categoryId)});"></span>
				</div>
			`).join('');
		$('#selectedCatItem').html(str);
	};

	parent.removeCatSelection = function(categoryId) {
		const index = SELECTEDCATEGORYIDARR.indexOf(categoryId);
		if (index > -1) {
			SELECTEDCATEGORYIDARR.splice(index, 1);
			$("#categoryIds").val(SELECTEDCATEGORYIDARR.toString());
		}
		populateSelectedCategories();
	};
	
	parent.searchFormReset = function() {
		$("#productKeyword").val("");
		$("#searchBrand").val("").trigger('keyup');
		saleOrderFunctionality.removeBrandSelection();
		$("#searchCat").val("").trigger('keyup');
		const categoryIds = $("#categoryIds").val().split(",");
		categoryIds.forEach(id => saleOrderFunctionality.removeCatSelection(parseInt(id)));
		$("#seachedProductTable").removeClass('hide').html('');
		$("#productCombinationSection").addClass('hide').html('');
	};

	parent.productSearch = function() {
		const keywordTyped = $("#productKeyword").val().toLowerCase();
		const selectedBrandId = parseInt($("#brandId").val());
		const selectedCategoryIds = $("#categoryIds").val().split(',').map(Number);
		let searchedProducts = PRODUCTPRECOMPILEDDATA.filter(product => {
			const { brandId, categoryIds, productCode, productTitle, metaKeyWords } = product;
			const productCategories = categoryIds.split(',').map(Number);
			return (
				(selectedBrandId && brandId === selectedBrandId) ||
				(selectedCategoryIds.length && productCategories.some(element => selectedCategoryIds.includes(element))) ||
				(keywordTyped && (
					productCode.toLowerCase().includes(keywordTyped) ||
					productTitle.toLowerCase().includes(keywordTyped) ||
					metaKeyWords.toLowerCase().includes(keywordTyped)
				))
			);
		});
		populateProductTable(searchedProducts);
		searchedProducts = [];
	};
	
	const populateProductTable = (searchedProducts) => {
		let str = `<div id="cms_345">${appCommonFunctionality.getCmsString(345)}</div>`;
		if (searchedProducts.length > 0) {
			searchedProducts.forEach(product => {
				str += `
					<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly marBot3">
						<div class="generalBox hover" onclick="saleOrderFunctionality.populateProductCombinations(${product.productId})">
							<i class="fa fa-gift"></i> ${product.productTitle} [${product.productCode}]
						</div>
					</div>`;
			});
		} else {
			str += `<div id="cms_346">${appCommonFunctionality.getCmsString(346)}</div>`;
		}
		$('#seachedProductTable').html(str);
	};

	parent.populateProductCombinations = function(productId){
		$("#seachedProductTable").addClass('hide');
		const filteredStocks = PRODUCTLIVESTOCKPRECOMPILEDDATA.filter(stock => stock.productId === parseInt(productId));
		const groupedByProductCombinationId = filteredStocks.reduce((acc, stock) => {
			acc[stock.productCombinationId] = stock;
			return acc;
		}, {});
		const uniqueStocks = Object.values(groupedByProductCombinationId);
		let str = '';
		if (uniqueStocks.length > 0) {
			uniqueStocks.forEach(stock => {
				str += `
					<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly marBot3">
						<div class="generalBox hover" onclick="saleOrderFunctionality.selectProductCombinations(${stock.productId}, ${stock.productCombinationId})">
							${stock.productTitle} [${stock.productCode}] <i class="fa fa-caret-right"></i> [${stock.productCombinationId}] - ${getQRTextHtml(stock.productCombinationQR, stock.productCode)}
						</div>
					</div>
				`;
			});
		} else {
			str = '<span id="cms_349">' + appCommonFunctionality.getCmsString(349) + '</span>';
		}
		$("#productCombinations").html(str);
		$("#productCombinationSection").removeClass('hide');
	};

	parent.backToSearchedProductTable = function(){
		$("#productCombinationSection").addClass('hide');
		$("#seachedProductTable").removeClass('hide');
	};

	parent.selectProductCombinations = function(productId, productCombinationId){
		for(var i = 0; i < PRODUCTLIVESTOCKPRECOMPILEDDATA.length; i++){
			if(PRODUCTLIVESTOCKPRECOMPILEDDATA[i].productId === parseInt(productId) && PRODUCTLIVESTOCKPRECOMPILEDDATA[i].productCombinationId === parseInt(productCombinationId)){
				var exists = ORDEROBJ.some(function(order) {
					return order.systemReference === PRODUCTLIVESTOCKPRECOMPILEDDATA[i].systemReference;
				});
				if (!exists) {
					ORDEROBJ.push(PRODUCTLIVESTOCKPRECOMPILEDDATA[i]);
					break;
				}
			}
		}
		populateModalCart();
	};

	const populateModalCart = function(){
		let str = '';
		if (ORDEROBJ.length > 0) {
			const aggregatedStocks = ORDEROBJ.reduce((acc, stock) => {
				const key = `${stock.productId}_${stock.productCombinationId}`;
				if (!acc[key]) {
					acc[key] = { ...stock, count: 1 };
				} else {
					acc[key].count += 1;
				}
				return acc;
			}, {});

			for (let key in aggregatedStocks) {
				const stock = aggregatedStocks[key];
				str += `
					<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly marBot3">
						<div class="generalBox hover">
							${stock.productTitle} [${stock.productCode}] <i class="fa fa-caret-right"></i> [${stock.productCombinationId}] - [${getQRTextHtml(stock.productCombinationQR, stock.productCode)}] X <b>${stock.count}</b> - <i class="fa fa-trash redText" onclick="saleOrderFunctionality.removeFromModalCart(${stock.productCombinationId})"></i>
						</div>
					</div>
				`;
			}
			$('#addToCartBtn').removeAttr('disabled');
		} else {
			str = '<span id="cms_349">' + appCommonFunctionality.getCmsString(349) + '</span>';
			$('#addToCartBtn').attr('disabled', 'disabled');
		}
		$("#selectedProductCombinations").html(str);
		$("#selectedProductCombinations, #selectedProductCombinationHeader").removeClass('hide');
	};

	parent.removeFromModalCart = function(productCombinationId){
		ORDEROBJ = ORDEROBJ.filter(item => item.productCombinationId !== productCombinationId);
		populateModalCart();
	};
	
	parent.specialDiscountKeyup = function(){
		if (ORDER?.orderObj) {
			const decodedOrderObj = JSON.parse(decodeURI(window.atob(ORDER.orderObj)));
			decodedOrderObj.specialDiscount = parseFloat($('#specialDiscount').val()) || 0.00;
			ORDER.orderObj = window.btoa(encodeURI(JSON.stringify(decodedOrderObj)));
		}
		const orderSummary = getOrderSummary();
		$('#totalPrice').html(appCommonFunctionality.getDefaultCurrency() + (orderSummary?.total ?? 0).toFixed(2));
	};
	
	parent.placeOrder = function () {
		let errorMessages = [
			{ id: "#selectedCustomerId", errorCode: 354},
			{ id: "#selectedCustomerDeliveryAddressId", errorCode: 355}
		];
		let errorCount = errorMessages.reduce((count, field) => {
			if (parseInt($(field.id).val()) === 0) {
				alert(appCommonFunctionality.getCmsString(field.errorCode));
				appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(field.errorCode), appCommonFunctionality.getLang());
				return count + 1;
			}
			return count;
		}, 0);
		if (ORDEROBJ.length === 0) {
			alert(appCommonFunctionality.getCmsString(356));
			appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(356), appCommonFunctionality.getLang());
			errorCount++;
		}
		if (errorCount === 0) {
			const qryStr = 'PLACEORDER';
			const orderSummary = getOrderSummary();
			let totalPrice = orderSummary?.total;
			const orderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
			let callData = {};
			if(PAGEDOCNAME === 'saleOrderDetails.php'){
				const orderObj = {
					orderObj: JSON.stringify(ORDEROBJ),
					tax: orderSummary?.tax,
					specialDiscount: orderSummary?.specialDiscount
				};
				callData = {
					orderId: 0,
					parentOrderId: 0,
					customerId: parseInt(ORDER.customerId),
					deliveryAddressId: parseInt(ORDER.deliveryAddressId),
					orderObj: window.btoa(encodeURI(JSON.stringify(orderObj))),
					packingObj : ORDER.packingObj,
					totalPrice: totalPrice,
					deliveryDate: ORDER.deliveryDate
				};
			}else{
				const orderObj = {
					orderObj: JSON.stringify(ORDEROBJ),
					tax: $('#taxP').text(),
					specialDiscount: orderSummary?.specialDiscount
				};
				callData = {
					orderId: orderId,
					parentOrderId: 0,
					customerId: parseInt($("#selectedCustomerId").val()),
					deliveryAddressId: parseInt($("#selectedCustomerDeliveryAddressId").val()),
					orderObj: window.btoa(encodeURI(JSON.stringify(orderObj))),
					packingObj : ORDER.packingObj,
					totalPrice: totalPrice,
					additionalData: window.btoa(encodeURI(JSON.stringify(ADDITIONALDATAOBJ))),
					deliveryDate: $('#deliveryDate').val()
				};
			}
			appCommonFunctionality.ajaxCallLargeData(qryStr, callData, receivePlaceOrderResponse);
		}
	};

	const receivePlaceOrderResponse = function(responseData){
		responseData = JSON.parse(responseData);
		saleOrderFunctionality.gotoOrderDetails(responseData.responseCode)
	};

	parent.initSaleOrderDetail = async function (commonActivityFlag) {
		appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		if(commonActivityFlag === true){
			await appCommonFunctionality.adminCommonActivity();
		}
		
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		ORDERSALESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERSALESTATUS'));
		COUNTRYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COUNTRY'));
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if (!orderId) {
			return;
		}
		const queryString = `ORDERDETAILS&orderId=${orderId}`;
		appCommonFunctionality.ajaxCall(queryString, receiveOrderDetailResponse);
	};

	const receiveOrderDetailResponse = function (responseData) {
		try {
			appCommonFunctionality.hideLoader();
			const orderId = appCommonFunctionality.getUrlParameter('orderId');
			ORDER = JSON.parse(responseData)?.msg?.[0];
			ORDERGUID = ORDER?.GUID;
			/*-----------------------------------Check if CoC Order-----------------------------------------*/
			if(ORDER?.buyerName?.toLowerCase() === COMPANYTYPECoC.toLowerCase() || ORDER?.companyName?.toLowerCase() === COMPANYTYPECoC.toLowerCase() || ORDER?.contactPerson?.toLowerCase() === COMPANYTYPECoC.toLowerCase()){
				isCoCOrder = true;
			}
			/*-----------------------------------Check if CoC Order-----------------------------------------*/
			if (!ORDER) {
				console.error("Invalid response data.");
				return;
			}else if(ORDER === 'O'){
				saleOrderFunctionality.gotoOrders();
			}
			const currentStatus = getOrderStatus(ORDER.status);
			
			//Order Status Progress 
			$('#orderStatusProgress').html(orderStatusProgress(ORDER.status));
			
			// Section 1: Order Summary
			const currencyObj = appCommonFunctionality.getDefaultData('CURRENCY');
			const orderSummaryHTML = `
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
					<div class="pull-left">
						<h2>${ORDER.orderCode} - ${currentStatus} </h2>
						<h2>${appCommonFunctionality.getDefaultCurrency()}${parseFloat(ORDER.totalPrice).toFixed(2)}</h2>
						<div class="f14"><b id="cms_851">Profit</b>: <b id="profitStatement" class="greenText"></b></div>
						<div class="f14"><b id="cms_360">${appCommonFunctionality.getCmsString(360)}</b>: ${ORDER.orderDate}</div>
						<div class="f14"><b id="cms_353">${appCommonFunctionality.getCmsString(353)}</b>: ${ORDER.deliveryDate}</div>
						<div class="f14 blueText"><b id="typeOfOrder"></b></div>
					</div>
				</div>
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
					<!--<div class="pull-right productImageBlock5">
						<img src="${QRCODEAPIURL}${ORDER.orderCode}|${ORDER.totalPrice}${currencyObj.currency}|${ORDER.orderDate}|${ORDER.deliveryDate}" 
							 alt="${ORDER.orderCode}" 
							 onerror="productFunctionality.onImgError(this);">
					</div>-->
				</div>`;
			$('#oderDetailsSection1').html(orderSummaryHTML);
			$('#deliveryDate').val(ORDER.deliveryDate);

			// Section 2: Billing and Delivery Information
			let oderDetailsSection2HTML = ``;
			if(ORDER.companyName.toLowerCase() !== 'coc'){
				oderDetailsSection2HTML = `
				<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white ordInfo-table roundedBorder">
					<tbody>
						<tr>
							<td width="50%"><strong id="cms_358">${appCommonFunctionality.getCmsString(358)}</strong></td>
							<td width="50%"><strong id="cms_359">${appCommonFunctionality.getCmsString(359)}</strong></td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_322">${appCommonFunctionality.getCmsString(322)}</b>: ${ORDER.companyName || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_322">${appCommonFunctionality.getCmsString(322)}</b>: ${ORDER.deliveryCompanyName || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_323">${appCommonFunctionality.getCmsString(323)}</b>: ${ORDER.contactPerson || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_323">${appCommonFunctionality.getCmsString(323)}</b>: ${ORDER.deliveryContactPerson || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_324">${appCommonFunctionality.getCmsString(324)}</b>: ${ORDER.phone || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_324">${appCommonFunctionality.getCmsString(324)}</b>: ${ORDER.deliveryPhone || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b>Email</b>: <a href="mailto:${ORDER.email || ''}" class="blueText">${ORDER.email || ''}</a> <br>
							</td>
							<td width="50%">
								<b>Email</b>: <a href="mailto:${ORDER.deliveryEmail || ''}" class="blueText">${ORDER.deliveryEmail || ''}</a> <br>
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_325">${appCommonFunctionality.getCmsString(325)}</b>: ${ORDER.address || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_325">${appCommonFunctionality.getCmsString(325)}</b>: ${ORDER.deliveryAddress || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_326">${appCommonFunctionality.getCmsString(326)}</b>: ${ORDER.town || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_326">${appCommonFunctionality.getCmsString(326)}</b>: ${ORDER.deliveryTown || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b>Postcode</b>: ${ORDER.postCode || ''} <br> 
							</td>
							<td width="50%">
								<b>Postcode</b>: ${ORDER.deliveryPostCode || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_327">${appCommonFunctionality.getCmsString(327)}</b>: <span>${appCommonFunctionality.getCountryName(ORDER.country, false)}</span>
							</td>
							<td width="50%">
								<b rel="cms_327">${appCommonFunctionality.getCmsString(327)}</b>: <span>${appCommonFunctionality.getCountryName(ORDER.deliveryCountry, false)}</span>
							</td>
						</tr>
					</tbody>
				</table>`;
			}else{
				oderDetailsSection2HTML = `<h2 class='text-right' id='cms_318'>${appCommonFunctionality.getCmsString(318)}</h2>
										   <div class='text-right f14' id='cms_393'>${appCommonFunctionality.getCmsString(393)}</div>
										   <div id="cutomerCompNTG" class='text-right f14'></div>
										   <div id="cutomerCompPE" class='text-right f12'></div>`;
			}
			$('#oderDetailsSection2').html(oderDetailsSection2HTML);
			if(ORDER.companyName.toLowerCase() === 'coc'){
				if(ORDER?.additionalData){
					ADDITIONALDATAOBJ = JSON.parse(decodeURI(window.atob(ORDER?.additionalData)));
					populateTempCustData();
				}
				$('#oderDetailsSection2').removeClass('scrollX');
			}

			// Section 3 & 4: Order Items & Billing section
			if (ORDER?.packingObj) { //I am placing it before because I need to calculate packing cost as well.
				const decodedOrderPackingObj = JSON.parse(decodeURI(window.atob(ORDER.packingObj)) || "[]");
				if (Array.isArray(decodedOrderPackingObj) && decodedOrderPackingObj.length) {
					PACKINGOBJ = decodedOrderPackingObj;
				}
			}
			if (ORDER?.orderObj) {
				$("#selectedCustomerGrade").val(ORDER?.customerGrade);
				$("#selectedCustomerId").val(ORDER?.customerId);
				$("#selectedCustomerDeliveryAddressId").val(ORDER.deliveryAddressId);
				try {
					const decodedOrderObj = JSON.parse(decodeURI(window.atob(ORDER.orderObj)));
					const finalOrderObj = JSON.parse(decodedOrderObj?.orderObj || "[]");
					const projectInformationData = JSON.parse($('#projectInformationData').val());
					DEFAULTADDRESS = projectInformationData?.billingInformation?.address + '<br>' + projectInformationData?.billingInformation?.town+ ' ' + projectInformationData?.billingInformation?.postCode;
					DEFAULTPHONE = projectInformationData?.billingInformation?.phone;
					VATNUMBER = projectInformationData?.paymentInformation?.vatNo;
					const currencyObj = appCommonFunctionality.getDefaultData('CURRENCY');
					if (Array.isArray(finalOrderObj) && finalOrderObj.length) {
						ORDEROBJ = finalOrderObj;
						saleOrderFunctionality.populateCart();
						const oderDetailsSection4HTML = `
						<div class="receipt-header">
							<h4>${SITENAME}</h4>
							<p>${DEFAULTADDRESS}</p>
							<p>Tel: ${DEFAULTPHONE}<br>VAT No:${VATNUMBER}<br><b>${ORDER.orderCode}</b> - ${ORDER.orderDate}</p>
						</div>
						
						<div id="billCartTableHolder" class="scrollX">
						</div>
						
						<div id="billTotalCalcSection" class="text-right f14">
						</div>
						
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center marBot10">
							<img src="${QRCODEAPIURL}${ORDER.orderCode}|${ORDER.totalPrice}${currencyObj.currency}|${ORDER.orderDate}|${ORDER.deliveryDate}" alt="${ORDER.orderCode}" class="productQRCode" onerror="productFunctionality.onImgError(this);">
						</div>
						
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly receipt-footer f14">
							<p><span id="cms_361">${appCommonFunctionality.getCmsString(361)}</span>: <span id="paymentModeBill"></span> | <span id="cms_362">${appCommonFunctionality.getCmsString(362)}</span>: ${appCommonFunctionality.addZeroesToNumber(ORDER.createdBy, 5)}</p>
							<h4><span id="cms_363">${appCommonFunctionality.getCmsString(363)}</span></h4>
						</div>`;
						$('#billPrint').html(oderDetailsSection4HTML);
						$('#billCartTableHolder').html($('#cartTableHolder').html());
						$('#billCartTableHolder table').removeClass().addClass('table receipt-items roundedBorder');
						$('#billTotalCalcSection').html(
							$('#totalCalcSection')
								.clone() // Clone the entire section
								.find('#paymentModeSection, #creditNote') // Find and exclude #paymentModeSection & #creditNote
								.remove() // Remove it
								.end() // Return back to the cloned content
								.html() // Get the HTML string
								.replace(
									'col-lg-6 col-md-6 col-sm-6 col-xs-6 ', 
									'col-lg-12 col-md-12 col-sm-12 col-xs-12 '
								) // Replace the specific class
						);
						/*------------------------------------Populating Profit Statement----------------------------*/
						const profitObj = calcProfit();
						$('#profitStatement').html(appCommonFunctionality.getDefaultCurrency() + profitObj.profitMargin + ' (' + profitObj.profitPercentage + ')');
						/*------------------------------------Populating Profit Statement----------------------------*/
					}
				} catch (error) {
					console.error("Failed to parse order object:", error);
				}
			}
			
			// Payment Information Section
			if (ORDER?.paymentInformation) {
				try {
					PAYMENTOBJ = ORDER?.paymentInformation;
					let partlyPaidTotalAmount = 0.00;
					let str = '';
					for(let i = 0; i < PAYMENTOBJ.length; i++){
						str = str + PAYMENTOBJ[i].financeDate + ' : ' + appCommonFunctionality.getDefaultCurrency() + PAYMENTOBJ[i].amount + ' [' + PAYMENTOBJ[i].paymentMode + ']<br/>';
						partlyPaidTotalAmount = partlyPaidTotalAmount + parseFloat(PAYMENTOBJ[i].amount);
					}
					const paidStatusId = getOrderStatusId('PAID');
					if(parseFloat(partlyPaidTotalAmount) >= parseFloat(ORDER.totalPrice) && ORDER.status < paidStatusId) {
						str = str + "<span id='cms_860'>" + appCommonFunctionality.getCmsString(860) + "</span> <span id='cms_861' class='blueText hover' onclick=\"saleOrderFunctionality.changeOrderStatus('" + orderId + "', " + paidStatusId + ")\">" + appCommonFunctionality.getCmsString(861) + "</span>";
					}
					$('#saleOrderPaymentInformation').html(str);
				} catch (error) {
					console.error("Failed to parse order object:", error);
				}
			}else{
				$('#saleOrderPaymentInformation').html('N/A');
			}

			//Populate next order status redirection on action button
			const extractOrderStatus = function(htmlString) {
				const regex = /<b style="color:[^"]+">([^<]+)<\/b>/;
				const match = htmlString.match(regex);
				return match ? match[1] : "";
			};
			const disableButtons = (selectors) => {
				$(selectors).prop('disabled', true);
			};
			const enableButtons = (selectors) => {
				$(selectors).prop('disabled', false);
			};
			const disableOrderPackingTab = function(){
				$('#orderPackingDetailsTab a').contents().unwrap();
				$('#orderPackingDetailsTab').addClass('notAllowed');
			};
			const enableDisableOrderCartonTagBtn = function(){
				if (ORDER?.packingObj) {
					PACKINGOBJ = JSON.parse(decodeURI(window.atob(ORDER.packingObj)));
				}
				if(PACKINGOBJ.length > 0){
					enableButtons("#cartonTagBtn");
				}else{
					disableButtons("#cartonTagBtn");
				}
			};
			switch (extractOrderStatus(currentStatus)) {
				
				case "PLACED":{
					disableButtons("#newOrderBtn");
					enableDisableOrderCartonTagBtn();
					break;
				}
					
				case "APPROVED":{
					disableButtons("#newOrderBtn, #editOrderBtn");
					enableDisableOrderCartonTagBtn();
					break;
				}
					
				case "PARTIALLYPAID":{
					disableButtons("#newOrderBtn, #editOrderBtn, #splitOrderBtn, #deleteOrderBtn");
					enableDisableOrderCartonTagBtn();
					break;
				}
				
				case "PAID":{
					disableButtons("#newOrderBtn, #editOrderBtn, #splitOrderBtn, #deleteOrderBtn");
					enableDisableOrderCartonTagBtn();
					break;
				}
					
				case "SHIPPED":
					disableButtons("#newOrderBtn, #editOrderBtn, #splitOrderBtn, #deleteOrderBtn");
					disableOrderPackingTab();
					enableDisableOrderCartonTagBtn();
					break;
					
				case "DELIVERED":{
					disableButtons("#newOrderBtn, #editOrderBtn, #splitOrderBtn, #deleteOrderBtn");
					disableOrderPackingTab();
					enableDisableOrderCartonTagBtn();
					break;
				}
					
				case "COMPLETED":
					disableButtons("#editOrderBtn, #splitOrderBtn, #actionBtn, #deleteOrderBtn");
					enableButtons("#newOrderBtn");
					disableOrderPackingTab();
					enableDisableOrderCartonTagBtn();
					break;
					
				case "CANCELLED1":{
					disableButtons("#editOrderBtn, #splitOrderBtn, #actionBtn, #deleteOrderBtn");
					enableButtons("#newOrderBtn");
					disableOrderPackingTab();
					enableDisableOrderCartonTagBtn();
					break;
				}
					
				case "CANCELLED2":{
					disableButtons("#editOrderBtn, #splitOrderBtn, #actionBtn, #deleteOrderBtn");
					enableButtons("#newOrderBtn");
					disableOrderPackingTab();
					enableDisableOrderCartonTagBtn();
					break;
				}
			}
			$('#orderStatusBunAction').html(generateOrderStatusLinks(ORDER.status));
			
			if (appCommonFunctionality.isMobile()) {
				$('#oderDetailsSection3').removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
			}
			appCommonFunctionality.cmsImplementationThroughID();
			saleOrderFunctionality.mapTypeOfOrder();
		} catch (error) {
			console.error("Error in receiveOrderDetailResponse:", error);
		}
	};
	
	const calcProfit = function() {
		var customerGrade = $('#selectedCustomerGrade').val();
		var totalPurchasePrice = 0;
		var totalSellingPrice = 0;
		for (var i = 0; i < ORDEROBJ.length; i++) {
			var item = ORDEROBJ[i];
			totalPurchasePrice += item.PPrice;
			if (customerGrade === 'w') {
				totalSellingPrice += item.WPrice;
			} else {
				totalSellingPrice += item.RPrice;
			}
		}
		var profitMargin = totalSellingPrice - totalPurchasePrice;
		var profitPercentage = (profitMargin / totalPurchasePrice) * 100;
		return {
			"profitMargin": parseFloat(profitMargin.toFixed(2)),
			"profitPercentage": parseFloat(profitPercentage.toFixed(2)) + "%"
		};
	};
	
	const orderStatusProgress = function (orderStatusId) {
		const orderStatusSteps = ORDERSALESTATUSPRECOMPILEDDATA.filter(status => status.orderStatusId < (getOrderStatusId('COMPLETED') + 1));
		const totalSteps = orderStatusSteps.length;
		const activeSteps = orderStatusSteps.filter(step => step.orderStatusId <= orderStatusId).length; // Use the passed parameter
		const progressPercentage = ((activeSteps - 1) / (totalSteps - 1)) * 100; // Calculate percentage
		let progressHtml = `<div class="progress-container">`;
		progressHtml += `<div class="progress" id="progress" style="width: ${progressPercentage}%;"></div>`;
		orderStatusSteps.forEach((step) => {
			const isActive = step.orderStatusId <= orderStatusId ? "active" : "";
			progressHtml += `
				<div class="circle ${isActive}">
					<span class="stepText" id="cms_${step.orderStatusCmsId}">${appCommonFunctionality.getCmsString(step.orderStatusCmsId)}</span>
				</div>
			`;
		});
		progressHtml += `</div>`;
		return progressHtml;
	};
	
	parent.updatePaymentInformation = async function () {
		if(validatePaymentInformation()){
			const saleOrderPaymentStatus = $('#saleOrderPaymentStatus').val();
			const orderStatusId = getOrderStatusId(saleOrderPaymentStatus);
			const orderStatusIdPaid = getOrderStatusId('PAID');
			if(ORDER.status < orderStatusIdPaid){
				const orderId = appCommonFunctionality.getUrlParameter('orderId');
				const saleOrderAmount = $('#saleOrderAmount').val();
				const saleOrderPaymentMode = $('#saleOrderPaymentMode').val();
				const saleOrderPaymentDetails = JSON.parse($('#saleOrderPaymentDetails').val());
				const saleOrderNarration = $('#saleOrderNarration').val();
				const paymentInfo = {
					financeTypeDDL : 1, //for financeType Income
					earningTypeDDL : financeCategoryORDS, //ORDS
					earningTitle : ORDER.orderCode,
					financeDate : appCommonFunctionality.getCurrentDatetime(),
					debit : 0.00,
					totalEarning : saleOrderAmount,
					earningDescription: saleOrderNarration,
					paymentMode: saleOrderPaymentMode,
					paymentDetails: window.btoa(encodeURI(JSON.stringify(saleOrderPaymentDetails)))
				};
				const selectedLang = $('#languageDDL').val() || 'en';

				/* Very Important to understand !
				1. First It is making FINANCEENTRY call
				2. Secondly it is making a series of DISPACHSTOCK calls
				3. Finally it is making the call in order to change Sale Order Status
				*/
				appCommonFunctionality.ajaxCallLargeData("FINANCEENTRY", paymentInfo, function(response){
					if(PAYMENTOBJ?.length === 0){
						const dispachStockArray = getDispachStockArray(ORDER.orderCode);
						for(let i = 0; i < dispachStockArray.length; i++){
							appCommonFunctionality.ajaxCallLargeData("DISPACHSTOCK", dispachStockArray[i], function(response){
								if(i === (dispachStockArray.length - 1)){
									const queryString = `CHANGEORDERSTATUS&orderId=${orderId}&orderStatusId=${orderStatusId}&selectedLang=${selectedLang}`;
									appCommonFunctionality.ajaxCall(queryString, receiveChangeOrderStatusResponse);
								}
							});
						}
					}else{
						const queryString = `CHANGEORDERSTATUS&orderId=${orderId}&orderStatusId=${orderStatusId}&selectedLang=${selectedLang}`;
						appCommonFunctionality.ajaxCall(queryString, receiveChangeOrderStatusResponse);
					}
				}); 
				
			}else{
				alert(appCommonFunctionality.getCmsString(394));
				appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(394), appCommonFunctionality.getLang());
			}
		}
	};
	
	const validatePaymentInformation = function(){
		var errorCount = 0;
		
		/*-------------------------------------Sale Order Payment Method Validation---------------------------*/
		if($("#saleOrderPaymentMode").val() === ''){
			alert(appCommonFunctionality.getCmsString(858));
			errorCount++;
		}
		/*-------------------------------------Sale Order Payment Method Validation---------------------------*/
		
		/*-------------------------------------Sale Order Amount Validation----------------------------------*/
		if($("#saleOrderAmount").val() === '' && parseFloat($("#saleOrderAmount").val()) === 0){
			appCommonFunctionality.raiseValidation("saleOrderAmount", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("saleOrderAmount", "saleOrderAmount", true);
			/*-------------------------------------Important data modification-------------------------------*/
			const saleOrderAmount = parseFloat((parseFloat($("#saleOrderAmount").val()) || 0).toFixed(2));
			if(saleOrderAmount === parseFloat(getPendingAmount())){
				$('#saleOrderPaymentStatus').val('PAID');
			}
			/*-------------------------------------Important data modification-------------------------------*/
		}
		/*-------------------------------------Sale Order Amount Validation----------------------------------*/
		
		/*-------------------------------------Sale Order Narration Validation-------------------------------*/
		if($("#saleOrderNarration").val() === ''){
			appCommonFunctionality.raiseValidation("saleOrderNarration", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("saleOrderNarration", "saleOrderNarration", true);
		}
		/*-------------------------------------Sale Order Narration Validation-------------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const getDispachStockArray = function(orderCode){
		const grouped = {};
		$.each(ORDEROBJ, function(_, item) {
			const key = item.productId + '-' + item.productCombinationId;
			if (!grouped[key]) {
				grouped[key] = { productId: item.productId, productCombinationId: item.productCombinationId, count1: 0, count2: 0 };
			}
			if (item.creditNote) {
				grouped[key].count2++;
			} else {
				grouped[key].count1++;
			}
		});
		const result = [];
		$.each(grouped, function(_, group) {
			const finalCount = group.count1 - group.count2;
			if (finalCount > 0) {
				result.push({ productIdHdn: group.productId, productCombinationIdHdn: group.productCombinationId, dispatchReference: orderCode, count: finalCount });
			}
		});

		return result;
	};
	
	parent.selectPaymentMode = async function(paymentMode){
		$('.paymentGifBlock').find('.fa-check').remove();
		$('#payBy' + appCommonFunctionality.capitalizeFirstLetter(paymentMode.toLowerCase())).append('<i class="fa fa-check greentext f16 check-icon"></i>');
		$('#saleOrderPaymentMode').val(paymentMode);
		let paymentDetails = {};
		switch (paymentMode.toLowerCase()) {
			
			case "card":{
				paymentDetails = await getInformationFromCardMachine();
				break;
			}
			
			case "upi":{
				paymentDetails = await getInformationFromUPI();
				break;
			}
			
			case "online":{
				paymentDetails = await getInformationFromOnlinePayment();
				break;
			}
		}
		$('#saleOrderPaymentDetails').val(JSON.stringify(paymentDetails));
	};

	const getInformationFromCardMachine = async function () {
		appCommonFunctionality.showLoader();
		//xxxx Stripe Card reader integration
		// Simulate waiting for some async process (e.g., API call)
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					paymentIntent: {
						id: "pi_1XYZ...",
						object: "payment_intent",
						amount: 5000,
						currency: "usd",
						status: "succeeded",
						charges: {
							data: [
								{
									id: "ch_1ABC...",
									object: "charge",
									amount: 5000,
									currency: "usd",
									status: "succeeded",
									payment_method_details: {
										card_present: {
											brand: "visa",
											last4: "1234",
											country: "US",
											emv_auth_data: "A1B2C3..."
										}
									},
									created: 1674839172
								}
							]
						},
						created: 1674839170
					}
				});
			}, LOADTIME); // Simulating a delay (e.g., API response)
		});
	};
	
	const getInformationFromUPI = async function () {
		appCommonFunctionality.showLoader();
		//xxxx UPI integration
		// Simulate waiting for some async process (e.g., API call)
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					paymentIntent: {
						transactionId: "TRX123456789",
						amount: 100.00,
						recipientVpa: "recipient@axisbank",
						merchantId: "MERCHANT123",
						paymentGateway: "Axis Bank",
						callbackUrl: "https://your-webhook-url/status",
						mobileNumber: "9876543210",
						created: 1674839170
					}
				});
			}, LOADTIME); // Simulating a delay (e.g., API response)
		});
	};
	
	const getInformationFromOnlinePayment = async function () {
		appCommonFunctionality.showLoader();
		//xxxx Online Payment integration
		// Simulate waiting for some async process (e.g., API call)
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					paymentIntent: {
						transactionId: "TRX123456789",
						amount: 100.00,
						recipientVpa: "recipient@axisbank",
						merchantId: "MERCHANT123",
						paymentGateway: "Axis Bank",
						callbackUrl: "https://your-webhook-url/status",
						mobileNumber: "9876543210",
						created: 1674839170
					}
				});
			}, LOADTIME); // Simulating a delay (e.g., API response)
		});
	};
	
	parent.printBill = function () {
		const content = $('#billPrint').html();
		if (!content) {
			console.error("No content available to print.");
			return;
		}
		$.get('../assets/templates/saleOrderBill.html', function (template) {
			if (!template) {
				console.error("Failed to load print template.");
				return;
			}
			const printWindow = window.open('', '_blank', 'width=800,height=600');
			printWindow.document.open();
			const htmlContent = template.replace('{{content}}', content);
			printWindow.document.write(htmlContent);
			printWindow.document.close();
			setTimeout(() => {
				printWindow.print();
				printWindow.onafterprint = () => printWindow.close();
			}, LOADTIME);
		}).fail(function () {
			console.error("Error loading the HTML template.");
		});
	};

	parent.gotoOrders = function(){
		window.location = `saleOrders.php`;
	};
	
	parent.openInvoice = function(){
		window.open(PROJECTPATH + `saleInvoice/` + ORDER.GUID, '_blank').focus();
	};
	
	parent.openCartonTag = function(){
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		window.open('saleOrderCartonDataPrint.php?orderId=' + orderId, '_blank').focus();
	};
	
	parent.openMail = function(){
		window.open('mail.php?search=' + ORDER.orderCode, '_blank').focus();
	};

	parent.openCreditNote = function () {
		if (ORDEROBJ.length > 0) {
			// Step 1: Find combinations that already have creditNote = true
			const creditNoteKeys = new Set(
				ORDEROBJ.filter(item => item.creditNote)
					.map(item => `${item.productId}-${item.productCombinationId}`)
			);

			// Step 2: Create a map to keep track of how many we’ve skipped for each key
			const skipCountMap = {};

			// Step 3: Filter out creditNote items + skip one normal item for each matching key
			const filteredItems = ORDEROBJ.filter(order => {
				const key = `${order.productId}-${order.productCombinationId}`;

				if (order.creditNote) return false; // Exclude creditNote items

				if (creditNoteKeys.has(key)) {
					if (!skipCountMap[key]) {
						skipCountMap[key] = 1; // Skip the first match
						return false;
					}
				}

				return true;
			});

			// Step 4: Generate the HTML
			const creditNoteItems = filteredItems.map(order => `
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 f14 noLeftPaddingOnly">
					<div class="creditNoteItem">
						<input type="checkbox" id="productCombination_${order.productCombinationId}" name="productCombination_${order.productCombinationId}" value="${order.productCombinationId}" class="marRig5">
						<span>${order.productTitle} [${order.productCode}] <span>[${order.productCombinationId}] - ${getQRTextHtml(order.productCombinationQR, order.productCode)}</span></span>
					</div>
				</div>
			`).join('');

			$('#creditNoteTableHolder').html(creditNoteItems);
			$('#creditNoteModal').modal('show');
		}
	};

	const generateOrderStatusLinks = function(currentOrderStatusId) {
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
        const currentStatus = ORDERSALESTATUSPRECOMPILEDDATA.find(
            status => status.orderStatusId === currentOrderStatusId
        );

        if (!currentStatus) {
            console.error("Invalid order status ID provided.");
            return "";
        }

        const redirectionIds = currentStatus.redirectionOrderStatusIds
            ? currentStatus.redirectionOrderStatusIds.split(",").map(Number)
            : [];

        const redirectionStatuses = ORDERSALESTATUSPRECOMPILEDDATA.filter(
            status => redirectionIds.includes(status.orderStatusId)
        );
		
        let linksHtml = "";
        redirectionStatuses.forEach(status => {
            linksHtml += `<li class="hover" onClick="saleOrderFunctionality.changeOrderStatus('${orderId}', ${status.orderStatusId})">
                        <a id="cms_${status.orderStatusCmsId}">${appCommonFunctionality.getCmsString(status.orderStatusCmsId)}</a>
                      </li>`;
        });
        return linksHtml;
    };
	
	parent.changeOrderStatus = function(orderId, orderStatusId){
		const saleOrderStatus = extractStatusText(getOrderStatus(orderStatusId));
		const selectedLang = $('#languageDDL').val() || 'en';
		let partlyPaidTotalAmount = 0.00
		for(let i = 0; i < PAYMENTOBJ.length; i++){
			partlyPaidTotalAmount = partlyPaidTotalAmount + parseFloat(PAYMENTOBJ[i].amount);
		}
		if(parseFloat(partlyPaidTotalAmount) >= parseFloat(ORDER.totalPrice)) {
			const queryString = `CHANGEORDERSTATUS&orderId=${orderId}&orderStatusId=${orderStatusId}&selectedLang=${selectedLang}`;
			appCommonFunctionality.ajaxCall(queryString, receiveChangeOrderStatusResponse);
		}else{
			if(saleOrderStatus === 'PARTIALLYPAID'){
				const pendingAmount = getPendingAmount();
				$('#paymentOptionModal').modal('show');
				$('#saleOrderCurrency').text(appCommonFunctionality.getDefaultCurrency());
				$('#saleOrderAmount').val(pendingAmount).prop('disabled', false);
				$('#saleOrderNarration').val(ORDER?.orderCode + ' - ' + appCommonFunctionality.getCmsString(840)).prop('disabled', false);
				$('#saleOrderPaymentStatus').val(saleOrderStatus);
			}else if(saleOrderStatus === 'PAID'){
				const pendingAmount = getPendingAmount();
				$('#paymentOptionModal').modal('show');
				$('#saleOrderCurrency').text(appCommonFunctionality.getDefaultCurrency());
				$('#saleOrderAmount').val(pendingAmount).prop('disabled', true);
				$('#saleOrderNarration').val(ORDER?.orderCode + ' - ' + appCommonFunctionality.getCmsString(859)).prop('disabled', true);
				$('#saleOrderPaymentStatus').val(saleOrderStatus);
			}else{
				const queryString = `CHANGEORDERSTATUS&orderId=${orderId}&orderStatusId=${orderStatusId}&selectedLang=${selectedLang}`;
				appCommonFunctionality.ajaxCall(queryString, receiveChangeOrderStatusResponse);
			}
		}
	};
	
	const getPendingAmount = function() {
		const totalPrice = parseFloat(ORDER?.totalPrice) || 0;
		const paidAmount = Array.isArray(PAYMENTOBJ) 
			? PAYMENTOBJ.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) 
			: 0;
		return (totalPrice - paidAmount).toFixed(2); // Ensures 2 decimal places
	};
	
	parent.verifyPendingAmount = function() {
		let saleOrderAmount = parseFloat($('#saleOrderAmount').val()) || 0;
		const maxAllowedAmount = getPendingAmount();
		saleOrderAmount = Math.max(0, Math.min(saleOrderAmount, maxAllowedAmount));
		$('#saleOrderAmount').val(saleOrderAmount.toFixed(2));
	};
	
	const receiveChangeOrderStatusResponse = function(response){
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if(parseInt(orderId) > 0){
			window.location = `saleOrderDetails.php?orderId=` + orderId;
		}
	};
	
	parent.initSaleOrdersSplit = async function () {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		COMPANYTYPEPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COMPANYTYPE'));
		ORDERSALESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERSALESTATUS'));
		COUNTRYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COUNTRY'));
		PRODUCTLIVESTOCKPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCTLIVESTOCK'));
		PRODUCTPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCT'));
		BRANDPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('BRAND'));
		CATEGORYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('CATEGORY'));
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if (orderId) {
			$('#orderId').val(orderId);
			appCommonFunctionality.ajaxCall('ORDERDETAILS&orderId=' + orderId, receiveOrderDeatilsData);
		}
		
		/*----------------------Customer Search implementation-----------------------------*/
		$("#customerSearch").on('keyup', function () {
			const customerSearchKeyword = $(this).val();
			if (customerSearchKeyword.length > 2) {
				isCoCOrder = false;
				SEARCHCUSTOMERCRITERIA.keyword = customerSearchKeyword;
				$('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
				appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
			} else {
				$('#customerSearchResult').html('');
			}
		});
		/*----------------------Customer Search implementation-----------------------------*/

		if(!appCommonFunctionality.isMobile()){
			$('#addProductQRScannerCam').prop('disabled', true);
		}else{
			$('#cartTableHolder').parent().removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
			$('#searchCatSection').removeClass('noRightPaddingOnly').addClass('nopaddingOnly'); //for productSearchModal
		}
    };
	
	parent.transferToNewOrder = function(productCombinationId){
		if(parseInt(productCombinationId) > 0){
			let index = ORDEROBJ.findIndex(obj => obj.productCombinationId === productCombinationId);
			if(index !== -1){
				let transferredObject = ORDEROBJ.splice(index, 1)[0];
				NEWORDEROBJ.push(transferredObject);
				//console.log(`Transferred object with productCombinationId ${productCombinationId}`);
				saleOrderFunctionality.populateCart();
				saleOrderFunctionality.populateNewOrderCart();
			} else {
				//console.log(`No object found with productCombinationId ${productCombinationId}`);
			}
		}
	};
	
	parent.populateNewOrderCart = function() {
		let selectedCustomerGrade = $("#selectedCustomerGrade").val().toLowerCase();
		let groupedOrderObj = [];
		let countMap = {};

		// Group by productCombinationId and add qty field
		$.each(NEWORDEROBJ, function(index, item) {
			if (countMap[item.productCombinationId]) {
				countMap[item.productCombinationId].qty++;
			} else {
				countMap[item.productCombinationId] = { ...item, qty: 1 };
				groupedOrderObj.push(countMap[item.productCombinationId]);
			}
		});

		// Sort groupedOrderObj by productCombinationId
		groupedOrderObj.sort((a, b) => a.productCombinationId - b.productCombinationId);

		let totalPriceBeforeTax = 0.00;
		let tableRows = '';

		if (groupedOrderObj.length > 0) {
			tableRows += `
				<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder">
					<tbody>
						<tr>
							<td width="75%" class="text-left"><b id="cms_329">Products</b></td>
							<td width="10%" class="text-right"><b>Qty</b></td>
							<td width="15%" class="text-right"><b id="cms_330">Price</b></td>
						</tr>
			`;

			$.each(groupedOrderObj, function(index, item) {
				let productPrice = selectedCustomerGrade === 'w' ? item.WPrice : item.RPrice;
				let groupTotal = (productPrice * item.qty);
				totalPriceBeforeTax += groupTotal;

				tableRows += `
					<tr>
						<td class="text-left">
							<div class="pull-left f12">
								<span>${item.productTitle} [${item.productCode}] ${appCommonFunctionality.getDefaultCurrency()} ${productPrice}</span><br>
								<span>[${item.productCombinationId}] - ${getQRTextHtml(item.productCombinationQR, item.productCode)}</span>
							</div>
							<div class="pull-left"></div>
						</td>
						<td class="text-right">
							<i class="fa fa-hand-o-left greenText marRig5 hover" onclick="saleOrderFunctionality.transferToExistingOrder(${item.productCombinationId})"></i>
							${item.qty}
						</td>
						<td class="text-right">
							<span>${appCommonFunctionality.getDefaultCurrency()}${groupTotal.toFixed(2)}</span>
						</td>
					</tr>
				`;
			});

			tableRows += '</tbody></table>';
		}

		let totalTax = totalPriceBeforeTax * DEFAULTTAX / 100;
		let totalPrice = totalPriceBeforeTax + totalTax;

		$('#newCartTableHolder').html(tableRows);
		$('#totalBeforeTaxNew').html(appCommonFunctionality.getDefaultCurrency() + totalPriceBeforeTax.toFixed(2));
		$("#taxPNew").html(DEFAULTTAX);
		$("#totalPriceNew").html(appCommonFunctionality.getDefaultCurrency() + totalPrice.toFixed(2));
		$('#totalCalcSectionNew').toggleClass('hide', groupedOrderObj.length === 0);
	};
	
	parent.transferToExistingOrder = function(productCombinationId){
		if(parseInt(productCombinationId) > 0){
			let index = NEWORDEROBJ.findIndex(obj => obj.productCombinationId === productCombinationId);
			if(index !== -1){
				let transferredObject = NEWORDEROBJ.splice(index, 1)[0];
				ORDEROBJ.push(transferredObject);
				//console.log(`Transferred object with productCombinationId ${productCombinationId}`);
				saleOrderFunctionality.populateCart();
				saleOrderFunctionality.populateNewOrderCart();
			} else {
				//console.log(`No object found with productCombinationId ${productCombinationId}`);
			}
		}
	};
	
	parent.splitOrder = function() {
		let errorCount = 0;
		const errorMsg = appCommonFunctionality.getCmsString(356);
		const lang = appCommonFunctionality.getLang();

		if (ORDEROBJ.length === 0 || NEWORDEROBJ.length === 0) {
			alert(errorMsg);
			appCommonFunctionality.textToAudio(errorMsg, lang);
			errorCount++;
		}

		if (errorCount === 0) {
			const qryStr = 'PLACEORDER';
			const selectedCustomerId = parseInt($("#selectedCustomerId").val());
			const selectedCustomerDeliveryAddressId = parseInt($("#selectedCustomerDeliveryAddressId").val());
			const deliveryDate = $('#deliveryDate').val();
			const deliveryDateNew = $('#deliveryDateNew').val();
			const orderId = parseInt(appCommonFunctionality.getUrlParameter('orderId')) ?? 0;
			const orderSummary = getOrderSummary();
			let totalPrice = orderSummary?.total;
			let totalPriceNew = $('#totalPriceNew').text();
			totalPriceNew = totalPriceNew.replace(appCommonFunctionality.getDefaultCurrency(), '');

			const processOrder = (orderObj, totalPrice, deliveryDate, orderId) => {
				orderObj = { 
					orderObj: JSON.stringify(orderObj), 
					tax: orderSummary?.tax
				};
				const callData = {
					orderId: orderId,
					parentOrderId: 0,
					customerId: selectedCustomerId,
					deliveryAddressId: selectedCustomerDeliveryAddressId,
					orderObj: window.btoa(encodeURI(JSON.stringify(orderObj))),
					packingObj: ORDER.packingObj,
					totalPrice: totalPrice,
					deliveryDate: deliveryDate
				};
				appCommonFunctionality.ajaxCallLargeData(qryStr, callData, receiveOrderSplitResponse);
			};

			processOrder(ORDEROBJ, totalPrice, deliveryDate, orderId);
			processOrder(NEWORDEROBJ, totalPriceNew, deliveryDateNew, 0);
		}
	};
	
	const receiveOrderSplitResponse = function(responseData){
		responseData = JSON.parse(responseData);
		const orderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
		if(parseInt(responseData.responseCode) > parseInt(orderId)){
			saleOrderFunctionality.gotoOrderDetails(responseData.responseCode);
		}
	};
	
	parent.createCreditNote = function() {
		const customerGrade = ORDER?.customerGrade;
		// Get the selected productCombinationId values
		const selectedCreditNoteCombinationArray = $('input[id^="productCombination_"]:checked')
			.map(function() {
				return this.value;
			})
			.get();

		// Clone matching orders and add CreditNote attribute
		const filteredOrderObj = selectedCreditNoteCombinationArray.map(selectedId => {
			const matchingOrder = ORDEROBJ.find(order => order.productCombinationId.toString() === selectedId);
			return matchingOrder ? { ...matchingOrder, creditNote: true } : null;
		}).filter(order => order);

		// Push the filteredOrderObj items into ORDEROBJ
		ORDEROBJ.push(...filteredOrderObj);

		// Sort ORDEROBJ by productCombinationId
		ORDEROBJ.sort((a, b) => a.productCombinationId - b.productCombinationId);

		const orderSummary = getOrderSummary();
		let totalPrice = orderSummary?.total;
		
		// Prepare the order object for the request
		const orderObj = {
			orderObj: JSON.stringify(ORDEROBJ),
			tax: orderSummary?.tax
		};
		const orderId = appCommonFunctionality.getUrlParameter('orderId') || 0;
		const callData = {
			orderId: orderId,
			parentOrderId: 0,
			customerId: ORDER.customerId,
			deliveryAddressId: ORDER.deliveryAddressId,
			orderObj: window.btoa(encodeURI(JSON.stringify(orderObj))),
			packingObj: ORDER.packingObj,
			totalPrice: totalPrice,
			deliveryDate: ORDER.deliveryDate
		};

		appCommonFunctionality.ajaxCallLargeData('PLACEORDER', callData, receivePlaceOrderResponse);
	};

	parent.initSaleOrderPackingDetails = async function () {
		appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();

		/*-------------------------------Getting Pre-Compiled Data----------------------------------*/
		PACKAGEPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PACKAGE'));
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		/*-------------------------------Getting Pre-Compiled Data----------------------------------*/
		
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if (orderId) {
			$('#orderId').val(orderId);
			const queryString = `ORDERDETAILS&orderId=${orderId}`;
			appCommonFunctionality.ajaxCall(queryString, receiveOrderPackingDetailResponse);
			populatePackageList();
		} else {
			parent.gotoOrders();
		}
	};

	const receiveOrderPackingDetailResponse = function (responseData) {
		appCommonFunctionality.hideLoader();
		ORDER = JSON.parse(responseData)?.msg?.[0];
		if (ORDER) {
			ORDERGUID = ORDER.GUID;
			const decodedOrderObj = JSON.parse(decodeURI(window.atob(ORDER.orderObj)));
			const finalOrderObj = JSON.parse(decodedOrderObj?.orderObj || "[]");
			TAXP = decodedOrderObj?.tax || 0;
			if (Array.isArray(finalOrderObj) && finalOrderObj.length) {
				ORDEROBJ = finalOrderObj;
				if (ORDER?.packingObj) {
					PACKINGOBJ = JSON.parse(decodeURI(window.atob(ORDER?.packingObj)));
				}
				parent.populatePackages();
			}
		} else {
			parent.gotoOrders();
		}
	};

	const populatePackageList = function () {
		let str = '<option value="0" id="cms_419">-Select Package-</option>';
		PACKAGEPRECOMPILEDDATA.forEach(package => {
			str += `<option value="${package.packetId}">${package.packetNumber}-${package.packetName}</option>`;
		});
		$('#packageList').html(str);
	};

	parent.changePackageList = function () {
		const selectedPacket = parseInt($('#packageList').val());
		let str = '<option value="" id="cms_420">-Select Package Dimension-</option>';
		if (selectedPacket > 0) {
			const selectedPackage = PACKAGEPRECOMPILEDDATA.find(package => package.packetId === selectedPacket);
			if (selectedPackage && selectedPackage.dimention) {
				selectedPackage.dimention.forEach(dimension => {
					str += `<option value="${dimension.width}x${dimension.height}x${dimension.length}">${dimension.width}cm x ${dimension.height}cm x ${dimension.length}cm</option>`;
				});
			}
		}
		$('#packageDimention').html(str);
	};

	parent.changePackageDimention = function () {
		const packageList = parseInt($('#packageList').val());
		const packageDimention = $('#packageDimention').val();
		if (packageList > 0 && packageDimention) {
			const [width, height, length] = packageDimention.split('x').map(Number);
			const selectedPackage = PACKAGEPRECOMPILEDDATA.find(package => parseInt(package.packetId) === packageList);
			const packetType = selectedPackage ? `${selectedPackage.packetNumber}-${selectedPackage.packetName}` : '';
			const packet = {
				packetNumber: PACKINGOBJ.length + 1,
				packetType: packetType,
				width: width,
				height: height,
				length: length,
				weight: 0,
				weightUnit: '',
				price: 0.00,
				trackingNo: '',
				items : []
			};
			PACKINGOBJ.push(packet);
			$('#populatePackageBtn').removeAttr('disabled');
		}
	};

	parent.populatePackages = function () {
		let str = '';
		if (PACKINGOBJ.length > 0) {
			PACKINGOBJ.forEach(packet => {
				str += `
					<div class="col-lg-2 col-md-6 col-sm-6 col-xs-6 noLeftPaddingOnly marTop5">
						<div class="cartonDiv3 marBot5">
							<span class="glyphicon glyphicon-remove removeCartonBtn redText hover" onclick="saleOrderFunctionality.removePackage(${packet.packetNumber});"></span>
							<h4 class="text-center"><b id="cms_421">Packet</b> <b>${packet.packetNumber}</b></h4>
							<div class="text-center f12">${packet.packetType}</div>
							<div class="text-center"><img src="${PROJECTPATH}assets/images/carton.png"></div>
							<div class="text-center blueText hover" onclick="saleOrderFunctionality.openPackagesWithInModal(${packet.packetNumber});">
								<span class="glyphicon glyphicon-search"></span>
								<span id="cms_422">View inside</span>
							</div>
							<div class="text-center marTop5">
								<span id="cms_423">Dimension in: </span> cm
							</div>
							<div class="input-group marTop5">
								<span id="Width_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_424">Width :</span> 
								</span>
								<input id="width_${packet.packetNumber}" name="width_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Width" rel="cms_425" autocomplete="off" value="${packet.width}" onfocusout="saleOrderFunctionality.savePackageData()">
							</div>
							<div class="input-group marTop5">
								<span id="height_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_426">Height: </span>
								</span>
								<input id="height_${packet.packetNumber}" name="height_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Height" rel="cms_427" autocomplete="off" value="${packet.height}" onfocusout="saleOrderFunctionality.savePackageData()">
							</div>
							<div class="input-group marTop5">
								<span id="length_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_428">Length :</span>
								</span>
								<input id="length_${packet.packetNumber}" name="length_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Length" rel="cms_429" autocomplete="off" value="${packet.length}" onfocusout="saleOrderFunctionality.savePackageData()">
							</div>
							<div class="text-center marTop5">
								<span id="cms_430">Weight in : </span>
								<select name="weightUnit_${packet.packetNumber}" id="weightUnit_${packet.packetNumber}" onchange="saleOrderFunctionality.savePackageData()">
									<option value="Gram" ${packet.weightUnit === 'Gram' ? 'selected' : ''}>Grams</option>
									<option value="KG" ${packet.weightUnit === 'KG' ? 'selected' : ''}>KGs</option>
									<option value="Pound" ${packet.weightUnit === 'Pound' ? 'selected' : ''}>Pounds</option>
								</select>
							</div>
							<div class="input-group marTop5">
								<span id="weight_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_431">Weight :</span>
								</span>
								<input id="weight_${packet.packetNumber}" name="weight_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Weight" rel="cms_432" autocomplete="off" value="${packet.weight}" onfocusout="saleOrderFunctionality.savePackageData()">
							</div>
							<div class="input-group marTop5">
								<span id="price_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_433">Price : ${appCommonFunctionality.getDefaultCurrency()}</span>
								</span>
								<input id="price_${packet.packetNumber}" name="price_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Price" rel="cms_434" autocomplete="off" value="${packet.price}" onfocusout="saleOrderFunctionality.savePackageData()">
							</div>
							<div class="input-group marTop5">
								<span id="trackingNumber_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_435">Tracking :</span>
								</span>
								<input id="trackingNumber_${packet.packetNumber}" name="trackingNumber_${packet.packetNumber}" type="text" class="form-control" placeholder="Tracking No" rel="cms_436" autocomplete="off" value="${packet.trackingNo}" onfocusout="saleOrderFunctionality.savePackageData()">
							</div>
						</div>
					</div>
				`;
			});
		}
		$('#packageDetailsHolder').html(str);
		$('#packageList, #packageDimention').prop('selectedIndex', 0);
		$('#populatePackageBtn').attr("disabled", "true");
		populateProductItemCarton();
	};

	parent.removePackage = function (packetNumber) {
		PACKINGOBJ = PACKINGOBJ.filter(packet => packet.packetNumber !== packetNumber);
		parent.populatePackages();
	};

	parent.openPackagesWithInModal = function (packetNumber) {
		const packageObject = PACKINGOBJ.find(packet => packet.packetNumber === packetNumber);
		$('#saleOrderPacketHeader').html(`<span id="cms_421">Packet</span>${packetNumber} [${packageObject.packetType}]`);
		const displayOrderArr = getDisplayOrderArr(packageObject.items);
		let str = `
			<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder">
				<tbody>
					<tr>
						<td width="100%" class="text-center"><b id="cms_329">${appCommonFunctionality.getCmsString(329)}</b></td>
					</tr>
					${displayOrderArr.map(item => `
					<tr>
						<td class="text-left">
							<div class="pull-left">
								<span>[${item.productCombinationId}] ${item.productTitle} [${item.productId}]</span><br>
							</div>
							<div class="pull-right">X ${item.qty} <i class="fa fa-trash-o redText marleft5 hover" onclick="saleOrderFunctionality.RemoveFromCarton(${packetNumber}, ${item.productCombinationId})"></i></div>
						</td>
					</tr>`).join('')}
				</tbody>
			</table>`;
		$('#saleOrderPacketTableHolder').html(str);
		$("#saleOrderPacketModal").modal('show');
	};
	
	parent.RemoveFromCarton = function(packetNumber, productCombinationId){
		if (PACKINGOBJ || Array.isArray(PACKINGOBJ)) {
			const packet = PACKINGOBJ.find(p => p.packetNumber === packetNumber);
			if (packet) {
				const originalLength = packet.items.length;
				packet.items = packet.items.filter(item => item.productCombinationId !== productCombinationId);
			}
		}
		$("#saleOrderPacketModal").modal('hide');
		parent.populatePackages();
	};

	parent.savePackageData = function () {
		function updatePackingObj(selector, property, parseFunc) {
			$(selector).each(function () {
				let idArr = this.id.split('_');
				let packetNumber = parseInt(idArr[1]);
				const packet = PACKINGOBJ.find(packet => packet.packetNumber === packetNumber);
				if (packet) {
					packet[property] = parseFunc(this.value);
				}
			});
		}

		updatePackingObj('input[id^="width_"]', 'width', parseFloat);
		updatePackingObj('input[id^="height_"]', 'height', parseFloat);
		updatePackingObj('input[id^="length_"]', 'length', parseFloat);
		updatePackingObj('select[id^="weightUnit_"]', 'weightUnit', String);
		updatePackingObj('input[id^="weight_"]', 'weight', parseFloat);
		updatePackingObj('input[id^="price_"]', 'price', parseFloat);
		updatePackingObj('input[id^="trackingNumber_"]', 'trackingNo', String);
	};

	const populateProductItemCarton = function () {
		const displayOrderArr = filterOrderItems();
		if (displayOrderArr.length > 0) {
			let str = '';
			if (displayOrderArr.length > 0) {
				str += `
					<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white minW720 roundedBorder">
						<tbody>
							<tr>
								<td width="75%" class="text-left"><b id="cms_329">${appCommonFunctionality.getCmsString(329)}</b></td>
								<td width="10%" class="text-center"><b id="cms_440">${appCommonFunctionality.getCmsString(440)}</b></td>
								<td width="15%" class="text-right"><b id="cms_441">${appCommonFunctionality.getCmsString(441)}</b></td>
							</tr>`;
				displayOrderArr.forEach(order => {
					str += `
						<tr>
							<td class="text-left">
								<div class="pull-left f16">
									<span>[${order.productCombinationId}] ${order.productTitle} [${order.productCode}]</span>
									<span>X ${order.qty}</span>
								</div>
							</td>
							<td class="text-center">
								<input type="number" id="assignQty_${order.productCombinationId}" name="assignQty_${order.productCombinationId}" value="${order.qty}" class="orderPackingAsignInput f20" min="1" max="${order.qty}">
							</td>
							<td class="text-right">
								${bindCartonList(order.productCombinationId)}
							</td>
						</tr>`;
				});
				str += `
						</tbody>
					</table>`;
			}
			$('#orderItemsHolder').html(str);
		}else{
			$('#orderItemsHolder').html('<div class="text-center greenText">Mapping for Order items and the packages are completed.</div>');
		}
	};
	
	const filterOrderItems = function(){
		let displayOrderArr = [];
		let packingItems = [];
		PACKINGOBJ.forEach(packet => {
			packingItems = packingItems.concat(packet.items);
		});
		let packingItemsCount = {};
		packingItems.forEach(item => {
			if (packingItemsCount[item.productCombinationId]) {
				packingItemsCount[item.productCombinationId]++;
			} else {
				packingItemsCount[item.productCombinationId] = 1;
			}
		});
		displayOrderArr = ORDEROBJ.filter(orderItem => {
			if (orderItem.creditNote === true) {
				return false;
			}
			if (packingItemsCount[orderItem.productCombinationId]) {
				packingItemsCount[orderItem.productCombinationId]--;
				if (packingItemsCount[orderItem.productCombinationId] < 0) {
					return true;
				}
				return false;
			}
			return true;
		});
		displayOrderArr = getDisplayOrderArr(displayOrderArr);
		return displayOrderArr;
	};
	
	const getDisplayOrderArr = function(filteredOrderItems) {
		const displayOrderArr = [];
		const orderMap = new Map();
		filteredOrderItems.forEach(order => {
			const productId = parseInt(order.productId);
			const productCombinationId = parseInt(order.productCombinationId);
			const key = `${productId}-${productCombinationId}`;
			
			if (orderMap.has(key)) {
				const existingOrder = orderMap.get(key);
				if (!order.creditNote) {
					existingOrder.qty += 1;
				}
			} else {
				if (!order.creditNote) {
					orderMap.set(key, { ...order, qty: 1 });
				}
			}
		});
		displayOrderArr.push(...orderMap.values());
		return displayOrderArr;
	};

	const bindCartonList = function (productCombinationId) {
		let str = '<select id="cartonList_' + productCombinationId + '" name="cartonList_' + productCombinationId + '" class="ddlStyle pull-right" onchange="saleOrderFunctionality.savePackageData()">';
		str += '<option value="0" id="cms_442">' + appCommonFunctionality.getCmsString(442) + '</option>';
		PACKINGOBJ.forEach(packet => {
			str += `<option value="${packet.packetNumber}">Packet ${packet.packetNumber} [${packet.packetType}]</option>`;
		});
		str += '</select>';
		return str;
	};
	
	parent.savePackingDetails = function(){
		if(packingDetailsValidation()){
			$('select[id^="cartonList_"]').each(function () {
				const packetNumber = parseInt(this.value);
				if(packetNumber > 0){
					let idArr = this.id.split('_');
					const productCombinationId = parseInt(idArr[1]);
					const assignQty = parseInt($('#assignQty_' + productCombinationId).val());
					const orderItems = ORDEROBJ.filter(item => item.productCombinationId === productCombinationId && item.creditNote !== true).slice(0, assignQty);
					for (let i = 0; i < PACKINGOBJ.length; i++) {
						if (parseInt(PACKINGOBJ[i].packetNumber) === parseInt(packetNumber)) {
							// Merge all orderItems arrays and push them to PACKINGOBJ[i].items
							PACKINGOBJ[i].items = PACKINGOBJ[i].items.concat(orderItems);
						}
					}
				}
			});
			
			const qryStr = 'PLACEORDER';
			const orderId = appCommonFunctionality.getUrlParameter('orderId') || 0;
			const orderSummary = getOrderSummary();
			let totalPrice = orderSummary?.total;
			
			const callData = {
				orderId: orderId,
				parentOrderId: ORDER.parentOrderId,
				customerId: ORDER.customerId,
				deliveryAddressId: ORDER.deliveryAddressId,
				orderObj: ORDER.orderObj,
				packingObj: window.btoa(encodeURI(JSON.stringify(PACKINGOBJ))),
				totalPrice: totalPrice,
				deliveryDate: ORDER.deliveryDate
			};
			appCommonFunctionality.ajaxCallLargeData(qryStr, callData, receiveOrderPackingResponse);
		}
	};
	
	const packingDetailsValidation = function(){
		var errorCount = 0;
		
		/*-------------------------------------Assign Quantity Validation-----------------------------------*/
		$('input[id^=assignQty_]').each(function() {
			if(this.value === ''){
				appCommonFunctionality.raiseValidation(this.id, "", false);
				errorCount++;
			}else if(parseInt(this.value) === 0){
				appCommonFunctionality.raiseValidation(this.id, "", false);
				errorCount++;
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*-------------------------------------Assign Quantity Validation-----------------------------------*/
		
		/*-------------------------------------Packet List Validation---------------------------------------*/
		$('select[id^=cartonList_]').each(function() {
			if(parseInt(this.value) === 0){
				appCommonFunctionality.raiseValidation(this.id, "", false);
				errorCount++;
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*-------------------------------------Packet List Validation---------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const receiveOrderPackingResponse = function(response){
		response = JSON.parse(response);
		if(parseInt(response.responseCode) > 0){
			window.location = `saleOrderPackingDetails.php?orderId=` + parseInt(response.responseCode);
		}
	};
	
	parent.initSaleOrderCartonDataPrint = async function () {
		appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if (orderId) {
			const queryString = `ORDERDETAILS&orderId=${orderId}`;
			appCommonFunctionality.ajaxCall(queryString, receiveOrderCartonDataPrintResponse);
		} else {
			parent.gotoOrders();
		}
	};
	
	const receiveOrderCartonDataPrintResponse = function(responseData) {
		appCommonFunctionality.hideLoader();
		const order = JSON.parse(responseData)?.msg?.[0];
		if (!order) {
			parent.gotoOrders();
			return;
		}
		const packingObj = JSON.parse(decodeURI(window.atob(order.packingObj)));
		if (packingObj.length === 0) {
			parent.gotoOrders();
			return;
		}

		const createPackingHtml = (packet, order, displayOrderArr) => {
			const projectInformationData = JSON.parse($('#projectInformationData').val());
			DEFAULTADDRESS = projectInformationData?.billingInformation?.address + '<br>' + projectInformationData?.billingInformation?.town+ ' ' + projectInformationData?.billingInformation?.postCode;
			DEFAULTPHONE = projectInformationData?.billingInformation?.phone;
			VATNUMBER = projectInformationData?.paymentInformation?.vatNo;
			
			const itemsHtml = displayOrderArr.map(item => `
				<tr class="f12">
					<td class="text-left">
						<div class="pull-left">
							<span>[${item.productCombinationId}] ${item.productTitle} [${item.productCode}]</span><br>
						</div>
						<div class="pull-right">X ${item.qty}</div>
					</td>
				</tr>
			`).join('');

			return `
				<div class="cartonSticker pull-left">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
						<h4 class="text-center">${order.companyName}</h4>
						<div class="text-center">${order.deliveryAddress}, ${order.deliveryTown}, ${order.deliveryPostCode}, ${appCommonFunctionality.getCountryName(order.deliveryCountry)}</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="pull-left"><i class="fa fa-phone marRig5"></i>${order.deliveryPhone}</div>
							<div class="pull-right"><i class="fa fa-envelope marRig5"></i>${order.email}</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder">
							<tbody>
								<tr>
									<td width="100%" class="text-center">
										<b>Carton ${packet.packetNumber} [${packet.packetType}]</b>
									</td>
								</tr>
								${itemsHtml}
							</tbody>
						</table>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="text-center">${SITETITLE}</div>
						<div class="text-center"><b>${order.orderCode} - ${order.orderDate}</b></div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
							<div class="text-left">${DEFAULTADDRESS}</div>
							<div class="text-left">Tel: ${DEFAULTPHONE}</div>
							<div class="text-left">VAT No:${VATNUMBER}</div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-right">
							<img src="${QRCODEAPIURL + order.orderCode + '|' + order.totalPrice + '|' + order.orderDate + '|' + order.deliveryDate}" alt="${order.orderCode}" class="cartonStickerQR" onerror="productFunctionality.onImgError(this);">
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly f12">
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-left">${packet.width} cm X ${packet.height} cm X ${packet.length} cm</div>
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-right">${packet.weight} ${packet.weightUnit}</div>
						</div>
					</div>
				</div>
				<br clear="all">
			`;
		};

		const printableHtml = packingObj.map(packet => {
			const displayOrderArr = getDisplayOrderArr(packet.items);
			return createPackingHtml(packet, order, displayOrderArr) + createPackingHtml(packet, order, displayOrderArr);
		}).join('');

		$('#printableCartonData').html(printableHtml);
	};
	
	parent.mapTypeOfOrder = function(){
		setTimeout(function () {
			let orderTypeText = '';
			const selectedCustomerGrade = $('#selectedCustomerGrade').val();
			if (selectedCustomerGrade.toUpperCase() === 'W') {
				orderTypeText = appCommonFunctionality.getCmsString(769);
			} else if (selectedCustomerGrade.toUpperCase() === 'R') {
				orderTypeText = appCommonFunctionality.getCmsString(770);
			}
			$('#typeOfOrder').html(orderTypeText);
		}, LOADTIME);
	};
  
    return parent;
}(window, window.$));