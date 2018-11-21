class Bird{
    constructor(id,area,ctx,lImage,Rimage){
        this.id = id;
        this.area = area;
        this.ctx = ctx;
        this.imgviva = lImage;
        this.imgmuerta = Rimage;
    }

    //dibuja la paloma en el area actualizada.
    display(vivoOmuerto){
        switch (vivoOmuerto) {
            case 'viva':
                this.ctx.drawImage(this.imgviva, this.area.getX(), this.area.getY());
                break;
            case 'muerta':
                this.ctx.drawImage(this.imgmuerta, this.area.getX(), this.area.getY());
                break;
        }
    }
}