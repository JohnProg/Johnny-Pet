var j5 = require("johnny-five");
var board = new j5.Board();
var servo;

module.exports.actions = function(socket){
    var LEDPIN = 13;        // Luz Led
    var PUERTAPIN = 10;     // servomotor para abrir la puerta
    var GIROPIN = 9;        // servomotor que va con el sensor
    var MASCOTAPIN = 8;     // Ultrasonido detecta la mascota cerca
    var COMIDAPIN = 7;      // Ultrasonido detecta el contendor de la comida
    var PRESIONPIN = 0;

    var disMinimoComida = 3;    // Distancia minima del contenedor de comida(contenedor vacio)
    var pesMinimoComida = 3;    // Peso minimo del plato (plato vacio)
    var proxMascota = 40;        // Distancia del sensor ha la mascota (mascota en el plato)      
    var estadoPuerta = 0;       // Estado de la puerta, abierta o cerrada
    var puertaAbierta= 90;      // Angulo que determina la puerta abierta
    var puertaCerrada = 0;      // Angulo que determina la puerta cerrada
    var tiempoComida =  5;      // Tiempo que la puerta permanece abierta
    var estado = 0;
    var estado2 = 0;

    board.on("ready", function(){
        servoPuerta = new j5.Servo(PUERTAPIN);
        servoGiro = new j5.Servo(GIROPIN);
        pingMascota = new j5.Ping(MASCOTAPIN);
        pingComida = new j5.Ping(COMIDAPIN);
        led = new j5.Led(LEDPIN);

        //obteniendo valores de los sensores
        // distanciaM = distanciaMascota();        // Distancia de la mascota
        // distanciaC = distanciaComida();         // Distancia del contenedor de comida
        // pesoC = pesoPlato();                    // Peso del plato  

        //---------------------------------------
        //Algoritmo
        //---------------------------------------
        //La mascota se acerco al plato de comida
/*
        if(proxMascota > distanciaM){
            //Existe comida en el contenedor
            if(distanciaC > disMinimoComida){
                //El peso del plato es menor al minimo para volver a llenarlo
                if(pesMinimoComida > pesoC){
                    abrirPuerta();
                    //Puerta abierta segun el tiempo declarado
                    board.loop( tiempoComida * 1000, function() {
                        socket.emit('notification', { msg: 'Su mascota ha sido alimentada' });
                    }
                    cerrarPuerta();
                } else {
                    console.log('ya hay comida en el plato')
                }
            } else {
                console.log('Notificar al dueño');
                socket.emit('notification', { msg: 'No hay comida para su mascota' });
            }

        }  
*/


    board.loop( 6000, function() {
        servoGiro.sweep();

        pingMascota.on("data", function(err, value) {});

        pingMascota.on("change", function(err, value) {
            distancia = this.cm ;
            if(distancia <= proxMascota ){
                servoGiro.stop();
                estado = 1;
                console.log('el perro esta cerca');
            }
        });

        if(estado == 1){
            pingComida.on("data", function(err, value) {});

            pingComida.on("change", function(err, value) {
                distanciaComida = this.cm ;
                if(distanciaComida <= 20){
                    estado2 = 1;
                    console.log('hay comida');
                }
                else{
                    estado = 0;
                }
                // console.log("Distancia 2: " + distanciaComida+ " cm.");
            });
        }

        if(estado2 ==1){
            console.log('analizar presion');
            this.analogRead(0, function(voltage) {
                if(voltage <= 14){
                    console.log('abierto');
                    abrirPuerta();
                } else {
                    console.log('cerrado');
                    cerrarPuerta();
                    estado2 = 0;
                }
                console.log(voltage);
            });
        }


        // console.log(distanciaM);


        // if(estadoPuerta == 0){
        //     abrirPuerta();
        // } else { 
        //     cerrarPuerta();
        // }



    });
        

    });


    function distanciaComida(){
        distancia  = 0;
        pingComida.on("data", function(err, value) {
            console.log("data", value);
        });

        pingComida.on("change", function(err, value) {
            distancia = this.cm ;
            console.log("Distancia " + distancia+ " cm.");
        });

        return distancia;
    }

    function pesoPlato(){
        peso = 0;
        this.analogRead(0, function(voltage) {
            return peso;
        });
    }

    function abrirPuerta(){
        console.log('Abierto');
        led.on();
        estadoPuerta = 1;
        // board.loop( 3000, function() {
            servoPuerta.to(puertaAbierta);
        // });
    }

    function cerrarPuerta(){
        estadoPuerta = 0;
        console.log('Cerrado');
        led.off();
        // board.loop( 3000, function() {
            servoPuerta.to(puertaCerrada);
        // });
    }

    socket.on('apagar', function(data){
        console.log('Apagado');
        led.off();
        servo.stop();
    });

    socket.on('prender', function(data){
        console.log('Prendido');
        led.on();
    });


    return board;
};