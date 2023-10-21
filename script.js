const sketchContainer = document.querySelector('#sketchContainer');

const sketchPadControls = document.querySelector('#sketchPadControls');
const brushButtonsContainer = document.querySelector('#brushButtons');

// Control sketchpad and brush behaviours
let showGrids = false;
let pixelBackgroundColor = 'rgb(0, 0, 0)';
let rgbPixels = false;
let darkeningMode = false;
let lighteningMode = false;

// Array for managing shading on pixels
const darkenlevel = [];

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
            pixel.style.backgroundColor = 'rgb(255, 255, 255)';

            if (showGrids === true) {
                pixel.style.border = '1px solid rgba(204, 203, 217, 0.5)';
            }

            // Add a count to the pixel
            const pixelNo = parseInt((i + 1) * (j + 1));
            pixel.setAttribute('pixelno', pixelNo);

            // Set shading values to 0
            darkenlevel[pixelNo] = 0;

            row.appendChild(pixel);
        }

        tempContainer.appendChild(row);
    }

    sketchContainer.innerHTML = tempContainer.innerHTML;
}

generate(24);
document.querySelector('#defaultBrush').classList.toggle('button-toggled-on');

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
        if (!darkeningMode && !lighteningMode) {
            // Reset shading level on pixel
            darkenlevel[pixel.getAttribute('pixelno')] = 0;

            // If RGB mode is on the pixels should have random colors
            if (rgbPixels === true) {
                function generateRandomRGB() {
                    return Math.floor(Math.random() * 255);
                }
                pixelBackgroundColor = `rgb(${generateRandomRGB()}, ${generateRandomRGB()}, ${generateRandomRGB()})`;
            }

        // Shading mode is on
        } else if (darkeningMode === true || lighteningMode === true) {
            const pixelNo = pixel.getAttribute('pixelno');

            const backgroundColor = pixel.style.backgroundColor;
            const pixelRGB = [];
            const colorsArray = backgroundColor.split(',');

            // For darkening mode, we need to increase darkenlevel of the pixel
            if (darkeningMode) {
                if (darkenlevel[pixelNo] < 0) {
                    darkenlevel[pixelNo] = 0;
                }
                if (darkenlevel[pixelNo] < 10) {
                    darkenlevel[pixelNo]++;
                }

            // For lightening mode, we need to decrese it
            } else if (lighteningMode) {
                if (darkenlevel[pixelNo] >= 0) {
                    darkenlevel[pixelNo] = 0;
                }
                if (darkenlevel[pixelNo] > -10) {
                    darkenlevel[pixelNo]--;
                }
            }

            // Red
            pixelRGB[0] = Number(colorsArray[0].trim().split('(')[1]);

            // Green
            pixelRGB[1] = Number(colorsArray[1].trim());

            // Blue
            pixelRGB[2] = Number(colorsArray[2].trim().split(')')[0]);

            for (let i = 0; i < pixelRGB.length; i++) {
                let newRGBValue;

                // If lightening mode is on and color is black, we need to set the pixel value of 90% black
                if (lighteningMode && pixelRGB[i] === 0) {
                    newRGBValue = Math.floor(255 / 10);
                } else {
                    newRGBValue = Math.floor(pixelRGB[i] * (1 - darkenlevel[pixelNo] / 10));
                }

                // If new pixel exceeds 255
                pixelRGB[i] = newRGBValue > 255 ? 255 : newRGBValue;
            };

            pixelBackgroundColor = `rgb(${pixelRGB[0]}, ${pixelRGB[1]}, ${pixelRGB[2]})`;
        }

        // Background color can get changed in event listeners below
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
        pixels.forEach(pixel => {
            pixel.style.backgroundColor = 'rgb(255, 255, 255)';
            darkenlevel[pixel.getAttribute('pixelno')] = 0;
        });

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
        target.classList.toggle('button-toggled-on');
    }
});

// Change brush styles (default, rgb, eraser)
brushButtonsContainer.addEventListener('click', event => {
    const target = event.target;

    if (target.id !== 'rgbBrush') {
        rgbPixels = false;

        if (target.id !== 'darkenBrush' && target.id !== 'lightenBrush') {
            if (target.id === 'defaultBrush') {
                pixelBackgroundColor = 'rgb(0, 0, 0)';
            } else if (target.id === 'eraser') {
                pixelBackgroundColor = 'rgb(255, 255, 255)';
            }

            darkeningMode = false;
            lighteningMode = false;
        } else if (target.id === 'darkenBrush') {
            darkeningMode = true;
            lighteningMode = false;
        } else if (target.id === 'lightenBrush') {
            lighteningMode = true;
            darkeningMode = false;
        }
    } else if (target.id === 'rgbBrush') {
        rgbPixels = true;
        darkeningMode = false;
        lighteningMode = false;
    }

    let buttons = target.parentNode.children;
    buttons = Array.from(buttons);
    buttons.forEach(button => {
        if (button.id !== target.id) {
            button.classList.remove('button-toggled-on');
        }
        if (target.tagName === 'BUTTON') {
            target.classList.add('button-toggled-on');
        }
    });
});