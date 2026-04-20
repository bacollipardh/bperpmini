'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navSections } from '@/lib/nav';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-slate-900 text-slate-100 min-h-screen p-4">
      <div className="text-xl font-bold mb-6">ERP</div>

      <div className="space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      active ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
