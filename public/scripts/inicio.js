$(document).ready(function(){

    let tankeLocal = null; //almacena el objeto tanke local.
    
    let inTheOtherSideTanks = [];//lista de los tankes que se encuentran conectados del otro lado.

    let inTheOtherSideBullets = [];

    let localBulletsFlying = [];

    let localWalls = [];

    let getTankThatIsInTheOtherSide = function(tankId){
        for(let i = 0; i<inTheOtherSideTanks.length; i++){
            if(inTheOtherSideTanks[i].id === tankId){
                return inTheOtherSideTanks[i];
            }
        }

        return null;
    };

    let deleteTankThatIsInTheOtherSide = function(tankId){
        for(let i = 0; i<inTheOtherSideTanks.length; i++){
            if(inTheOtherSideTanks[i].id === tankId){
                inTheOtherSideTanks.splice(i, 1);
            }
        }
    };

    let getBulletThatIsInTheOtherSide = function(idTanke,idInterval){
        for(let i = 0; i<inTheOtherSideBullets.length; i++){
            let bullet = inTheOtherSideBullets[i];
            if(bullet.idTanke === idTanke && bullet.idInterval === idInterval){
                return bullet;
            }
        }

        return null;
    }

    let deleteBulletThatIsInTheOtherSide = function(idTanke,idInterval){
        for(let i = 0; i<inTheOtherSideBullets.length; i++){
            let bullet = inTheOtherSideBullets[i];
            if(bullet.idTanke === idTanke && bullet.idInterval === idInterval){
                inTheOtherSideBullets.splice(i, 1);
            }
        }
    }

    let getLocalBulet = function(idTanke,idInterval){
        for(let i = 0; i<localBulletsFlying.length; i++){
            let bullet = localBulletsFlying[i];
            if(bullet.idTanke === idTanke && bullet.idInterval === idInterval){
                return bullet;
            }
        }
        return null;
    }

    let deleteLocalBullet = function(idTanke,idInterval){
        for(let i = 0; i<localBulletsFlying.length; i++){
            let bullet = localBulletsFlying[i];
            if(bullet.idTanke === idTanke && bullet.idInterval === idInterval){
                localBulletsFlying.splice(i, 1);
            }
        }
    }


    let limpiarInterval = function(idInterval){
        clearInterval(idInterval);
    };

    let getBulletImageByDirection = function(direction){
        if(direction === 'arriba'){
            return ImageManager.getImage('bullet_up');
        }else if(direction === 'abajo'){
            return ImageManager.getImage('bullet_down');
        }else if(direction === 'izquierda'){
            return ImageManager.getImage('bullet_left');
        }else if(direction === 'derecha'){
            return ImageManager.getImage('bullet_right');
        }
        else{
            return null;
        }
    };

    //Desaparece y elimina el muro de la lista de muros locales.
    let deleteWall = function(wallId){
        for(let i = 0; i<localWalls.length; i++){
            let wall = localWalls[i];
            if(wall.id === wallId){
                wall.disAppear();
                localWalls.splice(i, 1);
            }
        }
    }


    //Pinta el escenario dado un conjunto de elementos block;
    let escenaryWallsConstructor = function(listOfWalls,context){
        /*
        {
            id: 0,
            area : {
                    x : this.area.x,
                    y : this.area.y,
                    w : this.area.w, //normalmente w y h son de 16, la imagen es de 16x16
                    h : this.area.h
                }
        }
        
        */
        let wallImage = ImageManager.getImage('wall_brick');
        for (let index = 0; index < listOfWalls.length; index++) {
            let wallInJson = listOfWalls[index];

            let area = new Area(wallInJson.area.x,wallInJson.area.y,wallInJson.area.w,wallInJson.area.h);

            let wall = new Wall(wallInJson.id,area,context,wallImage);

            localWalls.push(wall);

            wall.display();

        }

    };

    let canvas = document.getElementById("gameField");
    canvas.width = 800;
    canvas.height = 560;
    let ctx = canvas.getContext("2d");

    //*******************Logica de sockets.

    let options = {};
    let socket = io('http://localhost:3000/',options);

    socket.on('connect',function(){

        socket.on('update-scenario-by-first-time',function(data){
            listaTankes = data.lista_de_tankes;
            lista_balas = data.lista_balas;
            lista_muros = data.walls;

            //Pinta los muros del juego y los registra en la lista de muros locales******
            escenaryWallsConstructor(lista_muros,ctx);
            
            //agrega los tankes en el juego al momento de la conexion al servidor.
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

            //agregar las balas existentes en el juego en el momento de la conexion.
            for(let j = 0; j<lista_balas.length;j++){
                let data = lista_balas[j];

                let area = new Area(data.area.x,data.area.y,data.area.w,data.area.h);

                let direction = data.direction; //orientacion de la bala.

                let imageBullet = getBulletImageByDirection(direction);
                
                let bulletThatIsOnline = new Bullet(data.id,ctx,imageBullet,area,data.direction);  


                bulletThatIsOnline.display(bulletThatIsOnline.direction);

                inTheOtherSideBullets.push(bulletThatIsOnline);
                
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

        /*****************************LOGICA PARA DISPARO DE LOS TANKES********************** */
        socket.on('other-player-shoot-by-first-time',function(data){
            /*
                data.idTanke
                data.idInterval
                data.x 
                data.y
                data.w 
                data.h
                data.direction
            */

            let imageBullet = getBulletImageByDirection(data.direction);
            let area = new Area(data.x,data.y,data.w,data.h);

            let bulletShootByOtherPlayer = new Bullet(data.idTanke,data.idInterval,ctx,imageBullet,area,data.direction);

            bulletShootByOtherPlayer.display();

            inTheOtherSideBullets.push(bulletShootByOtherPlayer);

        });

        socket.on('another-client-bullet-is-moving',function(data){
            let bulletOfOtherPlayerThatIsMoving = getBulletThatIsInTheOtherSide(data.idTanke,data.idInterval);
            if(bulletOfOtherPlayerThatIsMoving){
                bulletOfOtherPlayerThatIsMoving.move(bulletOfOtherPlayerThatIsMoving.direction);
            }
        });

        socket.on('bullet-exceed-border',function(data){
            if (data.scope === 'local'){
                deleteLocalBullet(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);
                return;
            }

            if(data.scope === 'external'){
                deleteBulletThatIsInTheOtherSide(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);
                return;
            }
        });

        //caundo una bala choca con un muro.
        socket.on('bullet-chock-with-wall',function(data){
            if (data.scope === 'local'){
                deleteLocalBullet(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);
                console.log("Se debe destruir el muro!!");
                return;
            }

            if(data.scope === 'external'){
                deleteBulletThatIsInTheOtherSide(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);
                console.log("Se debe destruir el muro!!");
                return;
            }
        });

        socket.on('movement-confirmation',function(data){
            if(data.mensaje === "si"){//si se puede mover
                tankeLocal.move(data.direccion);
            }
        });

    });

    //*******Movimiento de tanke y disparo con teclas direccionales y tecla espacio**
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:
                socket.emit('register-movement',{idTanke:tankeLocal.id,direccion:'izquierda'});
                break;
            case 38:
                socket.emit('register-movement',{idTanke:tankeLocal.id,direccion:'arriba'});
                break;
            case 39:
                socket.emit('register-movement',{idTanke:tankeLocal.id,direccion:'derecha'});
                break;
            case 40:
                socket.emit('register-movement',{idTanke:tankeLocal.id,direccion:'abajo'});
                break;
            case 32:
                let shootInformation = tankeLocal.loadBulletShootingInformation();
                let bulletImage =  getBulletImageByDirection(shootInformation.direction);

                let area = new Area(shootInformation.x,shootInformation.y,shootInformation.w,shootInformation.h);

                let bulletSooted = new Bullet(tankeLocal.id,null,ctx,bulletImage,area,shootInformation.direction);

                let idInterval = setInterval(function(){
                    bulletSooted.move(bulletSooted.direction);
                    let bulletInfo = {
                        x:bulletSooted.area.getX(),
                        y:bulletSooted.area.getY(),
                        w:bulletSooted.area.w,
                        h:bulletSooted.area.h,
                        idTanke:bulletSooted.idTanke,
                        idInterval:bulletSooted.idInterval,
                        direccion:bulletSooted.direction
                    }

                    socket.emit('bullet-step',bulletInfo);

                },10);



                shootInformation.idInterval = idInterval;

                bulletSooted.setIdInterval(shootInformation.idInterval);

                localBulletsFlying.push(bulletSooted);

                socket.emit('shoot',shootInformation);

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