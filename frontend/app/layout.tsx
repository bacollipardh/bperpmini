import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'ERP Admin Panel',
  description: 'Blerje, shitje, stok dhe faturim',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sq">
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
