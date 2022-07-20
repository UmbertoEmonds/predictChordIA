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
const modelUtils = __importStar(require("../ML/ModelUtils"));
const tf = __importStar(require("@tensorflow/tfjs-node"));
const constants = __importStar(require("../utils/Constants"));
const tfjs_node_1 = require("@tensorflow/tfjs-node");
const predictChord = ((request, response) => {
    const chord_header = request.get('chord');
    if (chord_header) {
        const labelMax = (0, tfjs_node_1.tensor1d)([155]);
        const labelMin = (0, tfjs_node_1.tensor1d)([1]);
        const referenceAccordToNormalize = constants.REF_NOTES.get(chord_header);
        const valueToPredict = tf.tensor(referenceAccordToNormalize);
        const valueNormalized = valueToPredict.sub(labelMin).div(labelMax.sub(labelMin));
        const preds = modelUtils.getModel().predict(valueNormalized);
        const predUnnormalized = preds.mul(labelMax.sub(labelMin)).add(labelMin);
        const predRouned = Math.round(predUnnormalized.dataSync()[0]);
        let responseData = {
            rawData: predRouned,
            chord: getByValue(constants.REF_NOTES, predRouned)
        };
        return response.send(responseData);
    }
    return response.status(400).send("Format de l'accord incorrect");
});
function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}
module.exports = {
    predictChord
};
