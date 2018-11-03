//Se encarga de vigilar los muros, si alguien choca, si una bala choca, etc...
let Area = require('./Area');

class WallWatcher{
    constructor(listOfWalls){
        this.walls = listOfWalls;
    }

    getWalls(){
        return this.walls;
    }

    setWalls(listOfWalls){
        this.walls = listOfWalls;
    }
    
    getNumberOfWalls(){
        return this.walls.length;
    }

    setWall(wall){
        this.walls.push(wall);
    }

    deleteWall(index){
        this.walls.splice(index, 1);//elimina el muro con el id coincidente.
    }

    getListOfWallsInJsonFormat(){
        let list = [];
        for(let i = 0; i<this.walls.length; i++){
            let wallInJsonFormat = this.walls[i].getJsonRepresentation();
            list.push(wallInJsonFormat);
        }
        return list;
    }

    verifyIfAreaChokWithAnyWall(area){
        for(let i = 0; i<this.walls.length; i++){
            let wall = this.walls[i];
            if(area.interseca(wall.area)){
                return wall;
            }
        }
        return null;
    }

    replicateFutureTankAreaForProve(tank,direccion){
        let area = null;
        switch (direccion) {
            case 'arriba':
                area = new Area(tank.area.getX(),tank.area.getY()- tank.velocity,32,32);
                break;
            case 'abajo':
                area = new Area(tank.area.getX(),tank.area.getY() + tank.velocity,32,32);
                break;
            case 'izquierda':
                area = new Area(tank.area.getX() - tank.velocity, tank.area.getY(),32,32);
                break;
            case 'derecha':
                area = new Area(tank.area.getX() + tank.velocity,tank.area.getY(),32,32);
                break;
        }

        return area;
    }
}

module.exports = WallWatcher;