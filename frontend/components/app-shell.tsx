import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
