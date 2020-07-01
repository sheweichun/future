export function setStyle(el, style) {
    Object.keys(style).forEach(function (name) {
        //@ts-ignore
        el.style[name] = style[name];
    });
}
export function px2Num(px, defaultValue) {
    var val = parseInt(px);
    if (isNaN(val)) {
        return defaultValue;
    }
    return val;
}
