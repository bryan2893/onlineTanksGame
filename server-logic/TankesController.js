class TankesController{
    constructor(){
        this.tankes = [];//lista de tankes.
    }

    findTank(name){
        for(let i = 0; i<this.tankes.length; i++){
            if(this.tankes[i].name === name){
                return this.tankes[i];
            }
        }
        return null;
    }

    pushTank(tank){
        this.tankes.push(tank);
    }

    updatePosition(tankName, position){//Usually P1,P2,P3, etc...
        let tanke = findTank(tankName);
        if (tanke){
            tanke.area.setX(position.x);
        }
    }
}