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
                console.log(input);
                var y = 0;
                y = (Math.pow(-x, 3) + (3 * Math.pow(x, 2)) + 5) / 4;

                return y;
  
                var nro_iter = 0,
                    max_iter = 0,
                    x_ant = 0,
                    xr = 0,
                    ea = 0;
                var point = $("#x_one").val();
                xr = parseFloat(point);
                var max_iter = $("#iter").val();
                while (nro_iter < max_iter) {
                    x_ant = xr;
                    xr = funciones(point);
                    ea = Math.abs((xr - x_ant) / xr) * 100;
                    point = xr;
                    nro_iter = nro_iter + 1;

                }

                $("#root").val(xr);
                $("#error").val(ea);
                $("#iteraciones").val(nro_iter);

        }

        function bisection(input) {
            console.log(input);
            var xr = input.x1,
                fx1, fxr, err;
            var x_ant = 0;
            for (var i = 0; i < input.iteracion; i++) {
                x_ant = xr;
                xr = (parseFloat(input.x1) + parseFloat(input.x2)) / 2;
                fx1 = replaceValues(input.funcion, parseFloat(input.x1));
                fxr = replaceValues(input.funcion, xr);
                err = Math.abs((xr - x_ant) / xr) * 100;
                if (fx1 * fxr < 0) {
                    input.x2 = xr;
                } else {
                    input.x1 = xr;
                }
            }
            return { XR: xr, error: err };
        }

        function newton(input) {
            //return metodo_libreria(input);
        }

        function rule_false(input) {
            var xr = input.x2,
                fx1, fx2, fxr, err;
            var x_ant = 0;
            for (var i = 0; i < input.iteracion; i++) {
                x_ant = xr;
                fx1 = replaceValues(input.funcion, parseFloat(x1));
                fx2 = replaceValues(input.funcion, parseFloat(x2));
                xr = (parseFloat(x2) - ((fx2 * (parseFloat(x1) - parseFloat(x2))) / (fx1 - fx2)));
                err = Math.abs((xr - x_ant) / xr) * 100;
                fxr = replaceValues(input.funcion, xr);
                if (fx1 * fxr < 0) {
                    x2 = xr;
                } else {
                    x1 = xr;
                }
            }

            return { XR: xr, error: err };
        }

        //METODOS PROPIOS
        function parse_input(input) {
            var arr = input.split(";");
            return {
                funcion: arr[0],
                x1: parseInt(arr[1]),
                x2: parseInt(arr[2]),
                iteracion: parseInt(arr[3])
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
