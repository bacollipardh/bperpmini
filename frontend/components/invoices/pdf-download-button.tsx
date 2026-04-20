'use client';

import { getClientToken } from '@/lib/auth-utils';

export function PdfDownloadButton({ href, label }: { href: string; label: string }) {
  async function handleDownload() {
    const token = getClientToken();
    const res = await fetch(href, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) { alert('PDF generation failed'); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = href.split('/').pop() + '.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap"
    >
      {label}
    </button>
  );
}
