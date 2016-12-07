(function() {
    'use strict';
 
    angular.module('math.methods', []).factory("$methods", function() {
        var routeLib = "/ng-math-factory/src";
        return [{
            name: 'General',
            sub: [
                { name: 'Operación basica', in : 'formula', readme: routeLib + '/general/readme/op_basic.html' }/*,
                { name: 'Derivar', in : 'formula', readme: routeLib + '/general/readme/derive.html' }*/
            ],
            factory: 'general'/*, 
            libs: [
                '/general/lib/derive.js'
            ]*/
        }, {
            name: 'Ajuste de curvas',
            sub: [
                { name: 'Mínimos cuadrados', in : 'xy' }
            ],
            factory: 'adjustCurve'
        }, {
            name: 'Búsqueda de raíces',
            sub: [
                { name: 'Punto fijo', in : 'formula', readme: routeLib + '/search_raiz/readme/point_fixed.html' },
                { name: 'Bisección', in : 'formula', readme: routeLib + '/search_raiz/readme/bisection.html' },
                { name: 'Newton Raphson', in : 'formula', readme: routeLib + '/search_raiz/readme/newton.html' },
                { name: 'Regla falsa', in : 'formula', readme: routeLib + '/search_raiz/readme/rule_false.html' }
            ],
            factory: 'searchRaiz'
        }, {
            name: 'Integración numérica',
            sub: [
                { name: 'Simpson 1/3', in : 'formula', readme: routeLib + '/search_raiz/readme/point_fixed.html' },
                { name: 'Bisección', in : 'formula', readme: routeLib + '/search_raiz/readme/bisection.html' },
                { name: 'Newton Raphson', in : 'formula', readme: routeLib + '/search_raiz/readme/newton.html' },
                { name: 'Regla falsa', in : 'formula', readme: routeLib + '/search_raiz/readme/rule_false.html' }
            ],
            factory: 'searchRaiz'
        }];
    });
})();
