const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const buttons= document.getElementById("buttons");
const colorinput= document.getElementById("colorpicked");
let pixels_width = 32;
let pixels_height = 32;
let pixels = new Array(pixels_width*pixels_height);
let scale=4;
let leftClicking=false;
let rightClicking=false;

updateCanvasSize();

let tool=pencil;
prepPixels();

function handleKeyboard(e){
    switch (e.key){
        case "b": tool=pencil;break;
        case "e": tool=eraser;break;
        case "p": tool=pickColor;break;
        case "g": tool=fill;break;
        case "k": console.log(pixels);
    }
}

function updateCanvasSize(){
    canvas.width=pixels_width*scale;
    canvas.height=pixels_height*scale;
    canvas.style.width=`${pixels_width*scale}px`;
    canvas.style.height=`${pixels_height*scale}px`;
    canvas.style.position="absolute";
    canvas.style.top=`${(1080-(pixels_height*scale))/3}px`;
    canvas.style.left=`${(1920-(pixels_width*scale))/2}px`;
}

function handleMouseDown(e){
    if(e.button==0)leftClicking=true;
    else rightClicking=true;
    handleMouseMoveCanvas(e);
}

function handleMouseUp(e){
    if(e.button==0)leftClicking=false;
    else rightClicking=false;
    if (tool==fill){
        const canvasBoundingRect = canvas.getBoundingClientRect();
        const x = e.clientX - canvasBoundingRect.left - 3;
        const y = e.clientY - canvasBoundingRect.top - 3;
        var realX=Math.floor(x/scale);
        var realY=Math.floor(y/scale);
        if(realX>=0 && realX<=pixels_width && realY>=0 && realY<=pixels_height){
            visited=new Array(pixels_width*pixels_height);
            for(var i=0;i<pixels_width*pixels_height;i++)
                visited[i]=false;
            tool(realX,realY,pixels[realX+realY*pixels_width],visited);
            drawPixels();
        }
    }
}

function handleMouseMoveCanvas(e){
    if(!leftClicking && !rightClicking)return;
    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasBoundingRect.left - 3;
    const y = e.clientY - canvasBoundingRect.top - 3;
    const realX=Math.floor(x/scale);
    const realY=Math.floor(y/scale);
    if (tool==zoom){
        if(leftClicking)tool(1);
        else tool(-1);
    }
    else if (rightClicking!=0){
        eraser(realX,realY);
    }
    else if (e.ctrlKey){
        pickColor(realX,realY);
    }
    else tool(realX,realY);
}

function pickColor(x,y){
    colorinput.value=pixels[x+y*pixels_width];
}

function fill(x,y,initialcolor,visited){
    var current=x+y*pixels_width;
    if(pixels[current]!=colorinput.value){
        if(pixels[current]==initialcolor && !visited[current]){
            visited[current]=true; 
            pixels[current]=colorinput.value;
            if(x+1<pixels_width)fill(x+1,y,initialcolor,visited);
            if(x-1>=0)fill(x-1,y,initialcolor,visited);
            if(y+1<pixels_height)fill(x,y+1,initialcolor,visited);
            if(y-1>=0)fill(x,y-1,initialcolor,visited);
        }
    }
}

function eraser(x,y){
    ctx.globalCompositeOperation="destination-out";
    putPixel(x,y,colorinput.value);
    pixels[x + y*pixels_width]="rgba(0,0,0,0)";
    ctx.globalCompositeOperation="source-over";
}

function pencil(x,y){
    ctx.globalCompositeOperation="source-over";
    putPixel(x,y,colorinput.value);
    pixels[x + y*pixels_width]=colorinput.value;
}

function zoom(val){
    if(scale+val>=1)scale+=val;
    updateCanvasSize();
    drawPixels();
}

function putPixel(x,y,c){
    ctx.fillStyle = c;
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
    switch(e.target.id){
        case "eraser":
            tool=eraser;break;
        case "pencil":
            tool=pencil;break;
        case "zoom":
            tool=zoom;break;
        case "color_picker":
            tool=pickColor;break;
    }
}

function handleScrollwheel(e){
    e.preventDefault();
    zoom(Math.sign(e.wheelDelta));
}

buttons.addEventListener("click",pick);

canvas.addEventListener("mousemove",handleMouseMoveCanvas);
canvas.addEventListener("mousedown",handleMouseDown);
addEventListener("mouseup",handleMouseUp);
addEventListener("keypress",handleKeyboard);

document.addEventListener('contextmenu', event => event.preventDefault());
addEventListener("wheel",handleScrollwheel,{ passive: false });