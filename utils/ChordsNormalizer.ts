import * as constants from "../utils/Constants";

function getChordsRawData(): string {
    const filePath = process.env.CHORDS_URI;
    const fs = require('fs');

    try {
        const outputData = fs.readFileSync(filePath, 'utf8');
        return outputData.toString();

    } catch(e) {
        console.log('Erreur lors de la récupération du jeu de donnée:', e.stack);
    }
}

function simplifyAndFlush(chords: string[]): string[]{
    let chordsSimplified: string[] = Array();

    chords.forEach(chord => {
        const chordsSplitted = chord.split(':');

        let root: string = chordsSplitted[0];
        let nature: string = chordsSplitted[1];

        constants.CHORD_INTERVAL.forEach((val: number[], key: string) => {
            if(nature && nature.startsWith(key)){
                chordsSimplified.push(`${root}${key}`);
            }
        });
    })

    return chordsSimplified;
}

export function parse(): string[]{
    const chordsRaw: string[] = getChordsRawData().split(' ');
    const chordsUnique: string[] = [...new Set(chordsRaw)];

    const chordsCleaned: string[] = simplifyAndFlush(chordsUnique);
    
    return chordsCleaned;
}