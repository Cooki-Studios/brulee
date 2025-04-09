function loadError(message, stop = false) {
    message += "\nCheck the console for more details. Report issues <a href='https://github.com/Cooki-Studios/brulee/issues' target='_blank'>here</a>.";
    document.getElementById("loading-error").innerHTML = message;
    document.getElementById("loading-error").setAttribute("stop", stop.toString());
    document.getElementById("loading-error").style.display = "block";
    document.getElementById("loading-error").style.opacity = "1";
}

let longLoad = setTimeout(() => {
    loadError("Loading is taking a while. Please check your internet connection or try again later.");
}, 10000);

function moveHints() {
    const mainRect = document.getElementById("main-container").getBoundingClientRect();
    for (const span of document.getElementsByClassName("placeholder")) {
        if (span.nextSibling.nodeName === "INPUT") {
            const rect = span.nextSibling.getBoundingClientRect();
            span.style.position = "absolute";
            span.style.top = `${rect.top - mainRect.top + rect.height + 4}px`;
            span.style.left = `${rect.left - mainRect.left + (rect.width / 2) - (span.offsetWidth / 2)}px`;
        }
    }
}

window.onload = function () {
    if (typeof marked === 'undefined') {
        loadError("Marked.js failed to load. Please check your internet connection or try again later.", true);
    }

    clearTimeout(longLoad);
    if (JSON.parse(document.getElementById("loading-error").getAttribute("stop"))) {
        return;
    }

    if (!localStorage.getItem("tutorialComplete")) {
        fetch("recipes/tutorial.md").then((response) => {
            response.text().then((data) => {
                document.getElementById("main-container").innerHTML = extractKeyValues(marked.parse(data));

                for (const input of document.getElementsByClassName("fill-in-the-blanks")) {
                    resizeInput(input);
                }

                moveHints();

                const resizeObserver = new ResizeObserver(moveHints);
                resizeObserver.observe(document.getElementById("main-container"));

                onresize = moveHints;
            });
        });
    }
}

function hideLoadingScreen() {
    document.getElementById("loading-error").style.display = "none";
    document.querySelector("main").style.visibility = "visible";
    document.getElementById("loading-screen").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("loading-screen").remove();
    }, 200);
    document.getElementById("loading-screen").style.pointerEvents = "none";
}

function traverseElements(element, callback, depth = 0) {
    callback(element, depth);

    for (const child of element.children) {
        traverseElements(child, callback, depth + 1);
    }
}

function randomColor(seed) {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        if (seed !== undefined) {
            seed = (seed * 9301 + 49297) % 233280;
            color += letters[Math.floor((seed / 233280) * 16)];
        } else {
            color += letters[Math.floor(Math.random() * 16)];
        }
    }
    return color;
}
