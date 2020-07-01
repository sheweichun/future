export function controlDelta(val, speed) {
    if (speed === void 0) { speed = 5; }
    return Math.floor(val / speed);
}
export function completeOptions(options, defaultOptions) {
    if (options == null)
        return defaultOptions;
    if (defaultOptions == null)
        return options;
    return Object.keys(defaultOptions).reduce(function (ret, key) {
        //@ts-ignore
        if (ret[key] === null || ret[key] === undefined) {
            ret[key] = defaultOptions[key];
        }
        return ret;
    }, Object.assign({}, options));
}
