class Tank{
    constructor(id,name,area,velocity){
        this.name = name;//May be P1,P2...
        this.id = id;
        this.lives = 3;
        this.area = area;
        this.velocity = velocity;
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
    }
}

module.exports = Tank;