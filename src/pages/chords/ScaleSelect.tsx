import { FC } from 'react';

import { Select } from './Select';
import { ScaleName } from './types';

export const ScaleSelect: FC<{ value: ScaleName; onChange: (value: ScaleName) => void }> = ({ value, onChange }) => (
  <Select value={value} onChange={onChange}>
    <option value="major">Major</option>
    <option value="minor">Minor</option>
    <option value="phrygian">Phrygian</option>
    <option value="harmonic minor">Harm. Minor</option>
  </Select>
);
