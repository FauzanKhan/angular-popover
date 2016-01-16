var app = angular.module('popoverApp', ['ngPopover']);

app.controller('masterController', ['$scope', function($scope){
	$scope.message = "Click on any of the above buttons to see the popovers in action"
	$scope.openCallback = function(popoverName){
		console.log("opened "+popoverName);
		$scope.message = "You just opened "+popoverName;
	}

	$scope.closeCallback = function(popoverName){
		console.log("closed "+popoverName)
		$scope.message = "You just closed "+popoverName;
	}
}]);