class Bullet{
    constructor(idTanke,idInterval,velocity,area,direction){
        this.idTanke = idTanke;
        this.idInterval = idInterval;
        this.velocity = velocity;
        this.area = area;//objeto Area
        this.direction = direction;
    }
    
    move(direccion){
        switch (direccion) {
            case 'arriba':
                this.area.setY(this.area.getY() - this.velocity);
                break;
            case 'abajo':
                this.area.setY(this.area.getY() + this.velocity);
                break;
            case 'izquierda':
                this.area.setX(this.area.getX() - this.velocity);
                break;
            case 'derecha':
                this.area.setX(this.area.getX() + this.velocity);
                break;
        }
    }

    getJsonRepresentation(){
        return {
            idTanke : this.idTanke,
            idInterval : this.idInterval,
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