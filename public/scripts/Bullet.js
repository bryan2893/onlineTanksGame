class Bullet{
    constructor(id,ctx,img,area,direction){
        this.id = id; //el id es el id del interval que realiza la animación
        this.ctx = ctx;
        this.velocity = 3;
        this.img = img;
        this.area = area;//objeto Area
        this.direction = direction;
    }

    disAppear(){
        this.ctx.clearRect(this.area.getX(), this.area.getY(), this.area.getWidth(),this.area.getHeiht());
    }

    display(){
        this.ctx.drawImage(this.img, this.area.getX(), this.area.getY());
    }

    setId(id){
        this.id = id; 
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