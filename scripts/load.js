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
    for (const span of document.getElementsByClassName("placeholder")) {
        if (span.nextSibling.nodeName === "INPUT") {
            const rect = span.nextSibling.getBoundingClientRect();
            span.style.position = "absolute";
            span.style.top = `${window.scrollY + rect.top + rect.height + 4}px`;
            span.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (span.offsetWidth / 2)}px`;
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

    setTimeout(() => {
        document.getElementById("loading-error").style.display = "none";
        document.querySelector("main").style.visibility = "visible";
        document.getElementById("loading-screen").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("loading-screen").remove();
        }, 200);
        document.getElementById("loading-screen").style.pointerEvents = "none";

        runTutorial();
    }, 500);
}

function runTutorial() {
    const el = document.getElementById("1");
    const text = document.getElementById("tutorial-text");

    el.onclick = () => {
        el.onclick = () => {};
        text.textContent = "This is an input. Specifically a text input.";

        let wait = setTimeout(function () {
            text.textContent += "\n\rThat means you can type in it by the way.";
        }, 10000);

        let tutorial1 = () => {
            el.removeEventListener("input", tutorial1);

            clearTimeout(wait);
            text.textContent = "Okay? Cool. See how it says (name) underneath?\n\rThat's a hint. You can use it to figure out what to type.";

            setTimeout(function () {
                text.textContent += "\n\rAfter you're done entering your name or just a random one, press enter to submit.";
            }, 5000);
        };
        el.addEventListener("input", tutorial1);
    };
}