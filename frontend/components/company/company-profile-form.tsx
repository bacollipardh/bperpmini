'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type Profile = {
  name?: string;
  fiscalNo?: string;
  vatNo?: string;
  businessNo?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  bankName?: string;
  bankAccount?: string;
};

function Field({
  label, name, value, onChange, placeholder, hint,
}: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? ''}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
      />
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
    </div>
  );
}

export function CompanyProfileForm({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>({
    name:       profile?.name        ?? '',
    fiscalNo:   profile?.fiscalNo    ?? '',
    vatNo:      profile?.vatNo       ?? '',
    businessNo: profile?.businessNo  ?? '',
    address:    profile?.address     ?? '',
    city:       profile?.city        ?? '',
    phone:      profile?.phone       ?? '',
    email:      profile?.email       ?? '',
    website:    profile?.website     ?? '',
    bankName:   profile?.bankName    ?? '',
    bankAccount:profile?.bankAccount ?? '',
  });
  const [busy, setBusy]   = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof Profile) {
    return (v: string) => setForm(f => ({ ...f, [key]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name?.trim()) { setError('Emri i kompanisë është i detyrueshëm.'); return; }
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      // Strip empty strings → undefined so backend ignores them
      const payload: Record<string, string> = {};
      for (const [k, v] of Object.entries(form)) {
        if (v && String(v).trim()) payload[k] = String(v).trim();
      }
      await api.put('company-profile', payload);
      setSaved(true);
      router.refresh();
    } catch (err: any) {
      try { setError(JSON.parse(err.message).message ?? err.message); }
      catch { setError(err.message ?? 'Gabim gjatë ruajtjes.'); }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {saved && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3">
          ✓ Profili i kompanisë u ruajt me sukses.
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
      )}

      {/* Identity */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 pb-1 border-b border-slate-100">Identiteti i Biznesit</h2>
        <Field label="Emri i Kompanisë *" name="name" value={form.name ?? ''} onChange={set('name')}
               placeholder="p.sh. Kompania ABC Sh.p.k." />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Nr. Fiskal" name="fiscalNo" value={form.fiscalNo ?? ''} onChange={set('fiscalNo')}
                 placeholder="600XXXXXXX" hint="Numri fiskal i ATK-së" />
          <Field label="Nr. TVSH" name="vatNo" value={form.vatNo ?? ''} onChange={set('vatNo')}
                 placeholder="XKXXXXXXXXX" hint="Nëse jeni i regjistruar për TVSH" />
          <Field label="Nr. Biznesit" name="businessNo" value={form.businessNo ?? ''} onChange={set('businessNo')}
                 placeholder="XXXXXXXX" hint="Numri i regjistrimit (ARBK)" />
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 pb-1 border-b border-slate-100">Kontakti & Adresa</h2>
        <Field label="Adresa" name="address" value={form.address ?? ''} onChange={set('address')}
               placeholder="Rruga, nr. ..." />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Qyteti" name="city" value={form.city ?? ''} onChange={set('city')}
                 placeholder="Prishtinë" />
          <Field label="Telefoni" name="phone" value={form.phone ?? ''} onChange={set('phone')}
                 placeholder="+383 4X XXX XXX" />
          <Field label="Email" name="email" value={form.email ?? ''} onChange={set('email')}
                 placeholder="info@kompania.com" />
        </div>
        <Field label="Faqja Web" name="website" value={form.website ?? ''} onChange={set('website')}
               placeholder="https://kompania.com" />
      </div>

      {/* Bank */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-800 pb-1 border-b border-slate-100">Të Dhënat Bankare</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Emri i Bankës" name="bankName" value={form.bankName ?? ''} onChange={set('bankName')}
                 placeholder="p.sh. ProCredit Bank" />
          <Field label="Nr. Llogarisë (IBAN)" name="bankAccount" value={form.bankAccount ?? ''} onChange={set('bankAccount')}
                 placeholder="XK05 XXXX XXXX XXXX XXXX" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 text-sm font-medium disabled:opacity-50 transition-colors shadow-sm"
        >
          {busy ? (
            <>
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Duke ruajtur...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Ruaj Profilin
            </>
          )}
        </button>
      </div>
    </form>
  );
}
