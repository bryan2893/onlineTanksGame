const http = require('http');
const express = require('express');
let app = express();
const path = require('path');

let SessionsManager = require('./server-logic/SessionsManager');
let BulletsManager = require('./server-logic/BulletsManager');
let Tank = require('./server-logic/Tank');
let Area = require('./server-logic/Area');
let Bullet = require('./server-logic/Bullet');
let WallConstructor = require('./server-logic/WalleConstructor');
let WallWatcher = require('./server-logic/WallWatcher');

let sessionsManager = new SessionsManager();
let bulletsManager = new BulletsManager();
let wallConstructor = new WallConstructor();//se utiliza cada vez que se quiere reiniciar el juego.

let wallWatcher = new WallWatcher(wallConstructor.getWalls());

console.log(wallWatcher.getListOfWallsInJsonFormat());


const httpServer = http.createServer(app);//Se crea el servidor http y se envia como paramtero el app de express.

app.use('/',express.static('public'));

app.get('/cliente',function(req,res){
    res.sendFile(path.join(path.join(__dirname+'/cliente-prueba.html')));
});

const io = require('socket.io')(httpServer,{pingInterval: 1000,pingTimeout: 1500});

io.on('connect',function(socketPlayer){

    //*******************************Logica para manejo de sesiones de jugadores(tankes)******************

    socketPlayer.emit('update-scenario-by-first-time',{lista_de_tankes: sessionsManager.getListOfTanksInJsonFormat(),lista_balas:bulletsManager.getListOfBulletsInJsonFormat(),walls:wallWatcher.getListOfWallsInJsonFormat()});

    //se crea un nuevo tanke en el servidor por cada conexion nueva...
    let newTank = new Tank(socketPlayer.id,'player',new Area(0,0,32,32),5,'derecha');

    //Se pone el tanke online con el manejador de sesiones.
    sessionsManager.setTank(newTank);
    console.log("Tanke online! hay "+sessionsManager.getNumberOfTanksOnline()+" tankes online");

    //Se envia el tanke creado al cliente conectado.
    socketPlayer.emit('create-local-tank',newTank.getJsonRepresentation());

    //Se le avisa a los demas jugadores de la creacion de un tanke.
    socketPlayer.broadcast.emit('new-tank-online', newTank.getJsonRepresentation());

    socketPlayer.on('disconnect',function(){
        sessionsManager.disconnectTank(socketPlayer.id);
        socketPlayer.broadcast.emit('tank-off-line',{idTanke:socketPlayer.id});
        console.log("Tanke desconectado correctamente ahora hay "+sessionsManager.getTanksOnline().length+" tankes online");
    });


    //registra el movimiento del tanke por parte del cliente.
    socketPlayer.on('register-movement',function(data){
        //hacer algo con el movimiento registrado!
        let tankThatIsReporting = sessionsManager.findTank(data.idTanke);

        //HACER ALGO PORQUE ESTAMOS FEOS

        if(tankThatIsReporting){
            let tankVelocity = tankThatIsReporting.tankVelocity;

            let tankAreaProve = wallWatcher.replicateFutureTankAreaForProve(tankThatIsReporting,data.direccion);

            let posibleChokWall = wallWatcher.verifyIfAreaChokWithAnyWall(tankAreaProve);
            if(posibleChokWall){
                socketPlayer.emit('movement-confirmation',{mensaje:"no"});
            }else{
                socketPlayer.emit('movement-confirmation',{mensaje:"si",direccion:data.direccion});
                tankThatIsReporting.move(data.direccion);
                socketPlayer.broadcast.emit('tank-is-moving',{idTanke:socketPlayer.id,direccion:data.direccion});
            }
        }
    });

    /*****************************Logica para disparos del tanke***********************************/

    //cuando un cliente dispare...
    socketPlayer.on('shoot',function(data){

        let area = new Area(data.x,data.y,data.w,data.h);
        let bullet = new Bullet(data.bulletId,3,area,data.direction);

        bulletsManager.setBullet(bullet); //se registra la bala en el BulletsManager del server.

        //Se le avisa a los demas usuarios online que el usuario disparó.(se envia la informacion del disparo para que el cliente lo pinte en su interfaz)
        socketPlayer.broadcast.emit('other-player-shoot-by-first-time',data);

    });

    socketPlayer.on('bullet-step',function(data){
        let bulletRunnig = bulletsManager.findBullet(data.bulletId);
        if(bulletRunnig){
            //Verificar si las balas tocan algun objeto o se salen de las dimensiones del cuadro de juego.
            bulletRunnig.move(data.direccion);

            console.log("Bala en eje x,y = "+bulletRunnig.area.getX()+","+bulletRunnig.area.getY());
            if (bulletRunnig.area.getX() > 800){
                console.log("El tanke esta fuera de limite derecho!");
            }
        }
        
        //IMPORTANTE: aqui hay que verificar cada paso que dé la bala, para detectar cuando choque con algo.

        //se le anuncia a los demas clientes que la bala se esta moviendo.
        socketPlayer.broadcast.emit('another-client-bullet-is-moving',{bulletId:data.bulletId});
    });
});

httpServer.listen(3000,function(){

    let areaMuro = new Area(10,50,16,16);
    let areaBala = new Area(10,44,8,8);

    console.log(areaMuro.interseca(areaBala));

    console.log("Servidor de sockets escuchando en el puerto 3000!");
});