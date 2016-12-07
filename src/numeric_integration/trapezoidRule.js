alert("HI");
var ValoresdeY;
ValoresdeY=[1,2,3,4,5]; //como no se como maneja la variable la deje estatica :v
var puntoa=2;//el a de la integral
var puntob=3;//b de la integral definida
var particiones=4;//esto es N
var DeltaX=(puntob-puntoa)/particiones;//Delta de X
//aca va el sumador del arreglo de valores
var sumatoriasY=0;
for (var i=1; i<ValoresdeY.length-1; i++) { sumatoriasY += ValoresdeY[i]; }
//aca termina
var valortrapecio=DeltaX*(ValoresdeY[ValoresdeY.length-1]+ValoresdeY[0]+(2*sumatoriasY));
console.log(valortrapecio);