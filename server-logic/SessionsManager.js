let Tank = require('./Tank');
let Area = require('./Area');

class SessionsManager{

    constructor(){
        this.tanksOnline = [];
    }

    findTank(tankId){
        for(let i = 0; i<this.tanksOnline.length; i++){
            if(this.tanksOnline[i].id === tankId){
                return this.tanksOnline[i];
            }
        }
        return null;
    }

    getTanksOnline(){
        return this.tanksOnline;
    }

    getNumberOfTanksOnline(){
        return this.tanksOnline.length;
    }

    setTank(tank){
        this.tanksOnline.push(tank);
    }

    disconnectTank(id){
        for(let i = 0; i<this.tanksOnline.length; i++){
            if(this.tanksOnline[i].id === id){
                this.tanksOnline.splice(i, 1);//elimina el tanke con el id coincidente.
            }
        }
    }

    getListOfTanksInJsonFormat(){
        let list = [];
        for(let i = 0; i<this.tanksOnline.length; i++){
            let tankInJsonFormat = this.tanksOnline[i].getJsonRepresentation();
            list.push(tankInJsonFormat);
        }
        return list;
    }

    verifyIfChokWithAnyTank(area,idTankeAexcluir){
        for(let i = 0; i<this.tanksOnline.length; i++){
            let tank = this.tanksOnline[i];
            if(area.interseca(tank.area) && tank.id !== idTankeAexcluir){
                return tank;
            }
        }
        return null;
    }

    createTankInstance(jsonTank){
        /*
        constructor(id,name,area,velocity,direction)

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
        let areaJson = jsonTank.area;
        let area = new Area(areaJson.x,areaJson.y,areaJson.w,areaJson.h);
        return new Tank(jsonTank.id,jsonTank.name,area,jsonTank.velocity,'derecha');
    }

    getPlayerNumer(){
        return this.getNumberOfTanksOnline() + 1;
    }
}

module.exports = SessionsManager;