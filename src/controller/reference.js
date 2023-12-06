const canvas = document.getElementById("canvas");
const effectsCanvas = document.getElementById("effect_canvas");
const ctx = canvas.getContext("2d");
const effectsctx = effectsCanvas.getContext("2d");
const buttons = document.getElementById("buttons");
const colorinput = document.getElementById("colorpicked");
const username = document.getElementById("username");
const description = document.getElementById("description");
let pixels_width = 32;
let pixels_height = 32;
let pixels = new Array(pixels_width * pixels_height);
let scale = 4;
let leftClicking = false;
let rightClicking = false;
let rectangleSelecting = false;
rectangleStartx = 0;
rectangleStarty = 0;
updateCanvasSize();

let tool = pencil;
prepPixels();

function handleKeyboard(e) {
    switch (e.key) {
        case "b": tool = pencil; break;
        case "e": tool = eraser; break;
        case "p": tool = pickColor; break;
        case "g": tool = fill; break;
        case "k": console.log(pixels);
    }
}


function updateCanvasSize() {
    canvas.width = pixels_width * scale;
    canvas.height = pixels_height * scale;
    canvas.style.width = `${pixels_width * scale}px`;
    canvas.style.height = `${pixels_height * scale}px`;
    canvas.style.position = "absolute";
    canvas.style.top = `${(1080 - (pixels_height * scale)) / 3}px`;
    canvas.style.left = `${(1920 - (pixels_width * scale)) / 2}px`;
    effectsCanvas.width = pixels_width * scale;
    effectsCanvas.height = pixels_height * scale;

    effectsCanvas.style.position = "absolute";
    effectsCanvas.style.top = `${(1080 - (pixels_height * scale)) / 3}px`;
    effectsCanvas.style.left = `${(1920 - (pixels_width * scale)) / 2}px`;
    effectsCanvas.style.background = 'rbga(0,0,0,0)';
    effectsCanvas.style.pointerEvents = 'none';
}


function handleMouseDown(e) {
    if (e.button == 0) leftClicking = true;
    else rightClicking = true;
    if (leftClicking && tool == rectangleSelect) {
        var { realX, realY } = calculateOffset(e);
        rectangleSelecting = true;
        rectangleStartx = realX;
        rectangleStarty = realY;
    }
    handleMouseMoveCanvas(e);
}

function calculateOffset(e) {
    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasBoundingRect.left - 3;
    const y = e.clientY - canvasBoundingRect.top - 3;
    var realX = Math.floor(x / scale);
    var realY = Math.floor(y / scale);
    return { realX, realY };
}

function handleMouseUp(e) {
    if (e.button == 0) leftClicking = false;
    else rightClicking = false;
    if (tool == fill && e.button == 0) {
        var { realX, realY } = calculateOffset(e);
        if (realX >= 0 && realX <= pixels_width && realY >= 0 && realY <= pixels_height) {
            visited = new Array(pixels_width * pixels_height);
            for (var i = 0; i < pixels_width * pixels_height; i++)
                visited[i] = false;
            tool(realX, realY, pixels[realX + realY * pixels_width], visited);
            drawPixels();
        }
    }
    else if (tool == rectangleSelect && e.button == 0) {
        var { realX, realY } = calculateOffset(e);
        rectangleSelect(realX, realY);
    }
}

function handleMouseMoveCanvas(e) {
    if (!leftClicking && !rightClicking) return;
    var { realX, realY } = calculateOffset(e);
    if (tool == zoom) {
        if (leftClicking) tool(1);
        else tool(-1);
    }
    else if (rightClicking != 0) {
        eraser(realX, realY);
    }
    else if (e.ctrlKey) {
        pickColor(realX, realY);
    }
    else if (tool == rectangleSelect);
    else tool(realX, realY);
}

function rectangleSelect(x, y) {
    if (x >= 0 && x <= pixels_width && y >= 0 && y <= pixels_height) {
        var copy = new Array(Math.abs((rectangleStartx - x) * (rectangleStarty - y)));

        for (var i = rectangleStarty; i < y; i++) {
            copy.push(pixels.slice(rectangleStartx + i * pixels_width, x + i * pixels_width));
        }
        effectsctx.clearRect(0, 0, canvas.width, canvas.height);
        effectsctx.beginPath();
        effectsctx.setLineDash([2]);
        signx = Math.sign(x - rectangleStartx);
        signy = Math.sign(y - rectangleStarty);
        effectsctx.rect((rectangleStartx - (signx == -1 ? -1 : 0)) * scale + 3, (rectangleStarty - (signy == -1 ? -1 : 0)) * scale + 3, (x - rectangleStartx + (signx == -1 ? -1 : 1)) * scale, (y - rectangleStarty + (signy == -1 ? -1 : 1)) * scale);
        effectsctx.stroke();
        console.log(copy);
    }
}


function pickColor(x, y) {
    colorinput.value = pixels[x + y * pixels_width];
}

function fill(x, y, initialcolor, visited) {
    var current = x + y * pixels_width;
    if (pixels[current] != colorinput.value) {
        if (pixels[current] == initialcolor && !visited[current]) {
            visited[current] = true;
            pixels[current] = colorinput.value;
            if (x + 1 < pixels_width) fill(x + 1, y, initialcolor, visited);
            if (x - 1 >= 0) fill(x - 1, y, initialcolor, visited);
            if (y + 1 < pixels_height) fill(x, y + 1, initialcolor, visited);
            if (y - 1 >= 0) fill(x, y - 1, initialcolor, visited);
        }
    }
}

function eraser(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    putPixel(x, y, colorinput.value);
    pixels[x + y * pixels_width] = "rgba(0,0,0,0)";
    ctx.globalCompositeOperation = "source-over";
}

function pencil(x, y) {
    ctx.globalCompositeOperation = "source-over";
    putPixel(x, y, colorinput.value);
    pixels[x + y * pixels_width] = colorinput.value;
}

function zoom(val) {
    if (scale + val >= 1) scale += val;
    updateCanvasSize();
    drawPixels();
}

function putPixel(x, y, c) {
    ctx.fillStyle = c;
    ctx.fillRect(x * scale, y * scale, scale, scale);
}

function prepPixels() {
    for (i = 0; i < pixels_height * pixels_width; i++) {
        pixels[i] = "rgba(0,0,0,0)";
    }
}

function drawPixels() {
    for (i = 0; i < pixels_height * pixels_width; i++) {
        putPixel(i % pixels_width, Math.floor(i / pixels_width), pixels[i]);
    }
}

function pick(e) {
    switch (e.target.id) {
        case "eraser":
            tool = eraser; break;
        case "pencil":
            tool = pencil; break;
        case "zoom":
            tool = zoom; break;
        case "color_picker":
            tool = pickColor; break;
        case "rectangle_select":
            tool = rectangleSelect;
    }
}


function handleScrollwheel(e) {
    e.preventDefault();
    zoom(Math.sign(e.wheelDelta));
}

function saveAsPNG() {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Set the dimensions of the temporary canvas
    tempCanvas.width = pixels_width;
    tempCanvas.height = pixels_height;

    // Draw the pixel data onto the temporary canvas
    for (let i = 0; i < pixels_height * pixels_width; i++) {
        const x = i % pixels_width;
        const y = Math.floor(i / pixels_width);
        tempCtx.fillStyle = pixels[i];
        tempCtx.fillRect(x, y, 1, 1);
    }

    // Convert the canvas to a data URL and trigger the download
    const dataURL = tempCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "pixel_art.png";
    link.click();
    const xhr = new XMLHttpRequest();
     xhr.open("POST", "../src/model/save_image.php", true);
     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
             console.log(xhr.responseText);
         }
     };
    console.log(username.value);
    console.log(description.value);
    xhr.send("imageData=" + encodeURIComponent(dataURL)+"&username=" + encodeURIComponent(username.value)+"&description=" + encodeURIComponent(description.value));
    }

buttons.addEventListener("click", pick);

canvas.addEventListener("mousemove", handleMouseMoveCanvas);
canvas.addEventListener("mousedown", handleMouseDown);
addEventListener("mouseup", handleMouseUp);
addEventListener("keypress", handleKeyboard);

document.addEventListener('contextmenu', event => event.preventDefault());
addEventListener("wheel", handleScrollwheel, { passive: false });