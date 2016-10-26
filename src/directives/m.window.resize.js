angular.module('m.angular.utilities.module')
.directive('mOnWindowResize', ['$window', '$parse', '$interval', '$rootScope',
    function($window, $parse, $interval, $rootScope) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attr) {

                var expr = $parse(attr.onWindowResize, null, true),
                    trigger = function(event){
                        var callback = function() {
                            expr(scope, {$event:event});
                        };
                        if ($rootScope.$$phase) {
                            scope.$evalAsync(callback);
                        } else {
                            scope.$apply(callback);
                        }
                    },
                    timer = 0,
                    reSized = false,
                    $invalidateWindowSizeFn;

                function resetTrigger() {
                    reSized = false;
                    $interval.cancel(timer);
                }

                function windowResizeHandler() {

                    if (timer) {
                        resetTrigger();
                    }

                    if (!reSized) {
                        timer = $interval(function(){
                            if(reSized){
                                resetTrigger();
                                trigger({
                                    element: element[0],
                                    elementWidth: element[0].clientWidth,
                                    elementHeight: element[0].clientHeight
                                });
                            }
                        }, 300);
                        reSized = true;
                    }
                }

                // bind to window resize event, will only ever be bound
                // one time for entire app
                function bind() {
                    var w = angular.element($window);
                    w.on('resize', function(){
                        windowResizeHandler();
                    });

                    w.ready(function documentReady() {
                        windowResizeHandler();
                    });

                    $invalidateWindowSizeFn = $rootScope.$on('$invalidateWindowSize', 
                    function handleInvalidateSize() {
                        windowResizeHandler();
                    });
                }

                // unbind window scroll event
                function unbind(){
                    var w = angular.element($window);
                    w.off('resize');

                    if ($invalidateWindowSizeFn !== null) {
                        $invalidateWindowSizeFn();
                    }
                }

                scope.$on('$destroy', function handleDestroyEvent() {
                    unbind();
                });

                bind();
            }
        };
    }]);