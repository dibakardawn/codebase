const MENUSELECTIONITEM = "categories.php";
const HTMLEDITOR = false;
let   CATEGORYPRECOMPILEDDATA = [];
const PAGEDOCNAME = appCommonFunctionality.getPageName();
	
$(document).ready(function() {
    /*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function() {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
    /*--------------------------Sidebar Menu Selection---------------------*/

    if (PAGEDOCNAME === "categories.php") {
		$.when(
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=CATEGORY')
		).done(function(response) {
			appCommonFunctionality.hideLoader();
			categoryFunctionality.initProductCategories(response);
		}).fail(function() {
			appCommonFunctionality.hideLoader();
			console.error('Error in one or both AJAX calls');
		});
    } else if (PAGEDOCNAME === "categoryEntry.php") {
        categoryFunctionality.initProductCategoryEntry();
    }
	
	appCommonFunctionality.cmsImplementationThroughID();
	appCommonFunctionality.cmsImplementationThroughRel();
	appCommonFunctionality.hideLoader();
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const categoryFunctionality = (function (window, $) {
    const parent = {};

    parent.initProductCategories = async function (response) {
        try {
            appCommonFunctionality.adjustMainContainerHight('categorySectionHolder');
            await appCommonFunctionality.adminCommonActivity();
            CATEGORYPRECOMPILEDDATA = JSON.parse(response);
            populateCategoryTree();
        } catch (error) {
            console.error('Error during initProductCategories:', error);
            appCommonFunctionality.hideLoader();
        }
    };

    function populateCategoryTree() {
        const str = makeCatTreeItem(0);
        $("#treeview").html(str).hummingbird();
        $('.fa-plus').click();
    }

    function makeCatTreeItem(parentCatId) {
        let str = '';
        CATEGORYPRECOMPILEDDATA.forEach(category => {
            if (parseInt(category.parentId) === parentCatId) {
                str += `<li data-id="${category.categoryId}">`;
                const getChildItems = makeCatTreeItem(parseInt(category.categoryId));
                str += getChildItems ? '<i class="fa fa-plus"></i>' : '<i class="fa fa-plus lightGreyText"></i>';
                str += `<label class="marleft5">
                            <span class="marleft5">
                                <img src="${category.categoryImage ? PROJECTPATH + 'uploads/productCategory/' + category.categoryImage : PROJECTPATH + 'assets/images/noImages.png'}" 
                                     alt="${category.categoryImage || 'No Image'}" 
                                     class="productImage hover" 
                                     onclick="categoryFunctionality.catDetail(${category.categoryId})" 
                                     onerror="appCommonFunctionality.onImgError(this)">
                            </span>
                            <span onclick="categoryFunctionality.catDetail(${category.categoryId})" class="marleft5 hover">${category.category}</span>
                            <span onclick="categoryFunctionality.editProductCategories(${category.categoryId})" class="marleft5 fa fa-pencil-square-o blueText hover" title="Edit"></span>
                            <span onclick="categoryFunctionality.addProductCategories(${category.categoryId})" class="marleft5 fa fa-plus-square greenText hover" title="Add Child Category"></span>`;
                if (parseInt(category.products) > 0) {
                    str += `<span onclick="categoryFunctionality.gotoProductsWithCatFilter(${category.categoryId})" class="marleft5 hover">[${category.products} Products]</span>`;
                }
                str += `</label>${getChildItems}</li>`;
            }
        });
        return parentCatId > 0 && str ? `<ul>${str}</ul>` : str;
    }

    parent.initProductCategoryEntry = async function (response) {
		try{
			appCommonFunctionality.adjustMainContainerHight('categorySectionHolder');
			await appCommonFunctionality.adminCommonActivity();
		} catch (error) {
            console.error('Error during initProductCategoryEntry:', error);
            appCommonFunctionality.hideLoader();
        }
    };

    parent.addProductCategories = function (parentId = '') {
        window.location.replace(`categoryEntry.php${parentId ? '?parentId=' + parentId : ''}`);
    };

    parent.editProductCategories = function (categoryId) {
        window.location.replace('categoryEntry.php?categoryId=' + categoryId);
    };

    parent.deleteProductCategories = function (categoryId) {
        if (confirm("Are you sure to delete this Product Categories?")) {
            window.location.replace('categories.php?ACTION=DELETE&categoryId=' + categoryId);
        }
    };

    parent.validateProductCategoryEntry = function () {
        const category = $("#category").val();
        if (!category) {
            appCommonFunctionality.raiseValidation("category", "Please Enter Product Category Name", true);
            $("#category").focus();
            return false;
        }
        appCommonFunctionality.removeValidation("category", "category", true);
        return true;
    };

    parent.goToProductCategories = function () {
        window.location.replace('categories.php');
    };

    parent.arrangeProducts = function (categoryId) {
        window.location.replace('arrangeProducts.php?categoryId=' + categoryId);
    };

    parent.gotoProductsWithCatFilter = function (categoryId) {
        window.location.replace('product.php?categoryId=' + categoryId);
    };

    return parent;
})(window, jQuery);