import { Chord, Scale } from '@tonaljs/tonal';

export type TonalJsChord = ReturnType<typeof Chord.get>;
export type TonalJsScale = ReturnType<typeof Scale.get>;

export type ScaleName = 'major' | 'minor' | 'phrygian' | 'harmonic minor';
export type NoteName = string;
export type ChordTypeName = 'triad' | 'seventh' | 'fourth';

export type ChordVoicing = {
  notes: string[];
  notesNoOctave: string[];
  name: string;
  bassNote: string;
  inversion: number;
};

export type ChordData = {
  name: string;
  chord: TonalJsChord;
  voicings: ChordVoicing[];
  hasAvoidNote: boolean;
};

export type StoredChord = { chord: ChordData; voicing: ChordVoicing };
