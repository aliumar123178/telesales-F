import { Radio } from 'lucide-react';

export default function Navbar({ title }) {
  return (
    <header className="sticky top-0 z-10 bg-brand-500">
      <div className="h-16 px-5 flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
          <Radio size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-white tracking-tight">Nexora</span>
      </div>
      {title && (
        <div className="bg-white px-5 py-3 border-b border-slate-100">
          <h1 className="text-lg font-display font-semibold text-brand-500">{title}</h1>
        </div>
      )}
    </header>
  );
}
