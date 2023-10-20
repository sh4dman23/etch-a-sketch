const sketchContainer = document.querySelector('#sketchContainer');

const sketchPadControls = document.querySelector('#sketchPadControls');
const brushButtonsContainer = document.querySelector('#brushButtons');

// Control sketchpad and brush behaviours
let showGrids = false;
let pixelBackgroundColor = 'black';
let rgbPixels = false;

function generate(pixelsPerEdge) {
    const tempContainer = document.createElement('div');

    // This helps us have a pixelPerEdge x pixelPerEdge grid
    const flexValue = `1 1 calc(100% / ${pixelsPerEdge})`;

    for (let i = 0; i < pixelsPerEdge; i++) {
        const row = document.createElement('div');
        row.classList.add('sketch-row');
        row.style.flex = flexValue;
        for (let j = 0; j < pixelsPerEdge; j++) {
            const pixel = document.createElement('div');
            pixel.classList.add('sketch-pixel');
            pixel.style.flex = flexValue;

            if (showGrids === true) {
                pixel.style.border = '1px solid rgba(204, 203, 217, 0.5)';
            }

            row.appendChild(pixel);
        }

        tempContainer.appendChild(row);
    }

    sketchContainer.innerHTML = tempContainer.innerHTML;
}

generate(16);

// Keep track of mousedown
let mouseDown = false;
sketchContainer.addEventListener('mousedown', event => {
    mouseDown = true;
    colorPixel(event);
});
sketchContainer.addEventListener('mouseup', () => {
    mouseDown = false;
});

// Color pixel if mouse is pressed and is hovering
sketchContainer.addEventListener('mouseover', colorPixel);

function colorPixel(event) {
    const pixel = event.target;
    if (pixel.classList.contains('sketch-pixel') && mouseDown) {
        // If RGB mode is on the pixels should have random colors
        if (rgbPixels === true) {
            function generateRandomRGB() {
                return Math.floor(Math.random() * 255);
            }
            pixelBackgroundColor = `rgb(${generateRandomRGB()}, ${generateRandomRGB()}, ${generateRandomRGB()})`;
        }
        pixel.style.backgroundColor = pixelBackgroundColor;
    }
}

// Change sketch pad pixels, reset pixels and show grids
sketchPadControls.addEventListener('click', event => {
    const target = event.target;

    // Pixels per Edge
    if (target.id === 'setPixels') {
        const pixelBox = document.querySelector('#pixelsPerEdge');
        const pixelsPerEdge = pixelBox.value;
        if (pixelsPerEdge > 0 && pixelsPerEdge <= 100) {
            generate(pixelsPerEdge);
        }

        return;

    // Reset
    } else if (target.id === 'resetSketch') {
        const pixels = sketchContainer.querySelectorAll('.sketch-pixel');
        pixels.forEach(pixel => pixel.style.backgroundColor = 'inherit');

    // Grids
    } else if (target.id === 'showGrids') {
        const pixels = sketchContainer.querySelectorAll('.sketch-pixel');
        if (showGrids === false) {
            pixels.forEach(pixel => pixel.style.border = '1px solid rgba(204, 203, 217, 0.5)');
            showGrids = true;
        } else {
            pixels.forEach(pixel => pixel.style.border = 'none');
            showGrids = false;
        }
    }
});

// Change brush styles (default, rgb, eraser)
brushButtonsContainer.addEventListener('click', event => {
    const target = event.target;

    if (target.id === 'defaultBrush') {
        pixelBackgroundColor = 'black';
    } else if (target.id === 'eraser') {
        pixelBackgroundColor = 'inherit';
    }

    rgbPixels = (target.id === 'rgbBrush') ? true : false;
});