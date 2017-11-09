angular.module("cartModule", []).controller("mainController", function ($scope){
	// Initialization
	$scope.products = [
		{productId: 1, productName: "Product 1", productImage: "Product1.png", productPrice: 1000},
		{productId: 2, productName: "Product 2", productImage: "Product2.png", productPrice: 2000},
		{productId: 3, productName: "Product 3", productImage: "Product3.png", productPrice: 3000},
		{productId: 4, productName: "Product 4", productImage: "Product4.png", productPrice: 4000},
		{productId: 5, productName: "Product 5", productImage: "Product5.png", productPrice: 5000},
		{productId: 6, productName: "Product 6", productImage: "Product6.png", productPrice: 6000},
		{productId: 7, productName: "Product 7", productImage: "Product7.png", productPrice: 7000},
		{productId: 8, productName: "Product 8", productImage: "Product8.png", productPrice: 8000}
	];

	$scope.cart = [];
	$scope.totalPrice = 0;
	$scope.cartDiv = "cartDiv";
	$("#" + $scope.cartDiv).hide();

	// Utility functions
	$scope.addToCart = function (productvId) {
		//alert(productvId);
		var flag = true;
		for (var i = 0; i < $scope.cart.length; i++){
			if($scope.cart[i].productId === productvId){
				$scope.cart[i].count = $scope.cart[i].count + 1;
				flag = false;
			}
		}
		if(flag){
			var item = {};
			for (var i = 0; i < $scope.products.length; i++){
				if($scope.products[i].productId === productvId){
					item.productId = $scope.products[i].productId;
					item.productImage = $scope.products[i].productImage;
					item.productPrice = $scope.products[i].productPrice;
					item.subTotalPrice = $scope.products[i].productPrice;
					item.count = 1;
				}
			}
			$scope.cart.push(item);
		}
		$scope.updateCart();
		$('html,body').animate({scrollTop: $("#" + $scope.cartDiv).offset().top},'slow');
	};
	
	$scope.deleteFromCart = function (productvId) {
		//alert(productvId);
		for (var i = 0; i < $scope.cart.length; i++){
			if($scope.cart[i].productId === productvId){
				$scope.cart.splice(i, 1);
			}
		}
		$scope.updateCart();
	};
	
	$scope.updateIndvProdCount = function (productvId) {
		var countv = $("#pCount" + productvId).val();
		//alert("productvId : " + productvId + "; countv : " + countv);
		if(isNaN(countv) || countv === ""){
			alert("Invalid Number !!!");
		}else {
			for (var i = 0; i < $scope.cart.length; i++){
				if($scope.cart[i].productId === productvId){
					$scope.cart[i].count = countv;
				}
			}
		}
		$scope.updateCart();
	}
	
	$scope.updateCart = function () {
		var totalvPrice = 0;
		for (var i = 0; i < $scope.cart.length; i++){
			$scope.cart[i].subTotalPrice = $scope.cart[i].count * $scope.cart[i].productPrice;
			totalvPrice = totalvPrice + $scope.cart[i].subTotalPrice;
		}
		$scope.totalPrice = totalvPrice;
		if(totalvPrice === 0){
			$("#" + $scope.cartDiv).hide('slow');
		}else{
			$("#" + $scope.cartDiv).show();
		}
	};
});