const http = require('http');
const express = require('express');
let app = express();
const path = require('path');

let SessionsManager = require('./server-logic/SessionsManager');
let Tank = require('./server-logic/Tank');
let Area = require('./server-logic/Area');

let sessionsManager = new SessionsManager();

const httpServer = http.createServer(app);//Se crea el servidor http y se envia como paramtero el app de express.

app.use('/',express.static('public'));

app.get('/cliente',function(req,res){
    res.sendFile(path.join(path.join(__dirname+'/cliente-prueba.html')));
});

const io = require('socket.io')(httpServer,{pingInterval: 1000,pingTimeout: 1500});


io.on('connect',function(socketPlayer){

    //se crea un nuevo tanke en el servidor por cada conexion nueva...
    let newTank = new Tank(socketPlayer.id,'player',new Area(0,0,32,32),5);

    //Se pone el tanke online con el manejador de sesiones.
    sessionsManager.setTank(newTank);
    console.log("Tanke online! hay "+sessionsManager.getNumberOfTanksOnline()+" tankes online");

    //socketPlayer.emit('create-tank',{nombre:'P1',x:0,y:0,width:32,height:32});

    socketPlayer.on('disconnect',function(){
        sessionsManager.disconnectTank(socketPlayer.id);
        console.log("Tanke desconectado correctamente ahora hay "+sessionsManager.getTanksOnline().length+" tankes online");
    });

    socketPlayer.on('register-movement',function(data){
        //hacer algo con el movimiento registrado!
    });
    
});

httpServer.listen(3000,function(){
    console.log("Servidor de sockets escuchando en el puerto 3000!");
});