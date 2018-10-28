class Area{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    getLeft(){
        return this.x;
    }

    getRight(){
        return this.x + this.w - 1;
    }

    getTop(){
        return this.y;
    }

    getBottom(){
        return this.y + this.h -1;
    }

    getHeiht(){
        return this.h;
    }

    getWidth(){
        return this.w;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    interseca(other){
        return !(this.getLeft() > other.getRight() ||
        this.getRight() < other.getLeft() ||
        this.getTop() > other.getBottom() ||
        this.getBottom() < other.getTop());
    }
}


class Tank{
    constructor(name,area,ctx,lImage,Rimage,Bimage,Uimage){
        this.name = name;
        this.area = area;
        this.ctx = ctx;
        this.leftImage = lImage;
        this.rightImage = Rimage;
        this.BottomImage = Bimage;
        this.UpImage = Uimage;
        this.velocity = 5;
    }

    move(direction){
        let x = this.area.getX();
        let y = this.area.getY();
        let wid = this.area.getWidth();
        let hei = this.area.getHeiht();

        switch (direction) {
            case 'arriba':
                this.ctx.clearRect(x, y, wid,hei);
                this.area.setY(y - this.velocity);
                this.display(direction);
                break;
            case 'abajo':
                this.ctx.clearRect(x, y, wid,hei);
                this.area.setY(y + this.velocity);
                this.display(direction);
                break;
            case 'izquierda':
                this.ctx.clearRect(x, y, wid,hei);
                this.area.setX(x - this.velocity);
                this.display(direction);
                break;
            case 'derecha':
                this.ctx.clearRect(x, y, wid,hei);
                this.area.setX(x + this.velocity);
                this.display(direction);
                break;
        }
    }

    //dibuja el tanke en el area actualizada.
    display(direction){
        switch (direction) {
            case 'arriba':
                this.ctx.drawImage(this.UpImage, this.area.getX(), this.area.getY());
                break;
            case 'abajo':
                this.ctx.drawImage(this.BottomImage, this.area.getX(), this.area.getY());
                break;
            case 'izquierda':
                this.ctx.drawImage(this.leftImage, this.area.getX(), this.area.getY());
                break;
            case 'derecha':
                this.ctx.drawImage(this.rightImage, this.area.getX(), this.area.getY());
                break;
        }
    }
}
