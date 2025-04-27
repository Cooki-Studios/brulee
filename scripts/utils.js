export default class utils {
    static traverseElements(element, callback, depth = 0) {
        callback(element, depth);
        for (const child of element.children) {
            this.traverseElements(child, callback, depth + 1);
        }
    }
    static randomColor(seed) {
        seed = (seed * 9301 + 49297) % 233280;
        const colorHex = Math.floor((Math.abs(Math.sin(seed) * 16777215)));
        let color = colorHex.toString(16);
        while (color.length < 6) {
            color = '0' + color;
        }
        return "#" + color;
    }
    static hover(x, y) {
        let elPoints = document.elementsFromPoint(x, y);
        if (elPoints) {
            elPoints.forEach(elPoint => {
                elPoint.classList.add("hover");
            });
            const hoverElements = document.getElementsByClassName("hover");
            for (const el of hoverElements) {
                if (!elPoints.includes(el)) {
                    el.classList.remove("hover");
                }
            }
        }
    }
    static camScale = 1;
}
//# sourceMappingURL=utils.js.map