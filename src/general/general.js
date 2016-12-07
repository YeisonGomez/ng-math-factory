(function() {
    'use strict';
    angular.module('math.general', [])
        .factory('general', function() {

            return {
                "Operación basica": op_basic,
                "Derivar": derivar
            };

            function op_basic(input) {
                var solucion = eval(input);
                return solucion;
            }

            function derivar(input) {
                var solution;
                try {
                    solution = deriveExpression(input);
                } catch (exception) {
                    solution = "Expresiones invalidas.";
                }
                return solution;
            }
        });
})();
