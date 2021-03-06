class Wall{
    constructor(id,area){
        this.id = id;
        this.area = area;
    }

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
}

module.exports = Wall;