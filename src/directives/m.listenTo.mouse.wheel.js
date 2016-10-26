angular.module('m.angular.utilities.module')
.directive('mListenToMouseWheel', function() {
    return function(scope, element, attr) {
        element.bind('DOMMouseScroll mousewheel onmousewheel', function(event) {

            // cross-browser wheel delta
            var _event = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, (_event.wheelDelta || -_event.detail)));

            if(delta > 0) {
                scope.$apply(function(){
                    scope.$eval(attr.onWheelUp);
                });
            } else if (delta < 0) {
                scope.$apply(function(){
                    scope.$eval(attr.onWheelDown);
                });
            }
            // for IE
            _event.returnValue = false;
            // for Chrome and Firefox
            if(_event.preventDefault) {
                _event.preventDefault();
            }
        });
    };
});