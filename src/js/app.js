var app = angular.module('popoverApp', ['ngPopover']);

app.controller('masterController', ['$scope', 'ngPopoverFactory', function($scope, ngPopoverFactory){
	$scope.message = "Click on any of the above buttons to see the popovers in action"
	$scope.openCallback = function(popoverName){
		$scope.message = "You just opened "+popoverName;
	}

	$scope.closeCallback = function(popoverName){
		$scope.message = "You just closed "+popoverName;
	};

	$scope.closePopover = function(trigger){
		ngPopoverFactory.closePopover(trigger);
	}
}]);