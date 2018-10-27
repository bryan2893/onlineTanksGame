const http = require('http');
const express = require('express');
let app = express();
const path = require('path');

const httpServer = http.createServer(app);//Se crea el servidor http y se envia como paramtero el app de express.

app.use('/',express.static('public'));

app.get('/cliente',function(req,res){
    res.sendFile(path.join(path.join(__dirname+'/cliente-prueba.html')));
});

const io = require('socket.io')(httpServer,{pingInterval: 1000,pingTimeout: 1500});


io.on('connect',function(socketPlayer){

    console.log('SomeOne is connected!');

    socketPlayer.emit('esta',"aqui estoy papi");

    socketPlayer.on('disconnect',function(reason){
        console.log('desconectado por '+reason);
    });
});

httpServer.listen(3000,function(){
    console.log("Servidor de sockets escuchando en el puerto 3000!");
});