(function() {
    'use strict';
    angular.module('math.general', [])
        .factory('general', ['$q' ,function($q) {

            return {
                options: function(input, sub_module) {
                    var deferred = $q.defer();
                    var html = {
                        resolve: "/adjust_curve/view_general.html"
                        //graphics: "/adjust_curve/view_graphics.html"
                    };

                    if (sub_module == "Operación basica") {
                        deferred.resolve([op_basic(input), html]);
                    } else {
                        deferred.reject("Método desconocido");
                    }

                    return deferred.promise;
                }
            };

            function op_basic(input) {
                
                return eval(input);
            }
        }]);
})();
