"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const constants = __importStar(require("../utils/Constants"));
function getChordsRawData() {
    const filePath = process.env.CHORDS_URI;
    const fs = require('fs');
    try {
        const outputData = fs.readFileSync(filePath, 'utf8');
        return outputData.toString();
    }
    catch (e) {
        console.log('Erreur lors de la récupération du jeu de donnée:', e.stack);
    }
}
function simplifyAndFlush(chords) {
    let chordsSimplified = Array();
    chords.forEach(chord => {
        const chordsSplitted = chord.split(':');
        let root = chordsSplitted[0];
        let nature = chordsSplitted[1];
        constants.CHORD_INTERVAL.forEach((val, key) => {
            if (nature && nature.startsWith(key)) {
                chordsSimplified.push(`${root}${key}`);
            }
        });
    });
    return chordsSimplified;
}
function parse() {
    const chordsRaw = getChordsRawData().split(' ');
    const chordsUnique = [...new Set(chordsRaw)];
    const chordsCleaned = simplifyAndFlush(chordsUnique);
    return chordsCleaned;
}
exports.parse = parse;
