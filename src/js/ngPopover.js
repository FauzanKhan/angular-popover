var app = angular.module('ngPopover', []);
app.directive('ngPopover', function() {
    return {
        restrict: 'EA',
        scope: {
            direction: '@',
            trigger: '@',
            onClose: '&',
            onOpen: '&',
            popoverClass: '@',
        },
        replace: true,
        transclude: true, // we want to insert custom content inside the directive
        link: function($scope, element, attrs, ctrl) {
            var $document = ctrl.document;
            $scope.show = false;
            $scope.popoverClass = attrs.popoverClass;
            $scope.style = {
                width: attrs.width,
                height: attrs.height
            }
            var left, top;
            var trigger = angular.element('#'+$scope.trigger);
            var target = angular.element('.generic-dropdown[trigger="'+$scope.trigger+'"]');
            $scope.dropDirection = attrs.direction || 'bottom';
            trigger.bind('click', function(ev){
                var left, top;
                var trigger = angular.element('#'+$scope.trigger);
                var target = angular.element('.generic-dropdown[trigger="'+$scope.trigger+'"]');
                ev.preventDefault();
                // ev.stopPropagation();
                calcPopoverPosition(trigger, target);
                angular.element('.generic-dropdown').not('[trigger="'+$scope.trigger+'"]').addClass('hide');
                target.toggleClass('hide');
                if(!target.hasClass('hide')){
                    ctrl.registerBodyListener();
                    $scope.onOpen();
                    $scope.$apply();
                }
                else{
                    ctrl.unregisterBodyListener();
                    $scope.onClose();
                    $scope.$apply();
                }
            });

            target.bind('click', function(e){
                e.stopPropagation();
            });

            var getTriggerOffset = function(){
                return trigger.offset()
            };

            var calcPopoverPosition = function(trigger, target){
                switch($scope.dropDirection){
                    case 'left': {
                        var targetWidth = target.toggleClass('hide').outerWidth();
                        target.toggleClass('hide');
                        left = getTriggerOffset().left - targetWidth - 10 + 'px';
                        top = getTriggerOffset().top + 'px';
                        break;
                    }

                    case 'right':{
                        left = getTriggerOffset().left + trigger.outerWidth() + 10 + 'px';
                        top = getTriggerOffset().top + 'px';
                        break;
                    }

                    case'top':{
                        var targetHeight = target.toggleClass('hide').outerHeight();
                        target.toggleClass('hide');
                        left = getTriggerOffset().left + 'px';
                        top = getTriggerOffset().top - targetHeight - 10 + 'px';
                        break;
                    }

                    default:{
                        left = getTriggerOffset().left +'px';
                        top = getTriggerOffset().top + trigger.outerHeight() + 10 + 'px'
                    }
                }
                target.css({
                    position: 'absolute',
                    left: left,
                    top: top
                });
            }

            calcPopoverPosition(trigger, target);

        },

        controller: ['$scope', function($scope){
            var bodyListenerLogic = function(e){
                var clickedElement = e.target;
                var insideDropdown = false;
                do {
                    if(clickedElement != document && (clickedElement.classList && (clickedElement.classList.contains('generic-dropdown') || clickedElement.classList.contains('ng-popover-trigger')))) {
                        insideDropdown = true;
                        break;
                    }
                } while ((clickedElement = clickedElement.parentNode));
                if(!insideDropdown) {
                    angular.element('.generic-dropdown').addClass('hide');
                    document.body.removeEventListener('click', bodyListenerLogic);
                    $scope.onClose();
                    $scope.$apply();
                }
            }
            this.registerBodyListener = function(){
                document.body.addEventListener('click', bodyListenerLogic);
            }

            this.unregisterBodyListener = function(){
                document.body.removeEventListener('click', bodyListenerLogic)
            }
        }],
    	template: '<div class="generic-dropdown hide" ng-style="style"><div class="generic-dropdown-wrapper {{dropDirection}}"><div class="generic-dropdown-content" ng-class="popoverClass"><ng-transclude></ng-transclude></div></div></div>'
    }
});
app.service('genericDropdownService', function(){
    return {
        closeDropdown : function(trigger){
            angular.element('.generic-dropdown[trigger='+trigger+']').addClass('hide');
        },
        closeAll : function(){
            angular.element('.generic-dropdown').addClass('hide');
        }
    }
})