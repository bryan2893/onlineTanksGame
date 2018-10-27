$(document).ready(function(){

    //*******************Logica de sockets.
    let options = {};
    let socket = io('http://localhost:3000/',options);

    socket.on('connect',function(serverSocket){
        console.log('conectado al servidor de socket!');

        socket.on('crear-tanke',function(data){

        });

    });
    //***********************************/

    //Inicio de juego********************
    let iniciarJuego = function(){
        //Dibujar Escenario

        console.log("Iniciando juego!");
        ctx.drawImage(ImageManager.getImage('tanke_player_1_abajo'),500,0);
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