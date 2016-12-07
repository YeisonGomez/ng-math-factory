(function() {
    'use strict';
    angular.module('math.search-raiz', []).factory('searchRaiz', function() {
        return {
            "Bisección": bisection,
            "Punto fijo": point_fixed,
            "Newton Raphson": newton,
            "Regla falsa": rule_false
        };

        function point_fixed(input) {
            input = parse_input(input);
            console.log(input);
            var x_ant = 0,
                xr = 0,
                ea = 0;
            var point = input.x1;
            xr = parseFloat(point);
            for (var i = 0; i < input.iteracion; i++) {
                x_ant = xr;
                xr = replaceValues(input.funcion, point);
                ea = Math.abs((xr - x_ant) / xr) * 100;
                point = xr;
            }
            console.log("xr: " + xr + " error" + ea);
            return {
                xr: xr,
                error: ea
            };
        }

        function bisection(input) {
            input = parse_input(input);
            console.log(replaceValues(input.funcion, input.x2));
            console.log(replaceValues(input.funcion, input.x1));
            var fx1b = replaceValues(input.funcion, input.x1);
            var fx2b = replaceValues(input.funcion, input.x2);
            if (fx1b <= 0 && fx2b >= 0 || fx1b >= 0 && fx2b <= 0) {
                var xr = input.x1,
                    fx1, fxr, err;
                var x_ant = 0;
                for (var i = 0; i < input.iteracion; i++) {
                    x_ant = xr;
                    xr = (parseFloat(input.x1) + parseFloat(input.x2)) / 2;
                    fx1 = replaceValues(input.funcion, parseFloat(input.x1));
                    fxr = replaceValues(input.funcion, xr);
                    err = Math.abs((xr - x_ant) / xr) * 100; 
                    if (fx1 * fxr <= 0) {
                        input.x2 = xr;
                    } else {
                        input.x1 = xr;
                    }
                }
                return { XR: xr, error: err };

            } else {
                return { XR: "no valido", error: "100%" };
            }
        }

        function newton(input) {
            //return metodo_libreria(input);
        }

        function rule_false(input) {
            input = parse_input(input);
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
