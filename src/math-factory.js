(function() {
    'use strict';

    var routeLib = "/ng-math-factory/src";

    angular.module('ng-math-factory', [
            'math.methods',
            'math.general',
            'math.adjust-curve',
            'math.search-raiz'
        ])
        .factory('$math', '$methods', 'adjustCurve', 'general', 'searchRaiz',
            function($methods, adjustCurve, general, searchRaiz) {
                return {
                    resolve: resolve,
                    getMethods: getMethods
                };

                function resolve(method, input, routeDep, callback) {
                    var methods_factory = $methods;
                    for (var i = 0; i < methods_factory.length; i++) {
                        if (method.name === methods_factory[i].name) {
                            if (methods_factory[i].libs !== undefined) {
                                for (var k = 0; k < methods_factory[i].libs.length; k++) {
                                    var oHead = document.getElementsByTagName('head')[0];
                                    var oScript = document.createElement('script');
                                    oScript.type = 'text/javascript';
                                    oScript.charset = 'utf-8';
                                    oScript.src = routeDep + routeLib + methods_factory[i].libs[k];
                                    oHead.appendChild(oScript);
                                }
                            }
                            var res = eval(methods_factory[i].factory + '["' + method.sub + '"]' + '("' + input + '")');
                            var html = methods_factory[i].html;
                            html.resolve = routeDep + routeLib + html.resolve;
                            html.graphics = (html.graphics === undefined) ? undefined : routeDep + routeLib + html.graphics;
                            callback(res, html);
                            break;
                        }
                    }
                }

                function getMethods() {
                    return $methods;
                }
            }
        );
})();
