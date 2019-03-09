$(document).ready(function(){

    let tankeLocal = null; //almacena el objeto tanke local.
    
    let inTheOtherSideTanks = [];//lista de los tankes que se encuentran conectados del otro lado.

    let inTheOtherSideBullets = [];

    let localBulletsFlying = [];

    let localWalls = [];

    let birthPoints = [];

    let getBirthPointRandomly = function(){
        let randomPosition = Math.floor(Math.random() * birthPoints.length);
        return birthPoints[randomPosition];
    };

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
                bullet.disAppear();
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
                bullet.disAppear();
                localBulletsFlying.splice(i, 1);
            }
        }
    }

    let matarPaloma = function(){
        let paloma = localWalls[0];
        paloma.display('muerta');
    };

    let gameOver = function(socket,ctx){
        socket.disconnect();
        ctx.clearRect(0,0,800,560);
        ctx.drawImage(ImageManager.getImage('game_over'), 280, 200);
    };


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
        let imgPalomaViva = ImageManager.getImage('base');
        let imgPalomaMuerta = ImageManager.getImage('base_destroyed');
        let birdInJson = listOfWalls[0];

        let area = new Area(birdInJson.area.x,birdInJson.area.y,birdInJson.area.w,birdInJson.area.h);

        let bird = new Bird(-2,area,ctx,imgPalomaViva,imgPalomaMuerta);

        localWalls.push(bird);

        let wallImage = ImageManager.getImage('wall_brick');
        for (let index = 1; index < listOfWalls.length; index++) {
            let wallInJson = listOfWalls[index];

            let area = new Area(wallInJson.area.x,wallInJson.area.y,wallInJson.area.w,wallInJson.area.h);

            let wall = new Wall(wallInJson.id,area,context,wallImage);

            localWalls.push(wall);

            wall.display();

        }

        bird.display('viva');

    };

    /*EN CASO DE QUE EL JUGADOR MUERA ESTA ES LA LÓGICA....*/
    let restablecerFuncionalidad = function(){
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
    }

    
    let stopPlayerGameBy4Seconds = function(socket,tanke){

        /*
            tanke...

            name : this.name,
            id : this.id,
            lives : this.lives,
            area : {
                x : this.area.x,
                y : this.area.y,
                w : this.area.w,
                h : this.area.h
            },
            velocity : this.velocity,
            actualDirection: this.actualDirection
            
            */

        document.onkeydown = function(){};
        setTimeout(() => {
            //getJsonRepresentation
            let newBirthPoint = getBirthPointRandomly();//punto donde renacerá el tanke.
            tanke.area = newBirthPoint;
            let area = new Area(newBirthPoint.x,newBirthPoint.y,newBirthPoint.w,newBirthPoint.h);
            tankeLocal.setArea(area);
            tankeLocal.setActualDirection('derecha');
            tankeLocal.display('derecha');
            socket.emit('player-comes-to-live',{tank:tanke});//avisa al sessionManager del servidor que el jugador esta de vuelta.
            restablecerFuncionalidad();//vuelve a dar el control al usuario.
        }, 4000);
    }

    let chooseImagesForLocaltank = function(playerNumber){
        if(playerNumber === 1){
            return ['tanke_player_1_izquierda','tanke_player_1_derecha','tanke_player_1_arriba','tanke_player_1_abajo'];
        }else if(playerNumber === 2){
            return ['tank_armor_left_c1_t2','tank_armor_right_c1_t2','tank_armor_up_c1_t2','tank_armor_down_c1_t2'];
        }else if(playerNumber === 3){
            return ['tank_fast_left_c0_t2','tank_fast_right_c0_t2','tank_fast_up_c0_t2','tank_fast_down_c0_t2'];
        }else if(playerNumber === 4){
            return ['tank_power_left_c0_t2_f','tank_power_right_c0_t2_f','tank_power_up_c0_t2_f','tank_power_down_c0_t2_f'];
        }else if(playerNumber === 5){
            return ['tank_power_left_c0_t2','tank_power_right_c0_t2','tank_power_up_c0_t2','tank_power_down_c0_t2'];
        }
        else{
            return null;
        }
    }

    let canvas = document.getElementById("gameField");
    canvas.width = 800;
    canvas.height = 560;
    let ctx = canvas.getContext("2d");

    //*******************Logica de sockets.

    let options = {};
    let socket = io('/',options);

    socket.on('connect',function(){

        socket.on('update-scenario-by-first-time',function(data){
            listaTankes = data.lista_de_tankes;
            lista_balas = data.lista_balas;
            lista_muros = data.walls;
            birthPoints = data.birthPoints;

            //Pinta los muros del juego y los registra en la lista de muros locales******
            escenaryWallsConstructor(lista_muros,ctx);
            
            //agrega los tankes en el juego al momento de la conexion al servidor.
            for(let i = 0; i<listaTankes.length;i++){
                let tank = listaTankes[i];

                let area = new Area(tank.area.x,tank.area.y,tank.area.w,tank.area.h);

                let setOfImagesForThisLocalPlayer = chooseImagesForLocaltank(tank.playerNumber);

                let l = ImageManager.getImage(setOfImagesForThisLocalPlayer[0]);
                let r = ImageManager.getImage(setOfImagesForThisLocalPlayer[1]);
                let u = ImageManager.getImage(setOfImagesForThisLocalPlayer[2]);
                let b = ImageManager.getImage(setOfImagesForThisLocalPlayer[3]);

                let tankThatIsOnline = new Tank(tank.id,area,ctx,l,r,b,u,tank.velocity,tank.actualDirection);


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
            let tank = data.tank;

            let area = new Area(tank.area.x,tank.area.y,tank.area.w,tank.area.h);

            let setOfImagesForThisLocalPlayer = chooseImagesForLocaltank(data.playerNumber);

            let l = ImageManager.getImage(setOfImagesForThisLocalPlayer[0]);
            let r = ImageManager.getImage(setOfImagesForThisLocalPlayer[1]);
            let u = ImageManager.getImage(setOfImagesForThisLocalPlayer[2]);
            let b = ImageManager.getImage(setOfImagesForThisLocalPlayer[3]);

            let tanke = new Tank(tank.id,area,ctx,l,r,b,u,tank.velocity,tank.actualDirection);
            tankeLocal = tanke;

            tanke.display('derecha');
        });

        //el servidor avisa que un tanke que no es el local ha sido creado.
        socket.on('new-tank-online',function(data){
            let tank = data.tank;

            let area = new Area(tank.area.x,tank.area.y,tank.area.w,tank.area.h);

            let setOfImagesForThisLocalPlayer = chooseImagesForLocaltank(data.playerNumber);

            let l = ImageManager.getImage(setOfImagesForThisLocalPlayer[0]);
            let r = ImageManager.getImage(setOfImagesForThisLocalPlayer[1]);
            let u = ImageManager.getImage(setOfImagesForThisLocalPlayer[2]);
            let b = ImageManager.getImage(setOfImagesForThisLocalPlayer[3]);

            let newOnlineTank = new Tank(tank.id,area,ctx,l,r,b,u,tank.velocity,tank.actualDirection);

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

        //cuando una bala choca con un muro.
        socket.on('bullet-chock-with-wall',function(data){
            if (data.scope === 'local'){
                deleteLocalBullet(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);
                deleteWall(data.wall.id);//borra de la lista local y despinta el muro.
                return;
            }
            if(data.scope === 'external'){
                //deleteWall(wall.id);//borra de la lista y despinta el muro.
                deleteBulletThatIsInTheOtherSide(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);
                deleteWall(data.wall.id);//borra de la lista local y despinta el muro.
                return;
            }
        });

        socket.on('bullet-chock-with-tank',function(data){

            /*
            data.tank

            name : this.name,
            id : this.id,
            lives : this.lives,
            area : {
                x : this.area.x,
                y : this.area.y,
                w : this.area.w,
                h : this.area.h
            },
            velocity : this.velocity,
            actualDirection: this.actualDirection
            
            */

            if (data.scope === 'local'){
                deleteLocalBullet(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);

                let tankePegado = data.tank;//representacion del objeto tanke en formato JSON.
                //Buscar y desparecer la representacion del tanke que se encuentra del otro lado del mundo.
                let tankeEnElOtroLado = getTankThatIsInTheOtherSide(tankePegado.id);
                if(tankeEnElOtroLado){
                    tankeEnElOtroLado.disAppear();
                }

                return;
            }

            if(data.scope === 'external'){
                deleteBulletThatIsInTheOtherSide(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);
                let tankePegado = data.tank;//representacion del objeto tanke en formato JSON.
                if(tankePegado.id === tankeLocal.id){
                    tankeLocal.disAppear();//despinta el tanke.
                    stopPlayerGameBy4Seconds(socket,tankePegado);
                }else{
                    let tankeEnElOtroLado = getTankThatIsInTheOtherSide(tankePegado.id);
                    tankeEnElOtroLado.disAppear();
                }
                return;
            }

        });

        //Indica que otro jugador ha renacido y que esta listo para luchar.
        socket.on('tank-fighting-again',function(data){
            let newTankPosition = data.tank.area;
            let tank = getTankThatIsInTheOtherSide(data.tank.id);
            if(tank){
                let area = new Area(newTankPosition.x,newTankPosition.y,newTankPosition.w,newTankPosition.h);
                tank.setArea(area);
                tank.display('derecha');
            }
        });

        socket.on('bullet-chock-with-bird',function(data){
            if (data.scope === 'local'){
                deleteLocalBullet(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);
                matarPaloma();
                gameOver(socket,ctx);
                return;
            }

            if(data.scope === 'external'){
                deleteBulletThatIsInTheOtherSide(data.idTanke,data.idInterval);
                limpiarInterval(data.idInterval);
                matarPaloma();
                gameOver(socket,ctx);
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