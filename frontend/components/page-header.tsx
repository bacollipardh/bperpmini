import Link from 'next/link';

export function PageHeader({
  title,
  description,
  createHref,
  createLabel = 'New',
}: {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description ? <p className="text-sm text-slate-500 mt-1">{description}</p> : null}
      </div>
      {createHref ? (
        <Link
          href={createHref}
          className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium"
        >
          {createLabel}
        </Link>
      ) : null}
    </div>
  );
}
