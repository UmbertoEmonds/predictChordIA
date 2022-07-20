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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const chordsService = __importStar(require("../service/ChordsService"));
const modelUtils = __importStar(require("../ML/ModelUtils"));
const tf = __importStar(require("@tensorflow/tfjs-node"));
const constants = __importStar(require("../utils/Constants"));
const app = (0, express_1.default)();
const ejs = require('ejs');
const chordRoute = require('../router/chordsRoute');
require('dotenv').config();
const port = 3000;
app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
app.use(express_1.default.json());
app.use('/ia-docharmonie/chords', chordRoute);
const chordsNormalized = chordsService.normalize();
modelUtils.createModel();
chordsNormalized.forEach(c => {
    if (c.firstChord == 100) {
        c.secondChord = 100;
    }
});
const tensorData = convertToTensor(chordsNormalized);
const { inputs, labels } = tensorData;
constants.setTensorData(tensorData);
modelUtils.trainModel(modelUtils.getModel(), inputs, labels);
console.log("Entrainement terminé");
function convertToTensor(data) {
    // Wrapping these calculations in a tidy will dispose any
    // intermediate tensors.
    return tf.tidy(() => {
        // Step 1. Shuffle the data
        tf.util.shuffle(data);
        // Step 2. Convert data to Tensor
        const inputs = data.map(d => d.firstChord);
        const labels = data.map(d => d.secondChord);
        // Ici, nous avons inputs.length exemples, et chaque exemple possède 1 caractéristique d'entrée (l'accord).
        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
        //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();
        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin)); // [num_examples, num_features_per_example] (nombre_exemples, nombre_caractéristiques_par_exemple)
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));
        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            // Return the min/max bounds so we can use them later.
            inputMax,
            inputMin,
            labelMax,
            labelMin,
        };
    });
}
module.exports = app;
