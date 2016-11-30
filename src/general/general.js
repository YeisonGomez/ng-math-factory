(function() {
    'use strict';
    angular.module('math.general', [])
        .factory('general', ['$q', function($q) {

            return {
                options: function(input, sub_module) {
                    var deferred = $q.defer();
                    var html = {
                        resolve: "/general/view_general.html"
                            //graphics: "/adjust_curve/view_graphics.html"
                    };

                    if (sub_module == "Operación basica") {
                        deferred.resolve([op_basic(input), html]);
                    } else if (sub_module == "Derivar") {
                        deferred.resolve([derivar(input), html]);
                    } else {
                        deferred.reject("Método desconocido");
                    }

                    return deferred.promise;
                }
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
        }]);
})();
