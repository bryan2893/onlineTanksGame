class SessionsManager{

    constructor(){
        this.tanksOnline = [];
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
}

module.exports = SessionsManager;