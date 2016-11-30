(function() {
    'use strict';

    angular.module('math.methods', []).factory("$methods", function() {
        var routeLib = "/ng-math-factory/src";
        return [{
            name: 'General',
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
            sub: [
                { name: 'Mínimos cuadrados', in : 'xy' },
                { name: 'Interpolación lineal', in : 'xy' }
            ],
            factory: 'adjustCurve'
        }, {
            name: '5 Métodos',
            sub: [
                { name: 'Punto fijo', in : 'formula', readme: '2x^2+3x+3; x1; x2; Iteraciones' },
                { name: 'Bisección', in : 'formula', readme: '2x^2+3x+3; x1; x2; Iteraciones' },
                { name: 'Newton Raphson', in : 'formula' },
                { name: 'Regla falsa', in : 'formula' }
            ]
        }];
    });
})();
