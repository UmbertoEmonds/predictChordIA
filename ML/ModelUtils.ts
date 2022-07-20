import { Sequential, Tensor } from "@tensorflow/tfjs";
import * as tf from '@tensorflow/tfjs-node';

let model: Sequential

export function getModel(): Sequential {
  return model;
}

export function createModel(): Sequential {
    // Create a sequential model
    model = tf.sequential();
  
    // Add a single input layer
    // l'inputShape est à 12 car on envoie un vecteur de 12 valeurs
    // units: nombre de neurones par couche
    model.add(tf.layers.dense({inputShape: [1], units: 1}));

    // ajouter d'une couche cachée
    //model.add(tf.layers.dense({units: 16, activation: 'sigmoid'}));
  
    // Add an output layer
    model.add(tf.layers.dense({units: 1}));
  
    return model;
}

export async function trainModel(model: Sequential, inputs: Tensor, labels: Tensor) {
    // Prepare the model for training.
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse'],
    });
  
    const batchSize = 24; // taille des sous-ensemble des données qu'on donnera au modèle à chaque itération d'apprentissage
    const epochs = 50; // nombre d'itérations pour la phase d'apprentissage
  
    // lancement de la phase d'entrainement
    return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true
    });
}

export function testModel(model: Sequential, tensorData: any) {
  
    const [xs, preds] = tf.tidy(() => {
  
      // generation de 100 example entre 0 et 1
      const xs = tf.linspace(0, 1, 100);
  
      // prediction
      const preds: any = model.predict(xs.reshape([100, 1]));
  
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