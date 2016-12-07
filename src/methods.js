(function() {
    'use strict';

    angular.module('math.methods', []).factory("$methods", function() {
        var routeLib = "/ng-math-factory/src";
        return [{
            name: 'General',
            sub: [{ name: 'Operación basica', in : 'formula', readme: routeLib + '/general/readme/op_basic.html' }],
            html: { resolve: "/general/view_general.html" },
            factory: 'general'
        }, {
            name: 'Ajuste de curvas',
            sub: [{ name: 'Mínimos cuadrados', in : 'xy' }],
            html: { resolve: "/adjust_curve/view_adjust_curve.html", graphics: "/adjust_curve/view_graphics.html" },
            factory: 'adjustCurve'
        }, {
            name: 'Búsqueda de raíces',
            sub: [
                { name: 'Punto fijo', in : 'formula', readme: routeLib + '/search_raiz/readme/point_fixed.html' },
                { name: 'Bisección', in : 'formula', readme: routeLib + '/search_raiz/readme/bisection.html' },
                { name: 'Newton Raphson', in : 'formula', readme: routeLib + '/search_raiz/readme/newton.html' },
                { name: 'Regla falsa', in : 'formula', readme: routeLib + '/search_raiz/readme/rule_false.html' }
            ],
            html: {
                resolve: "/search_raiz/view_search_raiz.html"
            },
            factory: 'searchRaiz'
        }];
    });
})();
