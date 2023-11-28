const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const buttons= document.getElementById("buttons");
const colorinput= document.getElementById("colorpicked");
let pixels_width = 32;
let pixels_height = 32;
let pixels = new Array(pixels_width*pixels_height);
let scale=1;
let color="rgba(255,255,255,1)";
let clicking=false;

updateCanvasSize();

let tool=pencil;
prepPixels();

function updateCanvasSize(){
    canvas.width=pixels_width*scale;
    canvas.height=pixels_height*scale;
    canvas.style.width=`${pixels_width*scale}px`;
    canvas.style.height=`${pixels_height*scale}px`;
    canvas.style.position="absolute";
    canvas.style.top=`${(1080-(pixels_height*scale))/3}px`;
    canvas.style.left=`${(1920-(pixels_width*scale))/2}px`;
}

function handleClickCanvas(e){
    clicking=true;
    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasBoundingRect.left;
    const y = e.clientY - canvasBoundingRect.top;
    const realX=Math.floor(x/scale);
    const realY=Math.floor(y/scale);
    if (tool==zoom){
        if(e.button==0)tool(1);
        else tool(-1);
    }
    else if (e.button!=0){
        eraser(realX,realY);
    }
    else tool(realX,realY);
}

function eraser(x,y){
    ctx.globalCompositeOperation="destination-out";
    putPixel(x,y,"rgba(255,255,255,255)");
    pixels[x + y*pixels_width]="rgba(0,0,0,0)";
}

function pencil(x,y){
    ctx.globalCompositeOperation="source-over";
    putPixel(x,y,colorinput.value);
}

function zoom(val){
    if(scale+val>=1)scale+=val;
    updateCanvasSize();
    drawPixels();
}

function putPixel(x,y,c){
    ctx.fillStyle = c;
    pixels[x + y*pixels_width]=c;
    ctx.fillRect(x*scale,y*scale,scale,scale);
}

function prepPixels(){
    for(i=0;i<pixels_height*pixels_width;i++){
        pixels[i]="rgba(0,0,0,0)";
    }
}

function drawPixels(){
    for(i=0;i<pixels_height*pixels_width;i++){
        putPixel(i%pixels_width,Math.floor(i/pixels_width),pixels[i]);
    }
}

function pick(e){
    console.log(e.target.id);
    switch(e.target.id){
        case "eraser":
            tool=eraser;break;
        case "pencil":
            tool=pencil;break;
        case "zoom":
            tool=zoom;break;
    }
}

buttons.addEventListener("click",pick);

canvas.addEventListener("click",handleClickCanvas);
canvas.addEventListener("contextmenu",handleClickCanvas);

document.addEventListener('contextmenu', event => event.preventDefault());