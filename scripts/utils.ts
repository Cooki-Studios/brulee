export default class utils {
    static traverseElements(element: Element, callback: (el: Element, depth: number) => void, depth: number = 0) {
        callback(element, depth);

        for (const child of element.children) {
            this.traverseElements(child, callback, depth + 1);
        }
    }

    static randomColor(seed: number) {
        seed = (seed * 9301 + 49297) % 233280;

        const colorHex: number = Math.floor((Math.abs(Math.sin(seed) * 16777215)));
        let color: string = colorHex.toString(16);
        while (color.length < 6) {
            color = '0' + color;
        }

        return "#" + color;
    }

    static hover(x: number, y: number) {
        let elPoints: Element[] = document.elementsFromPoint(x, y);
        if (elPoints) {
            elPoints.forEach(elPoint => {
                elPoint.classList.add("hover");
            });

            const hoverElements: any = document.getElementsByClassName("hover");
            for (const el of hoverElements) {
                if (!elPoints.includes(el)) {
                    el.classList.remove("hover");
                }
            }
        }
    }

    static camScale = 1;
}
