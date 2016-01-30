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
                var trigger = document.querySelector('#'+$scope.trigger);
                var target = document.querySelector('.ng-popover[trigger="'+$scope.trigger+'"]');

                // Add click event listener to trigger
                trigger.addEventListener('click', function(ev){
                    var left, top;
                    var trigger = this; //get trigger element 
                    var target =  document.querySelector('.ng-popover[trigger="'+$scope.trigger+'"]'); //get triger's target popover
                    ev.preventDefault();
                    calcPopoverPosition(trigger, target); //calculate the position of the popover
                   hideAllPopovers(trigger);
                    target.classList.toggle('hide'); //toggle display of target popover
                    // if target popover is visible then add click listener to body and call the open popover callback
                    if(!target.classList.contains('hide')){
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
                    var triggerRect = trigger.getBoundingClientRect();
                    var bodyRect = document.body.getBoundingClientRect();
                    return {
                        top: triggerRect.top + document.body.scrollTop,
                        left: triggerRect.left + document.body.scrollLeft
                    }
                };

                // calculates the position of the popover
                var calcPopoverPosition = function(trigger, target){
                    target.classList.toggle('hide');
                    var targetWidth = target.offsetWidth;
                    var targetHeight = target.offsetHeight;
                    target.classList.toggle('hide');
                    var triggerWidth = trigger.offsetWidth;
                    var triggerHeight = trigger.offsetHeight;
                    switch($scope.dropDirection){
                        case 'left': {
                            left = getTriggerOffset().left - targetWidth - 10 + 'px';
                            top = getTriggerOffset().top + 'px';
                            break;
                        }

                        case 'right':{
                            left = getTriggerOffset().left + triggerWidth + 10 + 'px';
                            top = getTriggerOffset().top + 'px';
                            break;
                        } 

                        case'top':{
                            left = getTriggerOffset().left + 'px';
                            top = getTriggerOffset().top - targetHeight - 10 + 'px';
                            break;
                        }

                        default:{
                            left = getTriggerOffset().left +'px';
                            top = getTriggerOffset().top + triggerHeight + 10 + 'px'
                        }
                    }
                    target.style.position = 'absolute';
                    target.style.left = left;
                    target.style.top = top;
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
                        hideAllPopovers();
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
                document.querySelector('.ng-popover[trigger='+trigger+']').classList.add('hide');
            },
            closeAll : function(){
                var allPopovers = document.querySelectorAll('.ng-popover');
                for(var i=0; i<allPopovers.length; i++){
                    if(!allPopovers[i].classList.contains('hide'))
                        allPopovers[i].classList.add('hide');
                }
            }
        }
    });

    // Hides all popovers, skips the popover whose trigger Id is provided in the function call
    var hideAllPopovers = function(trigger){
        var triggerId;
        if(trigger)
            triggerId = trigger.getAttribute('id');
         var allPopovers = trigger != undefined ? document.querySelectorAll('.ng-popover:not([trigger="'+triggerId+'"])') : document.querySelectorAll('.ng-popover');
        for(var i =0; i<allPopovers.length; i++){
            var popover = allPopovers[i];
            if(!popover.classList.contains('hide'))
                popover.classList.add('hide')
        }
    }
})(angular);