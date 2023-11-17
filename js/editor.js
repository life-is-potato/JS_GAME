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
        let sswz = new SSWZ();
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
    scale = event.wheelDelta/3;
    var div = document.getElementById("canvascontainer");
    var left=parseInt(div.style.left,10);
    var up=parseInt(div.style.top,10);
    left-=scale/2;
    up-=scale/2;
    console.log(up);
    div.style.left=left+"px";
    div.style.top=up+"px";
    canvas.width += scale;
    canvas.height += scale;
}

function startDraw(){
 isDrawing=true;
 context.beginPath();
 context.lineWidth=5;
}

function stopDraw(){
    isDrawing=false;
}

function drawing(){
    if(!isDrawing)return;
    context.lineTo(event.offsetX,event.offsetY);
    context.stroke();
}
addEventListener("mousemove", drawing);
addEventListener("mousedown", startDraw);
addEventListener("mouseup", stopDraw);
addEventListener("wheel", zoom, { passive: false });