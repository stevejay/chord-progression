import { FC } from 'react';

import { Select } from './Select';
import { ChordTypeName } from './types';

export const ChordTypeSelect: FC<{ value: ChordTypeName; onChange: (value: ChordTypeName) => void }> = ({
  value,
  onChange
}) => (
  <Select value={value} onChange={onChange}>
    <option value="triad">T</option>
    <option value="seventh">7</option>
    <option value="fourth">4</option>
  </Select>
);
