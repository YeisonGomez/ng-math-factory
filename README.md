# ng-math-factory

ng-math-factory es una libreria que soluciona problemas matemáticos con [AngularJS](https://angularjs.org/).

## Instalación #

```bash
$ bower install ng-math-factory --save
```

Esta acción es para agregarla como dependencia en el archivo ```bower.json```.

La libreria JavaScript debe agregarse en el **index.html** de tu proyecto:

```javascript
<script src="../ng-math-factory/dist/ng-math-factory.min.js"></script>
```

### Inyectando:

Ahora debe inyectar la libreria en su módulo **app.js**:

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
		$scope.method_current = { name: module, sub: sub };
		if(sub.in == "formula"){
			//Obtener un String con la formula a resolver
		}else if(sub.in == "xy"){
			//Obtener un arreglo de JSON especificado en la descripción de **in**
		}
    }
});
```

De esta forma se obtiene los métodos que proporciona ng-math-factory, para luego listarlos en tu aplicación.
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

**1. formula:** Se define que el método solicita un string con una formula a resolver. ("3 + 4 - 6 * 5 / 2")
**2. xy:** Se define que el método espera un arreglo de JSON's de esta forma:

```javascript
[
	{x: 1, y 2},
	{x: 3, y 4},
	{x: 5, y 6}
]
```

**Paso 3. Renderizar métodos**

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

	//input son los datos que solicita el método actual.
    $scope.solution = function(input) {
        $math.resolve($scope.method_current, input, function(data, html) {
            $scope.resolveHTML = html.resolve;
            $scope.resolveGraphics = html.graphics;
            $scope.solveProblem = data;
        });
    }
});
```

El metodo **resolve** de la factoria $math retorna 2 objetos:

##### Retorna

- **data** - Es la solución de la formula solicitada en forma de JSON.
- **html** - Es un JSON con dos rutas de un archivo html con la respuesta ya renderizada, ejemplo:

```javascript
{
	resolve: "lib/math/src/example_module/view_example_module.html",
	graphics: "lib/math/src/example_module/view_graphics.html"
}
```

**Paso 4. Renderizar la respuesta**

```html
<div ng-include src="resolveHTML"></div>
<div ng-include src="resolveGraphics"></div>
```

# Contribuir #
Para contribuir y agregar nuevos modulos a Nume, debes tener conceptos basicos de Angular 1 y highcharts-ng. Siguiendo unos cuantos pasos la implementación de un nuevo modulo sera muy sencillo y funcional. 

**Paso 1**

- En el editor de codigo ubicarse en: /www/js/math/
- Crear nuevo modulo: /www/js/math/mi_nuevo_modulo/
- Dentro del nuevo modulo crear 3 archivos, ejemplo: 
	1. mi_nuevo_modulo.js
	2. view_mi_nuevo_modulo.html
	3. view_graphics.html
- En el /www/index.html déspues del <body>:
	
	```javascript
		<script src="js/math/mi_nuevo_modulo/mi_nuevo_modulo.js"></script>
	```

**Paso 2**

En /www/js/controller.js agregar el nuevo modulo con sus sub-modulos

```javascript
	$scope.methods = [
		{
	        name: "AJ de curvas",
	        sub: [
	            { name: "Mínimos cuadrados", in : "xy" }
	        ]
	    },
		{
			name: "mi_nuevo_modulo",
			sub: [
				{name: "Sumar", in: "formula"}
				{name: "Restar", in: "formula"}
			]
		}
	]
```
**in**

Es el tipo de entrada que se va utilizar:

1. **formula:** Activa el input en el header para agregar una fórmula
2. **xy:** Activa un modal con una tabla donde solicita x, y.
3. **matriz:** "En desarrollo"

**Paso 3**

En /www/js/math/math_factory.js agregar 
```javascript
app.factory('mathFactory', function(minumSquare, miNuevoModulo) {
    return {
        solution: function(methods, input, callback) {
            if (methods.module == "AJ de curvas") {
                minumSquare.options(input, methods.sub, function(data, html) {
                    callback(data, html);
                });
            }else if(methods.module == "mi_nuevo_modulo"){
            	miNuevoModulo.options(input, methods.sub, function(data, html){
            		callback(data, html);
            	});
            }
        }
    }
});
```
**Nota:**
miNuevoModulo es el nombre del factory donde se agregara los nuevos metodos, ver el paso 4

**Paso 4**

En el script de el nuevo modulo

```javascript
app.factory('miNuevoModulo', function() {

	var add = function(input) {
            return input.a + input.b;
   	}

	var substract = function(input){
		return input.a - input.b;
	}

    return {
        options: function(input, sub_module, callback){
            var html = {
                resolve: "/js/math/mi_nuevo_modulo/view_mi_nuevo_modulo.html",
                graphics: "/js/math/mi_nuevo_modulo/view_graphics.html"
            };

            if(sub_module == "Sumar"){
            	callback(add(input), html);
            }else if(sub_module == "Restar"){
				callback(substract(input), html);
            }    
        }
    }
});
```
**Paso 5**

La solución en pantalla para el usuario es editable por el contributor. Para personalizar la vista y mostrar la solución del nuevo modulo se debe agregar en 
"/js/math/mi_nuevo_modulo/view_mi_nuevo_modulo.html"

```html
<h1>La solución del problema es:</h1>
<h2>{{solveProblem}}</h2>
```

**Nota:** {{solveProblem}} es la variable que contiene la respuesta del script proporcionado por el contributor **(no puede ser editable)**.

#Agregar gráfica con [highcharts-ng](https://github.com/pablojim/highcharts-ng)#

Para agregar una grafica se debe llevar a cabo en la respuesta del script, ejemplo:
	
**/www/js/math/mi_nuevo_modulo/mi_nuevo_modulo.js**

```javascript
var add = function(input) {
	var solution = {
		problem: input.a + input.b,
		miGrafica: []
	};

	//chartConfig son las configuraciones que solicita la libreria highcharts-ng
	solution.miGrafica = chartConfig; 
    return solution;
}
```

**/www/js/math/mi_nuevo_modulo/view_graphics.html**

```html
<highchart id="chart1" config="solveProblem.miGrafica"></highchart>
```

**Nota:** solveProblem no puede ser editado
