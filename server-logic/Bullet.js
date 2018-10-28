class Bullet{
    constructor(id,velocity,area,direction){  
        this.id = id;
        this.velocity = velocity;
        this.area = area;//objeto Area
        this.direction = direction;
    }

    setX(value){
        this.area.setX(value);
    }

    setY(value){
        this.area.setY(value);
    }
    
    move(direccion){
        switch (direccion) {
            case 'arriba':
                this.area.setY(this.posy - this.velocity);
            case 'abajo':
                this.area.setY(this.posy + this.velocity);
            case 'izquierda':
                this.area.setX(this.posx - this.velocity);
            case 'derecha':
                this.area.setX(this.posx + this.velocity);
                break;
        }
    }
}

module.exports = Bullet;