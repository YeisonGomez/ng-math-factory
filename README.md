# ng-math-factory

ng-math-factory es una librería que soluciona problemas matemáticos con [AngularJS](https://angularjs.org/).

-  [Instalación](#instalación)
-  [Inyectando](#inyectando)
-  [Uso](#uso)
-  [Contribuir](#contribuir)
-  [Agregar gráfica](#agregar-gráfica-con-highcharts-ng)
-  [Probar y depurar código](#probar-y-depurar-código-con-gulp)

## Instalación #

```bash
$ bower install ng-math-factory --save
```

Esta acción ( --save ) es para agregarla como dependencia en el archivo ```bower.json```.

La librería JavaScript debe agregarse en el **index.html** de tu proyecto:

```javascript
<script src="../ng-math-factory/dist/ng-math-factory.min.js"></script>
```

### Inyectando: #

Ahora debe inyectar la librería en su módulo **app.js**:

```
var app = angular.module('myapp', ['ng-math-factory']);
```

## Uso #

**Paso 1. Obtener métodos**

```javascript
app.controller('appCtrl', function($scope, $math) {
    $scope.methods = $math.getMethods();

	//Función para obtener el metodo seleccionado.
    $scope.selectMethod = function(module, sub){
		$scope.method_current = { name: module, sub: sub.name };
		if(sub.in == "formula"){
			//Obtener un String con la formula a resolver
		}else if(sub.in == "xy"){
			//Obtener un arreglo de JSON especificado en la descripción de **in**
		}
    }
});
```

De esta forma se obtiene los métodos que proporciona ng-math-factory, para luego poder listarlos en tu aplicación.
Los datos se obtiene en formato JSON con esta estructura:

```javascript
[{
    name: 'example',
    sub: [
        { name: 'Sumar', in : 'formula' },
        { name: 'Restar', in : 'formula' },
        { name: 'Multiplicar', in : 'formula' }
    ],
    factory: 'exampleFactory'
}]
```

## in #

Es el tipo de entrada que se va utilizar:

**1. formula:** Se define que el método solicita un string con una formula a resolver ("3 + 4 - 6 * 5 / 2").</br>
**2. xy:** Se define que el método espera un arreglo de JSON de esta forma:

```javascript
[
	{x: 1, y: 2},
	{x: 3, y: 4},
	{x: 5, y: 6}
]
```

**Paso 2. Renderizar métodos**

```html
<div ng-repeat="module in methods">
	<h3>{{module.name}}</h3>
	<button ng-repeat="sub in module" ng-click="selectMethod(module.name, sub)">{{sub.name}}</button>
</div>
```

Utilizamos la función para seleccionar el método a utilizar.

**Paso 3. Resolver**

```javascript
app.controller('appCtrl', function($scope, $math) {

    $scope.solution = function(input) {
        $math.resolve($scope.method_current, input, "/bower_components", function(data, html) {
            $scope.resolveHTML = html.resolve;
            $scope.resolveGraphics = html.graphics;
            $scope.solveProblem = data;
        });
    }
});
```

**$scope.method_current** es el método actualmente seleccionado:

```javascript
{ name: "mi_nuevo_modulo", sub: "Sumar" }
```

**input** son los datos que solicita el método actual.

**"/bower_components"** es la ruta donde esta la librería ng-math-factory actualmente.

El metodo **resolve** de la factoria $math retorna 2 objetos:

##### Retorna

- **data** - Es la solución de la formula solicitada en formato JSON.
- **html** - Es un JSON con dos rutas de un archivo html con la respuesta ya renderizada, ejemplo:

```javascript
{
	resolve: "lib/ng-math-factory/src/example_module/view_example_module.html",
	graphics: "lib/ng-math-factory/src/example_module/view_graphics.html"
}
```

**Paso 4. Renderizar la respuesta**

```html
<div ng-include src="resolveHTML"></div>
<div ng-include src="resolveGraphics"></div>
```

# Contribuir #
Para contribuir y agregar nuevos módulos a ng-math-factory, debes tener conceptos basicos de Angular 1 y highcharts-ng. Siguiendo unos cuantos pasos la implementación de un nuevo módulo será muy sencillo y funcional. 

Para hacer pruebas podras utilizar el [demo](https://github.com/YeisonGomez/ionic-methods-numerals), modificando la librería y la aplicación automáticamente tomara la actualización corriendola en local.

**Paso 1. Adjuntar mi_nuevo_modulo**

- En el editor de código ubicarse en: /ng-math-factory/src/
- Crear una carpeta con el nombre del nuevo módulo: /ng-math-factory/src/mi_nuevo_modulo/
- Dentro del nuevo módulo crear 3 archivos, ejemplo: 
	- mi_nuevo_modulo.js
	- view_mi_nuevo_modulo.html
	- view_graphics.html (Procurar no editar el nombre)

**Paso 2. Hacer push**

En /ng-math-factory/src/methods.js agregar el nuevo modulo con sus sub-modulos.

```javascript
(function() {
'use strict';

    angular.module('math.methods', []).factory("$methods", function() {
		return [
			{
		        name: "Ajuste de curvas",
		        sub: [
		            { name: "Mínimos cuadrados", in : "xy" }
		        ],
		        factory: "adjustCurve"		        
		    },
			{
				name: "mi_nuevo_modulo",
				sub: [
					{name: "Sumar", in: "formula"}
					{name: "Restar", in: "formula"}
				],
				factory: "miNuevoModulo",
				libs: [ /*Opcional*/
		        	'/mi_nuevo_modulo/lib/libreria.js'
		        ]
			}
		]
	});
})();
```
**in**

Es el tipo de entrada que se va utilizar:

**1. formula:** Se define que el método solicita un string con una formula a resolver ("3 + 4 - 6 * 5 / 2").</br>
**2. xy:** Se define que el método espera un arreglo de JSON de esta forma:

```javascript
[
	{x: 1, y: 2},
	{x: 3, y: 4},
	{x: 5, y: 6}
]
```

**Paso 3. Crear mi factoria**

En /ng-math-factory/src/mi_nuevo_modulo/mi_nuevo_modulo.js agregar.

```javascript
(function() {
    'use strict';
    angular.module('math.mi-nuevo-modulo', []).factory('miNuevoModulo', function($q) {
        return {
            options: function(input, sub_module, libs) {
                var deferred = $q.defer();
                var html = {
                    resolve: "/src/mi_nuevo_modulo/view_mi_nuevo_modulo.html",
                    graphics: "/src/mi_nuevo_modulo/view_graphics.html" //Opcional
                };

                if (sub_module == "Sumar") {
                    deferred.resolve([add(input), html]);
                } else if(sub_module == "Restar"){
					deferred.resolve([substract(input), html]);
                }else{
                    deferred.reject("Método desconocido");
                }
                return deferred.promise;
            }
        };

		function add(input) {
            return metodo_libreria(input);
	   	}

		function substract(input){
			return metodo_libreria(input);
		}
});
```

**Nota:** Para el uso de una dependencia más, deben agregar el script dentro de la carpeta lib, que previamente debe ser creada dentro del nuevo módulo.

**Paso 4. Agregar mi_nuevo_modulo**

En /ng-math-factory/src/math-factory.js agregar.

```javascript
angular.module('ng-math-factory', 
[
    'math.methods',
    'math.mi-nuevo-modulo'
])
```

**Paso 5. Renderizar la vista**

La solución en pantalla para el usuario es editable por el contributor. Para personalizar la vista y mostrar la solución del nuevo módulo se debe agregar en 
"/ng-math-factory/src/mi_nuevo_modulo/view_mi_nuevo_modulo.html"

```html
<h1>La solución del problema es:</h1>
<h2>{{solveProblem}}</h2>
```

**Nota:** solveProblem es la variable que contiene la respuesta del script proporcionado por el contributor **(no puede ser editable)**.

#Agregar gráfica con [highcharts-ng](https://github.com/pablojim/highcharts-ng)#

Para agregar una grafica se debe llevar a cabo en la respuesta del script, ejemplo:
	
**/ng-math-factory/src/mi_nuevo_modulo/mi_nuevo_modulo.js**

```javascript
function add(input) {
	var solution = {
		problem: metodo_libreria(input),
		miGrafica: []
	};

	//chartConfig son las configuraciones que solicita la librería highcharts-ng
	solution.miGrafica = chartConfig; 
    return solution;
}
```

**/ng-math-factory/src/mi_nuevo_modulo/view_graphics.html**

```html
<highchart id="chart1" config="solveProblem.miGrafica"></highchart>
```

**Nota:** solveProblem no es editable.

# Probar y depurar código con gulp #

Para probar la libreria en el [demo](https://github.com/YeisonGomez/ionic-methods-numerals) se debe modificar directamente la libreria desde la carpeta **/www/lib/ng-math-factory/src** y acceder desde la terminal, luego ejecutar:

```bash
$ gulp minify
```

El comando quedara escuchando los cambios que se hagan en los scripts de la librería. 

**Nota:** Correr el demo con **ionic serve**, y refrescar la página cuando hay cambios en la librería.
