import { FC } from 'react';

import { Select } from './Select';

export const NoteSelect: FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <Select value={value} onChange={onChange}>
    <option value="C">C</option>
    <option value="C#">C#</option>
    <option value="D">D</option>
    <option value="D#">D#</option>
    <option value="E">E</option>
    <option value="F">F</option>
    <option value="F#">F#</option>
    <option value="G">G</option>
    <option value="G#">G#</option>
    <option value="A">A</option>
    <option value="A#">A#</option>
    <option value="B">B</option>
  </Select>
);
