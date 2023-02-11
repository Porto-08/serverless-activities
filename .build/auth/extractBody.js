"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractBody = void 0;
var extractBody = function (event) {
    if (!event.body) {
        throw new Error("No body provided");
    }
    return JSON.parse(event.body);
};
exports.extractBody = extractBody;
//# sourceMappingURL=extractBody.js.map