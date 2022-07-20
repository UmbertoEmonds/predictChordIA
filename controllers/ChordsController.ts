import * as modelUtils from '../ML/ModelUtils';
import * as tf from '@tensorflow/tfjs-node';
import * as constants from "../utils/Constants";
import { Tensor, tensor1d, Tensor1D } from '@tensorflow/tfjs-node';
import { PredictResponse } from '../model/PredictResponse';

const predictChord = ((request, response) => {
    const chord_header = request.get('chord');
    
    if(chord_header){
        
        const labelMax: Tensor = tensor1d([155]);
        const labelMin: Tensor = tensor1d([1]);

        const referenceAccordToNormalize = constants.REF_NOTES.get(chord_header);
        const valueToPredict = tf.tensor(referenceAccordToNormalize)

        const valueNormalized = valueToPredict.sub(labelMin).div(labelMax.sub(labelMin));

        const preds: any = modelUtils.getModel().predict(valueNormalized);

        const predUnnormalized = preds.mul(labelMax.sub(labelMin)).add(labelMin);
        const predData = predUnnormalized.dataSync()[0];
        const predRouned = Math.round(predData);
        
        let responseData: PredictResponse = {
            rawData: predRouned,
            rawDataRounded: predRouned,
            chord: getByValue(constants.REF_NOTES, predRouned)
        }

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