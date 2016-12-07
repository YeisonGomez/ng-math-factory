(function() {
    'use strict';
    angular.module('math.numeric-integration', []).factory('numericIntegration', function() {
        return {
            "Simpson 1/3": simpson13,
            "Regla del trapecio": trapezoid
        };

        function simpson13(input) {
            var ValoresdeY;
            ValoresdeY = [1, 2, 3, 4, 5]; //como no se como maneja la variable la deje estatica :v
            var puntoa = input.a; //el a de la integral
            var puntob = input.b; //b de la integral definida
            var particiones = input.n; //esto es N
            var DeltaX = (puntob - puntoa) / particiones; //Delta de X
            //aca va el sumador del arreglo de valores
            var sumatoriaspar = 0;
            for (var i = 2; i < ValoresdeY.length - 1; i += 2) { sumatoriaspar += ValoresdeY[i]; }
            var sumatoriasimpar = 0;
            for (i = 1; i < ValoresdeY.length - 1; i += 2) { sumatoriasimpar += ValoresdeY[i]; }
            //aca termina
            var valortercio = DeltaX * (ValoresdeY[ValoresdeY.length - 1] + ValoresdeY[0] + (4 * sumatoriasimpar) + (2 * sumatoriaspar));
            return valortercio;
        }

        function trapezoid(input) {
            var ValoresdeY;
            ValoresdeY = [1, 2, 3, 4, 5]; //como no se como maneja la variable la deje estatica :v
            var puntoa = input.a; //el a de la integral
            var puntob = input.b; //b de la integral definida
            var particiones = input.n; //esto es N
            var DeltaX = (puntob - puntoa) / particiones; //Delta de X
            //aca va el sumador del arreglo de valores
            var sumatoriasY = 0;
            for (var i = 1; i < ValoresdeY.length - 1; i++) { sumatoriasY += ValoresdeY[i]; }
            //aca termina
            var valortrapecio = DeltaX * (ValoresdeY[ValoresdeY.length - 1] + ValoresdeY[0] + (2 * sumatoriasY));
            return valortrapecio;
        }
    });
})();
