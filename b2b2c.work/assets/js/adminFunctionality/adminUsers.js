const MENUSELECTIONITEM = "adminUsers.php";
const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~<>?";
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/*-----------------Commonly Used Variables--------------------------------*/
let USERROLES = [];
let ADMINMENUDATA = [];
/*-----------------Commonly Used Variables--------------------------------*/

const PAGEDOCNAME = appCommonFunctionality.getPageName();

$(document).ready(function(){
	
	/*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function () {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
	switch (PAGEDOCNAME) {
		
        case "adminUsers.php":{
			adminUsersFunctionality.initAdminUser();
            break;
		}
		
		case "adminUserEntry.php":{
			adminUsersFunctionality.initAdminUserEntry();
            break;
		}
		
		case "adminUserDetails.php":{
			adminUsersFunctionality.initAdminUserDetails();
            break;
		}
    }
	
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const adminUsersFunctionality = (function (window, $) {
	const parent = {};
	
	parent.initAdminUser = async function (){
		appCommonFunctionality.adjustMainContainerHight('adminUserSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
	};
	
	parent.addUser = function(){
		window.location = `adminUserEntry.php`;
	};
	
	parent.editUser = function(userId){
		window.location = `adminUserEntry.php?userId=` + userId;
	};
	
	parent.deleteUser = function(userId){
		window.location = `adminUsers.php?ACTION=DELETE&userId=` + userId;
	};
	
	parent.initAdminUserEntry = async function (){
		await appCommonFunctionality.adminCommonActivity();
		USERROLES = JSON.parse($("#userRoleSerializedData").val());
		populateUserRoleDropdown();
		ADMINMENUDATA = reArrangeAdminMenuForTreeView();
		populateMenuTree();
		appCommonFunctionality.adjustMainContainerHight('adminUserSectionHolder'); //placed it after the tree view purposefully
		if(appCommonFunctionality.isMobile()){
			$('#userInputPanel, #userRoleDDLHolder, #userFirstNameHolder, #userPhnoHolder, #passwordHolder').removeClass('noLeftPaddingOnly').addClass('noPaddingOnly');
		}
	};
	
	const populateUserRoleDropdown = function() {
		const $dropdown = $('#userRoleDDL');
		const selectedRoleId = $('#userRoleid').val();
		// Clear existing options (except the first one)
		$dropdown.find('option:gt(0)').remove();
		$.each(USERROLES, function(index, role) {
			$dropdown.append(
				$('<option>', {
					value: role.userRoleid,
					text: role.userRole,
					selected: (role.userRoleid == selectedRoleId)
				})
			);
		});
	};
	
	parent.onChangeUserRole = function(){
		const selectedRoleId = $('#userRoleDDL').val();
        if (!selectedRoleId) return;
        const selectedRole = USERROLES.find(role => role.userRoleid === selectedRoleId);
        if (!selectedRole) return;
        const permissions = selectedRole.rolePermissions 
            ? selectedRole.rolePermissions.split(',').map(Number) 
            : [];
        $('#treeview input[type="checkbox"]').each(function() {
            const menuId = parseInt($(this).val());
            const isChecked = permissions.includes(menuId);
            $(this).prop('checked', isChecked);
            if (isChecked) {
                $(this).closest('li').find('> input[type="checkbox"]').prop('checked', true);
            }
        });
	};
	
	const reArrangeAdminMenuForTreeView = function() {
		const data = JSON.parse($("#adminMenuSerializedData").val());
		const map = {};
		const roots = [];
		data.forEach(item => {
			item.menuId = parseInt(item.menuId);
			item.menuParentId = parseInt(item.menuParentId);
			item.menuIndex = parseInt(item.menuIndex);
			item.children = [];
			map[item.menuId] = item;
		});
		data.forEach(item => {
			if (item.menuParentId === 0) {
				roots.push(item);
			} else {
				if (map[item.menuParentId]) {
					map[item.menuParentId].children.push(item);
				}
			}
		});
		function sortTree(nodes) {
			nodes.sort((a, b) => a.menuIndex - b.menuIndex);
			nodes.forEach(node => {
				if (node.children && node.children.length > 0) {
					sortTree(node.children);
				}
			});
		}
		sortTree(roots);
		return roots;
	};
	
	const populateMenuTree = function () {
		const str = makeMenuTreeItem(ADMINMENUDATA, 0);
		$("#treeview").html(str).hummingbird();
		const permissions = $('#permissions').val()?.split(',') || [];
		const userRoleid = parseInt($('#userRoleid').val());
		const loginUserRoleid = parseInt($('#loginUserRoleid').val());
		if (PAGEDOCNAME === "adminUserEntry.php") {
			if(userRoleid > loginUserRoleid){
				permissions.forEach(menuId => {
					const trimmedId = menuId.trim();
					if (trimmedId) $(`#adminMenu_${trimmedId}`).prop('checked', true);
				});
			}else{
				permissions.forEach(menuId => {
					const trimmedId = menuId.trim();
					if (trimmedId) {
						$(`#adminMenu_${trimmedId}`).next('span.marleft5')
							.html(function() {
								const menuText = $(this).text().trim();
								return menuText + ' <i class="fa fa-check greenText"></i>';
							});
					}
				});
			}
		}else if (PAGEDOCNAME === "adminUserDetails.php") {
			permissions.forEach(menuId => {
				const trimmedId = menuId.trim();
				if (trimmedId) {
					$(`#adminMenu_${trimmedId}`).next('span.marleft5')
						.html(function() {
							const menuText = $(this).text().trim();
							return menuText + ' <i class="fa fa-check greenText"></i>';
						});
				}
			});
		}
		$('.fa-plus').click();
	};

	const makeMenuTreeItem = function (menuData, parentMenuId) {
		let str = '';
		const isEntryPage = (PAGEDOCNAME === "adminUserEntry.php");
		const userRoleid = parseInt($('#userRoleid').val());
		const loginUserRoleid = parseInt($('#loginUserRoleid').val());
		const showCheckboxes = isEntryPage && (userRoleid > loginUserRoleid);
		menuData.filter(item => parseInt(item.menuParentId) === parseInt(parentMenuId))
			.forEach(item => {
				const hasChildren = item.children && item.children.length > 0;
				str += `<li data-id="${item.menuId}">
					${hasChildren ? '<i class="fa fa-plus"></i>' : '<i class="fa fa-plus lightGreyText" style="visibility:hidden;"></i>'}
					<label class="marleft5">
						<span class="marleft5"><i class="fa ${item.bootstrapIcon}"></i></span>
						<input type="checkbox" id="adminMenu_${item.menuId}" name="adminMenu_${item.menuId}" value="${item.menuId}" 
							   style="${showCheckboxes ? '' : 'display:none;'}">
						<span class="marleft5">${item.menuName}</span>
					</label>
					${hasChildren ? `<ul>${makeMenuTreeItem(item.children, item.menuId)}</ul>` : ''}
				</li>`;
			});
		return str;
	};
	
	parent.checkAdminUserEmailExists = function(){
		var userEmail = $("#userEmail").val();
		appCommonFunctionality.ajaxCall('CHECKADMINUSEREMAILEXISTS&email=' + userEmail, showEmailStatus);
	};
	
	const showEmailStatus = function(data){
		var data = JSON.parse(data);
		$("#userEmailInfoIcon, #userEmailOkIcon, #userEmailCrossIcon").addClass('hide');
		if(parseInt(data.responseCode) === 0){
			$("#userEmailCrossIcon").removeClass('hide');
		}else if(parseInt(data.responseCode) === 1){
			$("#userEmailOkIcon").removeClass('hide');
			appCommonFunctionality.removeValidation("userEmail", "userEmail", false);
		}
	};
	
	parent.generateArbiteryEmail = function() {
        $("#userEmail").val(`${SITETITLE}-customer.${Date.now()}@gmail.com`).focus();
    };
	
	parent.checkUsernameExists = function(){
		var username = $("#username").val();
		appCommonFunctionality.ajaxCall('CHECKADMINUSERUSERNAMEEXISTS&username=' + username, showUsernameStatus);
	};
	
	const showUsernameStatus = function(data){
		var data = JSON.parse(data);
		$("#usernameInfoIcon, #usernameOkIcon, #usernameCrossIcon").addClass('hide');
		if(parseInt(data.responseCode) === 0){
			$("#usernameCrossIcon").removeClass('hide');
		}else if(parseInt(data.responseCode) === 1){
			$("#usernameOkIcon").removeClass('hide');
			appCommonFunctionality.removeValidation("userEmail", "userEmail", false);
		}
	};
	
	parent.generateArbiteryUsername = function(){
		appCommonFunctionality.ajaxCall('GENERATERANDOMUSERNAME', updateGeneratedUsername);
	};
	
	updateGeneratedUsername = function(data){
		data = JSON.parse(data);
		if(parseInt(data.responseCode)){
			$('#username').val(data.msg);
		}
	}
	
	parent.generatePassword = function(length = 16){
		let pass = "";
		for (let i = 0; i < length; i++) {
		  pass += charset[Math.floor(Math.random() * charset.length)];
		}
		$('#password').val(pass);
		$('#password').trigger('keyup');
	};
	
	parent.checkPasswordStrength = function(){
		let password = $('#password').val();
		const strength = evaluatePasswordStrength(password);
		$("#strengthBar").css({ width: strength.width, backgroundColor: strength.color });
	};
	
	const evaluatePasswordStrength = function(password){
		let score = 0;
		if (password.length >= 8) score++;
		if (password.length >= 12) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^a-zA-Z0-9]/.test(password)) score++;

		let width = score * 20;
		let color = "red";

		switch (score) {
		  case 1: color = "#ff4d4d"; break;       // Red
		  case 2: color = "#ff944d"; break;       // Light Orange
		  case 3: color = "#ffd11a"; break;       // Yellow
		  case 4: color = "#b3ff66"; break;       // Light Green
		  case 5: color = "#33cc33"; break;       // Green
		}

		return { width: width + "%", color: color };
	};
	
	parent.copyPassword = async function() {
		const password = $('#password').val();
		if (!password) {
			appCommonFunctionality.showPromptMsg(appCommonFunctionality.getCmsString(806));
			return;
		}

		try {
			if (navigator.clipboard) {
				await navigator.clipboard.writeText(password);
				appCommonFunctionality.showPromptMsg(appCommonFunctionality.getCmsString(807));
			} else {
				// Fallback for browsers without Clipboard API
				const textarea = document.createElement('textarea');
				textarea.value = password;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
				appCommonFunctionality.showPromptMsg(appCommonFunctionality.getCmsString(807));
			}
		} catch (err) {
			console.error('Failed to copy:', err);
			appCommonFunctionality.showPromptMsg(appCommonFunctionality.getCmsString(808));
		}
	};
	
	parent.validateAdminUserEntryForm = function(){
		let errorCount = 0;
		
		/*----------------------------------------User Role Validation----------------------------------------*/
		let userRoleDDL = parseInt($("#userRoleDDL").val()) || 0;
		if(userRoleDDL === 0){
		   appCommonFunctionality.raiseValidation("userRoleDDL", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("userRoleDDL", "userRoleDDL", true);
		}
		/*----------------------------------------User Role Validation----------------------------------------*/
		
		/*----------------------------------------User Firstname Validation-----------------------------------*/
		let userFirstName = $("#userFirstName").val() || "";
		if(userFirstName === ""){
		   appCommonFunctionality.raiseValidation("userFirstName", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("userFirstName", "userFirstName", true);
		}
		/*----------------------------------------User Firstname Validation-----------------------------------*/
		
		/*----------------------------------------User Lastname Validation------------------------------------*/
		let userLastName = $("#userLastName").val() || "";
		if(userLastName === ""){
		   appCommonFunctionality.raiseValidation("userLastName", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("userLastName", "userLastName", true);
		}
		/*----------------------------------------User Lastname Validation------------------------------------*/
		
		/*----------------------------------------User Phone Validation---------------------------------------*/
		let userPhno = $("#userPhno").val() || "";
		if(userPhno === ""){
		   appCommonFunctionality.raiseValidation("userPhno", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("userPhno", "userPhno", true);
		}
		/*----------------------------------------User Phone Validation---------------------------------------*/
		
		/*----------------------------------------User Email Validation---------------------------------------*/
		let userEmail = $("#userEmail").val() || "";
		if(userEmail === ""){
		   appCommonFunctionality.raiseValidation("userEmail", "", true);
		   errorCount++
		}else if (emailRegex && !emailRegex.test(userEmail)){
		   appCommonFunctionality.raiseValidation("userEmail", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("userEmail", "userEmail", true);
		}
		/*----------------------------------------User Email Validation---------------------------------------*/
		
		/*----------------------------------------Username Validation-----------------------------------------*/
		let username = $("#username").val() || "";
		if(username === ""){
		   appCommonFunctionality.raiseValidation("username", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("username", "username", true);
		}
		/*----------------------------------------Username Validation-----------------------------------------*/
		
		/*----------------------------------------Password Validation-----------------------------------------*/
		let password = $("#password").val() || "";
		if(password === ""){
		   appCommonFunctionality.raiseValidation("password", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("password", "password", true);
		}
		/*----------------------------------------Password Validation-----------------------------------------*/
		
		/*----------------------------------------Permission Validation---------------------------------------*/
		let permissions = $('input[type="checkbox"][id^="adminMenu_"]:checked')
				.map(function() {
					return $(this).val(); // Returns the "value" of checked checkboxes
				})
				.get();
				
		if(permissions.length === 0){
		   alert(appCommonFunctionality.getCmsString(809));
		   errorCount++
		}else{
			$('#permissions').val(permissions.join(','));
		}
		/*----------------------------------------Permission Validation---------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};

	parent.goToUserDetail = function(userId){
		window.location = `adminUserDetails.php?userId=` + userId;
	};
	
	parent.initAdminUserDetails = async function (){
		await appCommonFunctionality.adminCommonActivity();
		USERROLES = JSON.parse($("#userRoleSerializedData").val());
		ADMINMENUDATA = reArrangeAdminMenuForTreeView();
		populateMenuTree();
		appCommonFunctionality.adjustMainContainerHight('adminUserSectionHolder'); //placed it after the tree view purposefully
	};
	
	parent.gotoAdminUsers = function(){
		window.location = `adminUsers.php`;
	};
	
	return parent;
})(window, jQuery);