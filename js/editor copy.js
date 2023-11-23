button=document.getElementById("buttons");
let toolpicked="pencil";
(function () {
    let SSWZ = function () {
        this.keyScrollHandler = function (e) {
            if (e.ctrlKey) {
                e.preventDefault();
                return false;
            }
        }
    };
    if (window === top) {
        let sswz = new SSWZ() ;
        window.addEventListener('wheel', sswz.keyScrollHandler, { passive: false });
    }
})();

function elt(type, props, ...children) {
    let dom = document.createElement(type);
    if (props) Object.assign(dom, props);
    for (let child of children) {
      if (typeof child != "string") dom.appendChild(child);
      else dom.appendChild(document.createTextNode(child));
    }
    return dom;
}

class PixelCanvas{
    constructor(width,height){
        this.scale=8;
        this.width=width;
        this.height=height;
        this.dom = elt("canvas");
        this.dom.addEventListener("mousemove",this.drawing);
    }
    drawing(){
        let canvas=document.querySelector("canvas");
        let ctx=canvas.getContext("2d");
        ctx.strokeStyle= "#ffff00";
        ctx.beginPath();
        ctx.lineTo(event.offsetX,event.offsetY);
        ctx.stroke();
        drawCanvas(canvas,this);
    }
    empty(color){
        this.pixel= new Array(this.width*this.height);
        this.pixel.fill(color);
    }
    pixels(x,y){
        return(this.pixel[x+y*this.width]);
    }
}

function drawCanvas(canvas,app){
    canvas.width=app.width*app.scale;
    console.log(canvas.width);
    canvas.height=app.height*app.scale;
    let ctx= canvas.getContext("2d");
    console.log(app.pixels(0,0));
    for (let y = 0; y < app.height; y++) {
        for (let x = 0; x < app.width; x++) {
          ctx.fillStyle = app.pixels(x, y);
          ctx.fillRect(x * app.scale, y * app.scale, app.scale, app.scale);
        }
      }
}
app = new PixelCanvas(32,32);
app.empty("#ffffff");
drawCanvas(app.dom,app);
document.getElementById("canvascontainer").appendChild(app.dom);