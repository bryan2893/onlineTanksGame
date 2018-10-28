$(document).ready(function(){

    let tankeLocal = null; //almacena el objeto tanke local.
    
    let inTheOtherSideTanks = [];//lista de los tankes que se encuentran conectados del otro lado.

    let getTankThatIsInTheOtherSide = function(tankId){
        for(let i = 0; i<inTheOtherSideTanks.length; i++){
            if(inTheOtherSideTanks[i].id === tankId){
                return inTheOtherSideTanks[i];
            }
        }
    };

    let deleteTankThatIsInTheOtherSide = function(tankId){
        for(let i = 0; i<inTheOtherSideTanks.length; i++){
            if(inTheOtherSideTanks[i].id === tankId){
                inTheOtherSideTanks.splice(i, 1);//elimina el tanke con el id coincidente.
            }
        }
    };

    let canvas = document.getElementById("gameField");
    canvas.width = 600;
    canvas.height = 600;
    let ctx = canvas.getContext("2d");

    //*******************Logica de sockets.

    let options = {};
    let socket = io('http://localhost:3000/',options);

    socket.on('connect',function(){

        socket.on('update-scenario-by-first-time',function(data){
            listaTankes = data.lista_de_tankes;

            console.log(listaTankes);
            //se recorre la lista para crear los tankes y agregarlos en la lista local "inTheOtherSideTanks"
            
            for(let i = 0; i<listaTankes.length;i++){
                let data = listaTankes[i];

                let area = new Area(data.area.x,data.area.y,data.area.w,data.area.h);

                let l = ImageManager.getImage('tanke_player_1_izquierda');
                let r = ImageManager.getImage('tanke_player_1_derecha');
                let u = ImageManager.getImage('tanke_player_1_arriba');
                let b = ImageManager.getImage('tanke_player_1_abajo');

                let tankThatIsOnline = new Tank(data.id,area,ctx,l,r,b,u,data.velocity,data.actualDirection);


                tankThatIsOnline.display(tankThatIsOnline.actualDirection);

                inTheOtherSideTanks.push(tankThatIsOnline);

            }

        });

        socket.on('create-local-tank',function(data){
            let area = new Area(data.area.x,data.area.y,data.area.w,data.area.h);

            let l = ImageManager.getImage('tanke_player_1_izquierda');
            let r = ImageManager.getImage('tanke_player_1_derecha');
            let u = ImageManager.getImage('tanke_player_1_arriba');
            let b = ImageManager.getImage('tanke_player_1_abajo');

            let tanke = new Tank(data.id,area,ctx,l,r,b,u,data.velocity,data.actualDirection);
            tankeLocal = tanke;

            tanke.display('derecha');
        });

        //el servidor avisa que un tanke que no es el local ha sido creado.
        socket.on('new-tank-online',function(data){
            let area = new Area(data.area.x,data.area.y,data.area.w,data.area.h);

            let l = ImageManager.getImage('tanke_player_1_izquierda');
            let r = ImageManager.getImage('tanke_player_1_derecha');
            let u = ImageManager.getImage('tanke_player_1_arriba');
            let b = ImageManager.getImage('tanke_player_1_abajo');

            let newOnlineTank = new Tank(data.id,area,ctx,l,r,b,u,data.velocity,data.actualDirection);

            newOnlineTank.display('derecha');

            inTheOtherSideTanks.push(newOnlineTank);
        });

        socket.on('tank-is-moving',function(data){
            //obtener que tanke se está moviendo y hacia cual direccion.
            let tankeMoviendose = getTankThatIsInTheOtherSide(data.idTanke);
            if(tankeMoviendose){
                let direccion = data.direccion;
                tankeMoviendose.move(direccion);
            }
        });

        //cuando un tanke del otro lado se desconecta hay que sacarlo del escenario de este cliente.
        socket.on('tank-off-line',function(data){
            let tankeDesapareciendo = getTankThatIsInTheOtherSide(data.idTanke);
            if(tankeDesapareciendo){
                tankeDesapareciendo.disAppear();//desaparecer o limpiar el tanke de donde esta en la interfaz.
                deleteTankThatIsInTheOtherSide(data.idTanke);
            }
        });

    });

    //*******Movimiento de tanke y disparo con teclas direccionales y tecla espacio**
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:
                tankeLocal.move('izquierda');
                socket.emit('register-movement',{idTanke:tankeLocal.id,direccion:'izquierda'});
                break;
            case 38:
                socket.emit('register-movement',{idTanke:tankeLocal.id,direccion:'arriba'});
                tankeLocal.move('arriba');
                break;
            case 39:
                tankeLocal.move('derecha');
                socket.emit('register-movement',{idTanke:tankeLocal.id,direccion:'derecha'});
                break;
            case 40:
            socket.emit('register-movement',{idTanke:tankeLocal.id,direccion:'abajo'});
                tankeLocal.move('abajo');
                break;
            case 32:
                console.log("disparó!!");
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