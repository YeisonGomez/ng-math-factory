(function() {
    'use strict';

    var routeLib = "/ng-math-factory/src";

    angular.module('ng-math-factory', [
            'math.methods',
            'math.general',
            'math.adjust-curve'
        ])
        .factory('$math', ['$q', '$methods', 'adjustCurve', 'general', function($q, $methods, adjustCurve, general) {
            return {
                resolve: resolve,
                getMethods: getMethods
            };

            function resolve(method, input, routeDep, callback) {
                var methods_factory = $methods;
                for (var i = 0; i < methods_factory.length; i++) {
                    if (method.name === methods_factory[i].name) {
                        eval(methods_factory[i].factory).options(input, method.sub).then(function(data) {
                            var html = data[1];
                            html.resolve = routeDep + routeLib + html.resolve;
                            html.graphics = routeDep + routeLib + html.graphics;
                            callback(data[0], html);
                        });
                        break;
                    }
                }
            }

            function getMethods() {
                return $methods;
            }
        }]);
})();
