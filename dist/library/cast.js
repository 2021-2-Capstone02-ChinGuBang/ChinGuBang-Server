"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stringToBoolean(str) {
    if (str === "true")
        return true;
    else if (str === "false")
        return false;
    else
        return null;
}
function stringToNumber(str) {
    if (str === "null" || !str)
        return null;
    else
        return Number(str);
}
const cast = {
    stringToBoolean,
    stringToNumber,
};
exports.default = cast;
//# sourceMappingURL=cast.js.map