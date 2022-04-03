import { memo } from 'react';
import { Piano } from '@tonejs/piano';

import { ChordData, StoredChord } from './types';
import { getInversionName, getIsGoodChordChange, hasSameNotes, playChord } from './utils';

export type ChordCardProps = {
  chord: ChordData;
  piano: Piano;
  primaryNotes?: string[];
  addToStoredChords: (storedChord: StoredChord) => void;
  currentChord: ChordData | null;
  setCurrentChord: (chord: ChordData) => void;
};

export const ChordCard = memo(
  ({ chord, piano, primaryNotes, addToStoredChords, currentChord, setCurrentChord }: ChordCardProps) => {
    const { name, voicings } = chord;
    const active = (!primaryNotes || !hasSameNotes(voicings[0].notesNoOctave, primaryNotes)) && !name.endsWith('dim');
    const isGoodChordChange = active && currentChord && getIsGoodChordChange(currentChord, chord);
    return (
      <div className={`p-2 flex ${active ? 'opacity-100' : 'opacity-25'}`}>
        <div className="flex flex-col w-16">
          <div>{name}</div>
          <div className={`${isGoodChordChange ? 'bg-green-500' : 'bg-transparent'} w-3 h-3 rounded-full`} />
        </div>
        <div className="flex gap-1">
          {voicings.map((voicing) => (
            <button
              type="button"
              className="border-lime-700 border-2 rounded py-1 px-1 min-w-[4rem]"
              key={voicing.notes.join('-')}
              disabled={!active}
              onClick={(event) => {
                playChord(piano, voicing);
                setCurrentChord(chord);
                if (event.shiftKey) {
                  addToStoredChords({ chord, voicing });
                }
              }}
            >
              <span className="text-slate-600">{getInversionName(voicing.inversion)}</span>{' '}
              <strong>{voicing.bassNote}</strong>
            </button>
          ))}
        </div>
      </div>
    );
  }
);
