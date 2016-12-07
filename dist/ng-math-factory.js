(function() {
    'use strict';

    var routeLib = "/ng-math-factory/src";

    angular.module('ng-math-factory', [
            'math.methods',
            'math.general',
            'math.adjust-curve',
            'math.search-raiz'
        ])
        .factory('$math', ['$q', '$methods', 'adjustCurve', 'general', 'searchRaiz',
            function($q, $methods, adjustCurve, general, searchRaiz) {
                return {
                    resolve: resolve,
                    getMethods: getMethods
                };

                function resolve(method, input, routeDep, callback) {
                    var methods_factory = $methods;
                    for (var i = 0; i < methods_factory.length; i++) {
                        if (method.name === methods_factory[i].name) {
                            if (methods_factory[i].libs !== undefined) {
                                for (var k = 0; k < methods_factory[i].libs.length; k++) { 
                                    var oHead = document.getElementsByTagName('head')[0];
                                    var oScript = document.createElement('script');
                                    oScript.type = 'text/javascript';
                                    oScript.charset = 'utf-8';
                                    oScript.src = routeDep + routeLib + methods_factory[i].libs[k];
                                    oHead.appendChild(oScript);
                                }
                            }
                            eval(methods_factory[i].factory).options(input, method.sub).then(function(data) {
                                var html = data[1];
                                console.log(data);
                                html.resolve = routeDep + routeLib + html.resolve;
                                html.graphics = (html.graphics === undefined) ? undefined : routeDep + routeLib + html.graphics;
                                callback(data[0], html);
                            });
                            break;
                        }
                    }
                }


                function getMethods() {
                    return $methods;
                }
            }
        ]);
})();

(function() {
    'use strict';
 
    angular.module('math.methods', []).factory("$methods", function() {
        var routeLib = "/ng-math-factory/src";
        return [{
            name: 'General',
            sub: [
                { name: 'Operación basica', in : 'formula', readme: routeLib + '/general/readme/op_basic.html' }/*,
                { name: 'Derivar', in : 'formula', readme: routeLib + '/general/readme/derive.html' }*/
            ],
            factory: 'general'/*, 
            libs: [
                '/general/lib/derive.js'
            ]*/
        }, {
            name: 'Ajuste de curvas',
            sub: [
                { name: 'Mínimos cuadrados', in : 'xy' }
            ],
            factory: 'adjustCurve'
        }, {
            name: 'Búsqueda de raíces',
            sub: [
                { name: 'Punto fijo', in : 'formula', readme: routeLib + '/search_raiz/readme/point_fixed.html' },
                { name: 'Bisección', in : 'formula', readme: routeLib + '/search_raiz/readme/bisection.html' },
                { name: 'Newton Raphson', in : 'formula', readme: routeLib + '/search_raiz/readme/newton.html' },
                { name: 'Regla falsa', in : 'formula', readme: routeLib + '/search_raiz/readme/rule_false.html' }
            ],
            factory: 'searchRaiz'
        }];
    });
})();

(function() {
    'use strict';
    angular.module('math.adjust-curve', [])
        .factory('adjustCurve', ['$q' ,function($q) {

            return {
                options: function(input, sub_module) {
                    var deferred = $q.defer();
                    var html = {
                        resolve: "/adjust_curve/view_adjust_curve.html",
                        graphics: "/adjust_curve/view_graphics.html"
                    };

                    if (sub_module == "Mínimos cuadrados") {
                        deferred.resolve([minime_square(input), html]);
                    } else {
                        deferred.reject("Método desconocido");
                    }

                    return deferred.promise;
                }
            };

            function minime_square(input) {
                var chartConfig = {
                    options: {
                        tooltip: {
                            style: {
                                padding: 10,
                                fontWeight: 'bold'
                            }
                        }
                    },
                    series: [{
                        "name": "Puntos",
                        "data": [1, 2, 3, 4, 5, 6],
                        "type": "scatter",
                        "id": "series-0"
                    }, {
                        "name": "R",
                        "data": [3, 1],
                        "type": "line",
                        "id": "series-1"
                    }],
                    title: {
                        text: 'Mínimos cuadrados'
                    },
                    useHighStocks: false
                };


                var n = input.length;
                var solveMinumSquare = {
                    solveTable: [{ x: 'X', y: 'Y', a: 'X * Y', b: 'χ²', c: 'a + b X', d: 'Y - Ŷ' }],
                    solveSum: [
                        { symbol: 'Σχ:', value: 0 }, //0
                        { symbol: 'ΣY:', value: 0 }, //1
                        { symbol: 'Σ(X * Y):', value: 0 }, //2
                        { symbol: 'Σ(χ²):', value: 0 }, //3
                        { symbol: 'Σ(Y - Ŷ):', value: 0 } //4
                    ],
                    solveAB: [],
                    solveR: ''
                };
                var solveTable = [{ "x": 'X', "y": 'Y', "a": 'X * Y', "b": 'χ²', "c": 'a + b X', "d": 'Y - Ŷ' }];
                var a, b, c, d, y2 = 0;
                var solveSum = [
                    { symbol: 'Σχ:', value: 0 },
                    { symbol: 'ΣY:', value: 0 },
                    { symbol: 'Σ(X * Y):', value: 0 },
                    { symbol: 'Σ(χ²):', value: 0 },
                    { symbol: 'Σ(Y - Ŷ):', value: 0 }
                ];

                for (var i = 0; i < n; i++) {
                    if (input[i].x === "") {
                        input[i].x = 0;
                    }
                    if (input[i].y === "") {
                        input[i].y = 0;
                    }
                    a = input[i].x * input[i].y;
                    b = Math.pow(input[i].x, 2);
                    c = a + (b + input[i].x);
                    d = input[i].y - c;
                    y2 += Math.pow(input[i].y, 2);

                    solveMinumSquare.solveTable.push({ "x": input[i].x, "y": input[i].y, "a": a, "b": b, "c": c, "d": d });
                }
                for (i = 1; i < solveMinumSquare.solveTable.length; i++) {
                    solveMinumSquare.solveSum[0].value += solveMinumSquare.solveTable[i].x;
                    solveMinumSquare.solveSum[1].value += solveMinumSquare.solveTable[i].y;
                    solveMinumSquare.solveSum[2].value += solveMinumSquare.solveTable[i].a;
                    solveMinumSquare.solveSum[3].value += solveMinumSquare.solveTable[i].b;
                    solveMinumSquare.solveSum[4].value += solveMinumSquare.solveTable[i].d;
                }

                solveMinumSquare.solveAB[1] = (n * solveMinumSquare.solveSum[2].value - (solveMinumSquare.solveSum[0].value * solveMinumSquare.solveSum[1].value)) / ((n * solveMinumSquare.solveSum[3].value) - Math.pow(solveMinumSquare.solveSum[0].value, 2));
                solveMinumSquare.solveAB[0] = ((solveMinumSquare.solveSum[1].value + (solveMinumSquare.solveAB[1] * solveMinumSquare.solveSum[0].value)) / n);
                var ZXY = solveMinumSquare.solveSum[2].value;
                var ZX = solveMinumSquare.solveSum[0].value;
                var ZY = solveMinumSquare.solveSum[1].value;
                var ZX2 = solveMinumSquare.solveSum[3].value;
                var bug = (ZX2 - (Math.pow(ZX, 2) / n)) * (y2 - (Math.pow(ZY, 2) / n));
                solveMinumSquare.solveR = ((ZXY - ((ZX * ZY) / n)) / Math.sqrt(bug, 2));
                solveMinumSquare.solveR2 = Math.pow(solveMinumSquare.solveR, 2);

                //Grafica
                solveMinumSquare.graphics = [];
                var data = [];
                var dataY = [];
                var dataX = [];
                for (i = 1; i < solveMinumSquare.solveTable.length; i++) {
                    data.push([solveMinumSquare.solveTable[i].x, solveMinumSquare.solveTable[i].y]);
                    dataY.push(solveMinumSquare.solveTable[i].y);
                    dataX.push(solveMinumSquare.solveTable[i].x);
                    //solveMinumSquare.graphics.push([{ x: solveMinumSquare.solveTable[i].x, y: solveMinumSquare.solveTable[i].y }]);
                }
                chartConfig.series[0].data = data; //agrega los valores X  y Y
                chartConfig.series[1].data = [
                    [0, Math.min(dataY)],
                    [Math.max(dataX), Math.max(dataY)]
                ]; // agrega el mínimo y el máximo para la linea de dispersión de la gráfica 
                solveMinumSquare.graphics = chartConfig;
                return solveMinumSquare;
            }
        }]);
})();

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
                XR: xr,
                error: ea
            };
        }

        function bisection(input) {
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
                return { XR: "no valido", error: "100%" }
            }
        }

        function newton(input) {
            //return metodo_libreria(input);
        }

        function rule_false(input) {
            var fx1b = replaceValues(input.funcion, input.x1);
            var fx2b = replaceValues(input.funcion, input.x2);
            if (fx1b <= 0 && fx2b >= 0 || fx1b >= 0 && fx2b <= 0) {
                var xr = input.x2,
                    fx1, fx2, fxr, err;
                var x_ant = 0;
                for (var i = 0; i < input.iteracion; i++) {
                    x_ant = xr;
                    fx1 = replaceValues(input.funcion, parseFloat(input.x1));
                    fx2 = replaceValues(input.funcion, parseFloat(input.x2));
                    xr = (parseFloat(input.x2) - ((fx2 * (parseFloat(input.x1) - parseFloat(input.x2))) / (fx1 - fx2)));
                    err = Math.abs((xr - x_ant) / xr) * 100;
                    fxr = replaceValues(input.funcion, xr);
                    if (fx1 * fxr <= 0) {
                        input.x2 = xr;
                    } else {
                        input.x1 = xr;
                    }
                }

                return { XR: xr, error: err };
            } else {
                return { XR: "no valido", error: "100%" }
            }
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

/*
 * The basic idea of this script is to construct a syntax tree from a
 * mathematical expression and to apply differentiation rules to it. Also some
 * algebraic simplifications are applied.
 */

/*
 * The basic building block of syntax trees. The attributes left and right are
 * meant to be other tokens or undefined.
 */
var Token = function(type, value, left, right)
{
    this.setAttributes(type, value, left, right);
};

Token.prototype =
{
    copyAttributesFrom: function(that)
    {
        this.setAttributes(that.type, that.value, that.left, that.right);
    },
    
    deepCopy: function()
    {
        var left;
        var right;
        if (this.left !== undefined)
        {
            left = this.left.deepCopy();
        }
        if (this.right !== undefined)
        {
            right = this.right.deepCopy();
        }
        return new Token(this.type, this.value, left, right);
    },
    
    setAttributes: function(type, value, left, right)
    {
        this.type = type;
        this.value = value;
        this.left = left;
        this.right = right;
    },
    
    /*
     * Determines if this token is the root of a constant subtree (i.e. a
     * subtree that does not contain the identifier x)
     */
    isConstant: function()
    {
        if (this.type === "identifier" && this.value === "x")
        {
            return false;
        }
        if (this.left !== undefined && !this.left.isConstant())
        {
            return false;
        }
        if (this.right !== undefined && !this.right.isConstant())
        {
            return false;
        }
        return true;
    }
};

/*
 * Decomposes an expression string. Usage: Create a new Tokenizer object and
 * repeatedly call its nextToken method, e.g.
 * var tokenizer = new Tokenizer("2 * x")
 * tokenizer.nextToken() --> 2
 * tokenizer.nextToken() --> *
 * tokenizer.nextToken() --> x
 * tokenizer.nextToken() --> end
 */
var Tokenizer = function(expression)
{
    this.expression = expression + "\0";
    this.to = 0;
};

Tokenizer.prototype =
{
    nextToken: function()
    {
        this.from = this.to;
        // end
        if (this.expression.charAt(this.to) === "\0")
        {
            this.to++;
            return new Token("end");
        }
        // identifiers
        else if (this.expression.charAt(this.to) >= "A" && this.expression.charAt(this.to) <= "Z" || this.expression.charAt(this.to) === "_" || this.expression.charAt(this.to) >= "a" && this.expression.charAt(this.to) <= "z")
        {
            this.to++;
            while (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9" || this.expression.charAt(this.to) >= "A" && this.expression.charAt(this.to) <= "Z" || this.expression.charAt(this.to) === "_" || this.expression.charAt(this.to) >= "a" && this.expression.charAt(this.to) <= "z")
            {
                this.to++;
            }
            return new Token("identifier", this.expression.substring(this.from, this.to));
        }
        // numbers
        else if (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
        {
            this.to++;
            while (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
            {
                this.to++;
            }
            if (this.expression.charAt(this.to) === ".")
            {
                this.to++;
                if (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
                {
                    this.to++;
                    while (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
                    {
                        this.to++;
                    }
                }
                else
                {
                    throw "unrecognized token " + this.expression.substring(this.from, this.to);
                }
            }
            if (this.expression.charAt(this.to) === "E" || this.expression.charAt(this.to) === "e")
            {
                this.to++;
                if (this.expression.charAt(this.to) === "+" || this.expression.charAt(this.to) === "-")
                {
                    this.to++;
                }
                if (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
                {
                    this.to++;
                    while (this.expression.charAt(this.to) >= "0" && this.expression.charAt(this.to) <= "9")
                    {
                        this.to++;
                    }
                }
                else
                {
                    throw "unrecognized token " + this.expression.substring(this.from, this.to);
                }
            }
            return new Token("number", parseFloat(this.expression.substring(this.from, this.to)));
        }
        // one char tokens
        else if (this.expression.charAt(this.to) >= "(" && this.expression.charAt(this.to) <= "+" || this.expression.charAt(this.to) === "-" || this.expression.charAt(this.to) === "/" || this.expression.charAt(this.to) === "^")
        {
            this.to++;
            return new Token(this.expression.charAt(this.from));
        }
        // whitespace
        else if (this.expression.charAt(this.to) >= "\t" && this.expression.charAt(this.to) <= "\r" || this.expression.charAt(this.to) === " ")
        {
            this.to++;
            while (this.expression.charAt(this.to) >= "\t" && this.expression.charAt(this.to) <= "\r" || this.expression.charAt(this.to) === " ")
            {
                this.to++;
            }
            return this.nextToken();
        }
        else
        {
            throw "unrecognized token " + this.expression.charAt(this.to);
        }
    }
};

/*
 * Constructs a syntax tree using recursive descent.
 */
var parse = function(expression)
{
    var advance = function(expected)
    {
        if (expected !== undefined && lookahead.type !== expected)
        {
            throw expected + " expected but " + lookahead.type + " found";
        }
        var token = lookahead;
        lookahead = tokenizer.nextToken();
        return token;
    };
    
    var sum = function()
    {
        var token = product();
        while (lookahead.type === "+" || lookahead.type === "-")
        {
            lookahead.left = token;
            token = advance();
            token.right = product();
        }
        return token;
    };
    
    var product = function()
    {
        var token = sign();
        while (lookahead.type === "*" || lookahead.type === "/")
        {
            lookahead.left = token;
            token = advance();
            token.right = sign();
        }
        return token;
    };
    
    var sign = function()
    {
        if (lookahead.type === "+")
        {
            advance();
            return sign();
        }
        else if (lookahead.type === "-")
        {
            var token = advance();
            token.type = "~";
            token.right = sign();
            return token;
        }
        else
        {
            return power();
        }
    };
    
    var power = function()
    {
        var token = function_();
        if (lookahead.type === "^")
        {
            lookahead.left = token;
            token = advance();
            token.right = sign();
        }
        return token;
    };
    
    var function_ = function()
    {
        var token = factor();
        if (lookahead.type === "(")
        {
            lookahead.left = token;
            token = advance();
            token.right = sum();
            advance(")");
        }
        return token;
    };
    
    var factor = function()
    {
        if (lookahead.type === "(")
        {
            advance();
            var token = sum();
            advance(")");
            return token;
        }
        else if (lookahead.type === "identifier" || lookahead.type === "number")
        {
            return advance();
        }
        else
        {
            throw "unexpected " + lookahead.type;
        }
    };
    
    var tokenizer = new Tokenizer(expression);
    var lookahead;
    advance();
    var token = sum();
    if (lookahead.type !== "end")
    {
        throw "end expected but " + lookahead.type + " found";
    }
    return token;
};

/*
 * The unparse function needs this to determine when to put parentheses around a
 * subexpression.
 */
var precedence =
{
    "*": 1,
    "+": 0,
    "-": 0,
    "/": 1,
    "^": 3,
    "identifier": 4,
    "number": 4,
    "~": 2
};

/*
 * Generates an expression string from a syntax tree.
 */
var unparse = function(token)
{
    // ()
    if (token.type === "(")
    {
        var left = unparse(token.left);
        var right = unparse(token.right);
        return left + "(" + right + ")";
    }
    // *
    else if (token.type === "*")
    {
        var left = unparse(token.left);
        var right = unparse(token.right);
        if (precedence[token.left.type] < 1)
        {
            left = "(" + left + ")";
        }
        if (precedence[token.right.type] < 1)
        {
            right = "(" + right + ")";
        }
        return left + " * " + right;
    }
    // +
    else if (token.type === "+")
    {
        var left = unparse(token.left);
        var right = unparse(token.right);
        return left + " + " + right;
    }
    // -
    else if (token.type === "-")
    {
        var left = unparse(token.left);
        var right = unparse(token.right);
        if (precedence[token.right.type] < 1)
        {
            right = "(" + right + ")";
        }
        return left + " - " + right;
    }
    // /
    else if (token.type === "/")
    {
        var left = unparse(token.left);
        var right = unparse(token.right);
        if (precedence[token.left.type] < 1)
        {
            left = "(" + left + ")";
        }
        if (precedence[token.right.type] < 2)
        {
            right = "(" + right + ")";
        }
        return left + " / " + right;
    }
    // ^
    else if (token.type === "^")
    {
        var left = unparse(token.left);
        var right = unparse(token.right);
        if (precedence[token.left.type] < 4)
        {
            left = "(" + left + ")";
        }
        if (precedence[token.right.type] < 3)
        {
            right = "(" + right + ")";
        }
        return left + "^" + right;
    }
    // identifiers
    else if (token.type === "identifier")
    {
        return token.value;
    }
    // numbers
    else if (token.type === "number")
    {
        return token.value + "";
    }
    // ~
    else if (token.type === "~")
    {
        var right = unparse(token.right);
        if (precedence[token.right.type] < 2)
        {
            right = "(" + right + ")";
        }
        return "-" + right;
    }
    else
    {
        throw "unexpected " + token.type;
    }
};

/*
 * Applies some algebraic simplification rules to a syntax tree. Note that this
 * function changes the tree, so if you need the original tree, make a deep copy
 * of it.
 */
var simplify = function(token)
{
    if (token === undefined)
    {
        return;
    }
    simplify(token.left);
    simplify(token.right);
    if (token.type === "(")
    {
        if (token.left.type !== "identifier")
        {
            throw "function names must be identifiers";
        }
        if (token.left.value === "sin")
        {
            var right = unparse(token.right);
            if (right === "0")
            {
                token.setAttributes("number", 0);
                return;
            }
            else if (right === "pi / 2")
            {
                token.setAttributes("number", 1);
                return;
            }
            else if (right === "pi")
            {
                token.setAttributes("number", 0);
                return;
            }
            else if (right === "3 * pi / 2")
            {
                token.setAttributes("number", -1);
                return;
            }
        }
        else if (token.left.value === "cos")
        {
            var right = unparse(token.right);
            if (right === "0")
            {
                token.setAttributes("number", 1);
                return;
            }
            else if (right === "pi / 2")
            {
                token.setAttributes("number", 0);
                return;
            }
            else if (right === "pi")
            {
                token.setAttributes("number", -1);
                return;
            }
            else if (right === "3 * pi / 2")
            {
                token.setAttributes("number", 0);
                return;
            }
        }
        else if (token.left.value === "tan")
        {
            var right = unparse(token.right);
            if (right === "0")
            {
                token.setAttributes("number", 0);
                return;
            }
            else if (right === "pi")
            {
                token.setAttributes("number", 0);
                return;
            }
        }
        else if (token.left.value === "ln")
        {
            var right = unparse(token.right);
            if (right === "1")
            {
                token.setAttributes("number", 0);
                return;
            }
            else if (right === "e")
            {
                token.setAttributes("number", 1);
                return;
            }
        }
    }
    else if (token.type === "*")
    {
        if (token.left.type === "number" && token.right.type === "number")
        {
            token.setAttributes("number", token.left.value * token.right.value);
            return;
        }
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.setAttributes("number", 0);
                return;
            }
            else if (token.left.value === 1)
            {
                token.copyAttributesFrom(token.right);
                return;
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 0)
            {
                token.setAttributes("number", 0);
                return;
            }
            else if (token.right.value === 1)
            {
                token.copyAttributesFrom(token.left);
                return;
            }
        }
    }
    else if (token.type === "+")
    {
        if (token.left.type === "number" && token.right.type === "number")
        {
            token.setAttributes("number", token.left.value + token.right.value);
            return;
        }
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.copyAttributesFrom(token.right);
                return;
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 0)
            {
                token.copyAttributesFrom(token.left);
                return;
            }
        }
    }
    else if (token.type === "-")
    {
        if (token.left.type === "number" && token.right.type === "number")
        {
            token.setAttributes("number", token.left.value - token.right.value);
            return;
        }
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.setAttributes("~", undefined, undefined, token.right);
                return;
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 0)
            {
                token.copyAttributesFrom(token.left);
                return;
            }
        }
    }
    else if (token.type === "/")
    {
        if (token.left.type === "number" && token.right.type === "number")
        {
            var euclid = function(a, b)
            {
                while (b !== 0)
                {
                    var temp = b;
                    b = a % b;
                    a = temp;
                }
                return a;
            };
            var gcd = euclid(token.left.value, token.right.value);
            if (Math.sign(gcd) !== Math.sign(token.right.value))
            {
                gcd = -gcd;
            }
            if (gcd === token.right.value)
            {
                token.setAttributes("number", token.left.value / token.right.value);
            }
            else
            {
                token.left.setAttributes("number", token.left.value / gcd);
                token.right.setAttributes("number", token.right.value / gcd);
            }
            return;
        }
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.setAttributes("number", 0);
                return;
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 1)
            {
                token.copyAttributesFrom(token.left);
                return;
            }
        }
    }
    else if (token.type === "^")
    {
        if (token.left.type === "number" && token.right.type === "number")
        {
            token.setAttributes("number", Math.pow(token.left.value, token.right.value));
            return;
        }
        if (token.left.type === "number")
        {
            if (token.left.value === 0)
            {
                token.setAttributes("number", 0);
                return;
            }
            else if (token.left.value === 1)
            {
                token.setAttributes("number", 1);
                return;
            }
        }
        if (token.right.type === "number")
        {
            if (token.right.value === 0)
            {
                token.setAttributes("number", 1);
                return;
            }
            else if (token.right.value === 1)
            {
                token.copyAttributesFrom(token.left);
                return;
            }
        }
    }
    else if (token.type === "~")
    {
        if (token.right.type === "number")
        {
            token.setAttributes("number", -token.right.value);
            return;
        }
    }
};

/*
 * Derives a syntax tree. Call it on the root token and recursion will take care
 * of the entire tree. Note that this functions constructs a new tree instead of
 * modifying the original tree.
 */
var derive = function(token)
{
    // functions
    if (token.type === "(")
    {
        // left child must be an identifier
        if (token.left.type !== "identifier")
        {
            throw "function names must be identifiers";
        }
        // sine
        if (token.left.value === "sin")
        {
            return new Token
            (
                "*",
                undefined,
                new Token("(", undefined, new Token("identifier", "cos"), token.right.deepCopy()),
                derive(token.right)
            );
        }
        // cosine
        else if (token.left.value === "cos")
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "~",
                    undefined,
                    undefined,
                    new Token("(", undefined, new Token("identifier", "sin"), token.right.deepCopy())
                ),
                derive(token.right)
            );
        }
        // tangent
        else if (token.left.value === "tan")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "^",
                    undefined,
                    new Token("(", undefined, new Token("identifier", "cos"), token.right.deepCopy()),
                    new Token("number", 2)
                )
            );
        }
        // asin
        else if (token.left.value === "asin")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "(",
                    undefined,
                    new Token("identifier", "sqrt"),
                    new Token
                    (
                        "-",
                        undefined,
                        new Token("number", 1),
                        new Token
                        (
                            "^",
                            undefined,
                            token.right.deepCopy(),
                            new Token("number", 2)
                        )
                    )
                )
            );
        }
        // acos
        else if (token.left.value === "acos")
        {
            return new Token
            (
                "/",
                undefined,
                new Token("~", undefined, undefined, derive(token.right)),
                new Token
                (
                    "(",
                    undefined,
                    new Token("identifier", "sqrt"),
                    new Token
                    (
                        "-",
                        undefined,
                        new Token("number", 1),
                        new Token
                        (
                            "^",
                            undefined,
                            token.right.deepCopy(),
                            new Token("number", 2)
                        )
                    )
                )
            );
        }
        // atan
        else if (token.left.value === "atan")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "+",
                    undefined,
                    new Token("number", 1),
                    new Token
                    (
                        "^",
                        undefined,
                        token.right.deepCopy(),
                        new Token("number", 2)
                    )
                )
            );
        }
        // sinh
        else if (token.left.value === "sinh")
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "(",
                    undefined,
                    new Token("identifier", "cosh"),
                    token.right.deepCopy()
                ),
                derive(token.right)
            );
        }
        // cosh
        else if (token.left.value === "cosh")
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "(",
                    undefined,
                    new Token("identifier", "sinh"),
                    token.right.deepCopy()
                ),
                derive(token.right)
            );
        }
        // tanh
        else if (token.left.value === "tanh")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "^",
                    undefined,
                    new Token
                    (
                        "(",
                        undefined,
                        new Token("identifier", "cosh"),
                        token.right.deepCopy()
                    ),
                    new Token("number", 2)
                )
            );
        }
        // square root
        else if (token.left.value === "sqrt")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                new Token
                (
                    "*",
                    undefined,
                    new Token("number", 2),
                    token.deepCopy()
                )
            );
        }
        // natural logarithm
        else if (token.left.value === "ln")
        {
            return new Token
            (
                "/",
                undefined,
                derive(token.right),
                token.right.deepCopy()
            );
        }
        else
        {
            throw "derivative not implemented";
        }
    }
    // *
    else if (token.type === "*")
    {
        return new Token
        (
            "+",
            undefined,
            new Token("*", undefined, derive(token.left), token.right.deepCopy()),
            new Token("*", undefined, token.left.deepCopy(), derive(token.right))
        );
    }
    // +
    else if (token.type === "+")
    {
        return new Token("+", undefined, derive(token.left), derive(token.right));
    }
    // -
    else if (token.type === "-")
    {
        return new Token("-", undefined, derive(token.left), derive(token.right));
    }
    // /
    else if (token.type === "/")
    {
        return new Token
        (
            "/",
            undefined,
            new Token
            (
                "-",
                undefined,
                new Token("*", undefined, derive(token.left), token.right.deepCopy()),
                new Token("*", undefined, token.left.deepCopy(), derive(token.right))
            ),
            new Token("^", undefined, token.right.deepCopy(), new Token("number", 2))
        );
    }
    // ^
    else if (token.type === "^")
    {
        // f(x)^c --> c * f(x)^(c - 1) * f'(x)
        if (token.right.isConstant())
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "*",
                    undefined,
                    token.right.deepCopy(),
                    new Token
                    (
                        "^",
                        undefined,
                        token.left.deepCopy(),
                        new Token("-", undefined, token.right.deepCopy(), new Token("number", 1))
                    )
                ),
                derive(token.left)
            );
        }
        // c^f(x) --> c^f(x) * ln(c) * f'(x)
        else if (token.left.isConstant())
        {
            return new Token
            (
                "*",
                undefined,
                new Token
                (
                    "*",
                    undefined,
                    token.deepCopy(),
                    new Token("(", undefined, new Token("identifier", "ln"), token.left.deepCopy())
                ),
                derive(token.right)
            );
        }
        else
        {
            throw "derivative not implemented";
        }
    }
    // constants
    else if (token.type === "identifier")
    {
        if (token.value === "x")
        {
            return new Token("number", 1);
        }
        else
        {
            return new Token("number", 0);
        }
    }
    else if (token.type === "number")
    {
        return new Token("number", 0);
    }
    // unary -
    else if (token.type === "~")
    {
        return new Token("~", undefined, undefined, derive(token.right));
    }
    else
    {
        throw "derivative not implemented";
    }
};

/*
 * Derives an expression string and returns the derivative as a string.
 */
var deriveExpression = function(expression)
{
    var token = parse(expression);
    simplify(token);
    token = derive(token);
    // Now we unparse the syntax tree and parse it right back. This seems stupid
    // but sometimes it "cleans" the syntax tree making it easier for simplify
    // to digest.
    token = parse(unparse(token));
    simplify(token);
    return unparse(token);
};
