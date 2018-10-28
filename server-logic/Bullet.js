class Bullet{
    constructor(id,velocity,area,direction){  
        this.id = id;
        this.velocity = velocity;
        this.area = area;//objeto Area
        this.direction = direction;
    }
    
    move(direccion){
        switch (direccion) {
            case 'arriba':
                this.area.setY(this.area.getY() - this.velocity);
            case 'abajo':
                this.area.setY(this.area.getY() + this.velocity);
            case 'izquierda':
                this.area.setX(this.area.getX() - this.velocity);
            case 'derecha':
                this.area.setX(this.area.getX() + this.velocity);
                break;
        }
    }

    getJsonRepresentation(){
        return {
            id : this.id,
            area : {
                x : this.area.x,
                y : this.area.y,
                w : this.area.w,
                h : this.area.h
            },
            velocity : this.velocity,
            direction: this.direction
        }
    }
}

module.exports = Bullet;