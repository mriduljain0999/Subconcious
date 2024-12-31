"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
function random(len) {
    const options = "fsdgjlsklsoldnjlsedn345435ty9r0ewsdifuhs";
    let hash = "";
    const length = options.length;
    for (let i = 0; i < len; i++) {
        hash += options[Math.floor(Math.random() * length)];
    }
    return hash;
}
