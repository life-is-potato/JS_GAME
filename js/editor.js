button=document.getElementById("buttons");
console.log(button);
console.log(button.id);
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
window.addEventListener("load",()=>{
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
})

let isDrawing=false;

canvas = document.getElementById("canvas");
context = canvas.getContext("2d");
function zoom() {
    var imagedata= canvas.toDataURL("image/png");
    console.log(imagedata);
    scale = event.wheelDelta/3;
    var div = document.getElementById("canvascontainer");
    var left=parseInt(div.style.left,10);
    var up=parseInt(div.style.top,10);
    left-=scale;
    up-=scale;
    if(canvas.width+scale>=50){
    div.style.left=left+"px";
    div.style.top=up+"px";
    canvas.width += scale;
    canvas.height += scale;
    var destination=new Image;
    destination.src= imagedata;
    context.drawImage(destination,0,0);
    }
}

function pick(button){
    toolpicked=event.target.id;
    console.log(toolpicked);
}

function startDraw(){
 isDrawing=true;
 context.beginPath();

 color=document.getElementById("colorpicked");
 console.log(color.value);
 switch(toolpicked){
    case "eraser": context.strokeStyle='rgba(255,255,255,255)';context.globalCompositeOperation="destination-out";context.lineWidth=10;break;
    case "pencil": context.strokeStyle=color.value;context.globalCompositeOperation="source-over";context.lineWidth=5; break;
}
}

function stopDraw(){
    isDrawing=false;
}

function drawing(){
    if(!isDrawing)return;
    console.log(toolpicked);
    context.lineTo(event.offsetX,event.offsetY);
    context.stroke();
}
buttons.addEventListener("click",pick);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);
addEventListener("mouseup", stopDraw);
addEventListener("wheel", zoom, { passive: false });