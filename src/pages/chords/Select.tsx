import { DetailedHTMLProps, SelectHTMLAttributes } from 'react';

// Select stying: https://stackoverflow.com/questions/65120873/how-to-add-padding-to-the-default-arrow-in-a-select-dropdown-list

export type SelectProps<ValueT extends string> = {
  value: ValueT;
  onChange: (value: ValueT) => void;
} & Omit<DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'value' | 'onChange'>;

export function Select<ValueT extends string>({ value, onChange, children, ...rest }: SelectProps<ValueT>) {
  return (
    <select
      {...rest}
      value={value}
      onChange={(event) => onChange(event.target.value as ValueT)}
      className="border-lime-700 border-2 rounded py-1 px-2 text-sm outline-none focus-visible:ring"
    >
      {children}
    </select>
  );
}
