class BulletsManager{
    constructor(){
        this.bullets = [];
    }

    findBullet(bulletId){
        for(let i = 0; i<this.bullets.length; i++){
            if(this.bullets[i].id === bulletId){
                return this.bullets[i];
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

    stopFlyingBullet(id){
        for(let i = 0; i<this.bullets.length; i++){
            if(this.bullets[i].id === id){
                this.bullets.splice(i, 1);//elimina el tanke con el id coincidente.
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
}

module.exports = BulletsManager;