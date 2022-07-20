import express from 'express';
import 'dotenv/config';
import * as chordsService from '../service/ChordsService';
import * as modelUtils from '../ML/ModelUtils';
import * as tf from '@tensorflow/tfjs-node';
import * as constants from "../utils/Constants";

const app = express();
const ejs = require('ejs');
const chordRoute = require('../router/chordsRoute');

require('dotenv').config();

const port = 3000;

app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});

app.use(express.json());
app.use('/ia-docharmonie/chords', chordRoute);

const chordsNormalized = chordsService.normalize();

modelUtils.createModel();

chordsNormalized.forEach(c => {
    if(c.firstChord == 100){
        c.secondChord = 100
    }
})

const tensorData = convertToTensor(chordsNormalized);
const {inputs, labels} = tensorData;

constants.setTensorData(tensorData)

modelUtils.trainModel(modelUtils.getModel(), inputs, labels);
console.log("Entrainement terminé");

function convertToTensor(data) {
  
    return tf.tidy(() => {
      // Step 1. Shuffle the data
      tf.util.shuffle(data);
  
      // Step 2. Convert data to Tensor
      const inputs = data.map(d => d.firstChord)
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
      }
    });
  }
  

module.exports = app;