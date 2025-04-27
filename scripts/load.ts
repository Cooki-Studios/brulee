// @ts-ignore
import * as marked from "https://esm.sh/marked";
// @ts-ignore
// import confetti from "https://esm.sh/canvas-confetti";
import utils from "./utils.js";
import fillintheblanks from "./fillintheblanks.js";

const mainEl = document.querySelector("main") as HTMLElement;
const mainContainerEl = document.getElementById("main-container") as HTMLElement;
const loadingErrorEl = document.getElementById("loading-error");
const placeholderEl = document.getElementsByClassName("placeholder");
const loadingCircleEl = document.getElementById("loading-circle");
const loadingDotEl = document.getElementById("loading-dot");
const loadingLogoEl = document.getElementById("loading-logo");
const loadingScreenEl = document.getElementById("loading-screen") as HTMLElement;
const loadingTorchEl = document.getElementById("loading-torch");

function loadError(message: string, stop = false) {
    if (loadingErrorEl) {
        message += "\nCheck the console for more details. Report issues <a href='https://github.com/Cooki-Studios/brulee/issues' target='_blank'>here</a>.";
        loadingErrorEl.innerHTML = message;
        loadingErrorEl.setAttribute("stop", stop.toString());
        loadingErrorEl.style.display = "block";
        loadingErrorEl.style.opacity = "1";
    }
}

let longLoad = setTimeout(() => {
    loadError("Loading is taking a while. Please check your internet connection or try again later.");
}, 10000);

function moveHints() {
    if (mainContainerEl && placeholderEl) {
        let originTemp = "";
        if (utils.camScale !== 1) {
            originTemp = mainEl.style.transformOrigin;
            mainEl.style.transformOrigin = "0 0";
            mainEl.style.scale = "1";
        }

        Array.from(placeholderEl).forEach(span => {
            const nextSibling = span.nextSibling as HTMLElement;
            if (nextSibling && span.parentElement && nextSibling.nodeName === "INPUT") {
                const spanRect = span.getBoundingClientRect();
                (span as HTMLElement).style.display = "none";
                const rect = nextSibling.getBoundingClientRect();
                const parentRect = span.parentElement.getBoundingClientRect();

                (span as HTMLElement).style.position = "absolute";
                (span as HTMLElement).style.top = `${rect.top - parentRect.top + rect.height}px`;
                (span as HTMLElement).style.left = `${rect.left - parentRect.left + (rect.width - spanRect.width) / 2}px`;
                span.parentElement.style.paddingBottom = `${spanRect.height}px`;
            }
        });

        if (utils.camScale !== 1) {
            mainEl.style.transformOrigin = originTemp;
            mainEl.style.scale = utils.camScale.toString();
        }

        Array.from(placeholderEl).forEach(span => {
            (span as HTMLElement).style.display = "block";
        });
    }
}

function hideLoadingScreen() {
    setTimeout(() => {
        if (loadingErrorEl && mainContainerEl) {
            loadingErrorEl.style.display = "none";
            mainContainerEl.style.visibility = "visible";
            loadingScreenEl.style.opacity = "0";
            setTimeout(() => {
                // loadingScreenEl.remove();
                loadingScreenEl.style.display = "none";
            }, 200);
            loadingScreenEl.style.pointerEvents = "none";
        }
    }, 500);
}

function showLoadingScreen() {
    if (loadingCircleEl && loadingDotEl && loadingLogoEl && loadingScreenEl) {
        loadingCircleEl.style.display = "none";
        loadingDotEl.style.display = "none";
        loadingLogoEl.style.animationPlayState = "paused";
        if (loadingTorchEl) {
            loadingTorchEl.style.animationPlayState = "paused";
        }
        loadingScreenEl.style.display = "flex";
        mainContainerEl.style.visibility = "visible";
        loadingScreenEl.style.opacity = "1";
        loadingScreenEl.style.pointerEvents = "all";
    }
}

window.onload = function () {
    if (typeof marked === 'undefined') {
        loadError("Marked.js failed to load. Please check your internet connection or try again later.", true);
    }

    clearTimeout(longLoad);
    if (loadingErrorEl && loadingErrorEl.getAttribute("stop") && JSON.parse(loadingErrorEl.getAttribute("stop")!)) {
        return;
    }

    if (!localStorage.getItem("tutorialComplete")) {
        fetch("recipes/tutorial.md").then((response) => {
            response.text().then((data) => {
                if (mainContainerEl) {
                    mainContainerEl.innerHTML = fillintheblanks.extractKeyValues(marked.parse(data));

                    for (const input of document.getElementsByClassName("fill-in-the-blanks")) {
                        (input as HTMLInputElement).oninput = (e) => {
                            fillintheblanks.resizeInput(e.target as HTMLInputElement);
                            moveHints();
                        }

                        fillintheblanks.resizeInput(input as HTMLInputElement);
                    }

                    moveHints();

                    const resizeObserver = new ResizeObserver(moveHints);
                    resizeObserver.observe(mainContainerEl);

                    onresize = moveHints;

                    if (loadingErrorEl && loadingErrorEl.getAttribute("stop") && JSON.parse(loadingErrorEl.getAttribute("stop")!)) {
                        return;
                    }

                    if (window.location.pathname.endsWith("scripting") || window.location.pathname.endsWith("scripting.html")) {
                        const main = document.querySelector("main");
                        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
                        const ctx = canvas.getContext("2d");

                        if (ctx) {
                            if (matchMedia("(prefers-color-scheme: dark)").matches) {
                                ctx.fillStyle = "#151515";
                            } else {
                                ctx.fillStyle = "#f5f5f5";
                            }
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }

                        if (main) {
                            utils.traverseElements(main, (el, depth) => {
                                const color = utils.randomColor(depth);
                                (el as HTMLElement).style.setProperty("--hover-outline-color", color);
                            });
                        }
                    }

                    if (typeof runTutorial !== "undefined") {
                        runTutorial();
                    }

                    hideLoadingScreen();
                }
            });
        });
    }
}

window.onbeforeunload = () => {
    showLoadingScreen();
}
