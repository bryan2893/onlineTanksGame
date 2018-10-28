$(document).ready(function(){

    let canvas = document.getElementById("gameField");
    canvas.width = 600;
    canvas.height = 600;
    let ctx = canvas.getContext("2d");

    //*******************Logica de sockets.
    let options = {};
    let socket = io('http://localhost:3000/',options);

    socket.on('connect',function(){
        console.log('conectado al servidor de socket!');

        socket.on('create-tank',function(data){
            let area = new Area(data.x,data.y,data.width,data.height);
            let l = ImageManager.getImage('tanke_player_1_izquierda');
            let r = ImageManager.getImage('tanke_player_1_derecha');
            let u = ImageManager.getImage('tanke_player_1_arriba');
            let b = ImageManager.getImage('tanke_player_1_abajo');
            let tanke = new Tank(data.nombre,area,ctx,l,r,b,u);
            tankeLocal = tanke;
            tanke.display('derecha');
        });

        //Avisa que algun tanke se está moviendo.
        socket.on('move-tank',function(data){

        });

    });

    let tankeLocal = null; //almacena el objeto tanke local.
    //*******Movimiento de tanke y disparo con teclas direccionales y tecla espacio**
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:
                tankeLocal.move('izquierda');
                break;
            case 38:
                tankeLocal.move('arriba');
                break;
            case 39:
                tankeLocal.move('derecha');
                break;
            case 40:
                tankeLocal.move('abajo');
                break;
            case 32:
                alert("disparó!");
                break;
        }
    };

    //Inicio de juego********************
    let iniciarJuego = function(){
        //Dibujar Escenario

        console.log("Iniciando juego!");
    };
    //************************************/

    //Intervalo de confianza******************
    let intervalo = setInterval(function(){

        if(ImageManager.getLoadingProgress() === 100){
            clearInterval(intervalo);
            iniciarJuego();//se inicia el juego una vez que las imagenes estan cargadas.
        }

    },1);
    //*****************************************/

});