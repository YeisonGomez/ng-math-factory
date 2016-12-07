var ValoresdeY;
ValoresdeY = [1, 2, 3, 4, 5]; //como no se como maneja la variable la deje estatica :v
var puntoa = 2; //el a de la integral
var puntob = 3; //b de la integral definida
var particiones = 4; //esto es N
var DeltaX = (puntob - puntoa) / particiones; //Delta de X
//aca va el sumador del arreglo de valores
var sumatoriaspar = 0;
for (var i = 2; i < ValoresdeY.length - 1; i += 2) { sumatoriaspar += ValoresdeY[i]; }
var sumatoriasimpar = 0;
for (var i = 1; i < ValoresdeY.length - 1; i += 2) { sumatoriasimpar += ValoresdeY[i]; }
//aca termina
var valortercio = DeltaX * (ValoresdeY[ValoresdeY.length - 1] + ValoresdeY[0] + (4 * sumatoriasimpar) + (2 * sumatoriaspar));
console.log(valortercio);
