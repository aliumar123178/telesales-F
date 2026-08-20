import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 py-10 text-slate-400 ${className}`}>
      <Loader2 size={24} className="animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
