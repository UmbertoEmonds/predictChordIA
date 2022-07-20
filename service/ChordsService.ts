import { Chord } from "../model/Chord";
import fetch from 'node-fetch';
import * as chordsNormalizer from '../utils/ChordsNormalizer';
import * as constants from "../utils/Constants";

const URL = "http://localhost:3000/chords"

export async function getChords(): Promise<Chord[]> {
    const response = await fetch(URL)
    const chordsResult: Array<Chord> = await response.json()

    return chordsResult
}

export function normalize(): Chord[] {
    let chordsNormalized = Array<Chord>()
    let chordsHuman: string[] = chordsNormalizer.parse()
    let chordsNumeric = Array<number>()

    chordsHuman.forEach(chord => {
        chordsNumeric.push(constants.REF_NOTES.get(chord))
    })

    for(let i = 0; i < chordsNumeric.length; i++){
        let chord: Chord = {
            firstChord : chordsNumeric[i],
            secondChord : chordsNumeric[i+1]
        }

        /*
        if(i < 10){
            console.log(chordsHuman[i] + " <> " + chordsHuman[i+1])
            console.log(chord.firstChord + " <> " + chord.secondChord)
        }
        */

        i+=1

        chordsNormalized.push(chord)
    }

    return chordsNormalized
}