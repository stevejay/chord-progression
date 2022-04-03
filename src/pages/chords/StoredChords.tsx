import { FC, useEffect } from 'react';
import { Piano } from '@tonejs/piano';

import { KeyboardDiagram } from './KeyboardDiagram';
import { ChordData, StoredChord } from './types';
import { playChord } from './utils';

const keys = '123456789';

export type StoredChordsProps = {
  piano: Piano;
  storedChords: StoredChord[];
  clearStoredChord: (index: number) => void;
  clearAllStoredChords: () => void;
  setCurrentChord: (chord: ChordData) => void;
};

export const StoredChords: FC<StoredChordsProps> = ({
  piano,
  storedChords,
  clearStoredChord,
  clearAllStoredChords,
  setCurrentChord
}) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        const index = parseInt(event.key, 10) - 1;
        if (storedChords.length > index) {
          playChord(piano, storedChords[index].voicing);
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [piano, storedChords]);

  return (
    <div className="flex">
      <button
        type="button"
        onClick={clearAllStoredChords}
        className="border-red-700 bg-red-700 active:bg-red-800 text-white border-2 rounded py-1 px-1 w-16 h-8"
      >
        Clear
      </button>
      <div className="flex flex-col flex-grow justify-center items-center gap-2">
        {storedChords.map(({ chord, voicing }, index) => (
          <div key={voicing.notes.join('-')} className="flex gap-4 items-center">
            <button
              type="button"
              className="border-lime-700 border-2 rounded py-1 px-1 w-24"
              onClick={(event) => {
                if (event.shiftKey) {
                  clearStoredChord(index);
                } else {
                  playChord(piano, voicing);
                  setCurrentChord(chord);
                }
              }}
            >
              <span className="text-slate-600">{chord.name}</span> <strong>{voicing.bassNote}</strong>
            </button>
            <KeyboardDiagram voicing={voicing} />
          </div>
        ))}
      </div>
    </div>
  );
};
