;(function(angular){
    'use strict'
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
                $scope.popoverClass = attrs.popoverClass;
                $scope.dropDirection = attrs.direction || 'bottom';
                var left, top;
                var trigger = angular.element('#'+$scope.trigger);
                var target = angular.element('.ng-popover[trigger="'+$scope.trigger+'"]');

                // Add click event listener to trigger
                trigger.bind('click', function(ev){
                    var left, top;
                    var trigger = angular.element('#'+$scope.trigger); //get trigger element 
                    var target = angular.element('.ng-popover[trigger="'+$scope.trigger+'"]'); //get triger's target popover
                    ev.preventDefault();
                    calcPopoverPosition(trigger, target); //calculate the position of the popover
                    angular.element('.ng-popover').not('[trigger="'+$scope.trigger+'"]').addClass('hide'); //Hide all the popovers except for the target popover
                    target.toggleClass('hide'); //toggle display of target popover
                    // if target popover is visible then add click listener to body and call the open popover callback
                    if(!target.hasClass('hide')){
                        ctrl.registerBodyListener();
                        $scope.onOpen();
                        $scope.$apply();
                    }
                    //else remove click listener from body and call close popover callback
                    else{
                        ctrl.unregisterBodyListener();
                        $scope.onClose();
                        $scope.$apply();
                    }
                });

                var getTriggerOffset = function(){
                    return trigger.offset()
                };

                // calculates the position of the popover
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
                // logic to hide popover on click of body
                var bodyListenerLogic = function(e){
                    var clickedElement = e.target;
                    var insidePopover = false;
                    do {
                        if(clickedElement != document && (clickedElement.classList && (clickedElement.classList.contains('ng-popover') || clickedElement.classList.contains('ng-popover-trigger')))) {
                            insidePopover = true;
                        break;
                        }
                    } while ((clickedElement = clickedElement.parentNode));
                    if(!insidePopover) {
                        angular.element('.ng-popover').addClass('hide');
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
            template: '<div class="ng-popover hide"><div class="ng-popover-wrapper {{dropDirection}}"><div class="ng-popover-content" ng-class="popoverClass"><ng-transclude></ng-transclude></div></div></div>'
        }
    });

    app.factory('ngPopoverFactory', function(){
        return {
            closePopover : function(trigger){
                angular.element('.ng-popover[trigger='+trigger+']').addClass('hide');
            },
            closeAll : function(){
                angular.element('.ng-popover').addClass('hide');
            }
        }
    })
})(angular);