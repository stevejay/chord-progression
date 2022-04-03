import { Chord, Midi, note, Scale } from '@tonaljs/tonal';
import { Piano } from '@tonejs/piano';
import { intersection } from 'lodash-es';

import { ChordData, ChordTypeName, ChordVoicing, NoteName, ScaleName, TonalJsChord, TonalJsScale } from './types';
import * as Voicing from './voicing';
import { all } from './voicingDictionary';

// https://www.npmjs.com/package/tonal
// https://www.ethanhein.com/wp/2020/scales-keys-and-modes-on-the-circle-of-fifths/

// Works as is for major, natural minor (aeolian), and phrygian scales
// (since they are diatonic scales).
//
// Major - 1 back, 5 forward, e.g., C major (all white notes)
// Natural minor (aeolian) - 4 back, 2 forward, e.g. A minor (all white notes)
// Phyrgian - 5 back, 1 forward, e.g. E phyrgian (all white notes)
//
// For the harmonic minor, treat as per the natural minor (aeolian) scale
// but the 7th is raised.
//   - 4 back, 2 forward, 2 back is raised a semitone.
//        - e.g. A harmonic minor (all white notes except G is sharp)

/*
Natural minor scale - relative keys
Cb - Abm
Gb - Ebm
Db - Bbm
Ab - Fm
Eb - Cm
Bb - Gm
F - Dm
C - Am
G - Em
D - Bm
A - F#m
E - C#m
B - G#m
F# - D#m
C# - A#m
*/

export function createChordPalette(
  scaleName: ScaleName,
  rootNote: NoteName,
  chordType: ChordTypeName
): { scale: TonalJsScale; chordPalette: ChordData[] } {
  const scale = Scale.get(`${rootNote} ${scaleName}`);
  const chordsFromScale = getChordsFromScale(scale.notes, chordType);
  const noteToAvoid = getNoteToAvoid(scaleName, scale.notes);
  const range = getRange(chordType);
  //   console.log(chordType, scale, chordsFromScale);
  return {
    scale,
    chordPalette: chordsFromScale.map((item) => getVoicings(item, range, noteToAvoid))
  };
}

function getRange(chordType: ChordTypeName) {
  switch (chordType) {
    case 'triad':
      return { lower: 'E3', upper: 'B4' };
    case 'seventh':
    case 'fourth':
      return { lower: 'E3', upper: 'D5' };
    default:
      throw new Error(`unknown chord type '${chordType}'`);
  }
}

function getNoteToAvoid(scaleName: ScaleName, scaleNotes: string[]): string {
  switch (scaleName) {
    case 'major':
      return scaleNotes[4]; // Fifth
    case 'minor':
      return scaleNotes[6]; // Seventh
    case 'phrygian':
      return scaleNotes[2]; // Third
    default:
      return '';
  }
}

function getVoicings(chord: TonalJsChord, range: { lower: string; upper: string }, noteToAvoid: string): ChordData {
  const voicingsNotes = Voicing.search(chord.symbol, [range.lower, range.upper], all);
  let voicings = voicingsNotes.map((notes) => {
    const bassNotePitchClass = note(notes[0])!.pc;
    const chordNotePitchClasses = chord.notes.map((n) => note(n)!.pc);
    const inversion = chordNotePitchClasses.findIndex((x) => x === bassNotePitchClass);
    if (inversion === -1) {
      throw new Error(`could not find bass note ${chord.symbol} ${chord.notes.join(',')}`);
    }
    return {
      notes,
      notesNoOctave: chordNotePitchClasses,
      name: inversion === 0 ? chord.symbol : `${chord.symbol}/${bassNotePitchClass}`,
      bassNote: bassNotePitchClass,
      //   bass: notes[0]
      inversion // 0=root position, 1=1st, 2=2nd, 3=3rd
    };
  });
  voicings = voicings.sort((a, b) => (note(a.notes[0])?.midi ?? 0) - (note(b.notes[0])?.midi ?? 0));
  voicings = voicings.filter((_, i) => i < 3);
  return { name: chord.symbol, chord, hasAvoidNote: Boolean(chord.notes.find((x) => x === noteToAvoid)), voicings };
}

function getChordsFromScale(scaleNotes: string[], chordType: ChordTypeName) {
  return scaleNotes.map((note, index) => {
    const notes = getChordNotesFromScale(note, index, scaleNotes, chordType);
    // [note, scaleNotes[(index + 2) % scaleNotes.length], scaleNotes[(index + 4) % scaleNotes.length]];
    const detectedChordName = Chord.detect(notes)[0];
    // console.log('detectedChordName', detectedChordName);
    // console.log('notes', notes, detectedChordName);
    return Chord.get(detectedChordName);
  });
}

function getChordNotesFromScale(
  rootNote: string,
  rootNodeIndex: number,
  scaleNotes: string[],
  chordType: ChordTypeName
) {
  switch (chordType) {
    case 'triad':
      return [
        rootNote,
        scaleNotes[(rootNodeIndex + 2) % scaleNotes.length],
        scaleNotes[(rootNodeIndex + 4) % scaleNotes.length]
      ];
    case 'seventh':
      return [
        rootNote,
        scaleNotes[(rootNodeIndex + 2) % scaleNotes.length],
        scaleNotes[(rootNodeIndex + 4) % scaleNotes.length],
        scaleNotes[(rootNodeIndex + 6) % scaleNotes.length]
      ];
    case 'fourth':
      return [
        rootNote,
        scaleNotes[(rootNodeIndex + 3) % scaleNotes.length],
        scaleNotes[(rootNodeIndex + 6) % scaleNotes.length]
      ];
    default:
      throw new Error(`unknown chord type '${chordType}'`);
  }
}

export function hasSameNotes(chordNotes: string[], scaleNotes: string[]) {
  for (var i = 0; i < chordNotes.length; ++i) {
    if (scaleNotes.indexOf(chordNotes[i]) === -1) {
      return false;
    }
  }
  return true;
}

export function getInversionName(inversion: number) {
  switch (inversion) {
    case 0:
      return '0';
    case 1:
      return 'I';
    case 2:
      return 'II';
    case 3:
      return 'III';
    default:
      throw new Error(`unknown inversion '${inversion}'`);
  }
}

export function playChord(piano: Piano, voicing: ChordVoicing) {
  voicing.notes.forEach((note) => {
    piano.keyDown({ note, velocity: 0.5 });
    piano.keyUp({ note, time: '+1' });
  });
  let bassNote = Midi.toMidi(voicing.notes[0]);
  if (bassNote) {
    bassNote = bassNote - 12;
    piano.keyDown({ note: Midi.midiToNoteName(bassNote), velocity: 0.3 });
    piano.keyUp({ note: Midi.midiToNoteName(bassNote), time: '+1' });
  }
}

export function getIsGoodChordChange(currentChord: ChordData, nextChord: ChordData) {
  //   console.log('chords', currentChord.chord, nextChord.chord);

  const currentNotes = currentChord.chord.notes;
  const nextNotes = nextChord.chord.notes;
  const notesInCommon = intersection(currentNotes, nextNotes);

  // Triad
  if (currentNotes.length === 3) {
    return notesInCommon.length === 1;
  } else if (currentNotes.length === 4) {
    return notesInCommon.length === 1 || notesInCommon.length === 2;
  }

  return false;
}
