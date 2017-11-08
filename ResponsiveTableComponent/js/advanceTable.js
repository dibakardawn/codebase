var advanceTable = (function(window, $) {
	ajaxEnable = false;
	data = {};
	
	return {
		dataUrl: '',
		initialize: initialize
	};
	//--------------------------------------Functions-------------------------------------
	function initialize(){
		//alert("initialize" + window.screen.availWidth);
		getData();
		bindWholetable();
		var tHeadCount = ($(".tHead").length);
		var wPercent = ((100/tHeadCount) - responsiveRatio) + "%";
		$(".tHead, .tdClass").width(wPercent);
		$(".tHead").height($(".tHeadRow").height() - 10);
	}
	
	function bindWholetable(){
		var CompleteHTML = "";
		var headerHTML = bindHeader();
		var tablebodyHTML = bindData();
		CompleteHTML = headerHTML + tablebodyHTML;
		$("#table").html(CompleteHTML);
	}
	
	function bindHeader(){
		var headerStr = "<div class='tHeadRow'>";
		for(var i = 0; i < data.headerData.length; i++){
			headerStr = headerStr + "<div class='tHead'>";
			headerStr = headerStr + "<div class='columnNameHolder'>" + data.headerData[i].display + "</div>";
			if(data.headerData[i].enableSearch){
				headerStr = headerStr + "<div class='searchBoxHolder'><input type='text' class='searchBox' name='" + data.headerData[i].id + "' id='" + data.headerData[i].id + "' value=''></div>";
			}
			if(data.headerData[i].enableSort){
				headerStr = headerStr + "<div class='searchBoxHolder'>";
					headerStr = headerStr + "<select id='" + data.headerData[i].id + "' name='" + data.headerData[i].id + "' class='searchDDL'>";
						headerStr = headerStr + "<option value=''>" + data.sortByText + data.headerData[i].display + "</option>";
						for(var j = 0; j < (data.userData.length - 1); j++){
							headerStr = headerStr + "<option value='" + data.userData[j][data.headerData[i].id] + "'>" + data.userData[j][data.headerData[i].id] + "</option>";
						}
					headerStr = headerStr + "</select>";
				headerStr = headerStr + "</div>";
			}
			headerStr = headerStr + "</div>";
		}
		if(data.headerActionEnable){
			headerStr = headerStr + "<div class='tHead'>";
			headerStr = headerStr + "<div class='columnNameHolder'>" + data.ActionText+ "</div>";
			headerStr = headerStr + "</div>";
		}
		headerStr = headerStr + "</div>";
		return headerStr;
	}
	
	function bindData(){
		var tablebody = "";
		for(var i = 0; i < data.userData.length; i++){
			if (i % 2 === 0) {
				tablebody  = tablebody + "<div id='tRow_" + data.userData[i].ID + "' class='tRow even'>";
			}else{
				tablebody  = tablebody + "<div id='tRow_" + data.userData[i].ID + "' class='tRow odd'>";
			}
			for(var j = 0; j < Object.keys(data.userData[i]).length; j++){
				for(var k = 0; k < data.headerData.length; k++){
					if(Object.keys(data.userData[i])[j] === data.headerData[k].id){
						var propName  = data.headerData[k].id;
						tablebody  = tablebody + "<div class='tdClass'>" + (data.userData[i])[propName] + "</div>";
					}
				}
			}
			if(data.headerActionEnable){
				tablebody = tablebody + "<div class='tdClass'>";
				tablebody = tablebody + "<div class='editSection' onclick='editRecord(" + data.userData[i].ID + ")'>.</div>";
				tablebody = tablebody + "<div class='deleteSection' onclick='deleteRecord(" + data.userData[i].ID + ")'>.</div>";
				tablebody = tablebody + "</div>";
			}
			tablebody  = tablebody + "</div>";
		}
		return tablebody;
	}
	
	function bindPagination(){
		
	}
	
	function getData(){
		if(ajaxEnable){
		var dataObj = {};
		$.ajax({
				url: advanceTable.dataUrl,
				type: 'post',
				data : dataObj,
				async: true,
				success: function (data) {
					//alert(data);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					//alert(JSON.stringify(jqXHR));
				}
			});
		}else{
			data = {
						"headerData":[
										{"id":"firstName", "display":"First Name", "enableSearch":true, "enableSort":true},
										{"id":"middleName", "display":'Middle Name', "enableSearch":true, "enableSort":true},
										{"id":"lastName", "display":'Last Name', "enableSearch":true, "enableSort":true},
										{"id":"email", "display":'Email Id', "enableSearch":true, "enableSort":true},
										{"id":"phno", "display":'Phone', "enableSearch":true, "enableSort":true},
										{"id":"PAN", "display":'PAN', "enableSearch":true, "enableSort":true},
										{"id":"PASSPORT", "display":'Passport', "enableSearch":true, "enableSort":true},
									],
						"userData":[
										{"ID":"1","firstName":"Dibakar", "middleName":"Kumar", "lastName":"Dawn", "email":"dibakardawn@gmail.com","phno":"9681090303","PAN":"BBJPD568", "PASSPORT":"JHG76547"},
										{"ID":"2","firstName":"Somak", "middleName":"Kumar", "lastName":"Das", "email":"dibakardawn@gmail.com","phno":"9681090303","PAN":"BBJPD568", "PASSPORT":"JHG76547"},
										{"ID":"3","firstName":"Vikram", "middleName":"Kumar", "lastName":"Saha", "email":"dibakardawn@gmail.com","phno":"9681090303","PAN":"BBJPD568", "PASSPORT":"JHG76547"},
										{"ID":"4","firstName":"Saroj", "middleName":"Kumar", "lastName":"Darbar", "email":"dibakardawn@gmail.com","phno":"9681090303","PAN":"BBJPD568", "PASSPORT":"JHG76547"},
										{"ID":"5","firstName":"Subha", "middleName":"Kumar", "lastName":"Dutta", "email":"dibakardawn@gmail.com","phno":"9681090303","PAN":"BBJPD568", "PASSPORT":"JHG76547"},
										{"ID":"6","firstName":"Ashok", "middleName":"Kumar", "lastName":"Mallik", "email":"dibakardawn@gmail.com","phno":"9681090303","PAN":"BBJPD568", "PASSPORT":"JHG76547"},
										{"ID":"7","firstName":"Suhas", "middleName":"Kumar", "lastName":"Chakronorty", "email":"dibakardawn@gmail.com","phno":"9681090303","PAN":"BBJPD568", "PASSPORT":"JHG76547"}
									],
						"headerActionEnable" : true,
						"sortByText" : "Sort By ",
						"ActionText" : "Action",
						"editUrl" : "edit.aspx",
						"deleteUrl" : "delete.aspx",
						"noOfRecordPerPage":3,
						"firstLastEnable":true,
						"prevNextEnable":true
					};
		}
	}
	//--------------------------------------Functions-------------------------------------
}(window, window.jQuery));