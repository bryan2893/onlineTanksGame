class Bullet{
    constructor(id,ctx,img,area,direction){
        this.id = id;
        this.ctx = ctx;
        this.idInterval = null;
        this.velocity = 3;
        this.img = img;
        this.area = area;//objeto Area
        this.direction = direction;
    }

    limpiarInterval(callbackSacarBala){
        clearInterval(this.idInterval);
        this.disAppear();
        //callbackSacarBala(this.id);
    }

    disAppear(){
        this.ctx.clearRect(this.area.getX(), this.area.getY(), this.area.getWidth(),this.area.getHeiht());
    }

    display(){
        this.ctx.drawImage(this.img, this.area.getX(), this.area.getY());
    }
    
    move(direccion,socket){
        switch (direccion) {
            case 'arriba':
                this.disAppear();
                this.area.setY(this.area.getY() - this.velocity);
                if(socket !== null){
                    socket.emit('bullet-step',{bulletId:this.id,direccion:'arriba'});
                }
                this.display();
                break;
            case 'abajo':
                this.disAppear();
                this.area.setY(this.area.getY() + this.velocity);
                if(socket !== null){
                    socket.emit('bullet-step',{bulletId:this.id,direccion:'abajo'});
                }
                this.display();
                break;
            case 'izquierda':
                this.disAppear();
                this.area.setX(this.area.getX() - this.velocity);
                if(socket !== null){
                    socket.emit('bullet-step',{bulletId:this.id,direccion:'izquierda'});
                }
                this.display();
                break;
            case 'derecha':
                this.disAppear();
                this.area.setX(this.area.getX() + this.velocity);
                if(socket !== null){
                    socket.emit('bullet-step',{bulletId:this.id,direccion:'derecha'});
                }
                this.display();
                /*
                let referenceThis = this;
                for (let i = 0; i<objetos.length;i++){
                    let objeto = objetos[i];
                    if(referenceThis.area.interseca(objeto.area)){
                        console.log("Pegado!");
                        referenceThis.limpiarInterval();
                        return;
                    }
                }
                */
                break;
        }
    }

    animate(socket,direction){//el socket necesario para avisar a los demas usuarios del movimiento de la bala.
        let referenceSelf = this;
        this.idInterval = setInterval(function(){
            referenceSelf.move(direction,socket);
            if(referenceSelf.area.getX() > 500){
                referenceSelf.clearInterval(this.idInterval);
            }
        },10)
    }
}