import { TextareaHTMLAttributes } from 'react';

export function TextareaInput(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string },
) {
  const { label, ...rest } = props;
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea {...rest} className="w-full rounded-xl border px-3 py-2 text-sm min-h-[96px]" />
    </label>
  );
}
