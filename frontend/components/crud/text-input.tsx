import { InputHTMLAttributes } from 'react';

export function TextInput(
  props: InputHTMLAttributes<HTMLInputElement> & { label: string },
) {
  const { label, ...rest } = props;
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input {...rest} className="w-full rounded-xl border px-3 py-2 text-sm" />
    </label>
  );
}
