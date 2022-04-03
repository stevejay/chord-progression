import { FC, useCallback, useState } from 'react';

import { ChordPalette } from './ChordPalette';
import { StoredChords } from './StoredChords';
import { ChordData, StoredChord } from './types';
import { usePiano } from './usePiano';
import { useStartTone } from './useStartTone';

// const circleOfFifths = [
//     ['C'],
//     ['G'],
//     ['D'],
//     ['A'],
//     ['E'],
//     ['B', 'Cb'],
//     ['F#', 'Gb'],
//     ['Db', 'C#'],
//     ['Ab'],
//     ['Eb'],
//     ['Bb'],
//     ['F']
//   ];

const Chords: FC = () => {
  const [startTone, starting, started, startError] = useStartTone();
  const [piano, pianoLoaded, pianoError] = usePiano(started);
  const [primaryNotes, setPrimaryNotes] = useState<string[]>([]);
  const [storedChords, setStoredChords] = useState<StoredChord[]>([]);
  const [currentChord, setCurrentChord] = useState<ChordData | null>(null);

  const addToStoredChords = useCallback(
    (storedChord: StoredChord) => setStoredChords((prev) => [...prev, storedChord]),
    []
  );

  const clearAllStoredChords = useCallback(() => setStoredChords([]), []);

  const clearStoredChord = useCallback(
    (index: number) => setStoredChords((prev) => prev.filter((_, i) => i !== index)),
    []
  );

  if (startError) {
    return <p>Tone.js starting failed: {startError}</p>;
  }
  if (pianoError) {
    return <p>Piano initialisation failed: {pianoError}</p>;
  }
  if (!started) {
    return (
      <button type="button" onClick={startTone}>
        {starting ? 'Starting Tone.js...' : 'Start Tone.js'}
      </button>
    );
  }
  if (!piano || !pianoLoaded) {
    return <p>Initialising the piano...</p>;
  }
  return (
    <>
      <p className="text-center text-slate-400">MAJ: Db - Ab - Eb - Bb - F - [C] - G - D - A - E - B - F#/Gb</p>
      <p className="text-center text-slate-400">MIN: Bb - F - C - G - D - [A] - E - B - F# - C# - G# - D#/Eb</p>
      <div className="grid grid-cols-4">
        <ChordPalette
          piano={piano}
          primaryNotes={primaryNotes}
          addToStoredChords={addToStoredChords}
          currentChord={currentChord}
          setCurrentChord={setCurrentChord}
        />
        <ChordPalette
          piano={piano}
          setPrimaryNotes={setPrimaryNotes}
          addToStoredChords={addToStoredChords}
          currentChord={currentChord}
          setCurrentChord={setCurrentChord}
        />
        <ChordPalette
          piano={piano}
          primaryNotes={primaryNotes}
          addToStoredChords={addToStoredChords}
          currentChord={currentChord}
          setCurrentChord={setCurrentChord}
        />
        <ChordPalette
          piano={piano}
          primaryNotes={primaryNotes}
          addToStoredChords={addToStoredChords}
          currentChord={currentChord}
          setCurrentChord={setCurrentChord}
        />
      </div>
      <StoredChords
        piano={piano}
        storedChords={storedChords}
        clearStoredChord={clearStoredChord}
        clearAllStoredChords={clearAllStoredChords}
        setCurrentChord={setCurrentChord}
      />
    </>
  );
};

export default Chords;
