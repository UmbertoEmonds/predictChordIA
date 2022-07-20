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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testModel = exports.trainModel = exports.createModel = exports.getModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs-node"));
let model;
function getModel() {
    return model;
}
exports.getModel = getModel;
function createModel() {
    // Create a sequential model
    model = tf.sequential();
    // Add a single input layer
    // l'inputShape est à 12 car on envoie un vecteur de 12 valeurs
    // units: nombre de neurones par couche
    model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
    // ajouter d'une couche cachée
    //model.add(tf.layers.dense({units: 16, activation: 'sigmoid'}));
    // Add an output layer
    model.add(tf.layers.dense({ units: 1 }));
    return model;
}
exports.createModel = createModel;
function trainModel(model, inputs, labels) {
    return __awaiter(this, void 0, void 0, function* () {
        // Prepare the model for training.
        model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError,
            metrics: ['mse'],
        });
        const batchSize = 24; // taille des sous-ensemble des données qu'on donnera au modèle à chaque itération d'apprentissage
        const epochs = 50; // nombre d'itérations pour la phase d'apprentissage
        // lancement de la phase d'entrainement
        return yield model.fit(inputs, labels, {
            batchSize,
            epochs,
            shuffle: true
        });
    });
}
exports.trainModel = trainModel;
function testModel(model, tensorData) {
    const [xs, preds] = tf.tidy(() => {
        // generation de 100 example entre 0 et 1
        const xs = tf.linspace(0, 1, 100);
        // prediction
        const preds = model.predict(xs.reshape([100, 1]));
        // denormalisation
        const unNormXs = xs
            .mul(tensorData.inputMax.sub(tensorData.inputMin))
            .add(tensorData.inputMin);
        const unNormPreds = preds
            .mul(tensorData.labelMax.sub(tensorData.labelMin))
            .add(tensorData.labelMin);
        // formatage dans un tableau
        return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });
    return [xs, preds];
}
exports.testModel = testModel;
