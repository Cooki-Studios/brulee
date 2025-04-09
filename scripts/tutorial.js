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

setTimeout(() => {
    hideLoadingScreen();
    runTutorial();
}, 500);