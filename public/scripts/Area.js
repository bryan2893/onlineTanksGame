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