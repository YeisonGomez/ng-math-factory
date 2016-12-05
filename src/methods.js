(function() {
    'use strict';

    angular.module('math.methods', []).factory("$methods", function() {
        var routeLib = "/ng-math-factory/src";
        return [{
            name: 'General',
<<<<<<< HEAD
=======
            sub: [
                { name: 'Operación basica', in : 'formula', readme: routeLib + '/general/readme/op_basic.html' },
                { name: 'Derivar', in : 'formula', readme: routeLib + '/general/readme/derive.html' }
            ],
            factory: 'general',
            libs: [
                '/general/lib/derive.js'
            ]
        }, {
            name: 'Ajuste de curvas',
>>>>>>> fde4456b8d7bba703e14ce4eead433f483b65871
            sub: [
                { name: 'Operación basica', in : 'formula', readme: routeLib + '/general/readme/op_basic.html' }/*,
                { name: 'Derivar', in : 'formula', readme: routeLib + '/general/readme/derive.html' }*/
            ],
            factory: 'general'/*, 
            libs: [
                '/general/lib/derive.js'
            ]*/
        }, {
<<<<<<< HEAD
            name: 'Ajuste de curvas',
            sub: [
                { name: 'Mínimos cuadrados', in : 'xy' }
            ],
            factory: 'adjustCurve'
        }, {
            name: 'Búsqueda de raíces',
            sub: [
=======
            name: 'Búsqueda de raíces',
            sub: [
>>>>>>> fde4456b8d7bba703e14ce4eead433f483b65871
                { name: 'Punto fijo', in : 'formula', readme: routeLib + '/search_raiz/readme/point_fixed.html' },
                { name: 'Bisección', in : 'formula', readme: routeLib + '/search_raiz/readme/bisection.html' },
                { name: 'Newton Raphson', in : 'formula', readme: routeLib + '/search_raiz/readme/newton.html' },
                { name: 'Regla falsa', in : 'formula', readme: routeLib + '/search_raiz/readme/rule_false.html' }
            ],
            factory: 'searchRaiz'
        }];
    });
})();
