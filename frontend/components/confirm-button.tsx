'use client';

export function ConfirmButton({
  label,
  onClick,
  confirmText,
  className,
}: {
  label: string;
  onClick: () => Promise<void> | void;
  confirmText: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className ?? 'rounded-lg bg-slate-900 text-white px-3 py-2 text-sm'}
      onClick={async () => {
        if (!window.confirm(confirmText)) return;
        await onClick();
      }}
    >
      {label}
    </button>
  );
}
