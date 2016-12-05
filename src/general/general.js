(function() {
    'use strict';
    angular.module('math.general', [])
<<<<<<< HEAD
        .factory('general', ['$q' ,function($q) {
=======
        .factory('general', ['$q', function($q) {
>>>>>>> fde4456b8d7bba703e14ce4eead433f483b65871

            return {
                options: function(input, sub_module) {
                    var deferred = $q.defer();
                    var html = {
<<<<<<< HEAD
                        resolve: "/adjust_curve/view_general.html"
                        //graphics: "/adjust_curve/view_graphics.html"
=======
                        resolve: "/general/view_general.html"
                            //graphics: "/adjust_curve/view_graphics.html"
>>>>>>> fde4456b8d7bba703e14ce4eead433f483b65871
                    };

                    if (sub_module == "Operación basica") {
                        deferred.resolve([op_basic(input), html]);
<<<<<<< HEAD
=======
                    } else if (sub_module == "Derivar") {
                        deferred.resolve([derivar(input), html]);
>>>>>>> fde4456b8d7bba703e14ce4eead433f483b65871
                    } else {
                        deferred.reject("Método desconocido");
                    }

                    return deferred.promise;
                }
            };

            function op_basic(input) {
<<<<<<< HEAD
                
                return eval(input);
=======
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
>>>>>>> fde4456b8d7bba703e14ce4eead433f483b65871
            }
        }]);
})();
