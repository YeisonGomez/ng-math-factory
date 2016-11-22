(function() {
    'use strict';

    var routeLib = "/js/math";

    angular.module('ng-math-factory', [
            'math.methods',
            'math.adjust-curve'
        ])
        .factory('$math', function($q, $methods, adjustCurve) {
            return {
                resolve: resolve,
                getMethods: getMethods
            };

            function resolve(methods, input, callback) {
                var methods_factory = $methods;
                for (var i = 0; i < methods_factory.length; i++) {
                    if (methods.module === methods_factory[i].name) {
                        eval(methods_factory[i].factory).options(input, methods.sub).then(function(data) {
                            var html = data[1];
                            html.resolve = routeLib + html.resolve;
                            html.graphics = routeLib + html.graphics;
                            callback(data[0], html);
                        });
                        break;
                    }
                }
            }

            function getMethods() {
                return $methods;
            }
        });
})();
