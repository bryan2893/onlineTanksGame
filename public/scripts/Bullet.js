class Bullet{
    constructor(idTanke,idInterval,ctx,img,area,direction){
        this.idTanke = idTanke;
        this.idInterval = idInterval;
        this.ctx = ctx;
        this.velocity = 3;
        this.img = img;
        this.area = area;
        this.direction = direction;
    }

    disAppear(){
        this.ctx.clearRect(this.area.getX(), this.area.getY(), this.area.getWidth(),this.area.getHeiht());
    }

    display(){
        this.ctx.drawImage(this.img, this.area.getX(), this.area.getY());
    }

    setIdInterval(idInterval){
        this.idInterval = idInterval;
    }
    
    move(direccion){
        let x = this.area.getX();
        let y = this.area.getY();

        switch (direccion) {
            case 'arriba':
                this.disAppear();
                this.area.setY(y - this.velocity);
                this.display();
                break;
            case 'abajo':
                this.disAppear();
                this.area.setY(y + this.velocity);
                this.display();
                break;
            case 'izquierda':
                this.disAppear();
                this.area.setX(x - this.velocity);
                this.display();
                break;
            case 'derecha':
                this.disAppear();
                this.area.setX(x + this.velocity);
                this.display();
                break;
        }
    }
}