calenderNS = (function (window, $) {
	
	parent.LANG = "EN",
	parent.INPUTID = "",
	parent.CALENDERCLASS = "calender",
	parent.CALENDERHEADERCLASS = "calenderHeader",
	parent.CALENDERPREVCLASS = "calenderPrev",
	parent.CALENDERNEXTCLASS = "calenderNext",
	parent.CALENDERMONTHDDL = "calenderMonthDDL",
	parent.CALENDERYEARDDL = "calenderYearDDL",
	parent.CALENDERBODYCLASS = "calenderBody",
	parent.CALENDERWEEKDAYSHEADER = "calenderWeekdayHeader",
	parent.CALENDERNONDAYS = "calendeNonDays",
	parent.CALENDERDAYS = "calendeDays",
	parent.CALENDERSELECTEDDAY = "calenderSelectedDay",
	parent.TODAYDATE = "todayDate",
	parent.CALENDERSTARTYR = 1899,
	parent.CALENDERFROMTYR = 2022,
	parent.CALMAXROW = 7,
	parent.DATEFORMATE = "DD/MM/YYYY",
	parent.PREVNEXTBTN = {"NEXT" : ">>", "PREV" : "<<"},
	ALLOWCHARCODES = [48,49,50,51,52,53,54,55,56,57];
	ALLOWSPLCHARCODES = [32,45,47,58];
	DELIMETER = "";

	parent.calenderData = {
		"month": {
			"EN": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			"ES": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
		},
		"weekDays": {
			"EN": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			"ES": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
		},
		"CalTemplate": {
			"A": 0,
			"B": 1,
			"C": 2,
			"D": 3,
			"E": 4,
			"F": 5,
			"G": 6
		},
		"monthColTrx": {
			1: ["A","A","B","B","C","C","D","D","E","E","F","F","G","G"],
			2: ["D","D","E","E","F","F","G","G","A","A","B","B","C","C"],
			3: ["D","E","E","F","F","G","G","A","A","B","B","C","C","D"],
			4: ["G","A","A","B","B","C","C","D","D","E","E","F","F","G"],
			5: ["B","C","C","D","D","E","E","F","F","G","G","A","A","B"],
			6: ["E","F","F","G","G","A","A","B","B","C","C","D","D","E"],
			7: ["G","A","A","B","B","C","C","D","D","E","E","F","F","G"],
			8: ["C","D","D","E","E","F","F","G","G","A","A","B","B","C"],
			9: ["F","G","G","A","A","B","B","C","C","D","D","E","E","F"],
			10: ["A","B","B","C","C","D","D","E","E","F","F","G","G","A"],
			11: ["D","E","E","F","F","G","G","A","A","B","B","C","C","D"],
			12: ["F","G","G","A","A","B","B","C","C","D","D","E","E","F"]
		},
		"colYearTrx": {
			1: [1899, 1905, 1911, 1922, 1933, 1939, 1950, 1961, 1967, 1978, 1989, 1995, 2006, 2017],
			2: [1928, 1956, 1984, 2012],
			3: [1900, 1906, 1917, 1923, 1934, 1945, 1951, 1962, 1973, 1973, 1979, 1990, 2001, 2007, 2018],
			4: [1912, 1940, 1968, 1996],
			5: [1901, 1907, 1918, 1929, 1935, 1946, 1957, 1963, 1974, 1985, 1991, 2002, 2013, 2019],
			6: [1924, 1952, 1980, 2008],
			7: [1902, 1913, 1919, 1930, 1941, 1947, 1958, 1969, 1975, 1986, 1997, 2003, 2014],
			8: [1908, 1936, 1964, 1992, 2020],
			9: [1903, 1914, 1925, 1931, 1942, 1953, 1959, 1970, 1981, 1987, 1998, 2009, 2015],
			10: [1920, 1948, 1976, 2004],
			11: [1909, 1915, 1926, 1937, 1943, 1954, 1965, 1971, 1982, 1993, 1999, 2010, 2021],
			12: [1904, 1932, 1960, 1988, 2016],
			13: [1910, 1921, 1927, 1938, 1949, 1955, 1966, 1977, 1983, 1994, 2005, 2011, 2022],
			14: [1916, 1944, 1972, 2000]
		}
	},
							
	parent.initialize = function (id) {
		$(id).on('focus', function(e){
			appendCalenderContainer(id);
		}).on('keypress', function(e){
			e = (e) ? e : window.event;
			var charCode = (e.which) ? e.which : e.keyCode;
			if (ALLOWCHARCODES.indexOf(charCode) === -1 && ALLOWSPLCHARCODES.indexOf(charCode) === -1) {
				return false;
			}
			return true;
		});
		
		$(document).on('click', function(e){
			var clickedelement = e.target.id;
			if(clickedelement === ""){
				$(id + "_calender").remove();
			}else if((id !== "#" + clickedelement) && ($(id + "_calender").find("#" + clickedelement).length === 0)){
				$(id + "_calender").remove();
			}
		});
	},
	
	appendCalenderContainer = function (id) {
		getDelemeterFromString(DATEFORMATE);
		id = id.replace("#", "");
		INPUTID = id;
		if($("#" + id + "_calender").length === 0){
			var todayeDate = new Date();
			var thisYear = todayeDate.getFullYear();
			var thisMonth = todayeDate.getMonth() + 1;
			var daysinaMonth = daysInMonth(thisMonth,thisYear);
			var top = modifyCalenderPosition(id, "TOP");
			var left = modifyCalenderPosition(id, "LEFT");
			top = top + $(id).height() + 5;
			/*xxxx*/
			var predate = $("#" + INPUTID).val();
			if(predate !== "" && predate.indexOf(DELIMETER) > -1){
				predate = predate.split(DELIMETER);
				thisMonth = parseInt(predate[1]);
				thisYear = parseInt(predate[2]);
				daysinaMonth = daysInMonth(thisMonth,thisYear);
			}
			/*xxxx*/
			$("#" + id).after("<div id='" + id + "_calender' class='" + CALENDERCLASS + "' style='top:" + top + "px; left:" + left + "px;'>" + createCalenderHeader(thisYear, thisMonth, daysinaMonth) + createCalenderBody(thisYear, thisMonth, daysinaMonth) +"</div>");
			makeDateSelected();
		}
	},
	
	modifyCalenderPosition = function (id, direction) {
		var idObj = $("#" + id); 
		var offsetVal = idObj.offset();
		var ret = 0;
		switch(direction) {
			case "TOP":
				ret = offsetVal.top;
				break;
			case "BOTTOM":
				ret = offsetVal.bottom;
				break;
			case "LEFT":
				ret = offsetVal.left;
				break;
			case "RIGHT":
				ret = offsetVal.right;
				break;
			default:
				ret = 0;
		}
		return ret;
	},
	
	createCalenderHeader = function (thisYear, thisMonth, daysinaMonth) {
		thisMonth = thisMonth - 1;
		var CalenderHeaderHTML = "<div id='" + CALENDERHEADERCLASS + "' class='" + CALENDERHEADERCLASS + "'>";
		CalenderHeaderHTML = CalenderHeaderHTML + "<div id='" + CALENDERPREVCLASS + "' class='" + CALENDERPREVCLASS + "' onClick=\"prevNextMonth('PREV');\">" + PREVNEXTBTN.PREV + "</div>";
		CalenderHeaderHTML = CalenderHeaderHTML + "<select id='monthDDL' class='" + CALENDERMONTHDDL + "' onChange='monthYearChange()'>";
		for(var i = 0; i < calenderData.month[LANG].length; i++){
			if(i === thisMonth){
				CalenderHeaderHTML = CalenderHeaderHTML + "<option value='" + (i + 1) + "' selected='selected'>" + calenderData.month[LANG][i] + "</option>";
			}else{
				CalenderHeaderHTML = CalenderHeaderHTML + "<option value='" + (i + 1) + "'>" + calenderData.month[LANG][i] + "</option>";
			}
		}
		CalenderHeaderHTML = CalenderHeaderHTML + "</select>";
		CalenderHeaderHTML = CalenderHeaderHTML + "<select id='yearDDL' class='" + CALENDERYEARDDL + "' onChange='monthYearChange()'>";
		for(var i = CALENDERSTARTYR; i <= CALENDERFROMTYR; i++){
			if(i === thisYear){
				CalenderHeaderHTML = CalenderHeaderHTML + "<option value='" + i + "' selected='selected'>" + i + "</option>";
			}else{
				CalenderHeaderHTML = CalenderHeaderHTML + "<option value='" + i + "'>" + i + "</option>";
			}
		}
		CalenderHeaderHTML = CalenderHeaderHTML + "</select>";
		CalenderHeaderHTML = CalenderHeaderHTML + "<div id='" + CALENDERNEXTCLASS + "' class='" + CALENDERNEXTCLASS + "' onClick=\"prevNextMonth('NEXT');\">" + PREVNEXTBTN.NEXT + "</div>";
		CalenderHeaderHTML = CalenderHeaderHTML + "</div>"
		return CalenderHeaderHTML;
	},
	
	createCalenderBody = function (thisYear, thisMonth, daysinaMonth) {
		var colNumber  = detectColNumber(thisYear);
		var templateM = prepMonthTemplate(thisMonth,colNumber);
		var temPos = parent.calenderData.CalTemplate[templateM];
		var count = 1;
		
		var CalenderBodyHTML = "<table id='" + CALENDERBODYCLASS + "' class='" + CALENDERBODYCLASS + "'>";
		for(var i = 0; i < calenderData.weekDays[LANG].length; i++){
			CalenderBodyHTML = CalenderBodyHTML + "<tr>";
			for(var j = 0; j < CALMAXROW; j++){
				if(i === 0){
					CalenderBodyHTML = CalenderBodyHTML + "<td id='" + CALENDERWEEKDAYSHEADER + "_" + i + "_" + j + "' class='" + CALENDERWEEKDAYSHEADER + "'>" + calenderData.weekDays[LANG][j] + "</td>";
				}else if(i === 1 && j < temPos){
					CalenderBodyHTML = CalenderBodyHTML + "<td id='" + CALENDERNONDAYS + "_" + i + "_" + j + "' class='" + CALENDERNONDAYS + "'> </td>";
				}else{
					if(count <= daysinaMonth){
						
						CalenderBodyHTML = CalenderBodyHTML + "<td id='" + CALENDERDAYS + "_" + count + "' class='" + CALENDERDAYS + "' onClick=\"selectDate(" + count + ", this);\">" + count + "</td>";
					}
					count++;
				}
			}
			CalenderBodyHTML = CalenderBodyHTML + "</tr>";
		}
		CalenderBodyHTML = CalenderBodyHTML + "</table>";
		return CalenderBodyHTML;
	},
	
	prevNextMonth = function (action) {
		$("." + CALENDERBODYCLASS).remove();
		var Y = M = 0;
		if(action === "PREV"){
			if(parseInt($("#" + INPUTID + "_calender").find("#monthDDL").val()) === 1){
				M = 12;
				Y = parseInt($("#" + INPUTID + "_calender").find("#yearDDL").val()) - 1;
			}else{
				Y = parseInt($("#" + INPUTID + "_calender").find("#yearDDL").val());
				M = parseInt($("#" + INPUTID + "_calender").find("#monthDDL").val()) - 1;
			}
		}else if(action === "NEXT"){
			if(parseInt($("#" + INPUTID + "_calender").find("#monthDDL").val()) === 12){
				M = 1;
				Y = parseInt($("#" + INPUTID + "_calender").find("#yearDDL").val()) + 1;
			}else{
				Y = parseInt($("#" + INPUTID + "_calender").find("#yearDDL").val());
				M = parseInt($("#" + INPUTID + "_calender").find("#monthDDL").val()) + 1;
			}
		}
		$("#" + INPUTID + "_calender").find("#yearDDL").val(Y);
		$("#" + INPUTID + "_calender").find("#monthDDL").val(M);
		var calBody = createCalenderBody(Y, M, daysInMonth(M,Y));
		$("." + CALENDERHEADERCLASS).after(calBody);
		makeDateSelected();
	},
	
	selectDate = function (d, self) {
		var date = recogniseDate(d);
		var calenderInputBoxId = self.parentElement.parentElement.parentElement.parentElement.attributes.id.value.replace("_calender", "");
		$("#" + calenderInputBoxId).val(date);
		$("#" + calenderInputBoxId + "_calender").remove();
	},
	
	recogniseDate = function(d){
		var date = DATEFORMATE;
		var M = parseInt($("#" + INPUTID + "_calender").find("#monthDDL").val());
		var Y = parseInt($("#" + INPUTID + "_calender").find("#yearDDL").val());
		if(d < 10){
			date = date.replace("DD", "0" + d);
		}else{
			date = date.replace("DD", d);
		}
		if(M < 10){
			date = date.replace("MM", "0" + M);
		}else{
			date = date.replace("MM", M);
		}
		date = date.replace("YYYY", Y);
		return date;
	},
	
	makeDateSelected = function(){
		var todayeDate = new Date();
		var thisYear = todayeDate.getFullYear();
		var thisMonth = todayeDate.getMonth() + 1;
		var thisDay = todayeDate.getDate();
		var M = parseInt($("#" + INPUTID + "_calender").find("#monthDDL").val());
		var Y = parseInt($("#" + INPUTID + "_calender").find("#yearDDL").val());
		var predate = $("#" + INPUTID).val();
		/*xxxx*/
		if(predate !== "" && predate.indexOf(DELIMETER) > -1){
			predate = predate.split(DELIMETER);
			if(M === parseInt(predate[1]) && Y === parseInt(predate[2])){
				$("#" + INPUTID + "_calender").find("#" + CALENDERDAYS + "_" + parseInt(predate[0])).addClass(CALENDERSELECTEDDAY);
			}
		}
		/*xxxx*/
		if(M === thisMonth && Y === thisYear){
			$("#" + INPUTID + "_calender").find("#" + CALENDERDAYS + "_" + parseInt(thisDay)).addClass(TODAYDATE);
		}
	},
	
	monthYearChange = function () {
		$("." + CALENDERBODYCLASS).remove();
		var Y = parseInt($("#" + INPUTID + "_calender").find("#yearDDL").val());
		var M = parseInt($("#" + INPUTID + "_calender").find("#monthDDL").val());
		var calBody = createCalenderBody(Y, M, daysInMonth(M,Y));
		$("." + CALENDERHEADERCLASS).after(calBody);
		makeDateSelected();
	},
	
	detectColNumber = function (thisYear) {
		var col = 0;
		for(var i = 0; i < ObjectLength(calenderData.colYearTrx); i++){
			var t = $.inArray(thisYear, calenderData.colYearTrx[i]);
			if(t !== -1 && t > 0){
				col = i;
			}
		}
		return col;
	},
	
	prepMonthTemplate = function (thisMonth,colNumber) {
		var monthTemplate = "";
		var monthTemplateArr = calenderData.monthColTrx[thisMonth];
		monthTemplate = monthTemplateArr[colNumber - 1];
		return monthTemplate;
	},
	
	daysInMonth = function(month,year) {
		return new Date(year, month, 0).getDate();
	},
	
	getDelemeterFromString= function(str){
		for(var i = 0; i < str.length; i++){
			 if (ALLOWSPLCHARCODES.indexOf(str.charCodeAt(i)) > 0) {
				 DELIMETER = String.fromCharCode(str.charCodeAt(i));
			 }
		}
	},
	
	ObjectLength= function(object){
		var length = 0;
		for( var key in object ) {
			if( object.hasOwnProperty(key) ) {
				++length;
			}
		}
		return length;
	}
	
	return parent;
}(window, window.jQuery));