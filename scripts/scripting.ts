// @ts-ignore
// import tesseract from "https://esm.sh/tesseract.js";
import utils from "./utils.js";

// (async () => {
//     const worker = await tesseract.createWorker('eng');
//     const ret = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
//     console.log(ret.data.text);
//     await worker.terminate();
// })();

const main = document.querySelector("main");
let mainRect: DOMRect;
let mainContainerEl: HTMLElement | null = null;
if (main) {
    mainContainerEl = main.querySelector("#main-container");
    mainRect = main.getBoundingClientRect();
}
const info = document.getElementById("info");

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(document.body);

matchMedia("(prefers-color-scheme: dark)").onchange = (e) => {
    if (ctx) {
        if (e.matches) {
            ctx.fillStyle = "#151515";
        } else {
            ctx.fillStyle = "#f5f5f5";
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (ctx) {
        if (matchMedia("(prefers-color-scheme: dark)").matches) {
            ctx.fillStyle = "#151515";
        } else {
            ctx.fillStyle = "#f5f5f5";
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

let camX = 0;
let camY = 0;

let mouseX = 0;
let mouseY = 0;

let mouse = false;

document.body.addEventListener("wheel", (e) => {
    e.preventDefault();

    const scrollH = e.deltaX;
    const scrollV = e.deltaY;

    mouse = !Number.isInteger(e.deltaY);

    mouseX = e.x || e.clientX;
    mouseY = e.y || e.clientY;

    if (e.ctrlKey || mouse) {
        if (main) {
            const oldScale = utils.camScale;
            let scaleDelta: number;
            if (e.ctrlKey) {
                scaleDelta = scrollV * -0.005 * oldScale;
            } else {
                scaleDelta = scrollV * -0.001 * oldScale;
            }
            const newScale = Math.min(Math.max(0.125, oldScale + scaleDelta), 4);

            if (newScale !== oldScale) {
                const ratio = newScale / oldScale;
                camX = (mouseX - mainRect.left) * (1 - ratio) + camX * ratio;
                camY = (mouseY - mainRect.top) * (1 - ratio) + camY * ratio;

                utils.camScale = newScale;
            }
        }
    } else if (e.shiftKey) {
        camX -= scrollV;
    } else {
        if (e.buttons !== 4) {
            camX -= scrollH;
            camY -= scrollV;
        }
    }
}, { passive: false });

const keys: { [key: string]: boolean } = {};

window.addEventListener("keydown", (e) => {
    if (e.key === "s" && e.ctrlKey) {
        e.preventDefault();
    } else {
        keys[e.key] = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "s" && e.ctrlKey) {
        saveRecipe();
    } else {
        keys[e.key] = false;
    }
});

function updateCamera() {
    const speed = 10;

    if (keys[" "]) {
        camX = 0;
        camY = 0;
        utils.camScale = 1;
    } else {
        if (keys["w"] || keys["ArrowUp"]) camY += speed;
        if (keys["s"] || keys["ArrowDown"]) camY -= speed;
        if (keys["a"] || keys["ArrowLeft"]) camX += speed;
        if (keys["d"] || keys["ArrowRight"]) camX -= speed;
    }

    if (main) {
        main.style.left = `${camX}px`;
        main.style.top = `${camY}px`;
        main.style.scale = utils.camScale.toString();
        main.style.transformOrigin = "0 0";
    }

    requestAnimationFrame(updateCamera);
}
requestAnimationFrame(updateCamera);

document.body.onpointerdown = (e) => {
    if (e.target !== document.getElementById("swap-page") && e.target !== document.querySelector("#loading-error a")) {
        document.body.setPointerCapture(e.pointerId);

        if (e.button === 1 || e.button === 2) {
            document.body.style.cursor = "grabbing";
            if (main) {
                main.style.cursor = "grabbing";
            }
        }
    }
}

document.body.onpointermove = (e) => {
    const events = e.getCoalescedEvents();
    const latestE = events[events.length-1];

    mouseX = latestE.x || latestE.clientX;
    mouseY = latestE.y || latestE.clientY;

    if (mouseX > 0 && mouseX < window.innerWidth && mouseY > 0 && mouseY < window.innerHeight) {
        if (typeof utils.hover !== "undefined") {
            utils.hover(mouseX, mouseY);
        }
    }

    if (document.body.style.cursor === "grabbing") {
        camX += events.reduce((sum, event) => sum + event.movementX, 0);
        camY += events.reduce((sum, event) => sum + event.movementY, 0);
    }
}

document.body.onpointerup = (e) => {
    Array.from(document.querySelectorAll('.hover')).forEach(
        (el) => el.classList.remove('hover')
    );

    document.body.releasePointerCapture(e.pointerId);

    if (e.button === 1 || e.button === 2) {
        document.body.style.cursor = "initial";
        if (main) {
            main.style.cursor = "default";
        }
    }
}

document.body.onpointerleave = () => {
    Array.from(document.querySelectorAll('.hover')).forEach(
        (el) => el.classList.remove('hover')
    );
}

window.oncontextmenu = (e) => {
    e.preventDefault();
}

if (info) {
    info.style.display = "block";
}

function saveRecipe() {
    if (mainContainerEl) {
        let temp = mainContainerEl.cloneNode(true);
        if (temp instanceof HTMLElement) {
            for (const el of temp.querySelectorAll("input")) {
                el.outerHTML = `{${el.placeholder}${el.id}}`;
            }
            for (const el of temp.querySelectorAll(".placeholder")) {
                el.remove();
            }

            utils.traverseElements(temp, (el) => {
                el.removeAttribute("style");
            });

            localStorage.setItem("recipes", JSON.stringify({"tutorial": temp.innerHTML.replaceAll("<h1>", "# ").replaceAll("</h1>", "")}));
            if (info) {
                info.textContent = "Recipe saved!";
                info.style.opacity = "1";

                setTimeout(() => {
                    info.style.opacity = "0";
                }, 1000);
            }
        }
    }
}