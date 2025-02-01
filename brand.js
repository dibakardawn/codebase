let HTMLEDITOR = false;
let BRANDPRECOMPILEDDATA = [];
$(document).ready(function(){
	/*--------------------------Sidebar Menu Selection---------------------*/
	MENUSELECTIONITEM = "brands.php";
	$('.w3-bar-block > a').each(function(){ 
		var Url = $(this).attr("href"); // Get current url
		if(Url === MENUSELECTIONITEM){
			$(this).addClass("w3-blue");
		}
	});
	/*--------------------------Sidebar Menu Selection---------------------*/
	appCommonFunctionality.adminCommonActivity();

	var pagePathName= window.location.pathname; 
	var pageDocumentName = pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
	if(pageDocumentName === "brands.php"){
		brandFunctionality.initbrands();
	}else if(pageDocumentName === "brandEntry.php"){
		var refreshIntervalId = window.setInterval(function() {
			if($(".ql-toolbar").length === 0 && $('#brandDescBody').not('ql-container') && !HTMLEDITOR){
				brandFunctionality.initbrandsEntry();
			}else{
				if($("#brandDesc").val() !== ''){
					var delta = quill.clipboard.convert(decodeURI(window.atob($("#brandDesc").val())));
					quill.setContents(delta, 'silent');
				}
				HTMLEDITOR = true;
				appCommonFunctionality.cmsImplementationThroughID();
				appCommonFunctionality.cmsImplementationThroughRel();
				clearInterval(refreshIntervalId);
			}
		}, LOADTIME);
	}else if(pageDocumentName === "brandDetail.php"){
		brandFunctionality.initbrandsDetail();
	}
});

brandFunctionality = (function(window, $) {
	
	parent.initbrands = function(){
		appCommonFunctionality.adjustMainContainerHight('brandSectionHolder');
		/*-------------------------------Get Precompiled Data-------------------------------*/
		appCommonFunctionality.fetchIndexedDBData('BRAND').then(objects => { 
			BRANDPRECOMPILEDDATA = objects; 
			populateBrandTree();
		}).catch(error => {
			console.error("Failed to fetch objects from IndexedDB : BRAND : ", error);
		});
		/*-------------------------------Get Precompiled Data-------------------------------*/
		appCommonFunctionality.cmsImplementationThroughID();
		appCommonFunctionality.cmsImplementationThroughRel();
	},
	
	populateBrandTree = function(){
		var str = '';
		str = makeBrandTreeItem(0);
		$("#treeview").html(str);
		$("#treeview").hummingbird();
		$('.fa-plus').click();
	},
	
	makeBrandTreeItem = function(parentBrandId){
		var str = '';
		for(var i = 0; i < BRANDPRECOMPILEDDATA.length; i++){
			if(parseInt(BRANDPRECOMPILEDDATA[i].parentId) === parseInt(parentBrandId)){
				str = str + '<li data-id="' + BRANDPRECOMPILEDDATA[i].brandId + '">';
					var getChildItems = makeBrandTreeItem(parseInt(BRANDPRECOMPILEDDATA[i].brandId));
					if(getChildItems !== ''){
						str = str + '<i class="fa fa-plus"></i>';
					}else{
						str = str + '<i class="fa fa-plus lightGreyText"></i>';
					}
					str = str + '<label class="marleft5">';
						if(BRANDPRECOMPILEDDATA[i].brandImage !== ''){
							str = str + '<span class="marleft5"><img src="' + PROJECTPATH + 'uploads/brand/' + BRANDPRECOMPILEDDATA[i].brandImage + '" alt="' + BRANDPRECOMPILEDDATA[i].brandImage + '" class="productImage hover" onclick="brandFunctionality.brandDetail(' + BRANDPRECOMPILEDDATA[i].brandId + ');" onerror="appCommonFunctionality.onImgError(this)"></span>';
						}else{
							str = str + '<span class="marleft5"><img src="' + PROJECTPATH + 'assets/images/noImages.png" alt="No Image" class="productImage hover" onclick="brandFunctionality.brandDetail(' + BRANDPRECOMPILEDDATA[i].brandId + ');"></span>';
						}
						str = str + '<span onclick="brandFunctionality.brandDetail(' + BRANDPRECOMPILEDDATA[i].brandId + ');" class="marleft5 hover">' + BRANDPRECOMPILEDDATA[i].brandName + '</span>';
						str = str + '<span onclick="brandFunctionality.editbrand(' + BRANDPRECOMPILEDDATA[i].brandId + ');" class="marleft5 fa fa-pencil-square-o blueText hover" title="Edit"></span>';
						str = str + '<span onclick="brandFunctionality.addbrand(' + BRANDPRECOMPILEDDATA[i].brandId + ');" class="marleft5 fa fa-plus-square greenText hover" title="Add Child Brand"></span>';
						if(parseInt(BRANDPRECOMPILEDDATA[i].products) > 0){
							str = str + '<span onclick="brandFunctionality.gotoProductsWithBrandFilter(' + BRANDPRECOMPILEDDATA[i].brandId + ');" class="marleft5 hover">[' + BRANDPRECOMPILEDDATA[i].products + ' Products]</span>';
							str = str + '<span onclick="brandFunctionality.arrangeProducts(' + BRANDPRECOMPILEDDATA[i].brandId + ');" class="marleft5 blueText hover">[Arrange Product Sequence]</span>';
						}
					str = str + '</label>';
					str = str + getChildItems;
				str = str + '</li>';
			}
		}
		if(parseInt(parentBrandId) > 0 && str.length > 0){
			str = '<ul>' + str + '</ul>';
		}
		return str;
	},
	
	parent.addbrand = function(brandId){
		if(brandId === ''){
			window.location.replace('brandEntry.php');
		}else if (typeof brandId === "undefined"){
			window.location.replace('brandEntry.php');
		}else{
			window.location.replace('brandEntry.php?parentId=' + brandId);
		}
	},

	parent.editbrand = function(brandId){
		window.location.replace('brandEntry.php?brandId=' + brandId);
	},
	
	parent.brandDetail = function(brandId){
		window.location.replace('brandDetail.php?brandId=' + brandId);
	},
	
	parent.deletebrand = function(brandId){
		if(confirm("Are you sure to delete this Brand?")){
			window.location.replace('brands.php?ACTION=DELETE&brandId=' + brandId);
		}
	},
	
	parent.initbrandsEntry = function(){
		if($("#brandDescBody").length){
			/*--------------------------------quill-------------------------------------------------------*/
			var toolbarOptions = [
				['bold', 'italic', 'underline', 'strike'],        // toggled buttons
				['blockquote', 'code-block'],

				[{ 'header': 1 }, { 'header': 2 }],               // custom button values
				[{ 'list': 'ordered'}, { 'list': 'bullet' }],
				[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
				[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
				[{ 'direction': 'rtl' }],                         // text direction

				[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
				[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

				[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
				[{ 'font': [] }],
				[{ 'align': [] }]
			];

			quill = new Quill('#brandDescBody', {
				modules: {
					toolbar: toolbarOptions
				},
				theme: 'snow'
			});
			
			$('#brandDescBody').addClass('bgWhite maxH350');
			/*--------------------------------quill-------------------------------------------------------*/
		}
		appCommonFunctionality.adjustMainContainerHight('brandSectionHolder');
		appCommonFunctionality.cmsImplementationThroughID();
		appCommonFunctionality.cmsImplementationThroughRel();
	},
	
	parent.validatebrandEntry = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Product brand Name Validation----------------------------------------*/
		var brandName = $("#brandName").val();
		if (brandName === "") {
			appCommonFunctionality.raiseValidation("brandName", "Please Enter Product brand Name", true);
			$("#brandName").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("brandName", "brandName", true);
		}
		/*----------------------------------------------------Product brand Title Validation----------------------------------------*/
		
		/*----------------------------------------------------Product brand Description Validation----------------------------------*/
		var brandDesc = window.btoa(encodeURI(quill.root.innerHTML));
		if (brandDesc === "") {
			appCommonFunctionality.raiseValidation("brandsDescErrHolder", "Please Enter Product brand Description", false);
			$("#brandDesc").focus();
			errorCount++
		} else {
			$("#brandDesc").val(brandDesc);
			appCommonFunctionality.removeValidation("brandsDescErrHolder", "brandsDescErrHolder", false);
		}
		/*----------------------------------------------------Product brand Description Validation----------------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	},
	
	parent.initbrandsDetail = function(){
		$("#brandDescActual").html(decodeURI(window.atob($("#brandDesc").val())));
		appCommonFunctionality.cmsImplementationThroughID();
		appCommonFunctionality.cmsImplementationThroughRel();
	},
	
	parent.goTobrands = function(){
		window.location.replace('brands.php');
	},
	
	parent.arrangeProducts = function(brandId){
		window.location.replace('arrangeProducts.php?brandId=' + brandId);
	},
	
	parent.gotoProductsWithBrandFilter = function(brandId){
		window.location.replace('product.php?brandId=' + brandId);
	}
	
	return parent;
}(window, window.$));