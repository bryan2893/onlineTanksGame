class BulletsManager{
    constructor(){
        this.bullets = [];
    }

    //idInterval,idTanke
    findBullet(idInterval,idTanke){
        for(let i = 0; i<this.bullets.length; i++){
            let bullet = this.bullets[i];
            if(bullet.idInterval === idInterval && bullet.idTanke === idTanke){
                return bullet;
            }
        }
        return null;
    }

    getBulletsFlying(){
        return this.bullets;
    }
    
    getNumberOfBulletsOnline(){
        return this.bullets.length;
    }

    setBullet(bullet){
        this.bullets.push(bullet);
    }

    stopFlyingBullet(idTanke,idInterval){
        for(let i = 0; i<this.bullets.length; i++){
            let bullet = this.bullets[i];
            if(bullet.idTanke === idTanke && bullet.idInterval === idInterval){
                this.bullets.splice(i, 1);//elimina el tanke con las credenciales coincidentes.
            }
        }
    }

    getListOfBulletsInJsonFormat(){
        let list = [];
        for(let i = 0; i<this.bullets.length; i++){
            let bulletInJsonFormat = this.bullets[i].getJsonRepresentation();
            list.push(bulletInJsonFormat);
        }
        return list;
    }

    exceedBorderTable(bullet){
        let respuesta = false;
        switch(bullet.direction){
            case 'arriba':
                if(bullet.area.getY() <= 2){
                    respuesta = true;
                }
                break;
            case 'abajo':
                if(bullet.area.getY() >= 560-8){
                    respuesta = true;
                }
                break;
            case 'izquierda':
                if(bullet.area.getX() <= 2){
                    respuesta = true;
                }
                break;
            case 'derecha':
                if(bullet.area.getX() >= 800-8){
                    respuesta = true;
                }
                break;
        }
        return respuesta;
    }
}

module.exports = BulletsManager;