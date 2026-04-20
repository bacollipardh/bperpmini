export function StatsCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
      {subtitle ? <div className="text-xs text-slate-400 mt-2">{subtitle}</div> : null}
    </div>
  );
}
