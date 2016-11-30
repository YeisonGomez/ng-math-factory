(function() {
    'use strict'; 
    angular.module('math.search-raiz', []).factory('searchRaiz', function($q) {
        return {
            options: function(input, sub_module) {
                var deferred = $q.defer();
                var html = {
                    resolve: "/src/search_raiz/view_search_raiz.html"
                        //graphics: "/src/mi_nuevo_modulo/view_graphics.html" //Opcional
                };

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
            return metodo_libreria(input);
        }

        function bisection(input) {
            return metodo_libreria(input);
        }

        function newton(input) {
            return metodo_libreria(input);
        }

        function rule_false(input) {
            return metodo_libreria(input);
        }
    });
})();
