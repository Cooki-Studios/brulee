const main = document.querySelector("main");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(document.body);

matchMedia("(prefers-color-scheme: dark)").onchange = (e) => {
    if (e.matches) {
        ctx.fillStyle = "#151515";
    } else {
        ctx.fillStyle = "#f5f5f5";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (matchMedia("(prefers-color-scheme: dark)").matches) {
        ctx.fillStyle = "#151515";
    } else {
        ctx.fillStyle = "#f5f5f5";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

setTimeout(() => {
    if (matchMedia("(prefers-color-scheme: dark)").matches) {
        ctx.fillStyle = "#151515";
    } else {
        ctx.fillStyle = "#f5f5f5";
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    traverseElements(main, (el, depth) => {
        const color = randomColor(depth);
        el.style.setProperty("--hover-outline-color", color);
    });

    hideLoadingScreen();
}, 500);

let camX = 0;
let camY = 0;

document.body.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.buttons !== 4) {
        if (e.shiftKey) {
            camX -= e.deltaY;
            camY -= e.deltaX;
        } else {
            camX -= e.deltaX;
            camY -= e.deltaY;
        }
    }
}, { passive: false });

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function updateCamera() {
    const speed = 10;

    if (keys[" "]) {
        camX = 0;
        camY = 0;
    } else {
        if (keys["w"] || keys["ArrowUp"]) camY += speed;
        if (keys["s"] || keys["ArrowDown"]) camY -= speed;
        if (keys["a"] || keys["ArrowLeft"]) camX += speed;
        if (keys["d"] || keys["ArrowRight"]) camX -= speed;
    }

    main.style.left = `${camX}px`;
    main.style.top = `${camY}px`;

    requestAnimationFrame(updateCamera);
}
requestAnimationFrame(updateCamera);

document.body.onpointerdown = (e) => {
    if (e.target !== document.getElementById("swap-page")) {
        document.body.setPointerCapture(e.pointerId);

        if (e.button === 1) {
            document.body.style.cursor = "grabbing";
            main.style.cursor = "grabbing";
        }
    }
}

document.body.onpointermove = (e) => {
    if (document.body.style.cursor === "grabbing") {
        camX += e.movementX;
        camY += e.movementY;
    }
}

document.body.onpointerup = (e) => {
    document.body.releasePointerCapture(e.pointerId);

    if (e.button === 1) {
        document.body.style.cursor = "initial";
        main.style.cursor = "default";
    }
}