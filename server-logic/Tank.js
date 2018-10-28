class Tank{
    constructor(id,name,area,velocity,direction){
        this.name = name;//May be P1,P2...
        this.id = id;
        this.lives = 3;
        this.area = area;
        this.velocity = velocity;
        this.actualDirection = direction;
    }

    setActualDirection(direccion){
        this.actualDirection = direccion;
    }

    move(direction){
        let x = this.area.getX();
        let y = this.area.getY();

        switch (direction) {
            case 'arriba':
                this.area.setY(y - this.velocity);
                break;
            case 'abajo':
                this.area.setY(y + this.velocity);
                break;
            case 'izquierda':
                this.area.setX(x - this.velocity);
                break;
            case 'derecha':
                this.area.setX(x + this.velocity);
                break;
        }

        this.setActualDirection(direction);
    }

    getJsonRepresentation(){
        return {
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
        }
    }
}

module.exports = Tank;