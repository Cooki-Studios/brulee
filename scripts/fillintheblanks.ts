export default class fillintheblanks {
    static extractKeyValues(text: string) {
        const regex = /\{([a-zA-Z_]+)(\d+)}/g;
        let matches;
        let result = "";
        // let temp = document.createElement("span");

        while ((matches = regex.exec(text)) !== null) {
            const placeholder = matches[1].replaceAll("_", " ")

            if (result === "") {
                result = matches.input.replace(matches[0], `<span class="placeholder">(${placeholder})</span><input type='text'
                placeholder="${placeholder}"
                id="${parseInt(matches[2])}"
                style="width: 0"
                class="fill-in-the-blanks"
                autocomplete="off"
                spellcheck="false"
                autocapitalize="off">`);
            } else {
                result = result.replace(matches[0], `<span class="placeholder">(${placeholder})</span><input type='text'
                placeholder="${placeholder}"
                id="${parseInt(matches[2])}"
                style="width: 0"
                class="fill-in-the-blanks"
                autocomplete="off"
                spellcheck="false"
                autocapitalize="off">`);
            }
        }

        if (result === "") {
            result = text;
        }

        return result;
    }

    static resizeInput(input: HTMLInputElement) {
        if (input && input.parentNode) {
            // saveInput(input);

            let temp = document.createElement("span");

            if (input.value === "") {
                temp.textContent = input.placeholder;
            } else {
                temp.textContent = input.value;
            }

            temp.style.width = "fit-content";
            temp.style.whiteSpace = "pre-wrap";
            temp.className = "temp";
            input.parentNode.appendChild(temp);

            if (temp.offsetWidth <= window.innerWidth / 1.75) {
                input.style.width = `${temp.offsetWidth}px`;
            } else {
                input.style.width = `${window.innerWidth / 1.75}px`;
            }
            temp.remove();
        }
    }
}