(function() {
    'use strict';
    angular.module('math.search-raiz', []).factory('searchRaiz', function($q) {
        return {
            options: function(input, sub_module) {
                var deferred = $q.defer();
                var html = {
                    resolve: "/search_raiz/view_search_raiz.html"
                        //graphics: "/mi_nuevo_modulo/view_graphics.html" //Opcional
                };

                input = parse_input(input);

                if (sub_module == "Punto fijo") {
                    deferred.resolve([point_fixed(input), html]);
                } else if (sub_module == "Bisección") {
                    deferred.resolve([bisection(input), html]);
                } else if (sub_module == "Newton Raphson") {
                    deferred.resolve([newton(input), html]);
                } else if (sub_module == "Regla falsa") {
                    deferred.resolve([rule_false(input), html]);
                } else {
                    deferred.reject("Método desconocido");
                }
                return deferred.promise;
            }
        };

        function point_fixed(input) {

        }

        function bisection(input) {
            
        }

        function newton(input) {
            //return metodo_libreria(input);
        }

        function rule_false(input) {
            var xr = input.x2,
                fx1, fx2, fxr, ea;
            var x_ant = 0;
            for (var i = 0; i < input.iteracion; i++) {
                x_ant = xr;
                fx1 = replaceValues(input.funcion, parseFloat(x1));
                fx2 = replaceValues(input.funcion, parseFloat(x2));
                xr = (parseFloat(x2) - ((fx2 * (parseFloat(x1) - parseFloat(x2))) / (fx1 - fx2)));
                ea = Math.abs((xr - x_ant) / xr) * 100;
                fxr = replaceValues(input.funcion, xr);
                if (fx1 * fxr < 0) {
                    x2 = xr;
                } else {
                    x1 = xr;
                }
            }

            return { XR: xr, error: ea };
        }


    });
})();
