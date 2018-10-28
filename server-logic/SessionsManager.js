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
}

module.exports = SessionsManager;