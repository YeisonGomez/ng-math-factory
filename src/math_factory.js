app.factory('mathFactory', function(minumSquare) {

    var methods_factory = [{
        name: 'AJ de curvas',
        sub: [
            { name: 'Mínimos cuadrados', in : 'xy' },
            { name: 'Interpolación lineal', in : 'xy' }
        ],
        factory: 'minumSquare'
    }, {
        name: '5 Métodos',
        sub: [
            { name: 'Punto fijo', in : 'formula' },
            { name: 'Bisección', in : 'formula' },
            { name: 'Newton Raphson', in : 'formula' },
            { name: 'Regla falsa', in : 'formula' }
        ]
    }, {
        name: 'Matriz',
        sub: [
            { name: 'Gauss Jordan', in : 'matriz' }
        ]
    }];

    return {
        solution: function(methods, input, callback) {
            for (var i = 0; i < methods_factory.length; i++) {
                if (methods.module === methods_factory[i].name) {
                    eval(methods_factory[i].factory).options(input, methods.sub,
                        function(data, html) {
                            callback(data, html);
                        });
                    break;
                }
            }
        },
        getMethods: function() {
            return methods_factory;
        }
    };
});
