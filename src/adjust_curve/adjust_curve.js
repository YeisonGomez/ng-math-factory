(function() {
    'use strict';
    angular.module('math.adjust-curve', [])
        .factory('adjustCurve', function() {
            return {
                "Mínimos cuadrados": minime_square
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
        });
})();
