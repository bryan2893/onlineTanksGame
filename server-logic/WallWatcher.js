//Se encarga de vigilar los muros, si alguien choca, si una bala choca, etc...

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
        this.walls.splice(index, 1);//elimina el tanke con el id coincidente.
    }

    getListOfWallsInJsonFormat(){
        let list = [];
        for(let i = 0; i<this.walls.length; i++){
            let wallInJsonFormat = this.walls[i].getJsonRepresentation();
            list.push(wallInJsonFormat);
        }
        return list;
    }

    verifyIfTankChokWithAnyWall(tank){
        for(let i = 0; i<this.walls.length; i++){
            let wall = this.walls[i];
            if(tank.area.interseca(wall.area)){
                return wall;
            }
        }
        return null;
    }
}

module.exports = WallWatcher;