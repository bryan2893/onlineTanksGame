class Wall{
    constructor(id,area,ctx,img){
        this.id = id;
        this.area = area;
        this.ctx = ctx;
        this.img = img;
    }

    disAppear(){
        console.log("ejecucion metodo limpiar");
        this.ctx.clearRect(this.area.x, this.area.y, this.area.w,this.area.h);
    }

    display(){
        this.ctx.drawImage(this.img, this.area.getX(), this.area.getY());
    }

    /*
    getJsonRepresentation(){
        return {
            id: this.id,
            area : {
                x : this.area.x,
                y : this.area.y,
                w : this.area.w, //normalmente w y h son de 16, la imagen es de 16x16
                h : this.area.h
            }
        }
    }
    */
}