$(document).ready(function(){
	/*--------------------------Sidebar Menu Selection---------------------*/
	MENUSELECTIONITEM = "productMagazine.php";
	$('.w3-bar-block > a').each(function(){ 
		var Url = $(this).attr("href"); // Get current url
		if(Url === MENUSELECTIONITEM){
			$(this).addClass("w3-blue");
		}
	});
	/*--------------------------Sidebar Menu Selection---------------------*/
	BRANDS = [];
	PRODUCTS = [];
	MAGAZINEPRODUCTS = {};
	var pagePathName= window.location.pathname; 
	var pageDocumentName = pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
	if(pageDocumentName === "productMagazine.php"){
		productMagazineFunctionality.initProductMagazine();
	}else if(pageDocumentName === "createProductMagazine.php"){
		productMagazineFunctionality.createProductMagazine();
	}else if(pageDocumentName === "shareProductMagazine.php"){
		productMagazineFunctionality.shareProductMagazineInit();
	}
});

productMagazineFunctionality = (function(window, $) {
	
	parent.initProductMagazine = function(){
		appCommonFunctionality.adjustMainContainerHight('productMagazineSectionHolder');
	},
	
	parent.gotoCreateProductMagazine = function(){
		window.location.replace('createProductMagazine.php');
	},
	
	parent.copyMagazine = function(magazineId){
		window.location.replace('productMagazine.php?ACTION=COPYMAGAZINE&magazineId=' + magazineId);
	},

	parent.deleteMagazine = function(magazineId){
		window.location.replace('productMagazine.php?ACTION=DELETE&magazineId=' + magazineId);
	},	
	
	parent.editMagazine = function(magazineId){
		window.location.replace('createProductMagazine.php?magazineId=' + magazineId);
	},
	
	parent.createProductMagazine = function(){
		appCommonFunctionality.adjustMainContainerHight('productMagazineSectionHolder');
		BRANDS = JSON.parse($('#productBrandSerializedData').val());
		PRODUCTS = JSON.parse($('#productPreCompileData').val());
		var str = '';
		str = makeBrandTreeItem(0);
		$("#treeview").html(str);
		$("#treeview").hummingbird();
		$('.fa-plus').click();
		appCommonFunctionality.cmsImplementationThroughID();
		appCommonFunctionality.cmsImplementationThroughRel();
	
		/*--------------------If it is an Edit---------------------------------------*/
		if(appCommonFunctionality.getUrlParameter("magazineId")){
			var products = $("#products").val();
			products = products.replace(/'/g, '"');
			MAGAZINEPRODUCTS = JSON.parse(products);
			if(MAGAZINEPRODUCTS.productIds.length > 0){
				var brandIds = MAGAZINEPRODUCTS.brandIds;
				$("input:checkbox[id^=bnode-]").each(function() {
					if (brandIds.indexOf(parseInt($(this).val())) > -1) {
						$(this).prop('checked', true).parent().parent().children(':first-child').click();
					}
				});
				var productIds = MAGAZINEPRODUCTS.productIds;
				$("input:checkbox[id^=pnode-]").each(function() {
					for(var i = 0; i < productIds.length; i++){
						if(parseInt(productIds[i].productId) === parseInt($(this).val())){
							$(this).prop('checked', true);
							var id = this.id;
							var productPriceInputId = id.replace("pnode", "productPrice");
							$('#' + productPriceInputId).val(productIds[i].productPrice);
							
							if($('#' + this.id).parents().eq(3).children(":first").hasClass('fa-plus')){
								$('#' + this.id).parents().eq(3).children(":first").removeClass('fa-plus').addClass('fa-minus');
								$('#' + this.id).parents().eq(2).css('display', 'block');
							}
						}
					}
				});
			}
		}
		/*--------------------If it is an Edit---------------------------------------*/
	},
	
	makeBrandTreeItem = function(parentBrandId){
		var str = '';
		for(var i = 0; i < BRANDS.length; i++){
			if(parseInt(BRANDS[i].parentId) === parseInt(parentBrandId) && parseInt(BRANDS[i].products) > 0){
				str = str + '<li data-id="' + BRANDS[i].brandId + '">';
					var getChildItems = makeBrandTreeItem(parseInt(BRANDS[i].brandId));
					var getProductItems = listProductItems(parseInt(BRANDS[i].brandId));
					if(getChildItems !== ''){
						str = str + '<i class="fa fa-plus"></i>';
					}else{
						str = str + '<i class="fa fa-plus lightGreyText"></i>';
					}
					str = str + '<label class="marleft5">';
						str = str + '<input id="bnode-' + BRANDS[i].brandId + '" data-id="custom-' + BRANDS[i].brandId + '" type="checkbox" value="' + BRANDS[i].brandId + '">';
						str = str + '<span class="marleft5 hover">' + BRANDS[i].brandName + '</span>';
						if(parseInt(BRANDS[i].products) > 0){
							str = str + '<span class="marleft5 hover">[' + BRANDS[i].products + ' <span id="cms_37">Products</span>]</span>';
						}
					str = str + '</label>';
					str = str + getChildItems;
					if(parseInt(BRANDS[i].products) > 0){
						str = str + getProductItems;
					}
				str = str + '</li>';
			}
		}
		if(parseInt(parentBrandId) > 0 && str.length > 0){
			str = '<ul>' + str + '</ul>';
		}
		return str;
	},
	
	listProductItems = function(brandId){
		var str = '';
		var filteredProduct = PRODUCTS.filter(function (obj) { 
			return parseInt(obj.brandId) === parseInt(brandId)
		});
		for(var i = 0; i < filteredProduct.length; i++){
			str = str + '<li data-id="' + filteredProduct[i].productId + '">';
				str = str + '<label>';
					str = str + '<input id="pnode-' + brandId + '-' + filteredProduct[i].productId + '" data-id="custom-' + brandId + '-' + filteredProduct[i].productId + '" type="checkbox" value="' + filteredProduct[i].productId + '">';
					str = str + '<span><img src="' + PROJECTPATH + PRODUCTIMAGEURL + '64x64/' + filteredProduct[i].productImage + '" alt="' + filteredProduct[i].productImage + '" class="productImage marleft5" onerror="appCommonFunctionality.onImgError(this)"></span>';
					str = str + '<span class="marleft5 blueText">' + filteredProduct[i].productTitle + ' [' + filteredProduct[i].productCode + ']</span>';
				str = str + '</label>';
			str = str + '</li>';
		}
		if(parseInt(brandId) > 0 && str.length > 0){
			str = '<ul>' + str + '</ul>';
		}
		return str;
	},
	
	parent.validateProductMagazineEntry = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Magazine Title Validation---------------------------------------*/
		var magazine = $("#magazine").val();
		if (magazine === "") {
			appCommonFunctionality.raiseValidation("magazine", appCommonFunctionality.getCmsString(184), true);
			$("#magazine").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("magazine", "magazine", true);
		}
		/*----------------------------------------------------Magazine Title Validation---------------------------------------*/
		
		/*----------------------------------------------------Product List Validation-----------------------------------------*/
		if($('[id^=pnode-]').is(':checked')){
			$("#productsErr").text('');
			var brandArray = [];
            $("input:checkbox[id^=bnode-]:checked").each(function() {
                brandArray.push(parseInt($(this).val()));
            });
			MAGAZINEPRODUCTS.brandIds = brandArray;
			var productArray = [];
            $("input:checkbox[id^=pnode-]:checked").each(function() {
				var id = this.id;
				var productPriceInputId = id.replace("pnode", "productPrice");
				var productObj = {"productId":parseInt($(this).val()), "productPrice":$('#' + productPriceInputId).val()}
                productArray.push(productObj);
            });
			MAGAZINEPRODUCTS.productIds = productArray;
			if(MAGAZINEPRODUCTS.productIds.length > 0){
				//$("#products").val(window.btoa(encodeURI(JSON.stringify(MAGAZINEPRODUCTS))));
				$("#products").val(JSON.stringify(MAGAZINEPRODUCTS));
			}
		}else{
			$("#productsErr").text(appCommonFunctionality.getCmsString(185));
		}
		/*----------------------------------------------------Product List Validation-----------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	},
	
	parent.shareProductMagazineInit = function(){
		appCommonFunctionality.adjustMainContainerHight('productMagazineSectionHolder');
		initSelectAllCustomer();
	},
	
	initSelectAllCustomer = function(){
		$("#selectAll").on('click', function(e){
			if($('#selectAll').is(":checked")){
				$("[id^='customer_']").prop('checked', true);
			}else{
				$("[id^='customer_']").prop('checked', false);
			}
		});
	},
	
	parent.validateProductMagazineCustomer = function(){
		if(!$('[id^="customer_"]').is(":checked")){
			alert(appCommonFunctionality.getCmsString(186));
			return false;
		}else{
			return true;
		}
	}
	
	return parent;
}(window, window.$));