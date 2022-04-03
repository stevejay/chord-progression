import { memo, useEffect, useState } from 'react';
import { Piano } from '@tonejs/piano';

import { ChordCard } from './ChordCard';
import { ChordTypeSelect } from './ChordTypeSelect';
import { NoteSelect } from './NoteSelect';
import { ScaleSelect } from './ScaleSelect';
import { ChordData, ChordTypeName, ScaleName, StoredChord } from './types';
import { createChordPalette } from './utils';

function rotatedChords(chords: ChordData[], scaleNotes: string[], primaryNotes?: string[]) {
  if (!primaryNotes || !primaryNotes.length) {
    return chords;
  }
  const startLetter = primaryNotes[0][0];
  const startIndex = scaleNotes.findIndex((x) => x.startsWith(startLetter));
  if (startIndex === 0) {
    return chords;
  }
  const reorderedChords = [];
  for (let i = startIndex; i < chords.length; ++i) {
    reorderedChords.push(chords[i]);
  }
  for (let i = 0; i < startIndex; ++i) {
    reorderedChords.push(chords[i]);
  }
  return reorderedChords;
}

export type ChordPaletteProps = {
  piano: Piano;
  primaryNotes?: string[];
  setPrimaryNotes?: (notes: string[]) => void;
  addToStoredChords: (storedChord: StoredChord) => void;
  currentChord: ChordData | null;
  setCurrentChord: (chord: ChordData) => void;
};

export const ChordPalette = memo(
  ({ piano, primaryNotes, setPrimaryNotes, addToStoredChords, currentChord, setCurrentChord }: ChordPaletteProps) => {
    const [scaleName, setScaleName] = useState<ScaleName>('major');
    const [rootNote, setRootNote] = useState('C');
    const [chordType, setChordType] = useState<ChordTypeName>('triad');
    const [chordPalette, setChordPalette] = useState(() => createChordPalette('major', 'C', chordType));

    useEffect(() => {
      const chordPalette = createChordPalette(scaleName, rootNote, chordType);
      setChordPalette(chordPalette);
      setPrimaryNotes && setPrimaryNotes(chordPalette.scale.notes);
    }, [scaleName, rootNote, primaryNotes, setPrimaryNotes, chordType]);

    return (
      <div className="p-4 space-y-4 flex-shrink">
        <div className="flex gap-2">
          <NoteSelect value={rootNote} onChange={setRootNote} />
          <ScaleSelect value={scaleName} onChange={setScaleName} />
          <ChordTypeSelect value={chordType} onChange={setChordType} />
        </div>
        <div className="bg-slate-100/20 shadow-xl rounded-sm grid grid-cols-1 divide-y">
          {rotatedChords(chordPalette.chordPalette, chordPalette.scale.notes, primaryNotes).map((chord, index) => (
            <ChordCard
              key={index}
              chord={chord}
              piano={piano}
              primaryNotes={primaryNotes}
              addToStoredChords={addToStoredChords}
              currentChord={currentChord}
              setCurrentChord={setCurrentChord}
            />
          ))}
        </div>
      </div>
    );
  }
);
