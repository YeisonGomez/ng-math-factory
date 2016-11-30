(function() {
    'use strict';

    angular.module('math.methods', []).factory("$methods", function() {
        return [{
            name: 'General',
            sub: [
                { name: 'Operación basica', in : 'formula' },
                { name: 'Derivar', in : 'formula' }
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
                { name: 'Punto fijo', in : 'formula' },
                { name: 'Bisección', in : 'formula' },
                { name: 'Newton Raphson', in : 'formula' },
                { name: 'Regla falsa', in : 'formula' }
            ]
        }, {
            name: 'Matriz',
            sub: [
                { name: 'Gauss Jordan', in : 'matriz' }
            ]
        }];
    });
})();
