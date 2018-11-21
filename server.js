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


const httpServer = http.createServer(app);//Se crea el servidor http y se envia como paramtero el app de express.

app.use('/',express.static('public'));

app.get('/cliente',function(req,res){
    res.sendFile(path.join(path.join(__dirname+'/cliente-prueba.html')));
});

const io = require('socket.io')(httpServer,{pingInterval: 1000, pingTimeout: 1500});

io.on('connect',function(socketPlayer){

    //*******************************Logica para manejo de sesiones de jugadores(tankes)******************

    socketPlayer.emit('update-scenario-by-first-time',{lista_de_tankes: sessionsManager.getListOfTanksInJsonFormat(),lista_balas:bulletsManager.getListOfBulletsInJsonFormat(),walls:wallWatcher.getListOfWallsInJsonFormat()});

    let randomBirthArea = wallConstructor.chooseRandomlyArea();

    //se crea un nuevo tanke en el servidor por cada conexion nueva...
    let newTank = new Tank(socketPlayer.id,'player',randomBirthArea,5,'derecha');

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
        let bullet = new Bullet(data.idTanke,data.idInterval,3,area,data.direction);

        bulletsManager.setBullet(bullet); //se registra la bala en el BulletsManager del server.

        //Se le avisa a los demas usuarios online que el usuario disparó.(se envia la informacion del disparo para que el cliente lo pinte en su interfaz)
        socketPlayer.broadcast.emit('other-player-shoot-by-first-time',data);

    });

    socketPlayer.on('bullet-step',function(data){
        let bulletRunnig = bulletsManager.findBullet(data.idInterval,data.idTanke);
        if(bulletRunnig){
            //Verificar si las balas tocan algun objeto o se salen de las dimensiones del cuadro de juego.
            bulletRunnig.move(data.direccion);

            //PRIORIDAD 1
            let posibleTank = sessionsManager.verifyIfChokWithAnyTank(bulletRunnig.area);
            if(posibleTank){
                bulletsManager.stopFlyingBullet(bulletRunnig.idTanke,bulletRunnig.idInterval);
                socketPlayer.broadcast.emit('bullet-chock-with-tank',{scope:'external',idTanke:bulletRunnig.idTanke,idInterval:bulletRunnig.idInterval,tank:posibleTank.getJsonRepresentation()});
                socketPlayer.emit('bullet-chock-with-tank',{scope:'local',idTanke:bulletRunnig.idTanke,idInterval:bulletRunnig.idInterval,tank:posibleTank.getJsonRepresentation()});
                return;
            }

            let paloma = wallWatcher.verifyIfShootIsToBird(bulletRunnig.area);
            if (paloma){
                bulletsManager.stopFlyingBullet(bulletRunnig.idTanke,bulletRunnig.idInterval);
                socketPlayer.broadcast.emit('bullet-chock-with-bird',{scope:'external',idTanke:bulletRunnig.idTanke,idInterval:bulletRunnig.idInterval,bird:paloma.getJsonRepresentation()});
                socketPlayer.emit('bullet-chock-with-bird',{scope:'local',idTanke:bulletRunnig.idTanke,idInterval:bulletRunnig.idInterval,bird:paloma.getJsonRepresentation()});
            }

            //PRIORIDAD 2
            let posibleWall = wallWatcher.verifyIfAreaChokWithAnyWall(bulletRunnig.area);
            if(posibleWall){
                bulletsManager.stopFlyingBullet(bulletRunnig.idTanke,bulletRunnig.idInterval);
                wallWatcher.deleteWall(posibleWall.id);
                socketPlayer.broadcast.emit('bullet-chock-with-wall',{scope:'external',idTanke:bulletRunnig.idTanke,idInterval:bulletRunnig.idInterval,wall:posibleWall.getJsonRepresentation()});
                socketPlayer.emit('bullet-chock-with-wall',{scope:'local',idTanke:bulletRunnig.idTanke,idInterval:bulletRunnig.idInterval,wall:posibleWall.getJsonRepresentation()});
                return;
            }

            //PRIORIDAD 3
            if (bulletsManager.exceedBorderTable(bulletRunnig)){
                bulletsManager.stopFlyingBullet(bulletRunnig.idTanke,bulletRunnig.idInterval);
                socketPlayer.broadcast.emit('bullet-exceed-border',{scope:'external',idTanke:bulletRunnig.idTanke,idInterval:bulletRunnig.idInterval});
                socketPlayer.emit('bullet-exceed-border',{scope:'local',idTanke:bulletRunnig.idTanke,idInterval:bulletRunnig.idInterval});
                return;
            }

            //se le anuncia a los demas clientes que la bala se esta moviendo.
            socketPlayer.broadcast.emit('another-client-bullet-is-moving',{idTanke:data.idTanke,idInterval:data.idInterval});

        }
    });

});

httpServer.listen(3000,function(){
    console.log("Servidor de sockets escuchando en el puerto 3000!");
});