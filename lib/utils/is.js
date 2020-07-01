export function isString(str) {
    return str instanceof String || typeof str == 'string';
}
export function numIsEqual(left, right) {
    return Math.abs(left - right) < 0.00001;
}
