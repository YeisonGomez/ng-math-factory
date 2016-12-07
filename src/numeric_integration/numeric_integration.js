(function() {
    'use strict';
    angular.module('math.numeric-integration', []).factory('numericIntegration', function($q) {
        return {
            options: function(input, sub_module) {
                var deferred = $q.defer();
                var html = {
                    resolve: "/numeric_integration/view_numeric_integration.html"
                        //graphics: "/mi_nuevo_modulo/view_graphics.html" //Opcional
                };

                input = parse_input(input);

                if (sub_module == "Simpson 1/3") {
                    deferred.resolve([point_fixed(input), html]);
                } else if (sub_module == "Regla del trapecio") {
                    deferred.resolve([bisection(input), html]);
                } else {
                    deferred.reject("Método desconocido");
                }
                return deferred.promise;
            }
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
            for (var i = 1; i < ValoresdeY.length - 1; i += 2) { sumatoriasimpar += ValoresdeY[i]; }
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

        //METODOS PROPIOS
        function parse_input(input) {
            var arr = input.split(";");
            return {
                funcion: arr[0],
                a: parseInt(arr[1]),
                b: parseInt(arr[2]),
                n: parseInt(arr[3])
            };
        }

        function replaceValues(funcion, x) {
            funcion = replaceOthers(funcion, "pow");
            funcion = replaceOthers(funcion, "x", x);
            return eval(funcion);
        }

        function replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

        function replaceOthers(funcion, type, x) {
            funcion = replaceAll(funcion, " ", "");

            if (type == "pow") {
                while (funcion.indexOf("^") != -1) {
                    funcion = funcion.replace("^", "**");
                }
            } else if (type == "x") {
                var pos = funcion.indexOf("x");
                while (pos != -1) {
                    var num_antes = (funcion[pos - 1] !== undefined && isNumeric(funcion[pos - 1]));
                    var num_despues = (funcion[pos + 1] !== undefined && isNumeric(funcion[pos + 1]));

                    if (num_antes && num_despues) {
                        funcion = funcion.replace("x", "*" + x + "*");
                    } else if (num_antes) {
                        funcion = funcion.replace("x", "*" + x);
                    } else if (num_despues) {
                        funcion = funcion.replace("x", x + "*");
                    } else {
                        funcion = funcion.replace("x", x);
                    }

                    pos = funcion.indexOf("x");
                }
            }

            return funcion;
        }

        function isNumeric(input) {
            return (input - 0) == input && ('' + input).trim().length > 0;
        }
    });
})();
