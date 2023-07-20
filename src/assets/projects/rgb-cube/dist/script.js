"use strict";
const canvas = document.getElementById('image-builder');
const ctx = canvas.getContext('2d');
const cube = document.getElementById('cube');
const size = 256;
const sideRules = [
    [1, 0, 2],
    [1, 2, 0],
    [3, 2, 1],
    [5, 2, 3],
    [0, 2, 5],
    [1, 3, 4], // bottom
];
const generateSide = ([ruleR, ruleG, ruleB]) => {
    const imageSrc = new Uint8ClampedArray(size * size * 4);
    for (let i = 0; i < imageSrc.length; i += 4) {
        const [r, g, b, a] = [i, i + 1, i + 2, i + 3];
        const pixelI = i / 4;
        const col = pixelI % size;
        const row = Math.floor(pixelI / size);
        const ruleMap = [0, col, row, 0xFF, 0xFF - row, 0xFF - col];
        imageSrc[r] = ruleMap[ruleR];
        imageSrc[g] = ruleMap[ruleG];
        imageSrc[b] = ruleMap[ruleB];
        imageSrc[a] = 127;
    }
    ctx.putImageData(new ImageData(imageSrc, size, size), 0, 0);
    const image = new Image(size, size);
    image.src = canvas.toDataURL('image/png');
    return image;
};
sideRules
    .map(generateSide)
    .forEach((img, i) => {
    img.classList.add(`side-${i}`);
    cube.appendChild(img);
});