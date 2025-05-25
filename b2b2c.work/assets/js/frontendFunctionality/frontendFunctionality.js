const urlElements = appCommonFunctionality.allElementsFromUrl();
const ORDERTYPE = urlElements[3].toUpperCase();
let PAGEDOCNAME = '';
if(ORDERTYPE === 'SALEINVOICE'){
	PAGEDOCNAME = 'printableOrder.php';
}else if(ORDERTYPE === 'PURCHASEINVOICE'){
	PAGEDOCNAME = 'printableOrder.php';
}

/*-----------------Commonly Used Variables--------------------------------*/
let SALEORDER = {};
let SALEORDEROBJ = [];
let SALEPACKINGOBJ = [];
let SALEORDERPAYMENT = [];
let SALEADDITIONALDATAOBJ = {};

let PURCHASEORDER = {};
let PURCHASEORDEROBJ = [];
let PURCHASEPACKINGOBJ = [];
let PURCHASEORDERPAYMENT = {};

let projectInformationData = {};
let defaultCurrencyObj = {};
let orderTnCData = {};
let TAX = 0;
/*-----------------Commonly Used Variables--------------------------------*/

$(document).ready(function() {
	
	switch (PAGEDOCNAME) {
		
		case "printableOrder.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=LANGUAGE')
			).done(function(languageResponse) {
				// Both AJAX calls completed successfully
				appCommonFunctionality.hideLoader();
				frontendFunctionality.initPrintableOrderPrint(languageResponse);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
    }
	
	appCommonFunctionality.cmsImplementationThroughID();
	appCommonFunctionality.cmsImplementationThroughRel();
});

const frontendFunctionality  = (function (window, $) {
	
	const parent = {};
	
	/*---------------------------------------------------------Common functionality---------------------------------------------------*/
	parent.contentPopulation = function(){
		if (LANGUAGEPRECOMPILEDDATA.length > 0 && $("#CMSDATA").length > 0) {
			if ($("#CMSDATA").val().length > 0) {
				CMSDATA = JSON.parse($("#CMSDATA").val().replace(/'/g, '"'));
				appCommonFunctionality.cmsImplementationThroughID();
				appCommonFunctionality.cmsImplementationThroughRel();
			}
		}
	};
	/*---------------------------------------------------------Common functionality---------------------------------------------------*/
	
	/*---------------------------------------------------------Printable Order--------------------------------------------------------*/
	parent.initPrintableOrderPrint = function(languageResponse){
		LANGUAGEPRECOMPILEDDATA = JSON.parse(languageResponse);
		appCommonFunctionality.bindLangDDL();
		if (!ORDERTYPE) {
			return;
		}
		const orderGUID = urlElements[4];
		if (!orderGUID) {
			return;
		}
		let queryString = '';
		if(ORDERTYPE === 'SALEINVOICE'){
			queryString = `SALEORDERDETAILSBYGUID&orderGUID=${orderGUID}`;
		}else if(ORDERTYPE === 'PURCHASEINVOICE'){
			queryString = `PURCHASEORDERDETAILSBYGUID&orderGUID=${orderGUID}`;
		}
		appCommonFunctionality.ajaxCall(queryString, receiveOrderDetailResponse);
	};
	
	const receiveOrderDetailResponse = function(orderDetailsResponse){
		appCommonFunctionality.hideLoader();
		if(ORDERTYPE === 'SALEINVOICE'){
			SALEORDER = JSON.parse(orderDetailsResponse)?.msg?.[0];
			if (SALEORDER?.orderObj) {
				const decodedOrderObj = JSON.parse(decodeURI(window.atob(SALEORDER.orderObj)));
				const finalOrderObj = JSON.parse(decodedOrderObj?.orderObj || "[]");
				if (Array.isArray(finalOrderObj) && finalOrderObj.length) {
					SALEORDEROBJ = finalOrderObj;
				}
			}
			if (SALEORDER?.packingObj) {
				const decodedOrderPackingObj = JSON.parse(decodeURI(window.atob(SALEORDER.packingObj)) || "[]");
				if (Array.isArray(decodedOrderPackingObj) && decodedOrderPackingObj.length) {
					SALEPACKINGOBJ = decodedOrderPackingObj;
				}
			}
			if (SALEORDER?.paymentInformation) {
				SALEORDERPAYMENT = SALEORDER?.paymentInformation;
			}
			if(SALEORDER?.additionalData){
				SALEADDITIONALDATAOBJ = JSON.parse(decodeURI(window.atob(SALEORDER?.additionalData)));
			}
		}else if(ORDERTYPE === 'PURCHASEINVOICE'){
			PURCHASEORDER = JSON.parse(orderDetailsResponse)?.msg?.[0];
			if (PURCHASEORDER?.orderObj) {
				const decodedOrderObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER.orderObj)));
				const finalOrderObj = JSON.parse(decodedOrderObj?.purchaseOrderObj || "[]");
				if (Array.isArray(finalOrderObj) && finalOrderObj.length) {
					PURCHASEORDEROBJ = finalOrderObj;
				}
			}
			if (PURCHASEORDER?.packingObj) {
				const decodedOrderPackingObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER.packingObj)) || "[]");
				if (Array.isArray(decodedOrderPackingObj) && decodedOrderPackingObj.length) {
					PURCHASEPACKINGOBJ = decodedOrderPackingObj;
				}
			}
			if (PURCHASEORDER?.paymentInformation) {
				PURCHASEORDERPAYMENT = PURCHASEORDER?.paymentInformationl
			}
		}
		projectInformationData = JSON.parse($('#projectInformationData').val());
		orderTnCData = JSON.parse($('#tncData').val());
		defaultCurrencyObj = appCommonFunctionality.getDefaultData('CURRENCY');
		populatePrintableOrderInformation();
		populatePrintableOrderTable1();
		populateTempCustData(); //Applicable for CoC orders
		if(ORDERTYPE === 'SALEINVOICE'){
			populatePrintableSaleOrderCartTable();
		}else if(ORDERTYPE === 'PURCHASEINVOICE'){
			populatePrintablePurchaseOrderCartTable();
		}
		populatePrintableOrderPaymentInformation();
		populatePrintableOrderTnC();
		populatePrintableOrderFooter();
		parent.contentPopulation();
	};
	
	const populatePrintableOrderInformation = function() {
		const order = ORDERTYPE === 'SALEINVOICE' ? SALEORDER : 
					 ORDERTYPE === 'PURCHASEINVOICE' ? PURCHASEORDER : null;
		if (!order) return;
		const { billingInformation } = projectInformationData || {};
		const orderCode = order.orderCode;
		const str = `
			<div class="f30">${billingInformation?.companyName || ''}</div>
			<div class="f20">
				${ORDERTYPE === 'SALEINVOICE' ? '<span id="cms_711">Sale Order</span>' : '<span id="cms_844">Purchase Order</span>'}</span> : 
				<span class="goldenText">${orderCode}</span> - <span class="copyText"></span>
			</div>
			<div>${[billingInformation?.address, billingInformation?.town, 
				   billingInformation?.postCode, billingInformation?.country]
				   .filter(Boolean).join(', ')}</div>
			<div>
				<span class="glyphicon glyphicon-phone-alt"></span> 
				<span>${billingInformation?.tel || ''}</span> | 
				<span class="glyphicon glyphicon-print"></span> 
				<span>${billingInformation?.fax || ''}</span>
			</div>
			<div>
				<span class="glyphicon glyphicon-envelope"></span> 
				<span>${billingInformation?.email || ''}</span>
			</div>
			<div>
				<span class="glyphicon glyphicon-globe"></span> 
				<span>${PROJECTPATH}</span>
			</div>
		`;
		$('#pritableOrderInformation1, #pritableOrderInformation2').html(str);
		if(ORDERTYPE === 'SALEINVOICE') {
			$('#pritableOrderInformation1 .copyText').html('<span id="cms_845"></span>');
			$('#pritableOrderInformation2 .copyText').html('<span id="cms_846"></span>');
		} else {
			$('#pritableOrderInformation1 .copyText').html('<span id="cms_847"></span>');
			$('#pritableOrderInformation2 .copyText').html('<span id="cms_846"></span>');
		}
		const qrData = `${SITETITLE}_${orderCode}|${order.totalPrice}${defaultCurrencyObj.currency}|${order.orderDate}|${order.deliveryDate}`;
		$('#printabaleOrderQR1, #printabaleOrderQR2').attr('src', `${PROJECTPATH}api/qrcode.php?qr=${encodeURIComponent(qrData)}`).attr('alt', orderCode);
	};
	
	const populatePrintableOrderTable1 = function(){
		let str = ``;
		if(ORDERTYPE === 'SALEINVOICE'){
			str = `
				<table class="table table-bordered table-striped marBot10">
					<tbody>
						<tr>
							<td width="15%"><b id="cms_712">Buyer</b>:</td>
							<td width="85%">
								<span>${SALEORDER.contactPerson} [${SALEORDER.companyName}]</span> | 
								<span class="glyphicon glyphicon-phone-alt"></span> 
								<span>${SALEORDER.phone}</span> | 
								<span class="glyphicon glyphicon-envelope"></span> 
								<span>${SALEORDER.email}</span>
							</td>
						</tr>
						<tr>
							<td width="15%"><b id="cms_724">Address</b>:</td>
							<td width="85%">
								${SALEORDER?.address ?? ''} ${SALEORDER?.town ?? ''} ${SALEORDER?.postCode ?? ''}
							</td>
						</tr>
					</tbody>
				</table>
			`;
		}else if(ORDERTYPE === 'PURCHASEINVOICE'){
			str = `
				<table class="table table-bordered table-striped marBot10">
					<tbody>
						<tr>
							<td width="15%"><b id="cms_824">Supplier</b>:</td>
							<td width="85%">
								<span>${PURCHASEORDER.supplierName} [${PURCHASEORDER.supplierContactPerson}]</span> | 
								<span class="glyphicon glyphicon-phone-alt"></span> 
								<span>${PURCHASEORDER.supplierContactNo}</span> | 
								<span class="glyphicon glyphicon-envelope"></span> 
								<span>${PURCHASEORDER.supplierEmail}</span>
							</td>
						</tr>
						<tr>
							<td width="15%"><b id="cms_724">Address</b>:</td>
							<td width="85%">
								${PURCHASEORDER?.supplierAddress ?? ''} ${PURCHASEORDER?.supplierTown ?? ''} ${PURCHASEORDER?.supplierPostCode ?? ''}
							</td>
						</tr>
					</tbody>
				</table>
			`;
		}
		$('#pritableOrderTable1_1, #pritableOrderTable1_2').html(str);
	};
	
	const populateTempCustData = function(){ //Applicable for CoC orders
		if(SALEADDITIONALDATAOBJ?.tempCustData){
			let tempCustData = SALEADDITIONALDATAOBJ?.tempCustData;
			let str = '';
			str = str + '<span>' + tempCustData?.custName + ' [' + COMPANYTYPECoC + ']</span> | ';
			str = str + '<span class="glyphicon glyphicon-phone-alt"></span> ';
			str = str + '<span>' + tempCustData?.custPhone + '</span> | ';
			str = str + '<span class="glyphicon glyphicon-envelope"></span> ';
			str = str + '<span>' + tempCustData?.custEmail + '</span>';
			$('#pritableOrderTable1_1 table, #pritableOrderTable1_2 table').find('tr:first-child td:nth-child(2)').html(str);
		}
	}
	
	const populatePrintableSaleOrderCartTable = function(){
		let hasCreditNote = false;
		const orderSummary = getSaleOrderSummary();
		const displayOrderArr = (orderSummary?.orderCartData && orderSummary.orderCartData.length > 0) ? orderSummary.orderCartData : [];
		//console.log('displayOrderArr : ', JSON.stringify(displayOrderArr));
		
		let str = `
		  <table class="table table-bordered table-striped marBot10">
			<tbody>
			  <tr>
				<td width="75%" class="text-left"><b id="cms_713">Products</b></td>
				<td width="10%" class="text-right"><b>Qty</b></td>
				<td width="15%" class="text-right"><b id="cms_714">Price</b></td>
			  </tr>
		`;

		displayOrderArr.forEach(item => {
		  const isCredit = item.creditNote;
		  const rowClass = isCredit ? "bgLightRed" : "";
		  const qty = isCredit ? `-${item.qty}` : item.qty;
		  const totalPrice = (item.effectivePrice * item.qty).toFixed(2);
		  const priceStr = isCredit ? `-${appCommonFunctionality.getDefaultCurrency()}${totalPrice}` : `${appCommonFunctionality.getDefaultCurrency()}${totalPrice}`;

		  str += `
			<tr class="${rowClass}">
			  <td class="text-left">
				<div class="pull-left f12">
				  <span>${item.productTitle} [${item.productCode}] ${item.offerText}</span><br>
				  <span>[${item.productCombinationId}] - ${getQRTextHtml(item.productCombinationQR, item.productCode)}</span>
				</div>
				<div class="pull-left"></div>
			  </td>
			  <td class="text-right">${qty}</td>
			  <td class="text-right">
				<span>${priceStr}</span>
			  </td>
			</tr>
		  `;
		});

		str += `
			</tbody>
		  </table>
		`;
		$('#cartTableHolder1, #cartTableHolder2').html(str);
		
		const currency = appCommonFunctionality.getDefaultCurrency();
		$('#totalBeforeTax1, #totalBeforeTax2').html(currency + (orderSummary?.totalBeforeTax ?? 0).toFixed(2));
		$('#packingCost1, #packingCost2').html(currency + (orderSummary?.packingCost ?? 0).toFixed(2));
		$('#specialDiscount1, #specialDiscount2').html(currency + (orderSummary?.specialDiscount ?? 0).toFixed(2));
		$('#taxAmount1, #taxAmount2').html((orderSummary?.tax ?? 0) + '%');
		$('#totalPrice1, #totalPrice2').html(currency + (orderSummary?.total ?? 0).toFixed(2));
	};

	const getSaleOrderSummary = function () {
		const summaryMap = {};
		let hasCreditNote = false;
		const selectedCustomerGrade = (SALEORDER && SALEORDER.customerGrade) ? SALEORDER.customerGrade.toLowerCase() : '';
		
		let specialDiscount = 0.00;
		if (SALEORDER?.orderObj) {
			const decodedOrderObj = JSON.parse(decodeURI(window.atob(SALEORDER.orderObj)));
			TAX = parseFloat(decodedOrderObj?.tax ?? 0);
			specialDiscount = decodedOrderObj?.specialDiscount ? parseFloat(decodedOrderObj.specialDiscount) : 0.00;
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

		SALEORDEROBJ.forEach(item => {
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

		const packingCost = SALEPACKINGOBJ.reduce((total, packet) => total + packet.price, 0);
		const subtotal = totalBeforeTax + packingCost - specialDiscount;
		const totalWithTax = subtotal + (subtotal * TAX / 100);

		return {
			orderCartData,
			totalBeforeTax,
			packingCost,
			specialDiscount,
			tax: TAX,
			total: totalWithTax,
			hasCreditNote
		};
	};
	
	const populatePrintablePurchaseOrderCartTable = function(){
		let hasDebitNote = false;
		const orderSummary = getPurchaseOrderSummary();
		const displayOrderArr = (orderSummary?.purchaseOrderCartData && orderSummary.purchaseOrderCartData.length > 0) ? orderSummary.purchaseOrderCartData : [];
		//console.log('displayOrderArr : ', JSON.stringify(displayOrderArr));
		
		let str = `
		  <table class="table table-bordered table-striped marBot10">
			<tbody>
			  <tr>
				<td width="75%" class="text-left"><b id="cms_713">Products</b></td>
				<td width="10%" class="text-right"><b>Qty</b></td>
				<td width="15%" class="text-right"><b id="cms_714">Price</b></td>
			  </tr>
		`;

		displayOrderArr.forEach(item => {
		  const isDebit = item.debitNote;
		  const rowClass = isDebit ? "bgLightRed" : "";
		  const qty = isDebit ? `-${item.qty}` : item.qty;
		  const totalPrice = (item.PPrice * item.qty).toFixed(2);
		  const priceStr = isDebit ? `-${appCommonFunctionality.getDefaultCurrency()}${totalPrice}` : `${appCommonFunctionality.getDefaultCurrency()}${totalPrice}`;

		  str += `
			<tr class="${rowClass}">
			  <td class="text-left">
				<div class="pull-left f12">
				  <span>${item.productTitle} [${item.productCode}]</span><br>
				  <span>[${item.productCombinationId}] - ${getQRTextHtml(item.productCombinationQR, item.productCode)}</span>
				</div>
				<div class="pull-left"></div>
			  </td>
			  <td class="text-right">${qty}</td>
			  <td class="text-right">
				<span>${priceStr}</span>
			  </td>
			</tr>
		  `;
		});

		str += `
			</tbody>
		  </table>
		`;
		$('#cartTableHolder1, #cartTableHolder2').html(str);
		
		const currency = appCommonFunctionality.getDefaultCurrency();
		$('#totalBeforeTax1, #totalBeforeTax2').html(currency + (orderSummary?.totalBeforeTax ?? 0).toFixed(2));
		$('#packingCost1, #packingCost2').html(currency + (orderSummary?.packingCost ?? 0).toFixed(2));
		$('#specialDiscount1, #specialDiscount2').html(currency + (orderSummary?.specialDiscount ?? 0).toFixed(2));
		$('#taxAmount1, #taxAmount2').html((orderSummary?.tax ?? 0) + '%');
		$('#totalPrice1, #totalPrice2').html(currency + (orderSummary?.total ?? 0).toFixed(2));
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
		const packingCost = PURCHASEPACKINGOBJ.reduce((total, packet) => total + packet.price, 0);
		
		if (PURCHASEORDER?.orderObj) {
			const decodedOrderObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER.orderObj)));
			TAX = parseFloat(decodedOrderObj?.tax ?? 0);
		}

		// Calculate total
		const total = totalBeforeTax + packingCost;
		const totalWithTax = total + (total * TAX / 100);

		return {
			purchaseOrderCartData,
			totalBeforeTax,
			packingCost,
			tax: TAX,
			total: totalWithTax,
			hasDebitNote
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
	
	const populatePrintableOrderPaymentInformation = function(){
		let str = ``;
		if(ORDERTYPE === 'SALEINVOICE'){
			let paymentRecords = '';
			for(let i = 0; i < SALEORDERPAYMENT.length; i++){
				paymentRecords = paymentRecords + SALEORDERPAYMENT[i].financeDate + ' : ' + appCommonFunctionality.getDefaultCurrency() + SALEORDERPAYMENT[i].amount + ' [' + SALEORDERPAYMENT[i].paymentMode + ']<br/>';
			}
			str = `
				<div class="f24"><span id="cms_715">Paid by</span> : </div>
				<div>${paymentRecords}</div>
				<div><b id="cms_716">Invoice Date</b> : ${appCommonFunctionality.formatDate(SALEORDER.orderDate)}</div>
				<div><b id="cms_717">Delivery Date</b> : ${appCommonFunctionality.formatDate(SALEORDER.deliveryDate)}</div>
			`;
		}else if(ORDERTYPE === 'PURCHASEINVOICE'){
			str = `
				<div class="f24"><span id="cms_715">Paid by</span> : ${PURCHASEORDERPAYMENT?.paymentMode ?? 'N/A'}</div>
				<div><b id="cms_716">Invoice Date</b> : ${appCommonFunctionality.formatDate(PURCHASEORDER.orderDate)}</div>
				<div><b id="cms_717">Delivery Date</b> : ${appCommonFunctionality.formatDate(PURCHASEORDER.deliveryDate)}</div>
			`;
		}
		$('#printableOrderPaymentInformation1, #printableOrderPaymentInformation2').html(str);
		projectInformationData = JSON.parse($('#projectInformationData').val());
		$('#upiid').html(projectInformationData?.paymentInformation?.UPIID);
	};
	
	const populatePrintableOrderTnC = function(){
		if(ORDERTYPE === 'SALEINVOICE'){
			$('#printabaleOrderTnC1, #printabaleOrderTnC2').html(orderTnCData.saleOrderTnC);
			$("#printabaleOrderTnC1 p").css('margin', '0px'); //removing unnessery margin after p tag
			$("#printabaleOrderTnC2 p").css('margin', '0px'); //removing unnessery margin after p tag
		}
	};
	
	const populatePrintableOrderFooter = function(){
		if(ORDERTYPE === 'SALEINVOICE') {
			$('#signingAuthority').html('<span id="cms_849"></span>');
		} else {
			$('div.printabaleOrderSectionFooter').each(function() {
				$(this).children('div').first().remove();
			});
			$('#signingAuthority').html('<span id="cms_850"></span>');
		}
	};
	/*---------------------------------------------------------Printable Order--------------------------------------------------------*/
	
    return parent;
}(window, window.$));