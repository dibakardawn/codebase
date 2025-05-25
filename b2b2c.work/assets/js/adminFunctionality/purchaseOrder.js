const MENUSELECTIONITEM = "purchaseOrders.php";
/*-----------------Pre-Compiled Variables---------------------------------*/
let ORDERPURCHASESTATUSPRECOMPILEDDATA = [];
let COUNTRYPRECOMPILEDDATA = [];
let PRODUCTLIVESTOCKPRECOMPILEDDATA = [];
let PRODUCTPRECOMPILEDDATA = [];
let STOCKSTORAGEPRECOMPILEDDATA = [];
let DEFAULTTAX = 0;
/*-----------------Pre-Compiled Variables---------------------------------*/

/*-----------------Commonly Used Variables--------------------------------*/
let productQtyObj = {
	"value" : 0,
	"productCombinationId" : 0
}
let PURCHASEORDEROBJ = [];
let PURCHASEORDERSELECTEDOBJ = [];
let PURCHASEORDERGUID = '';
let NEWPURCHASEORDEROBJ = []; //for PurchaseOrder Splitting
let PURCHASEORDER = {};
let PURCHASEORDERPACKINGOBJ = [];
let PAYMENTOBJ = [];
let COMMUNICATIONOBJ = [];
let commObj = {
	postId : 0,
	information : '',
	postedByRole : '',
	postedById : 0,
	date : ''
};
let SEARCHSUPPLIERCRITERIA = {
	supplierId : 0,
	keyword : ''
}
let SEARCHPURCHASEORDERCRITERIA = {
	purchaseOrderId : 0,
	supplierId : 0,
	status : 0,
	startDate : '',
	endDate : ''
}
let PURCHASEORDERCLAUSES = [];
let PURCHASEORDERTNC = '';
/*-----------------Commonly Used Variables--------------------------------*/

/*-----------------QR Code Scanner Camera Popup Variables-----------------*/
let qrCodeScannerCameraPopupWindow;
let qrCodeScannerCameraPopupCheckInterval;
const qrScannerCameraUrl = 'qrCodeScannerCamera.html';
let scannerQRCodes = [];
/*-----------------QR Code Scanner Camera Popup Variables-----------------*/

const inputDelay = 500;
let GUID = '';
let TAX = 0;
const BARQRREGEX = new RegExp(`^${SITETITLE}_?`);
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
		
        case "purchaseOrders.php":{
			purchaseOrderFunctionality.initPurchaseOrder();
            break;
		}
		
		case "purchaseOrderInput.php":{
			purchaseOrderFunctionality.initPurchaseOrderInput();
            break;
		}
		
		case "purchaseOrderDetails.php":{
			purchaseOrderFunctionality.initPurchaseOrderDetails();
            break;
		}
		
		case "purchaseOrderPackingDetails.php":{
			purchaseOrderFunctionality.initPurchaseOrderPackingDetails();
            break;
		}
		
		case "splitPurchaseOrder.php":{
			purchaseOrderFunctionality.initSplitPurchaseOrder();
            break;
		}
		
		case "purchaseOrderInspection.php":{
			purchaseOrderFunctionality.initPurchaseOrderInspection();
            break;
		}
    }
	
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const purchaseOrderFunctionality = (function (window, $) {
    const parent = {};

    parent.initPurchaseOrder = async function () {
        appCommonFunctionality.adjustMainContainerHight('purchaseOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		ORDERPURCHASESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERPURCHASESTATUS'));
		const supplierId = appCommonFunctionality.getUrlParameter('supplierId') || 0;
		if(parseInt(supplierId) > 0){
			SEARCHPURCHASEORDERCRITERIA.supplierId = supplierId;
		}
		appCommonFunctionality.ajaxCallLargeData("PURCHASEORDERS", SEARCHPURCHASEORDERCRITERIA, receivePurchaseOrdersResponse);
		
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
    };
	
	const receivePurchaseOrdersResponse = function(purchaseOrderResponse){
		PURCHASEORDEROBJ = JSON.parse(purchaseOrderResponse)?.msg || [];
		populatePurchaseOrderTable(PURCHASEORDEROBJ);
	};
	
	const populatePurchaseOrderTable = function (parsedData) {
		if (!parsedData.length) {
			$('#purchaseOrderTableHolder').html('<p>No Data.</p>');
			return;
		}
		const getSortIcon = (field, cmsId) => `
			<i class="fa fa-sort-amount-asc hover marRig5" onclick="purchaseOrderFunctionality.sortOrderTable('ASC', '${field}')"></i>
			<strong id="cms_${cmsId}">${appCommonFunctionality.getCmsString(cmsId)}</strong>
			<i class="fa fa-sort-amount-desc hover marleft5" onclick="purchaseOrderFunctionality.sortOrderTable('DESC', '${field}')"></i>
		`;
		const getActionIcons = (purchaseOrderId, orderStatus) => {
			let editOrderButton = '';
			let splitOrderButton = '';
			if (orderStatus <= getPurchaseOrderStatusId('PLACED')) { //if greater than PLACED
				editOrderButton = `<i class="fa fa-pencil-square-o marleft5 greenText hover" onclick="purchaseOrderFunctionality.editPurchaseOrder(${purchaseOrderId})"></i>`;
			}
			if (orderStatus <= getPurchaseOrderStatusId('APPROVED')) { //if greater than APPROVED
				splitOrderButton = `<i class="fa fa-code-fork marleft5 blueText hover" onclick="purchaseOrderFunctionality.splitPurchaseOrder(${purchaseOrderId})"></i>`;
			}
			return `
				<div class="spaceBetweenSection">
					${editOrderButton}
					${splitOrderButton}
					<!--<i class="fa fa-trash-o marleft5 redText hover" onclick="purchaseOrderFunctionality.deletePurchaseOrder(${purchaseOrderId})"></i>-->
					<i class="fa fa-tv marleft5 blueText hover" onclick="purchaseOrderFunctionality.gotoPurchaseOrderDetails(${purchaseOrderId})"></i>
				</div>
			`;
		};
		const rows = parsedData.map(purchaseOrder => {
			const totalPrice = Number(purchaseOrder.totalPrice);
			const paidAmount = Number(purchaseOrder.paidAmount || 0); // Default to 0 if not provided
			const currency = appCommonFunctionality.getDefaultCurrency();
			const paidAmountClass = totalPrice > paidAmount ? 'redText' : 'greenText';
			return `
				<tr>
					<td>
						<a href="purchaseOrderDetails.php?purchaseOrderId=${purchaseOrder.purchaseOrderId}" class="blueText">${purchaseOrder.purchaseOrderCode}</a><br>
						<span class="f12 greenText">${currency}${totalPrice.toFixed(2)}</span>
						<span class="f12">/</span>
						<span class="f12 ${paidAmountClass}">${currency}${paidAmount.toFixed(2)}</span>
					</td>
					<td>
						${purchaseOrder.supplierName} [${purchaseOrder.supplierContactPerson}]<br>
						<span class="f12">
							<i class="fa fa-phone blueText"></i> 
							${purchaseOrder.supplierContactNo} - 
							<i class="fa fa-envelope blueText"></i> 
							<a href="mailto:${purchaseOrder.supplierEmail}" class="blueText">${purchaseOrder.supplierEmail}</a>
						</span>
					</td>
					<td>${getPurchaseOrderStatus(purchaseOrder.status)}</td>
					<td>${purchaseOrder.purchaseOrderCreateDate}</td>
					<td>${purchaseOrder.purchaseOrderDeliveryDate}</td>
					<td>${getActionIcons(purchaseOrder.purchaseOrderId, purchaseOrder.status)}</td>
				</tr>
			`;
		}).join('');
		const table = `
			<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white minW1180">
				<tbody>
					<tr>
						<td width="10%">${getSortIcon('totalPrice', 549)}</td>
						<td width="40%"><strong id="cms_550">${appCommonFunctionality.getCmsString(550)}</strong></td>
						<td width="10%"><strong id="cms_551">${appCommonFunctionality.getCmsString(551)}</strong></td>
						<td width="15%">${getSortIcon('purchaseOrderCreateDate', 552)}</td>
						<td width="15%">${getSortIcon('purchaseOrderDeliveryDate', 553)}</td>
						<td width="10%"><strong id="cms_554">${appCommonFunctionality.getCmsString(554)}</strong></td>
					</tr>
					${rows}
				</tbody>
			</table>
		`;
		$('#purchaseOrderTableHolder').html(table);
	};

	const getPurchaseOrderStatus = function(purchaseOrderStatusId) {
		if (typeof ORDERPURCHASESTATUSPRECOMPILEDDATA !== 'undefined' && 
			ORDERPURCHASESTATUSPRECOMPILEDDATA !== null && 
			ORDERPURCHASESTATUSPRECOMPILEDDATA.length > 0) {
			const status = ORDERPURCHASESTATUSPRECOMPILEDDATA.find(item => item.purchaseOrderStatusId === purchaseOrderStatusId);
			return status ? `<b style="color:${status.color}">${status.purchaseOrderStatus}</b>` : "";
		}
		return "";
	};
	
	const extractStatusText = function(purchaseOrderStatusHTML){
		const regex = />([^<]+)</;
		const match = purchaseOrderStatusHTML.match(regex);
		return match && match[1] ? match[1].trim() : "";
	};
	
	const getPurchaseOrderStatusId = function (purchaseOrderStatus) {
		if (typeof ORDERPURCHASESTATUSPRECOMPILEDDATA !== 'undefined' && 
			ORDERPURCHASESTATUSPRECOMPILEDDATA !== null && 
			ORDERPURCHASESTATUSPRECOMPILEDDATA.length > 0) {
				const status = ORDERPURCHASESTATUSPRECOMPILEDDATA.find(item => item.purchaseOrderStatus === purchaseOrderStatus);
				return status ? status.purchaseOrderStatusId : 0;
		}
		return 0;
    };
	
	parent.sortOrderTable = function (purchaseOrder, field) {
        const orderData = PURCHASEORDEROBJ;
        orderData.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];
            if (!isNaN(valueA) && !isNaN(valueB)) {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }
            if (purchaseOrder === "ASC") return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            if (purchaseOrder === "DESC") return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        });
        populatePurchaseOrderTable(orderData);
    };
	
	parent.addPurchaseOrder = function(){
		window.location = `purchaseOrderInput.php`;
	};
	
	parent.editPurchaseOrder = function (purchaseOrderId) {
		if(PAGEDOCNAME === 'purchaseOrderDetails.php'){
			purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		}
        window.location = `purchaseOrderInput.php?purchaseOrderId=` + purchaseOrderId;
    };
	
	parent.gotoPurchaseOrderDetails = function(purchaseOrderId){
		window.location = `purchaseOrderDetails.php?purchaseOrderId=` + purchaseOrderId;
	};
	
	parent.searchPurchaseOrderModal = function(){
		$("#purchaseOrderSearchModal").modal('show');
		bindPurchaseOrderStatusDDL();
		if(appCommonFunctionality.isMobile()){
			$('#orderCode, #startDate').parent().parent().removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
		}else{
			$('#orderCode, #startDate').parent().parent().removeClass('nopaddingOnly').addClass('noLeftPaddingOnly');
		}
	};
	
	const bindPurchaseOrderStatusDDL = function(){
		let str = '';
		str = str + '<option value="0">' + appCommonFunctionality.getCmsString(516) + '</option>'
		for(let i = 0; i < ORDERPURCHASESTATUSPRECOMPILEDDATA.length; i++){
			str = str + '<option value="' + ORDERPURCHASESTATUSPRECOMPILEDDATA[i].purchaseOrderStatusId + '">' + appCommonFunctionality.getCmsString(parseInt(ORDERPURCHASESTATUSPRECOMPILEDDATA[i].purchaseOrderStatusCmsId)) + '</option>';
		}
		$('#purchaseOrderStatusDDL').html(str);
	};
	
	parent.searchPurchaseOrderFormReset = function(){
		$('#orderCode, #startDate, #endDate, #supplierSearch').val('');
		$('#purchaseOrderStatusDDL').prop('selectedIndex', 0);
		$('#supplierSearchResult, #selectedSupplierSection').html('');
		$('#barcodeScannerHolder, #selectedSupplierTitle').addClass('hide');
	};
	
	parent.purchaseOrderSearch = function() {
		if (validatePurchaseOrderSearchForm()) {
			const orderCode = orderCodeSign($('#orderCode').val());
			SEARCHPURCHASEORDERCRITERIA.purchaseOrderId = parseInt(orderCode, 10) || 0;
			SEARCHPURCHASEORDERCRITERIA.supplierId = parseInt($('#selectedSupplierId').val(), 10) || 0;
			SEARCHPURCHASEORDERCRITERIA.status = parseInt($('#purchaseOrderStatusDDL').val(), 10) || 0;
			SEARCHPURCHASEORDERCRITERIA.startDate = $('#startDate').val() || '';
			SEARCHPURCHASEORDERCRITERIA.endDate = $('#endDate').val() || '';
			purchaseOrderFunctionality.searchPurchaseOrderFormReset();
			$("#purchaseOrderSearchModal").modal('hide');
			appCommonFunctionality.ajaxCallLargeData("PURCHASEORDERS", SEARCHPURCHASEORDERCRITERIA, receivePurchaseOrdersResponse);
		}
	};
	
	const validatePurchaseOrderSearchForm = function(){
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
		const ordsMatch = firstPart.match(/(?:ORDP_)?(\d+)$/);
		if (ordsMatch) {
			return ordsMatch[1];
		}
		return firstPart;
	};
	
	parent.initPurchaseOrderInput = async function () {
		appCommonFunctionality.adjustMainContainerHight('purchaseOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		ORDERPURCHASESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERPURCHASESTATUS'));
		PRODUCTLIVESTOCKPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCTLIVESTOCK'));
		PRODUCTPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCT'));
		BRANDPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('BRAND'));
		CATEGORYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('CATEGORY'));
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		if (!purchaseOrderId && $('#tncData').val()) {
			const tncData = JSON.parse($('#tncData').val());
			PURCHASEORDERTNC = tncData?.purchaseOrderTnC;
			purchaseOrderFunctionality.populateTnC();
			$('#deliveryDateTnC').text($('#deliveryDate').val());
		}
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		/*----------------------Edit Purchase Order implementation------------------------*/
		if (purchaseOrderId) {
			$('#purchaseOrderId').val(purchaseOrderId);
			appCommonFunctionality.ajaxCall('PURCHASEORDERDETAILS&purchaseOrderId=' + purchaseOrderId, receivePurchaseOrderInputData);
		}
		/*----------------------Edit Purchase Order implementation------------------------*/
		
		/*----------------------Supplier Search by supplierId-----------------------------*/
		const supplierId = appCommonFunctionality.getUrlParameter('supplierId');
		if(supplierId && PAGEDOCNAME === 'purchaseOrderInput.php'){
			SEARCHSUPPLIERCRITERIA.supplierId = supplierId;
			appCommonFunctionality.ajaxCallLargeData('GETSUPPLIERS', SEARCHSUPPLIERCRITERIA, populateSupplierSuggestionBox);
		}
		/*----------------------Supplier Search by supplierId-----------------------------*/
		
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
			$('#clauseSection, #signSection').removeClass('noRightPaddingOnly').addClass('nopaddingOnly');
		}
		
		/*----------------------#productKeyword on enter product serach-----------------------------*/
		$('#productKeyword').keypress(function(event) {
			// Check if the Enter key (key code 13) is pressed
			if (event.which === 13) {
				// Prevent the default action (form submission, etc.)
				event.preventDefault();
				// Trigger the product search function
				purchaseOrderFunctionality.productSearch();
			}
		});
		/*----------------------#productKeyword on enter product serach-----------------------------*/
	};	
	
	const receivePurchaseOrderInputData = function(purchaseOrderDetailsResponse){
		PURCHASEORDER = JSON.parse(purchaseOrderDetailsResponse)?.msg?.[0];
		const supplierResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
		const str = `<div class="f16">${PURCHASEORDER.supplierName} (${PURCHASEORDER.supplierContactPerson})</div>`;
		$('#selectedSupplierSection').html(str).addClass(supplierResultItemClass);
		$("#selectedSupplierTitle, #purchaseOrderControlButtonHolder").removeClass('hide');
		$('#supplierSearchResult').html('');
		$('#selectedSupplierId').val(PURCHASEORDER.supplierId);
		if (PURCHASEORDER?.purchaseOrderObj) {
			const decodedPurchaseOrderObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchaseOrderObj)));
			const finalPurchaseOrderObj = JSON.parse(decodedPurchaseOrderObj?.purchaseOrderObj || "[]");
			if (Array.isArray(finalPurchaseOrderObj) && finalPurchaseOrderObj.length) {
				PURCHASEORDEROBJ = finalPurchaseOrderObj;
				purchaseOrderFunctionality.populateCart();
			}
		}
		$('#deliveryDate').val(PURCHASEORDER.purchaseOrderDeliveryDate);
		if (PURCHASEORDER?.additionalData) {
			const decodedPurchaseOrderAdditionalData = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.additionalData)));
			const finalPurchaseOrderClausesObj = decodedPurchaseOrderAdditionalData?.clauses || "[]";
			if (Array.isArray(finalPurchaseOrderClausesObj) && finalPurchaseOrderClausesObj.length) {
				PURCHASEORDERCLAUSES = finalPurchaseOrderClausesObj;
				purchaseOrderFunctionality.populateClauses();
			}
			PURCHASEORDERTNC = decodedPurchaseOrderAdditionalData?.tnc || "";
			purchaseOrderFunctionality.populateTnC();
		}
	};

	const populateSupplierSuggestionBox = function(responseData){
		$('#supplierGroupAddonIcon').removeClass('fa-spinner fa-spin').addClass('fa-search');
		const supplierData = JSON.parse(responseData);
		const supplierResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        let str = '';
        if (supplierData.length > 0) {
            supplierData.forEach(supplier => {
                const supplierId = supplier.supplierId;
				str = str + '<div id="supplierResultItem_' + supplierId + '" class="customerResultItem hover" onclick="purchaseOrderFunctionality.onSelectingSupplier(' + supplierId + ')">';
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
        $("#selectedSupplierId").val(supplierId);
        const supplierResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        $("#selectedSupplierSection").html($(`#supplierResultItem_${supplierId}`).html()).addClass(supplierResultItemClass);
        $("#selectedSupplierTitle, #purchaseOrderControlButtonHolder").removeClass('hide');
        $('#supplierSearchResult').html('');
		$('#supplierSearch').val('');
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
                    PURCHASEORDEROBJ.push(product);
                    productFound = true;
                    purchaseOrderFunctionality.scannerGun();
                    return true;
                }
                return false;
            });
            if (!productFound) {
                $("#productScannerErr").html('* ' + appCommonFunctionality.getCmsString(543));
				appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(543), appCommonFunctionality.getLang());
				setTimeout(function() {
					$('#productScannerErr').html('');
				}, 3000);
                purchaseOrderFunctionality.scannerGun();
            }
            purchaseOrderFunctionality.populateCart();
        }
    };
	
	const getPurchaseOrderSummary = function() {
		const summaryMap = {};
		let hasDebitNote = false;

		// Helper function to initialize a product entry
		const initializeProductEntry = (item, isDebitNote = false) => ({
			productId: item.productId,
			productTitle: item.productTitle,
			productCode: item.productCode,
			PPrice: item.PPrice,
			productCombinationId: item.productCombinationId,
			productCombinationQR: item.productCombinationQR,
			qty: 0,
			...(isDebitNote && { debitNote: true })
		});

		// Populate the summary map
		PURCHASEORDEROBJ.forEach(item => {
			const baseKey = `${item.productId}-${item.productCombinationId}`;
			const normalKey = `${baseKey}-normal`;
			const debitKey = `${baseKey}-debitNote`;

			if (item.debitNote) {
				hasDebitNote = true;
			}

			// Aggregate all items first (regardless of debitNote status)
			if (!summaryMap[normalKey]) {
				summaryMap[normalKey] = initializeProductEntry(item);
			}
			summaryMap[normalKey].qty += 1;

			// Separate debitNote items
			if (item.debitNote) {
				if (!summaryMap[debitKey]) {
					summaryMap[debitKey] = initializeProductEntry(item, true);
				}
				summaryMap[debitKey].qty += 1;
			}
		});

		// Convert the summary map to an array
		const purchaseOrderCartData = Object.values(summaryMap);

		// Calculate total before tax
		const totalBeforeTax = purchaseOrderCartData.reduce((total, item) => {
			return total + (item.PPrice * item.qty * (item.debitNote ? -1 : 1));
		}, 0);

		// Calculate packing cost
		const packingCost = PURCHASEORDERPACKINGOBJ.reduce((total, packet) => total + packet.price, 0);

		// Calculate total
		const total = totalBeforeTax + packingCost;
		const totalWithTax = total + (total * DEFAULTTAX / 100);

		return {
			purchaseOrderCartData,
			totalBeforeTax,
			packingCost,
			tax: DEFAULTTAX,
			total: totalWithTax,
			hasDebitNote
		};
	};

	parent.populateCart = function () {
		let hasDebitNote = false;
		let displayOrderArr = [];
		const purchaseOrderData = getPurchaseOrderSummary();
		displayOrderArr = purchaseOrderData.purchaseOrderCartData;

		let totalPrice = 0;
		let totalBeforeTax = 0;
		let packingCost = 0;
		let wideTableStyle = '';
		if (PAGEDOCNAME === 'purchaseOrderInput.php') {
			wideTableStyle = 'minW720';
		}
		let str = `<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder ${wideTableStyle}"><tbody><tr><td width="75%" class="text-left"><b id="cms_544">${appCommonFunctionality.getCmsString(544)}</b></td><td width="10%" class="text-right"><b>Qty</b></td><td width="15%" class="text-right"><b id="cms_545">${appCommonFunctionality.getCmsString(545)}</b></td></tr>`;
		if (displayOrderArr.length > 0) {
			displayOrderArr.forEach(item => {
				let rowBgClass = '';
				if (item.debitNote) {
					rowBgClass = 'bgLightRed';
				}
				const effectivePrice = item.PPrice;
				const offerText = appCommonFunctionality.getDefaultCurrency() + effectivePrice.toFixed(2);
				let QRTextHtml = getQRTextHtml(item.productCombinationQR, item.productCode);
				let weightInputHtml = '';
				if (QRTextHtml.indexOf(WEIGHTSIGN) != -1 && PAGEDOCNAME === 'purchaseOrderInput.php') {
					weightInputHtml = `<div class="input-group input-group-md">
										<input type="number" id="productItemWeight_${item.productCombinationId}" name="productItemWeight_${item.productCombinationId}" oninput="purchaseOrderFunctionality.calcQtyOnWeight(this.value, ${item.productCombinationId})" value="0" autocomplete="off" class="marleft5 maxW64">
										<span class="input-group-addon">
											<i class="fa fa-balance-scale redText hover"></i>
										</span>
									</div>`;
				}
				let qtyInputHTML = ``;
				if (PAGEDOCNAME === 'purchaseOrderInput.php') {
					qtyInputHTML = `<div class="input-group input-group-md">
									<span class="input-group-addon greenText" onclick="purchaseOrderFunctionality.changeQty('+', ${item.productCombinationId})">
										<i class="fa fa-plus greenText"></i>
									</span>
									<input type="number" id="productItemQty_${item.productCombinationId}" name="productItemQty_${item.productCombinationId}" value="${item.qty}" step="1" min="0" autocomplete="off" onfocus="purchaseOrderFunctionality.storeProductItemQty(this.value, ${item.productCombinationId})"
									onchange="purchaseOrderFunctionality.productItemQtyInputKeyUp(this.value, ${item.productCombinationId})" class="maxW64">
									<span class="input-group-addon" onclick="purchaseOrderFunctionality.changeQty('-', ${item.productCombinationId})">
										<i class="fa fa-minus redText"></i>
									</span>
								</div>`;
				} else if (PAGEDOCNAME === 'purchaseOrderDetails.php') {
					if (item.debitNote) {
						qtyInputHTML = `-${item.qty}`;
					} else {
						qtyInputHTML = `${item.qty}`;
					}
				}
				let deleteBtnHTML = ``;
				if (PAGEDOCNAME === 'purchaseOrderInput.php') {
					deleteBtnHTML = `<i class="fa fa-trash redText marleft5 hover" onclick="purchaseOrderFunctionality.removeFromCart(${item.productCombinationId})"></i>`;
				}
				if (item.debitNote) {
					str += `<tr class="${rowBgClass}">
								<td class="text-left">
									<div class="pull-left f12">
										<span>${item.productTitle} [${item.productCode}] ${offerText}</span><br>
										<span>[${item.productCombinationId}] - ${QRTextHtml}</span>
									</div>
									<div class="pull-left">${weightInputHtml}</div>
								</td>
								<td class="text-right">${qtyInputHTML}</td>
								<td class="text-right">
									<span> - ${appCommonFunctionality.getDefaultCurrency()}${(effectivePrice * item.qty).toFixed(2)}</span>
									${deleteBtnHTML}
								</td>
							</tr>`;
					totalBeforeTax -= effectivePrice * item.qty;
				} else {
					str += `<tr class="${rowBgClass}">
								<td class="text-left">
									<div class="pull-left f12">
										<span>${item.productTitle} [${item.productCode}] ${offerText}</span><br>
										<span>[${item.productCombinationId}] - ${QRTextHtml}</span>
									</div>
									<div class="pull-left">${weightInputHtml}</div>
								</td>
								<td class="text-right">${qtyInputHTML}</td>
								<td class="text-right">
									<span>${appCommonFunctionality.getDefaultCurrency()}${(effectivePrice * item.qty).toFixed(2)}</span>
									${deleteBtnHTML}
								</td>
							</tr>`;
					totalBeforeTax += effectivePrice * item.qty;
				}
			});
		} else {
			str += '<tr><td colspan="3">No Data</td></tr>';
		}
		str += '</tbody></table>';
		$("#cartTableHolder").html(str).addClass('scrollX');
		if (displayOrderArr.length > 0) {
			$("#totalCalcSection, #clauseSection, #tncSection, #signSection, #placeOrderBtnSection").removeClass('hide');
			$("#totalBeforeTax").html(appCommonFunctionality.getDefaultCurrency() + purchaseOrderData.totalBeforeTax.toFixed(2));
			$("#packingCost").html(appCommonFunctionality.getDefaultCurrency() + purchaseOrderData.packingCost.toFixed(2));
			$("#taxP").html(purchaseOrderData.tax);
			$("#totalPrice, #totalPriceH2").html(appCommonFunctionality.getDefaultCurrency() + purchaseOrderData.total.toFixed(2));
			if (purchaseOrderData.hasDebitNote) {
				$('#debitNote').html('<span id="cms_546">' + appCommonFunctionality.getCmsString(546) + '</span> : <a href="' + PROJECTPATH + 'debitNote/' + PURCHASEORDER.GUID + '" target="_blank"><i class="fa fa-file-text redText"></i></a>');
			}
			$('#placePurchaseOrderBtn').attr('disabled', false);
		} else {
			$("#totalCalcSection, #clauseSection, #tncSection, #signSection, #placeOrderBtnSection").addClass('hide');
			$("#totalBeforeTax").html('');
			$("#packingCost").html('');
			$("#taxP").html('');
			$("#totalPrice, #totalPriceH2").html('');
			$('#placePurchaseOrderBtn').attr('disabled', true);
		}
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
				const existingReferences = new Set(PURCHASEORDEROBJ.map(item => item.systemReference));
				const newItem = PRODUCTLIVESTOCKPRECOMPILEDDATA.find(item => 
					item.productCombinationId === productCombinationId &&
					!existingReferences.has(item.systemReference)
				);
				if (newItem) {
					PURCHASEORDEROBJ.push(newItem);
				}
			}else{
				const newItem = PRODUCTLIVESTOCKPRECOMPILEDDATA.find(item => 
					item.productCombinationId === productCombinationId);
				if (newItem) {
					PURCHASEORDEROBJ.push(newItem);
				}
			}
		} else if (operation === '-') {
			const indexToRemove = PURCHASEORDEROBJ.slice().reverse().findIndex(item => 
				item.productCombinationId === productCombinationId
			);

			if (indexToRemove !== -1) {
				PURCHASEORDEROBJ.splice(PURCHASEORDEROBJ.length - 1 - indexToRemove, 1);
			}
		}
		purchaseOrderFunctionality.populateCart();
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
					purchaseOrderFunctionality.changeQty(operation, productCombinationId);
				}
				productQtyObj.value = qtyVal;
			}
		}
	};

	parent.removeFromCart = function(productCombinationId){
		PURCHASEORDEROBJ = PURCHASEORDEROBJ.filter(item => item.productCombinationId !== productCombinationId);
		purchaseOrderFunctionality.populateCart();
	};
	
	parent.populateClauses = function () {
		const isPurchaseOrderDetails = PAGEDOCNAME === 'purchaseOrderDetails.php';
		const clausesHtml = PURCHASEORDERCLAUSES.map((clause, i) => `
			<div class="clauseItem">
				${!isPurchaseOrderDetails ? `<i class="fa fa-remove pull-right redText marRig5 marleft5 hover" onclick="purchaseOrderFunctionality.removeClause(${i})"></i>` : ''}
				<span class="f12"><i class="fa fa-star marRight5"></i>${clause}</span>
			</div>
		`).join('');
		$('#clauseHolder').html(clausesHtml);
	};
	
	parent.populateTnC = function () {
		$('#tncHTML').html(PURCHASEORDERTNC);
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
					if(PAGEDOCNAME === 'purchaseOrderInput.php'){
						scannerQRCodes.forEach(code => {
							let scannerQRCode = code.replace(BARQRREGEX, '');
							//alert(scannerQRCode); //alert individual scanned code
							captureProductCombinationFromBarQrCode(scannerQRCode);
						});
					}else if(PAGEDOCNAME === 'purchaseOrders.php'){
						const scannedString = scannerQRCodes[0];
						$('#orderCode').val(scannedString);
						parent.purchaseOrderSearch();
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
				<div class="searchedItem hover" onclick="purchaseOrderFunctionality.onBrandSelection(${brand.brandId})">
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
		purchaseOrderFunctionality.populateSelectedBrand(brandId);
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
						<span class="pull-right fa fa-remove redText hover" onclick="purchaseOrderFunctionality.removeBrandSelection();"></span>
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
				<div class="searchedItem hover" onclick="purchaseOrderFunctionality.onCatSelection(${parseInt(cat.categoryId)}, this)">
					<span class="padLeft4">${cat.category}</span>
				</div>
			`).join('');
			$('#searchedCats').html(str).removeClass('hide');
			$('#searchCatIconSpan').html('<span class="fa fa-close redText hover" onClick="purchaseOrderFunctionality.resetSearchCatField();"></span><span class="fa fa-search marleft5 hover"></span>');
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
					<span class="fa fa-remove redText hover marleft5" onclick="purchaseOrderFunctionality.removeCatSelection(${parseInt(cat.categoryId)});"></span>
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
		purchaseOrderFunctionality.removeBrandSelection();
		$("#searchCat").val("").trigger('keyup');
		const categoryIds = $("#categoryIds").val().split(",");
		categoryIds.forEach(id => purchaseOrderFunctionality.removeCatSelection(parseInt(id)));
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
						<div class="generalBox hover" onclick="purchaseOrderFunctionality.populateProductCombinations(${product.productId})">
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
						<div class="generalBox hover" onclick="purchaseOrderFunctionality.selectProductCombinations(${stock.productId}, ${stock.productCombinationId})">
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
				var exists = PURCHASEORDEROBJ.some(function(purchaseOrder) {
					return purchaseOrder.systemReference === PRODUCTLIVESTOCKPRECOMPILEDDATA[i].systemReference;
				});
				if (!exists) {
					PURCHASEORDEROBJ.push(PRODUCTLIVESTOCKPRECOMPILEDDATA[i]);
					break;
				}
			}
		}
		populateModalCart();
	};

	const populateModalCart = function(){
		let str = '';
		if (PURCHASEORDEROBJ.length > 0) {
			const aggregatedStocks = PURCHASEORDEROBJ.reduce((acc, stock) => {
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
							${stock.productTitle} [${stock.productCode}] <i class="fa fa-caret-right"></i> [${stock.productCombinationId}] - [${getQRTextHtml(stock.productCombinationQR, stock.productCode)}] X <b>${stock.count}</b> - <i class="fa fa-trash redText" onclick="purchaseOrderFunctionality.removeFromModalCart(${stock.productCombinationId})"></i>
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
		PURCHASEORDEROBJ = PURCHASEORDEROBJ.filter(item => item.productCombinationId !== productCombinationId);
		populateModalCart();
	};
	
	parent.placePurchaseOrder = function () {
		let errorMessages = [
			{ id: "#selectedSupplierId", errorCode: 547}
		];
		let errorCount = errorMessages.reduce((count, field) => {
			if (parseInt($(field.id).val()) === 0) {
				alert(appCommonFunctionality.getCmsString(field.errorCode));
				appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(field.errorCode), appCommonFunctionality.getLang());
				return count + 1;
			}
			return count;
		}, 0);
		if (PURCHASEORDEROBJ.length === 0) {
			alert(appCommonFunctionality.getCmsString(548));
			appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(548), appCommonFunctionality.getLang());
			errorCount++;
		}
		if (errorCount === 0) {
			const qryStr = 'PLACEPURCHASEORDER';
			const purchaseOrderObj = {
				purchaseOrderObj: JSON.stringify(PURCHASEORDEROBJ),
				tax: $('#taxP').text()
			};
			const purchaseOrderData = getPurchaseOrderSummary();
			let totalPrice = purchaseOrderData.total;
			const additionalData = {
				tnc : $('#tncHTML').html(),
				clauses : PURCHASEORDERCLAUSES
			};
			const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
			let callData = {};
			if(PAGEDOCNAME === 'purchaseOrderDetails.php'){
				callData = {
					purchaseOrderId: 0,
					parentPurchaseOrderId: 0,
					supplierId: parseInt(PURCHASEORDER.supplierId),
					purchaseOrderObj: window.btoa(encodeURI(JSON.stringify(purchaseOrderObj))),
					communicationObj : window.btoa(encodeURI(JSON.stringify(commObj))),
					purchasePackingObj : PURCHASEORDER?.purchasePackingObj !== undefined ? PURCHASEORDER?.purchasePackingObj : null,
					totalPrice: totalPrice,
					additionalData : window.btoa(encodeURI(JSON.stringify(additionalData))),
					purchaseOrderDeliveryDate: PURCHASEORDER.purchaseOrderDeliveryDate
				};
			}else{
				callData = {
					purchaseOrderId: purchaseOrderId,
					parentPurchaseOrderId: 0,
					supplierId: parseInt($("#selectedSupplierId").val()),
					purchaseOrderObj: window.btoa(encodeURI(JSON.stringify(purchaseOrderObj))),
					communicationObj : window.btoa(encodeURI(JSON.stringify(commObj))),
					purchasePackingObj : PURCHASEORDER?.purchasePackingObj !== undefined ? PURCHASEORDER?.purchasePackingObj : null,
					totalPrice: totalPrice,
					additionalData : window.btoa(encodeURI(JSON.stringify(additionalData))),
					purchaseOrderDeliveryDate: $('#deliveryDate').val()
				};
			}
			appCommonFunctionality.ajaxCallLargeData(qryStr, callData, receivePlacePurchaseOrderResponse);
		}
	};
	
	const receivePlacePurchaseOrderResponse = function(purchaseOrderResonse){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		purchaseOrderResonse = JSON.parse(purchaseOrderResonse);
		if(PAGEDOCNAME === 'purchaseOrderDetails.php' || PAGEDOCNAME === 'purchaseOrderInput.php'){
			purchaseOrderFunctionality.gotoPurchaseOrderDetails(purchaseOrderResonse.responseCode);
		}else if(PAGEDOCNAME === 'splitPurchaseOrder.php'){
			if(parseInt(purchaseOrderId) < parseInt(purchaseOrderResonse.responseCode)){
				purchaseOrderFunctionality.gotoPurchaseOrderDetails(purchaseOrderResonse.responseCode);
			}
		}
	};
	
	parent.openClauseModal = function(){
		$("#purchaseOrderClauseModal").modal('show');
	};
	
	parent.addClause = function(){
		const clause = $('#clauseTextArea').val();
		if(clause.length > 0){
			PURCHASEORDERCLAUSES.push(clause);
		}
		$('#clauseTextArea').val('')
		purchaseOrderFunctionality.populateClauses();
	};
	
	parent.removeClause = function(index){
		if(index > -1) {
			PURCHASEORDERCLAUSES.splice(index, 1);
			purchaseOrderFunctionality.populateClauses();
		}
	};

	parent.editTnc = function(){
		$('#tncHTML').addClass('hide');
		$('#tncTextArea').val($('#tncHTML').html());
		$('#tncTextAreaSection').removeClass('hide');
	};
	
	parent.updateTncHTML = function(){
		$('#tncHTML').html($('#tncTextArea').val()).removeClass('hide');
		$('#tncTextAreaSection').addClass('hide');
	};
	
	parent.onchangeDeliveryDate = function(){
		$('#deliveryDateTnC').html($('#deliveryDate').val());
	};
	
	parent.initPurchaseOrderDetails = async function () {
		appCommonFunctionality.adjustMainContainerHight('purchaseOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		ORDERPURCHASESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERPURCHASESTATUS'));
		PRODUCTLIVESTOCKPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCTLIVESTOCK'));
		PRODUCTPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCT'));
		COUNTRYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COUNTRY'));
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		/*----------------------Edit Purchase Order implementation------------------------*/
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		if (purchaseOrderId) {
			$('#purchaseOrderId').val(purchaseOrderId);
			appCommonFunctionality.ajaxCall('PURCHASEORDERDETAILS&purchaseOrderId=' + purchaseOrderId, receivePurchaseOrderDetailsData);
		}
		/*----------------------Edit Purchase Order implementation------------------------*/
	};
	
	const receivePurchaseOrderDetailsData = function(purchaseOrderDetailsResponse){
		try {
			appCommonFunctionality.hideLoader();
			const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId');
			PURCHASEORDER = JSON.parse(purchaseOrderDetailsResponse)?.msg?.[0];
			PURCHASEORDERGUID = PURCHASEORDER.GUID;
			if (!PURCHASEORDER) {
				console.error("Invalid response data.");
				return;
			}
			const currentStatus = getPurchaseOrderStatus(PURCHASEORDER.status);
			
			if(!appCommonFunctionality.isMobile()){
				//Purchase Order Status Progress 
				$('#purchaseOrderStatusProgress').html(orderStatusProgress(PURCHASEORDER.status));
			}
			
			// Section 1: Order Summary
			const orderSummaryHTML = `
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
					<div class="pull-left">
						<h2>${PURCHASEORDER.purchaseOrderCode} - ${currentStatus} </h2>
						<h2 id="totalPriceH2"></h2>
						<div class="f14"><b id="cms_552">${appCommonFunctionality.getCmsString(552)}</b>: ${PURCHASEORDER.purchaseOrderCreateDate}</div>
						<div class="f14"><b id="cms_553">${appCommonFunctionality.getCmsString(553)}</b>: ${PURCHASEORDER.purchaseOrderDeliveryDate}</div>
					</div>
				</div>
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
					<!--<div class="pull-right productImageBlock5">
						<img src="${QRCODEAPIURL}${PURCHASEORDER.purchaseOrderCode}|${PURCHASEORDER.totalPrice}GBP|${PURCHASEORDER.purchaseOrderCreateDate}|${PURCHASEORDER.purchaseOrderDeliveryDate}" 
							 alt="${PURCHASEORDER.purchaseOrderCode}" 
							 onerror="productFunctionality.onImgError(this);">
					</div>-->
				</div>`;
			$('#orderDetailsSection1').html(orderSummaryHTML);

			// Section 2: Billing and Delivery Information
			const projectInformationData = JSON.parse($('#projectInformationData').val());
			const billingInformation = projectInformationData?.billingInformation;
			const deliveryInformation = projectInformationData?.deliveryInformation;
			const deliveryIdentifire = 0;
			let orderDetailsSection2HTML = `
			<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white ordInfo-table roundedBorder">
				<tbody>
					<tr>
						<td width="50%"><strong id="cms_575">${appCommonFunctionality.getCmsString(575)}</strong></td>
						<td width="50%"><strong id="cms_576">${appCommonFunctionality.getCmsString(576)}</strong></td>
					</tr>
					<tr class="f12">
						<td width="50%">
							<b rel="cms_577">${appCommonFunctionality.getCmsString(577)}</b>: ${billingInformation.companyName || ''} <br> 
						</td>
						<td width="50%">
							<b rel="cms_577">${appCommonFunctionality.getCmsString(577)}</b>: ${deliveryInformation[deliveryIdentifire].store || ''} <br> 
						</td>
					</tr>
					<tr class="f12">
						<td width="50%">
							<b rel="cms_578">${appCommonFunctionality.getCmsString(578)}</b>: ${billingInformation.contactPerson || ''} <br> 
						</td>
						<td width="50%">
							<b rel="cms_578">${appCommonFunctionality.getCmsString(578)}</b>: ${deliveryInformation[deliveryIdentifire].contactPerson || ''} <br> 
						</td>
					</tr>
					<tr class="f12">
						<td width="50%">
							<b rel="cms_579">${appCommonFunctionality.getCmsString(579)}</b>: ${billingInformation.phone || ''} <br> 
						</td>
						<td width="50%">
							<b rel="cms_579">${appCommonFunctionality.getCmsString(579)}</b>: ${deliveryInformation[deliveryIdentifire].phone || ''} <br> 
						</td>
					</tr>
					<tr class="f12">
						<td width="50%">
							<b>Email</b>: <a href="mailto:${billingInformation.email || ''}" class="blueText">${billingInformation.email || ''}</a> <br>
						</td>
						<td width="50%">
							<b>Email</b>: <a href="mailto:${deliveryInformation[deliveryIdentifire].email || ''}" class="blueText">${deliveryInformation[deliveryIdentifire].email || ''}</a> <br>
						</td>
					</tr>
					<tr class="f12">
						<td width="50%">
							<b rel="cms_580">${appCommonFunctionality.getCmsString(580)}</b>: ${billingInformation.address || ''} <br> 
						</td>
						<td width="50%">
							<b rel="cms_580">${appCommonFunctionality.getCmsString(580)}</b>: ${deliveryInformation[deliveryIdentifire].address || ''} <br> 
						</td>
					</tr>
					<tr class="f12">
						<td width="50%">
							<b rel="cms_581">${appCommonFunctionality.getCmsString(581)}</b>: ${billingInformation.town || ''} <br> 
						</td>
						<td width="50%">
							<b rel="cms_581">${appCommonFunctionality.getCmsString(581)}</b>: ${deliveryInformation[deliveryIdentifire].town || ''} <br> 
						</td>
					</tr>
					<tr class="f12">
						<td width="50%">
							<b>Postcode</b>: ${billingInformation.postCode || ''} <br> 
						</td>
						<td width="50%">
							<b>Postcode</b>: ${deliveryInformation[deliveryIdentifire].postCode || ''} <br> 
						</td>
					</tr>
					<tr class="f12">
						<td width="50%">
							<b rel="cms_582">${appCommonFunctionality.getCmsString(582)}</b>: <span>${appCommonFunctionality.getCountryName(billingInformation.countryId, false)}</span>
						</td>
						<td width="50%">
							<b rel="cms_582">${appCommonFunctionality.getCmsString(582)}</b>: <span>${appCommonFunctionality.getCountryName(deliveryInformation[deliveryIdentifire].countryId, false)}</span>
						</td>
					</tr>
				</tbody>
			</table>`;
			$('#orderDetailsSection2').html(orderDetailsSection2HTML);
			
			// Section 3 & 4: Order Items & Billing section
			if (PURCHASEORDER?.purchaseOrderObj) {
				$("#selectedSupplierId").val(PURCHASEORDER?.supplierId);
				try {
					
					if (PURCHASEORDER?.purchasePackingObj) { //I am placing it before because I need to calculate packing cost as well.
						const decodedPurchaseOrderPackingObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchasePackingObj)));
						if (Array.isArray(decodedPurchaseOrderPackingObj) && decodedPurchaseOrderPackingObj.length) {
							PURCHASEORDERPACKINGOBJ = decodedPurchaseOrderPackingObj;
						}
					}
					
					if (PURCHASEORDER?.purchaseOrderObj) {
						const decodedPurchaseOrderObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchaseOrderObj)));
						const finalPurchaseOrderObj = JSON.parse(decodedPurchaseOrderObj?.purchaseOrderObj || "[]");
						if (Array.isArray(finalPurchaseOrderObj) && finalPurchaseOrderObj.length) {
							PURCHASEORDEROBJ = finalPurchaseOrderObj;
							purchaseOrderFunctionality.populateCart();
						}
					}
					
					if (PURCHASEORDER?.additionalData) {
						const decodedPurchaseOrderAdditionalData = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.additionalData)));
						const finalPurchaseOrderClausesObj = decodedPurchaseOrderAdditionalData?.clauses || "[]";
						if (Array.isArray(finalPurchaseOrderClausesObj) && finalPurchaseOrderClausesObj.length) {
							PURCHASEORDERCLAUSES = finalPurchaseOrderClausesObj;
							purchaseOrderFunctionality.populateClauses();
						}
						PURCHASEORDERTNC = decodedPurchaseOrderAdditionalData?.tnc || "";
						purchaseOrderFunctionality.populateTnC();
					}
					
				} catch (error) {
					console.error("Failed to parse order object:", error);
				}
			}

			// Payment Information Section
			if (PURCHASEORDER?.paymentInformation) {
				try {
					PAYMENTOBJ = PURCHASEORDER?.paymentInformation;
					let partlyPaidTotalAmount = 0.00;
					let str = '';
					for(let i = 0; i < PAYMENTOBJ.length; i++){
						str = str + PAYMENTOBJ[i].financeDate + ' : ' + appCommonFunctionality.getDefaultCurrency() + PAYMENTOBJ[i].amount + ' [' + PAYMENTOBJ[i].paymentMode + ']<br/>';
						partlyPaidTotalAmount = partlyPaidTotalAmount + parseFloat(PAYMENTOBJ[i].amount);
					}
					const paidStatusId = getPurchaseOrderStatusId('PAID');
					if(parseFloat(partlyPaidTotalAmount) >= parseFloat(PURCHASEORDER.totalPrice) && PURCHASEORDER.status < paidStatusId) {
						str = str + "<span id='cms_868'>" + appCommonFunctionality.getCmsString(868) + "</span> <span id='cms_869' class='blueText hover' onclick=\"saleOrderFunctionality.changeOrderStatus('" + purchaseOrderId + "', " + paidStatusId + ")\">" + appCommonFunctionality.getCmsString(869) + "</span>";
					}
					$("#purchaseOrderPaymentInfo").html(str);
				} catch (error) {
					console.error("Failed to parse order object:", error);
				}
			}else{
				$("#purchaseOrderPaymentInfo").html('N/A');
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
				$('#purchaseOrderPackingDetailsTab a').contents().unwrap();
				$('#purchaseOrderPackingDetailsTab').addClass('notAllowed');
			};
			
			const supplierSignature = function(instruction){
				setTimeout(function() {
					if(instruction === "NOSIGN"){
						$('#supplierSignSection').html(appCommonFunctionality.getCmsString(709));
					}else if(instruction === "SIGN"){
						const supplierId = $('#selectedSupplierId').val();
						const supplierSignImg = '<img src="' + PROJECTPATH + 'uploads/supplierSignature/SUPPLIER-SIGN_' + supplierId + '.jpeg" alt="signature" class="productImageBlock5 w100p" onerror="appCommonFunctionality.onImgError(this)">';
						$('#supplierSignSection').html(supplierSignImg);
					}
				}, 1000);
			};
			
			switch (extractOrderStatus(currentStatus)) {
				
				case "PLACED":{
					disableButtons("#newPurchaseOrderBtn, #inspectionBtn");
					supplierSignature('NOSIGN');
					break;
				}
					
				case "APPROVED":{
					disableButtons("#newPurchaseOrderBtn, #editPurchaseOrderBtn, #inspectionBtn");
					supplierSignature('NOSIGN');
					break;
				}
				
				case "PACKING":{
					disableButtons("#newPurchaseOrderBtn, #editPurchaseOrderBtn, #splitPurchaseOrderBtn, #inspectionBtn, #deletePurchaseOrderBtn");
					supplierSignature('NOSIGN');
					break;
				}
				
				case "SHIPPED":{
					disableButtons("#newPurchaseOrderBtn, #editPurchaseOrderBtn, #splitPurchaseOrderBtn, #deletePurchaseOrderBtn");
					enableButtons("#inspectionBtn");
					supplierSignature('SIGN');
					break;
				}
				
				case "INSPECTED":{
					disableButtons("#newPurchaseOrderBtn, #editPurchaseOrderBtn, #splitPurchaseOrderBtn, #inspectionBtn, #deletePurchaseOrderBtn");
					supplierSignature('SIGN');
					break;
				}
				
				case "PARTIALLYPAID":{
					disableButtons("#newPurchaseOrderBtn, #editPurchaseOrderBtn, #splitPurchaseOrderBtn, #inspectionBtn, #deletePurchaseOrderBtn");
					supplierSignature('SIGN');
					break;
				}
				
				case "PAID":{
					disableButtons("#newPurchaseOrderBtn, #editPurchaseOrderBtn, #splitPurchaseOrderBtn, #inspectionBtn, #deletePurchaseOrderBtn");
					supplierSignature('SIGN');
					break;
				}
				
				case "COMPLETED":{
					disableButtons("#editPurchaseOrderBtn, #splitPurchaseOrderBtn, #actionBtn, #inspectionBtn, #deletePurchaseOrderBtn");
					enableButtons("#newPurchaseOrderBtn");
					disableOrderPackingTab();
					supplierSignature('SIGN');
					break;
				}
					
				case "CANCELLED1":{
					disableButtons("#editPurchaseOrderBtn, #splitPurchaseOrderBtn, #actionBtn, #inspectionBtn, #deletePurchaseOrderBtn");
					enableButtons("#newPurchaseOrderBtn");
					disableOrderPackingTab();
					supplierSignature('SIGN');
					break;
				}
					
				case "CANCELLED2":{
					disableButtons("#editPurchaseOrderBtn, #splitPurchaseOrderBtn, #actionBtn, #inspectionBtn, #deletePurchaseOrderBtn");
					enableButtons("#newPurchaseOrderBtn");
					disableOrderPackingTab();
					supplierSignature('SIGN');
					break;
				}
			}
			$('#purchaseOrderStatusBunAction').html(generateOrderStatusLinks(PURCHASEORDER.status));
			
			if (appCommonFunctionality.isMobile()) {
				$('.tabHeader ').addClass('f12');
				$('#oderDetailsSection3').removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
				$('#clauseSection, #signSection').removeClass('noRightPaddingOnly').addClass('nopaddingOnly');
			}
			
			appCommonFunctionality.cmsImplementationThroughID();
			
		} catch (error) {
			console.error("Error in receiveOrderDetailResponse:", error);
		}
	};
	
	const orderStatusProgress = function (purchaseOrderStatusId) {
		const purchaseOrderStatusSteps = ORDERPURCHASESTATUSPRECOMPILEDDATA.filter(status => status.purchaseOrderStatusId < (getPurchaseOrderStatusId('COMPLETED') + 1));
		const totalSteps = purchaseOrderStatusSteps.length;
		const activeSteps = purchaseOrderStatusSteps.filter(step => step.purchaseOrderStatusId <= purchaseOrderStatusId).length;
		const progressPercentage = ((activeSteps - 1) / (totalSteps - 1)) * 100; // Calculate percentage
		let progressHtml = `<div class="progress-container">`;
		progressHtml += `<div class="progress" id="progress" style="width: ${progressPercentage}%;"></div>`;
		purchaseOrderStatusSteps.forEach((step) => {
			const isActive = step.purchaseOrderStatusId <= purchaseOrderStatusId ? "active" : "";
			progressHtml += `
				<div class="circle ${isActive}">
					<span class="stepText" id="cms_${step.purchaseOrderStatusCmsId}">${appCommonFunctionality.getCmsString(step.purchaseOrderStatusCmsId)}</span>
				</div>
			`;
		});
		progressHtml += `</div>`;
		return progressHtml;
	};
	
	const generateOrderStatusLinks = function(currentOrderStatusId) {
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
        const currentStatus = ORDERPURCHASESTATUSPRECOMPILEDDATA.find(
            status => status.purchaseOrderStatusId === currentOrderStatusId
        );

        if (!currentStatus) {
            console.error("Invalid order status ID provided.");
            return "";
        }

        const redirectionIds = currentStatus.redirectionPurchaseOrderStatusIds
            ? currentStatus.redirectionPurchaseOrderStatusIds.split(",").map(Number)
            : [];

        const redirectionStatuses = ORDERPURCHASESTATUSPRECOMPILEDDATA.filter(
            status => redirectionIds.includes(status.purchaseOrderStatusId)
        );
		
        let linksHtml = "";
        redirectionStatuses.forEach(status => {
            linksHtml += `<li class="hover" onClick="purchaseOrderFunctionality.changePurchaseOrderStatus('${purchaseOrderId}', ${status.purchaseOrderStatusId})">
                        <a id="cms_${status.purchaseOrderStatusCmsId}">${appCommonFunctionality.getCmsString(status.purchaseOrderStatusCmsId)}</a>
                      </li>`;
        });
        return linksHtml;
    };

	parent.changePurchaseOrderStatus = function(purchaseOrderId, purchaseOrderStatusId){
		const purchaseOrderStatus = extractStatusText(getPurchaseOrderStatus(purchaseOrderStatusId));
		const selectedLang = $('#languageDDL').val() || 'en';
		let partlyPaidTotalAmount = 0.00
		for(let i = 0; i < PAYMENTOBJ.length; i++){
			partlyPaidTotalAmount = partlyPaidTotalAmount + parseFloat(PAYMENTOBJ[i].amount);
		}
		if(parseFloat(partlyPaidTotalAmount) >= parseFloat(PURCHASEORDER.totalPrice)) {
			const queryString = `CHANGEPURCHASEORDERSTATUS&purchaseOrderId=${purchaseOrderId}&purchaseOrderStatusId=${purchaseOrderStatusId}&selectedLang=${selectedLang}`;
			appCommonFunctionality.ajaxCall(queryString, receiveChangePurchaseOrderStatusResponse);
		}else{
			if(purchaseOrderStatus === 'PARTIALLYPAID'){
				$('#paymentOptionModal').modal('show');
				$('#purchaseOrderCurrency').text(appCommonFunctionality.getDefaultCurrency());
				$('#purchaseOrderAmount').prop('disabled', false);
				$('#purchaseOrderNarration').val(PURCHASEORDER?.purchaseOrderCode + ' - ' + appCommonFunctionality.getCmsString(862)).prop('disabled', false);
				$('#purchaseOrderPaymentStatus').val(purchaseOrderStatus);
			}else if(purchaseOrderStatus === 'PAID'){
				$('#paymentOptionModal').modal('show');
				$('#purchaseOrderCurrency').text(appCommonFunctionality.getDefaultCurrency());
				let totalPrice = $('#totalPrice').text();
				totalPrice = totalPrice.replace(appCommonFunctionality.getDefaultCurrency(), '');
				$('#purchaseOrderAmount').val(totalPrice).prop('disabled', true);
				$('#purchaseOrderNarration').val(PURCHASEORDER?.purchaseOrderCode + ' - ' + appCommonFunctionality.getCmsString(867)).prop('disabled', true);
				$('#purchaseOrderPaymentStatus').val(purchaseOrderStatus);
			}else{
				const queryString = `CHANGEPURCHASEORDERSTATUS&purchaseOrderId=${purchaseOrderId}&purchaseOrderStatusId=${purchaseOrderStatusId}&selectedLang=${selectedLang}`;
				appCommonFunctionality.ajaxCall(queryString, receiveChangePurchaseOrderStatusResponse);
			}
		}
	};
	
	parent.updatePaymentInformation = async function () {
		if(validatePaymentInformation()){
			const purchaseOrderPaymentStatus = $('#purchaseOrderPaymentStatus').val();
			const purchaseOrderStatusId = getPurchaseOrderStatusId(purchaseOrderPaymentStatus);
			const purchaseOrderStatusIdPaid = getPurchaseOrderStatusId('PAID');
			if(PURCHASEORDER.status < purchaseOrderStatusIdPaid){
				const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId');
				const purchaseOrderAmount = $('#purchaseOrderAmount').val();
				const purchaseOrderPaymentMode = $('#purchaseOrderPaymentMode').val();
				const purchaseOrderPaymentDetails = JSON.parse($('#purchaseOrderPaymentDetails').val());
				const purchaseOrderNarration = $('#purchaseOrderNarration').val();
				const paymentInfo = {
					financeTypeDDL : 0, //for financeType Expenses
					expenseTypeDDL : financeCategoryORDP, //ORDP
					expenseTitle : PURCHASEORDER.purchaseOrderCode,
					financeDate : appCommonFunctionality.getCurrentDatetime(),
					credit : 0.00,
					totalexpense : purchaseOrderAmount,
					expenseDescription: purchaseOrderNarration,
					paymentMode: purchaseOrderPaymentMode,
					paymentDetails: window.btoa(encodeURI(JSON.stringify(purchaseOrderPaymentDetails)))
				};
				const selectedLang = $('#languageDDL').val() || 'en';

				/* Very Important to understand !
				1. First It is making FINANCEENTRY call
				2. Finally it is making the call in order to change Purchase Order Status
				*/
				appCommonFunctionality.ajaxCallLargeData("FINANCEENTRY", paymentInfo, async (response) => {
					const queryString = `CHANGEPURCHASEORDERSTATUS&purchaseOrderId=${purchaseOrderId}&purchaseOrderStatusId=${purchaseOrderStatusId}&selectedLang=${selectedLang}`;
					appCommonFunctionality.ajaxCall(queryString, receiveChangePurchaseOrderStatusResponse);
				});
				
			}else{
				alert(appCommonFunctionality.getCmsString(394));
				appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(394), appCommonFunctionality.getLang());
			}
		}
	};
	
	const validatePaymentInformation = function(){
		var errorCount = 0;
		
		/*-------------------------------------Purchase Order Payment Method Validation---------------------------*/
		if($("#purchaseOrderPaymentMode").val() === ''){
			alert(appCommonFunctionality.getCmsString(852));
			errorCount++;
		}
		/*-------------------------------------Purchase Order Payment Method Validation---------------------------*/
		
		/*-------------------------------------Purchase Order Amount Validation----------------------------------*/
		if($("#purchaseOrderAmount").val() === '' && parseFloat(saleOrderAmount) > 0){
			appCommonFunctionality.raiseValidation("purchaseOrderAmount", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("purchaseOrderAmount", "purchaseOrderAmount", true);
		}
		/*-------------------------------------Purchase Order Amount Validation----------------------------------*/
		
		/*-------------------------------------Purchase Order Narration Validation-------------------------------*/
		if($("#purchaseOrderNarration").val() === ''){
			appCommonFunctionality.raiseValidation("purchaseOrderNarration", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("purchaseOrderNarration", "purchaseOrderNarration", true);
		}
		/*-------------------------------------Purchase Order Narration Validation-------------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.selectPaymentMode = async function(paymentMode){
		$('.paymentGifBlock').find('.fa-check').remove();
		$('#payBy' + appCommonFunctionality.capitalizeFirstLetter(paymentMode.toLowerCase())).append('<i class="fa fa-check greentext f16 check-icon"></i>');
		$('#purchaseOrderPaymentMode').val(paymentMode);
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
		$('#purchaseOrderPaymentDetails').val(JSON.stringify(paymentDetails));
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
	
	const receiveChangePurchaseOrderStatusResponse = function(response){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		if(parseInt(purchaseOrderId) > 0){
			window.location = `purchaseOrderDetails.php?purchaseOrderId=` + purchaseOrderId;
		}
	};
	
	parent.openInvoice = function(){
		window.open(PROJECTPATH + `purchaseInvoice/` + PURCHASEORDER.GUID, '_blank').focus();
	};
	
	parent.openMail = function(){
		window.open('mail.php?search=' + PURCHASEORDER.purchaseOrderCode, '_blank').focus();
	};
	
	parent.splitPurchaseOrder = function(){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		if(parseInt(purchaseOrderId) > 0){
			window.location = `splitPurchaseOrder.php?purchaseOrderId=` + purchaseOrderId;
		}
	};
	
	parent.goToInspection = function(){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		if(parseInt(purchaseOrderId) > 0){
			window.location = `purchaseOrderPackingDetails.php?purchaseOrderId=` + purchaseOrderId;
		}
	};
	
	parent.goToPurchaseOrderPackingDetail = function(){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		window.location = `purchaseOrderPackingDetails.php?purchaseOrderId=` + purchaseOrderId;
	};
	
	parent.gotoPurchaseOrders = function(){
		window.location = `purchaseOrders.php`;
	};
	
	parent.deletePurchaseOrder = function (purchaseOrderId) {
		if(PAGEDOCNAME === 'purchaseOrderDetails.php'){
			purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
			appCommonFunctionality.ajaxCall("DELETEPURCHASEORDER&purchaseOrderId=" + purchaseOrderId, purchaseOrderFunctionality.gotoPurchaseOrders);
		}
        appCommonFunctionality.ajaxCall("DELETEPURCHASEORDER&purchaseOrderId=" + purchaseOrderId, purchaseOrderFunctionality.initPurchaseOrder);
    };
	
	parent.initSplitPurchaseOrder = async function () {
		appCommonFunctionality.adjustMainContainerHight('purchaseOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		/*----------------------Getting Purchase Order Data--------------------------------------*/
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		if (purchaseOrderId) {
			$('#purchaseOrderId').val(purchaseOrderId);
			appCommonFunctionality.ajaxCall('PURCHASEORDERDETAILS&purchaseOrderId=' + purchaseOrderId, receivePurchaseOrderDetailsDataForSplit);
		}
		/*----------------------Getting Purchase Order Data--------------------------------------*/
	};
	
	const receivePurchaseOrderDetailsDataForSplit = function(purchaseOrderData){
		appCommonFunctionality.hideLoader();
		PURCHASEORDER = JSON.parse(purchaseOrderData)?.msg?.[0];
		PURCHASEORDERGUID = PURCHASEORDER.GUID;

		$('#selectedSupplierSection').html('<div class="f16">' + PURCHASEORDER?.supplierName + ' (' + PURCHASEORDER?.supplierContactPerson + ')</div>');
		$('#existingPurchaseOrderCode').html('[' + PURCHASEORDER?.purchaseOrderCode + ']');
		
		if (PURCHASEORDER?.purchaseOrderObj) {
			const decodedPurchaseOrderObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchaseOrderObj)));
			const finalPurchaseOrderObj = JSON.parse(decodedPurchaseOrderObj?.purchaseOrderObj || "[]");
			if (Array.isArray(finalPurchaseOrderObj) && finalPurchaseOrderObj.length) {
				PURCHASEORDEROBJ = finalPurchaseOrderObj;
				purchaseOrderFunctionality.populateSplitCarts(PURCHASEORDEROBJ, 'EXISTING');
			}
		}
		
		$('#deliveryDate').val(PURCHASEORDER.purchaseOrderDeliveryDate);
	};
	
	parent.populateSplitCarts = function(purchaseOrdObj, identifire) {
		let uniqueProducts = {};
		$.each(purchaseOrdObj, function(index, product) {
			let key = product.productId + '-' + product.productCombinationId;
			
			if (uniqueProducts[key]) {
				uniqueProducts[key].qty += 1;
			} else {
				uniqueProducts[key] = { ...product, qty: 1 };
			}
		});

		let displayItems = Object.values(uniqueProducts);
		let totalPrice = 0;
		let str = `
			<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder">
				<tbody>
					<tr>
						<td width="75%" class="text-left"><b id="cms_544">Products</b></td>
						<td width="10%" class="text-right"><b>Qty</b></td>
						<td width="15%" class="text-right"><b id="cms_545">Price</b></td>
					</tr>`;
		
		if (displayItems.length > 0) {
			displayItems.forEach(item => {
				totalPrice += item.PPrice * item.qty;
				str += `
					<tr>
						<td class="text-left">
							<div class="pull-left f12">
								<span>${item.productTitle} [${item.productCode}] ${appCommonFunctionality.getDefaultCurrency()}${item.PPrice.toFixed(2)}</span><br>
								<span>[${item.productCombinationId}] - ${getQRTextHtml(item.productCombinationQR, item.productCode)}</span>
							</div>
						</td>
						<td class="text-right">
							${item.qty}`;
				
				if (identifire === 'EXISTING') {
					str += `<i class="fa fa-hand-o-right greenText marleft5 hover" onclick="purchaseOrderFunctionality.transferOrder(${item.productCombinationId}, 'EXISTING', 'NEW')"></i>`;
				} else if (identifire === 'NEW') {
					str += `<i class="fa fa-hand-o-left greenText marleft5 hover" onclick="purchaseOrderFunctionality.transferOrder(${item.productCombinationId}, 'NEW', 'EXISTING')"></i>`;
				}
				
				str += `</td>
						<td class="text-right">
							<span>${appCommonFunctionality.getDefaultCurrency()}${(item.PPrice * item.qty).toFixed(2)}</span>
						</td>
					</tr>`;
			});
		} else {
			str += `
				<tr>
					<td class="text-left">No Data</td>
				</tr>`;
		}

		str += `
				</tbody>
			</table>`;
		
		if (identifire === 'EXISTING') {
			$('#cartTableHolder').html(str);
		} else if (identifire === 'NEW') {
			$('#cartNewTableHolder').html(str);
		}

		if (displayItems.length > 0) {
			if (identifire === 'EXISTING') {
				$('#totalBeforeTax').html(`${appCommonFunctionality.getDefaultCurrency()}${totalPrice.toFixed(2)}`);
				$('#taxP').html(`${DEFAULTTAX}`);
				totalPrice += totalPrice * (DEFAULTTAX / 100);
				$('#totalPrice').html(`${appCommonFunctionality.getDefaultCurrency()}${totalPrice.toFixed(2)}`);
				$('#totalCalcSection').removeClass('hide');
			} else if (identifire === 'NEW') {
				$('#newTotalBeforeTax').html(`${appCommonFunctionality.getDefaultCurrency()}${totalPrice.toFixed(2)}`);
				$('#newTaxP').html(`${DEFAULTTAX}`);
				totalPrice += totalPrice * (DEFAULTTAX / 100);
				$('#newTotalPrice').html(`${appCommonFunctionality.getDefaultCurrency()}${totalPrice.toFixed(2)}`);
				$('#newTotalCalcSection').removeClass('hide');
			}
		}
		
		if(PURCHASEORDEROBJ.length > 0 && NEWPURCHASEORDEROBJ.length > 0){
			$('#splitPurchaseOrderBtn').attr('disabled', false);
		}
	};
	
	parent.transferOrder = function(combinationId, from, to) {
		let sourceArray, destinationArray;
		if (from === 'EXISTING' && to === 'NEW') {
			sourceArray = PURCHASEORDEROBJ;
			destinationArray = NEWPURCHASEORDEROBJ;
		} else if (from === 'NEW' && to === 'EXISTING') {
			sourceArray = NEWPURCHASEORDEROBJ;
			destinationArray = PURCHASEORDEROBJ;
		}
		const itemIndex = sourceArray.findIndex(item => item.productCombinationId === combinationId);
		if (itemIndex !== -1) {
			const [removedItem] = sourceArray.splice(itemIndex, 1);
			destinationArray.push(removedItem);
		}
		purchaseOrderFunctionality.populateSplitCarts(NEWPURCHASEORDEROBJ, 'NEW');
		purchaseOrderFunctionality.populateSplitCarts(PURCHASEORDEROBJ, 'EXISTING');
	};
	
	parent.splitPurchaseOrderSubmit = function(){
		if(validateSplitPurchaseOrderForm()){
			const qryStr = 'PLACEPURCHASEORDER';
			/*-----------------------------------New Purchase Order-----------------------------------*/
			const newPurchaseOrderObj = {
				purchaseOrderObj: JSON.stringify(NEWPURCHASEORDEROBJ),
				tax: $('#taxP').text()
			};
			let newTotalPrice = $('#newTotalPrice').html();
			newTotalPrice = newTotalPrice.replace(appCommonFunctionality.getDefaultCurrency(), '');
			const callDataNew = {
				purchaseOrderId: 0,
				parentPurchaseOrderId: 0,
				supplierId: parseInt(PURCHASEORDER?.supplierId),
				purchaseOrderObj: window.btoa(encodeURI(JSON.stringify(newPurchaseOrderObj))),
				communicationObj : PURCHASEORDER?.commObj,
				purchasePackingObj : PURCHASEORDER?.purchasePackingObj !== undefined ? PURCHASEORDER?.purchasePackingObj : null,
				totalPrice: newTotalPrice,
				additionalData : PURCHASEORDER?.additionalData,
				purchaseOrderDeliveryDate: $('#newDeliveryDate').val()
			};
			appCommonFunctionality.ajaxCallLargeData(qryStr, callDataNew, receivePlacePurchaseOrderResponse);
			/*-----------------------------------New Purchase Order-----------------------------------*/
			
			/*-----------------------------------Existing Purchase Order------------------------------*/
			const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
			const existingPurchaseOrderObj = {
				purchaseOrderObj: JSON.stringify(PURCHASEORDEROBJ),
				tax: $('#taxP').text()
			};
			let totalPrice = $('#totalPrice').html();
			totalPrice = totalPrice.replace(appCommonFunctionality.getDefaultCurrency(), '');
			const callDataExisting = {
				purchaseOrderId: purchaseOrderId,
				parentPurchaseOrderId: 0,
				supplierId: parseInt(PURCHASEORDER?.supplierId),
				purchaseOrderObj: window.btoa(encodeURI(JSON.stringify(existingPurchaseOrderObj))),
				communicationObj : PURCHASEORDER?.commObj,
				purchasePackingObj : PURCHASEORDER?.purchasePackingObj !== undefined ? PURCHASEORDER?.purchasePackingObj : null,
				totalPrice: totalPrice,
				additionalData : PURCHASEORDER?.additionalData,
				purchaseOrderDeliveryDate: $('#deliveryDate').val()
			};
			appCommonFunctionality.ajaxCallLargeData(qryStr, callDataExisting, receivePlacePurchaseOrderResponse);
			/*-----------------------------------Existing Purchase Order------------------------------*/
		}
	};

	const validateSplitPurchaseOrderForm = function(){
		var errorCount = 0;
		
		if(PURCHASEORDEROBJ.length === 0){
			$("#errorMsg").html('* ' + appCommonFunctionality.getCmsString(587));
			appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(587), appCommonFunctionality.getLang());
			setTimeout(function() {
				$('#errorMsg').html('');
			}, 3000);
		}
		
		if(NEWPURCHASEORDEROBJ.length === 0){
			$("#errorMsg").html('* ' + appCommonFunctionality.getCmsString(588));
			appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(588), appCommonFunctionality.getLang());
			setTimeout(function() {
				$('#errorMsg').html('');
			}, 3000);
		}
		
		if(PURCHASEORDEROBJ.length > 0 && NEWPURCHASEORDEROBJ.length > 0){
			$('#splitPurchaseOrderBtn').attr('disabled', false);
		}
		
		/*----------------------------------------------------Existing Purchase Order Date Validation--------------------------*/
		var deliveryDate = $("#deliveryDate").val();
		if (deliveryDate === '') {
			appCommonFunctionality.raiseValidation("deliveryDate", '', true);
			$("#deliveryDate").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("deliveryDate", "deliveryDate", true);
		}
		/*----------------------------------------------------Existing Purchase Order Date Validation--------------------------*/
		
		/*----------------------------------------------------New Purchase Order Date Validation-------------------------------*/
		var newDeliveryDate = $("#newDeliveryDate").val();
		if (newDeliveryDate === '') {
			appCommonFunctionality.raiseValidation("newDeliveryDate", '', true);
			$("#newDeliveryDate").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("newDeliveryDate", "newDeliveryDate", true);
		}
		/*----------------------------------------------------New Purchase Order Date Validation-------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.initPurchaseOrderPackingDetails = async function () {
		appCommonFunctionality.adjustMainContainerHight('purchaseOrderPackingSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		if (purchaseOrderId) {
			$('#purchaseOrderId').val(purchaseOrderId);
			appCommonFunctionality.ajaxCall("PURCHASEORDERDETAILS&purchaseOrderId=" + purchaseOrderId, receivePurchaseOrderPackingDetailResponse);
		}
	}; 

	const receivePurchaseOrderPackingDetailResponse = function(purchaseOrderPackingDetailsResponse){
		appCommonFunctionality.hideLoader();
		PURCHASEORDER = JSON.parse(purchaseOrderPackingDetailsResponse)?.msg?.[0];
		PURCHASEORDERGUID = PURCHASEORDER?.GUID;
		
		if(PURCHASEORDER?.purchasePackingObj){
			const decodedPurchasePackingOrderObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchasePackingObj)));
			if (Array.isArray(decodedPurchasePackingOrderObj) && decodedPurchasePackingOrderObj.length) {
				PURCHASEORDERPACKINGOBJ = decodedPurchasePackingOrderObj;
				populatePackages();
			}
		}
	};
	
	const populatePackages = function () {
		let str = '';
		if (PURCHASEORDERPACKINGOBJ.length > 0) {
			PURCHASEORDERPACKINGOBJ.forEach(packet => {
				const imgSrc = packet.convertedToStock 
					? `${PROJECTPATH}assets/images/cartonOpened.png` 
					: `${PROJECTPATH}assets/images/carton.png`;

				const convertedToStockText = packet.convertedToStock 
					? `<div id="cms_705" class="text-center f12 greenText">${appCommonFunctionality.getCmsString(705)}</div>` 
					: '';

				str += `
					<div class="col-lg-2 col-md-6 col-sm-6 col-xs-6 noLeftPaddingOnly marTop5">
						<div class="cartonDiv3 marBot5">
							<h4 class="text-center"><b id="cms_663">Packet</b> <b>${packet.packetNumber}</b></h4>
							<div class="text-center f12">${packet.packetType}</div>
							${convertedToStockText}
							<div class="text-center"><img src="${imgSrc}"></div>
							<div class="text-center blueText hover" onclick="purchaseOrderFunctionality.openPackagesWithInModal(${packet.packetNumber});">
								<span class="glyphicon glyphicon-search"></span>
								<span id="cms_685">View inside</span>
							</div>
							<div class="text-left marTop5">
								<b id="cms_686">Dimension in: </b> cm
							</div>
							<div class="text-left marTop5">
								<b id="cms_687">Width :</b><span>${packet.width}</span>
							</div>
							<div class="text-left marTop5">
								<b id="cms_688">Height: </b><span>${packet.height}</span>
							</div>
							<div class="text-left marTop5">
								<b id="cms_689">Length :</b><span>${packet.length}</span>
							</div>
							<div class="text-left marTop5">
								<b id="cms_690">Weight in : </b><span>${packet.weightUnit}</span>
							</div>
							<div class="text-left marTop5">
								<b id="cms_691">Weight :</b><span>${packet.weight}</span>
							</div>
							<div class="text-left marTop5">
								<b id="cms_692">Price : </b><span>${appCommonFunctionality.getDefaultCurrency()}${packet.price}</span>
							</div>
							<div class="text-left marTop5">
								<b id="cms_693">Tracking :</b><span>${packet.trackingNo}</span>
							</div>
						</div>
					</div>
				`;
			});
		}
		$('#packageDetailsHolder').html(str);
	};
	
	parent.openPackagesWithInModal = function (packetNumber) {
		const packageObject = PURCHASEORDERPACKINGOBJ.find(packet => packet.packetNumber === packetNumber);
		$('#saleOrderPacketHeader').html(`<span id="cms_694">Packet</span>${packetNumber} [${packageObject.packetType}]`);
		const displayOrderHtml = getDisplayOrderArr(packageObject.items);
		$('#saleOrderPacketTableHolder').html(displayOrderHtml);
		$('#packetNumberHdn').val(packetNumber);
		if(packageObject.convertedToStock){
			$('#inspectBtn').remove();
			$('#convertedToStockText').text(appCommonFunctionality.getCmsString(705));
		}
		$("#saleOrderPacketModal").modal('show');
	};
	
	parent.inspectCartonProducts = function(){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		const packetNumber = $('#packetNumberHdn').val();
		if(parseInt(purchaseOrderId) > 0){
			window.open(`purchaseOrderInspection.php?purchaseOrderId=` + purchaseOrderId + `&packetNumber=` + packetNumber, '_blank');
		}
	};
	
	const getDisplayOrderArr = function(filteredOrderItems) {
		const displayOrderArr = [];
		const orderMap = new Map();

		filteredOrderItems.forEach(order => {
			const productId = parseInt(order.productId);
			const productCombinationId = parseInt(order.productCombinationId);
			const key = `${productId}-${productCombinationId}-${order.debitNote || false}`;
			
			if (orderMap.has(key)) {
				const existingOrder = orderMap.get(key);
				existingOrder.qty += 1;
			} else {
				orderMap.set(key, { ...order, qty: 1 });
			}
		});

		displayOrderArr.push(...orderMap.values());

		let str = `
		<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder">
			<tbody>
				<tr>
					<td width="75%" class="text-left"><b id="cms_544">Products</b></td>
					<td width="10%" class="text-right"><b>Qty</b></td>
				</tr>`;

		displayOrderArr.forEach(item => {
			const rowClass = item.debitNote ? "bgLightRed" : "";
			str += `
			<tr class="${rowClass}">
				<td class="text-left">
					<div class="pull-left f12">
						<span>${item.productTitle} [${item.productCode}] - [${item.productCombinationId}]</span>
					</div>
					<div class="pull-left"></div>
				</td>
				<td class="text-right">${item.qty}</td>
			</tr>`;
		});

		str += `
			</tbody>
		</table>`;
		
		return str;
	};
	
	parent.initPurchaseOrderInspection = async function () {
		appCommonFunctionality.adjustMainContainerHight('purchaseOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		STOCKSTORAGEPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('STOCKSTORAGE'));
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') ?? 0;
		const packetNumber = appCommonFunctionality.getUrlParameter('packetNumber') ?? 0;
		if (purchaseOrderId && packetNumber) {
			$('#purchaseOrderId').val(purchaseOrderId);
			appCommonFunctionality.ajaxCall("PURCHASEORDERDETAILS&purchaseOrderId=" + purchaseOrderId, receivePurchaseOrderInspectionResponse);
		}else{
			purchaseOrderFunctionality.goToPurchaseOrderPackingDetail();
		}
	}; 
	
	const receivePurchaseOrderInspectionResponse = function(purchaseOrderInspectionResponse){
		appCommonFunctionality.hideLoader();
		PURCHASEORDER = JSON.parse(purchaseOrderInspectionResponse)?.msg?.[0];
		PURCHASEORDERGUID = PURCHASEORDER?.GUID;
		$('#selectedSupplierId').val(PURCHASEORDER?.supplierId);
		
		if(PURCHASEORDER?.purchasePackingObj){
			const decodedPurchasePackingOrderObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchasePackingObj)));
			if (Array.isArray(decodedPurchasePackingOrderObj) && decodedPurchasePackingOrderObj.length) {
				const packetNumber = appCommonFunctionality.getUrlParameter('packetNumber') || 0;
				PURCHASEORDERPACKINGOBJ = decodedPurchasePackingOrderObj;
				PURCHASEORDERSELECTEDOBJ = PURCHASEORDERPACKINGOBJ.filter(packet => packet.packetNumber === parseInt(packetNumber))[0].items;
				populateCartHeaderText();
				populateExistingCart();
			}
		}
		
		/*-------------------------------Populate Item position Treeview in Item position modal-----------------------------*/
		$("#treeview").html(makeStockStorageTreeItem(0));
		$("#treeview").hummingbird();
		$('[id^="stockStorageItem_"]').click(function() { 
			const checkboxIdArr = this.id.split('_');
			$("#storageId").val(parseInt(checkboxIdArr[1]));
			$('input[type="checkbox"][id^="stockStorageItem_"]').not(this).prop('checked', false);
		});
		/*-------------------------------Populate Item position Treeview in Item position modal-----------------------------*/
	};
	
	const populateCartHeaderText = function(){
		setTimeout(function() {
			$('#arrivedItemsHeader').html('<span id="cms_694">' + appCommonFunctionality.getCmsString(694) + '</span> ' + PURCHASEORDERPACKINGOBJ[0].packetNumber + '[' + PURCHASEORDERPACKINGOBJ[0].packetType + '] <span id="cms_697">' + appCommonFunctionality.getCmsString(697) + '</span>');
			$('#defectiveItemsHeader').html('<span id="cms_694">' +appCommonFunctionality.getCmsString(694) + '</span> ' + PURCHASEORDERPACKINGOBJ[0].packetNumber + '[' + PURCHASEORDERPACKINGOBJ[0].packetType + '] <span id="cms_698">'  + appCommonFunctionality.getCmsString(698) + '</span>');
		}, 1000);
	};
	
	const populateExistingCart = function(){
		const displayOrderArr = [];
		const orderMap = new Map();
		PURCHASEORDERSELECTEDOBJ.forEach(purchaseOrder => {
			const productId = parseInt(purchaseOrder.productId);
			const productCombinationId = parseInt(purchaseOrder.productCombinationId);
			const key = `${productId}-${productCombinationId}`;

			if (orderMap.has(key)) {
				const existingOrder = orderMap.get(key);
				if (purchaseOrder.debitNote) {
					// Create a separate entry for debitNote items
					const debitNoteKey = `${key}-debitNote`;
					if (orderMap.has(debitNoteKey)) {
						orderMap.get(debitNoteKey).qty += 1;
					} else {
						orderMap.set(debitNoteKey, { ...purchaseOrder, qty: 1 });
					}
					hasDebitNote = true;
				} else {
					existingOrder.qty += 1;
				}
			} else {
				if (purchaseOrder.debitNote) {
					const debitNoteKey = `${key}-debitNote`;
					orderMap.set(debitNoteKey, { ...purchaseOrder, qty: 1 });
				} else {
					orderMap.set(key, { ...purchaseOrder, qty: 1 });
				}
			}
		});
		displayOrderArr.push(...orderMap.values());
		//console.log("displayOrderArr : ", displayOrderArr);
		let str = `
        <table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder">
            <tbody>
                <tr>
                    <td width="75%" class="text-left"><b id="cms_544">Products</b></td>
                    <td width="10%" class="text-right"><b>Qty</b></td>
                    <td width="15%" class="text-right"><b id="cms_554">Action</b></td>
                </tr>`;
				
        displayOrderArr.forEach(product => {
			const combinationDetails = getQRTextHtml(product.productCombinationQR, product.productCode);
			const rowClass = product.debitNote ? 'bgLightRed' : '';
			const actionIcon = product.debitNote ? '' : `<i class="fa fa-hand-o-right redText hover" onclick="purchaseOrderFunctionality.discardItem(${product.productCombinationId})"></i>`;

			str += `
				<tr class="${rowClass}">
					<td class="text-left">
						<div class="pull-left f12">
							<span>${product.productTitle} [${product.productCode}] £${product.PPrice}</span><br>
							<span>[${product.productCombinationId}] - ${combinationDetails}</span>
						</div>
						<div class="pull-left"></div>
					</td>
					<td class="text-right">${product.qty}</td>
					<td class="text-right">
						${actionIcon}
					</td>
				</tr>`;
		});

        str += `
            </tbody>
        </table>`;

        // Set the HTML content of the element with id 'cartTableHolder'
        $('#cartTableHolder').html(str);
	};
	
	parent.discardItem = function(productCombinationId) {
		const items = PURCHASEORDERSELECTEDOBJ.filter(item => item.productCombinationId === productCombinationId && !item.debitNote);
		if (items.length > 0) {
			const lastItem = items[items.length - 1];
			lastItem.debitNote = true;
			NEWPURCHASEORDEROBJ.push(lastItem);
		}
		populateDiscardCart();
		populateExistingCart();
	};
	
	const populateDiscardCart = function() {
		let str = `
		<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder">
			<tbody>
				<tr>
					<td width="85%" class="text-left"><b id="cms_544">Products</b></td>
					<td width="15%" class="text-right"><b id="cms_554">Action</b></td>
				</tr>`;

		NEWPURCHASEORDEROBJ.forEach((product, index) => {
			const combinationDetails = getQRTextHtml(product.productCombinationQR, product.productCode);

			str += `
				<tr>
					<td class="text-left">
						<div class="pull-left f12">
							<span>${product.productTitle} [${product.productCode}] £${product.PPrice}</span><br>
							<span>[${product.productCombinationId}] - ${combinationDetails}</span><br>`;
			
			if (product.reason) {
				str += `<span class="redText"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i> ${product.reason}</span>`;
			}

			str += `</div>
						<div class="pull-left"></div>
					</td>
					<td class="text-right">
						<div class="stickerQrHolder">
							<i class="fa fa-file-text redText hover" onclick="purchaseOrderFunctionality.openReturnNoteModal(${product.productCombinationId}, ${index})"></i>
							<i class="fa fa-trash-o redText hover" onclick="purchaseOrderFunctionality.returnItem(${product.productCombinationId})"></i>
						</div>
					</td>
				</tr>`;
		});

		str += `
			</tbody>
		</table>`;

		// Set the HTML content of the element with id 'discardTableHolder'
		$('#discardTableHolder').html(str);
	};
	
	parent.returnItem = function(productCombinationId) {
		const index = NEWPURCHASEORDEROBJ.findIndex(item => item.productCombinationId === productCombinationId);
		if (index !== -1) {
			const [item] = NEWPURCHASEORDEROBJ.splice(index, 1);
			
			// Find the last item in PURCHASEORDERSELECTEDOBJ with debitNote = true and matching productCombinationId
			const purchaseOrderIndex = PURCHASEORDERSELECTEDOBJ.map((purchaseOrder, idx) => ({ ...purchaseOrder, idx }))
				.reverse()
				.findIndex(purchaseOrder => purchaseOrder.productCombinationId === productCombinationId && purchaseOrder.debitNote === true);

			if (purchaseOrderIndex !== -1) {
				// The actual index of the item in the original array
				const actualIndex = PURCHASEORDERSELECTEDOBJ.length - 1 - purchaseOrderIndex;
				// Remove the item from PURCHASEORDERSELECTEDOBJ
				PURCHASEORDERSELECTEDOBJ.splice(actualIndex, 1);
			}
			
			// Remove debitNote and reason attributes from the item
			delete item.debitNote;
			delete item.reason;

			// Add the item back to PURCHASEORDERSELECTEDOBJ
			PURCHASEORDERSELECTEDOBJ.push(item);
		}
		populateDiscardCart();
		populateExistingCart();
	};
	
	parent.openReturnNoteModal = function(productCombinationId, index) {
		$('#productCombinationId').val(productCombinationId);
		$('#index').val(index);
		
		const items = NEWPURCHASEORDEROBJ.filter(item => item.productCombinationId === productCombinationId);
		$('#returnNoteHeader').html(items[0].productTitle + ' [' + items[0].productCode + '] - ' + productCombinationId);
		let str = '';
		str = str + '<input id="reason" name="reason" type="text" class="form-control" placeholder="' + appCommonFunctionality.getCmsString(700) + '" autocomplete="off" value="" rel="cms_700">';
		$('#returnNoteTableHolder').html(str);
		$("#returnNoteModal").modal('show');
	};
	
	parent.saveReturnNote = function() {
		const productCombinationId = parseInt($('#productCombinationId').val());
		const index = parseInt($('#index').val());
		const reason = $('#reason').val();

		// Find the item in NEWPURCHASEORDEROBJ where productCombinationId and index match
		const newPurchaseOrderItem = NEWPURCHASEORDEROBJ.find((product, i) => product.productCombinationId === productCombinationId && i == index);

		// If the item is found, add the reason attribute
		if (newPurchaseOrderItem) {
			newPurchaseOrderItem.reason = reason;
		}

		// Find the item in PURCHASEORDERSELECTEDOBJ where productCombinationId, index match and debitNote is true
		const purchaseOrderItem = PURCHASEORDERSELECTEDOBJ.find((product, i) => product.productCombinationId === productCombinationId && i == index && product.debitNote === true);

		// If the item is found, add the reason attribute
		if (purchaseOrderItem) {
			purchaseOrderItem.reason = reason;
		}
		
		populateDiscardCart();
		populateExistingCart();
		$('#returnNoteModal').modal('hide');
	};
	
	parent.saveInspection = function(identifire) {
		const qryStr = 'PLACEPURCHASEORDER';
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') || 0;
		const packetNumber = appCommonFunctionality.getUrlParameter('packetNumber') || 0;
		
		/*----------------------------Updating convertedToStock = true to the packet on packet finalization--------------------------*/
		if (!identifire) {
			let selectedPacket = $(PURCHASEORDERPACKINGOBJ).filter(function(index, packet) {
				return packet.packetNumber === parseInt(packetNumber);
			})[0];
			
			if (selectedPacket) {
				selectedPacket.convertedToStock = true; // Set the attribute on the selected packet
			}
		}
		/*----------------------------Updating convertedToStock = true to the packet on packet finalization--------------------------*/
		
		/*----------------------------Updating existing Purchase Order Object -------------------------------------------------------*/
		let existingPurchaseOrderObj = PURCHASEORDER?.purchaseOrderObj ? JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchaseOrderObj))) : {};
		const updatedPurchaseOrderObj = [];
		PURCHASEORDERPACKINGOBJ.forEach(packet => {
			packet.items.forEach(item => {
				updatedPurchaseOrderObj.push(item);
			});
		});
		existingPurchaseOrderObj.purchaseOrderObj = JSON.stringify(updatedPurchaseOrderObj);
		PURCHASEORDEROBJ = updatedPurchaseOrderObj;
		/*----------------------------Updating existing Purchase Order Object -------------------------------------------------------*/
		
		/*----------------------------Caluculate Total Price-------------------------------------------------------------------------*/
		const purchaseOrderData = getPurchaseOrderSummary();
		let totalPrice = purchaseOrderData.total;
		/*----------------------------Caluculate Total Price-------------------------------------------------------------------------*/
		
		const callData = {
			purchaseOrderId: purchaseOrderId,
			parentPurchaseOrderId: 0,
			supplierId: parseInt(PURCHASEORDER?.supplierId),
			purchaseOrderObj: window.btoa(encodeURI(JSON.stringify(existingPurchaseOrderObj))),
			communicationObj: PURCHASEORDER?.communicationObj,
			purchasePackingObj: window.btoa(encodeURI(JSON.stringify(PURCHASEORDERPACKINGOBJ))),
			totalPrice: totalPrice,
			additionalData: PURCHASEORDER?.additionalData,
			purchaseOrderDeliveryDate: PURCHASEORDER.purchaseOrderDeliveryDate
		};

		if(identifire){
			appCommonFunctionality.ajaxCallLargeData(qryStr, callData, receiveSaveInspectionResponse);
		}else{
			appCommonFunctionality.ajaxCallLargeData(qryStr, callData, finalizeInspectionSaveStock);
		}
	};
	
	const receiveSaveInspectionResponse = function(response){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('purchaseOrderId') || 0;
		window.location = `purchaseOrderPackingDetails.php?purchaseOrderId=` + purchaseOrderId;
	};
	
	parent.openItemPositionModal = function(){
		$("#itemPositionModal").modal('show');
	};
	
	const makeStockStorageTreeItem = function(parentId) {
		let str = '';
		STOCKSTORAGEPRECOMPILEDDATA.forEach(storage => {
			if (parseInt(storage.parentId) === parseInt(parentId)) {
				let childItems = makeStockStorageTreeItem(parseInt(storage.storageId));
				str += `
					<li data-id="${storage.storageId}">
						<i class="fa fa-plus ${childItems ? '' : 'lightGreyText'}"></i>
						<label class="marleft5">
							<input type="checkbox" id="stockStorageItem_${storage.storageId}" name="stockStorageItem_${storage.storageId}" value="${storage.storageId}" onClick="purchaseOrderFunctionality.selectItemPositionVal(${storage.storageId})">
							<span class="marleft5 hover">${storage.storageName}</span>
						</label>
						${childItems}
					</li>`;
			}
		});
		return parentId > 0 && str ? `<ul>${str}</ul>` : str;
	};
	
	parent.selectItemPositionVal = function(itemPosition){
		$('#itemPosition').val(itemPosition);
	};

	parent.onBarQrSwitchChange = function() {
		const barQrInput = $("#barQr");
		const isBarQrChecked = parseInt(barQrInput.val());
		barQrInput.val(isBarQrChecked ? 0 : 1);
		barQrInput.prop('checked', !isBarQrChecked);
		$("#barCode").toggleClass('hide', isBarQrChecked);
		$("#qrCode").toggleClass('hide', !isBarQrChecked);
		$('#systemReferenceType').val(isBarQrChecked ? 0 : 1);
	};
	
	const finalizeInspectionSaveStock = function(response){
		const qryStr = 'SAVESTOCK';
		const packetNumber = appCommonFunctionality.getUrlParameter('packetNumber') || 0;
        var selectedPacket = $(PURCHASEORDERPACKINGOBJ).filter(function(index, packet) {
            return packet.packetNumber === parseInt(packetNumber);
        })[0];
		var filteredItems = [];
        if (selectedPacket) {
            filteredItems = $(selectedPacket.items).filter(function(index, item) {
                return item.debitNote !== true;
            }).get();
        }
		
		/*---------------Re-arrangement of Object structure-------------------*/
		var rearrangedObject = filteredItems.reduce((acc, item) => {
            var key = `${item.productId}-${item.productCombinationId}`;
            if (!acc[key]) {
                acc[key] = {
                    productId: item.productId,
                    productCombinationId: item.productCombinationId,
                    productCombinationQR: item.productCombinationQR,
                    systemReferenceArray: [],
                    systemReferenceType: parseInt($('#systemReferenceType').val()),
                    itemPosition: parseInt($('#itemPosition').val()),
                    entryReference: PURCHASEORDER.purchaseOrderCode
                };
            }
            acc[key].systemReferenceArray.push(item.systemReference);
            return acc;
        }, {});
        var rearrangedArray = Object.values(rearrangedObject);
		/*---------------Re-arrangement of Object structure-------------------*/
		
		let completedRequests = 0;
		for (let i = 0; i < rearrangedArray.length; i++) {
			const callData = {
				productId: rearrangedArray[i].productId,
				productCombinationId: rearrangedArray[i].productCombinationId,
				productCombinationQR: rearrangedArray[i].productCombinationQR,
				systemReferenceArray: rearrangedArray[i].systemReferenceArray.join(','),
				systemReferenceType: rearrangedArray[i].systemReferenceType,
				itemPosition: rearrangedArray[i].itemPosition,
				entryReference: rearrangedArray[i].entryReference
			};
			appCommonFunctionality.ajaxCallLargeData(qryStr, callData, function(response) {
				completedRequests++;
				if (completedRequests === rearrangedArray.length) {
					purchaseOrderFunctionality.goToInspection();
				}
			});
		}
	};
	
    return parent;
}(window, window.$));