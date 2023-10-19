const sketchContainer = document.querySelector('#sketchContainer');
const pixelBox = document.querySelector('#pixelsPerEdge');
const setPixelsButton = document.querySelector('#setPixels');
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

            row.appendChild(pixel);
        }

        tempContainer.appendChild(row);
    }

    sketchContainer.innerHTML = tempContainer.innerHTML;
}

generate(16);

sketchContainer.addEventListener('mouseover', (event) => {
    const target = event.target;
    if (target.classList.contains('sketch-pixel')) {
        target.classList.toggle('black-pixel');
    }
});

setPixelsButton.addEventListener('click', (event) => {
    const pixelsPerEdge = pixelBox.value;
    if (pixelsPerEdge > 0 && pixelsPerEdge <= 100) {
        generate(pixelsPerEdge);
    }
});