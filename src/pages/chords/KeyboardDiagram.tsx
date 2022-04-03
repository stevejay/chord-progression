import { FC, memo } from 'react';
import { Midi } from '@tonaljs/tonal';

import { ChordVoicing } from './types';

export type KeyboardDiagramProps = {
  voicing: ChordVoicing;
};

const keyboardMidiNotes = Array.from({ length: 12 * 3 }, (_, i) => i + 48);
const blackKeys = [1, 3, 6, 8, 10];
const smallerWhiteKeys = [0, 4, 5, 11];

function isBlackKey(index: number) {
  return blackKeys.includes(index % 12);
}

function isSmallerWhiteKey(index: number) {
  return smallerWhiteKeys.includes(index % 12);
}

const Key: FC<{ index: number; isPressed: boolean }> = ({ index, isPressed }) => {
  const normalColor = isBlackKey(index) ? 'bg-slate-700' : 'bg-gray-200';
  const color = isPressed ? 'bg-blue-500' : normalColor;
  const width = isSmallerWhiteKey(index) ? 'w-3' : 'w-4';
  return <div className={`${width} h-6 border border-slate-800 ${color}`} />;
};

export const KeyboardDiagram = memo(({ voicing }: KeyboardDiagramProps) => {
  const midiNotes = voicing.notes.map((note) => Midi.toMidi(note));
  return (
    <div className="flex">
      {keyboardMidiNotes.map((i) => (
        <Key key={i} index={i} isPressed={midiNotes.includes(i)} />
      ))}
    </div>
  );
});
