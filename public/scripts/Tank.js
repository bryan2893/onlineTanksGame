class Tank{
    constructor(id,area,ctx,lImage,Rimage,Bimage,Uimage,velocity,actualDirection){
        this.id = id;
        this.area = area;
        this.ctx = ctx;
        this.leftImage = lImage;
        this.rightImage = Rimage;
        this.BottomImage = Bimage;
        this.UpImage = Uimage;
        this.velocity = velocity;
        this.actualDirection = actualDirection;
    }

    setActualDirection(direction){
        this.actualDirection = direction;
    }

    move(direction){
        let x = this.area.getX();
        let y = this.area.getY();
        let wid = this.area.getWidth();
        let hei = this.area.getHeiht();

        switch (direction) {
            case 'arriba':
                this.disAppear();
                this.area.setY(y - this.velocity);
                this.display(direction);
                break;
            case 'abajo':
                this.disAppear();
                this.area.setY(y + this.velocity);
                this.display(direction);
                break;
            case 'izquierda':
                this.disAppear();
                this.area.setX(x - this.velocity);
                this.display(direction);
                break;
            case 'derecha':
                this.disAppear();
                this.area.setX(x + this.velocity);
                this.display(direction);
                break;
        }

        this.setActualDirection(direction);
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

    //crea una bala que sale desde el "cañon" de este tanke, tomando su actualdirection como referencia.
    loadBulletShootingInformation(){
        let bulletInformation = {};
        switch (this.actualDirection) {
            case 'arriba':
                bulletInformation.bulletId = this.id;
                bulletInformation.x = this.area.getX() + 12;
                bulletInformation.y = this.area.getY();
                break;
            case 'abajo':
                bulletInformation.bulletId = this.id;
                bulletInformation.x = this.area.getX() + 12;
                bulletInformation.y = this.area.getY() + this.area.getHeiht();
                break;
            case 'izquierda':
                bulletInformation.bulletId = this.id;
                bulletInformation.x = this.area.getLeft();
                bulletInformation.y = this.area.getY() + 12; //12 para que la imagen de la bala quede centrada. el tanke es de 32x32 y la bala de 8x8
                break;
            case 'derecha':
                bulletInformation.bulletId = this.id;
                bulletInformation.x = this.area.getRight();
                bulletInformation.y = this.area.getY() + 12; //12 para que la imagen de la bala quede centrada. el tanke es de 32x32 y la bala de 8x8
                break;
        }

        bulletInformation.w = this.area.getWidth();
        bulletInformation.h = this.area.getHeiht();
        bulletInformation.direction = this.actualDirection;

        return bulletInformation;
    }

    disAppear(){
        let x = this.area.getX();
        let y = this.area.getY();
        let wid = this.area.getWidth();
        let hei = this.area.getHeiht();
        this.ctx.clearRect(x, y, wid,hei);
    }
}
