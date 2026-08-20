import { Check } from 'lucide-react';

export default function WizardProgress({ steps, currentStep }) {
  return (
    <div className="flex items-center mb-6">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  isDone
                    ? 'bg-brand-500 text-white'
                    : isActive
                    ? 'bg-coral-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? <Check size={14} /> : stepNum}
              </div>
              <span
                className={`text-[11px] text-center leading-tight max-w-[64px] ${
                  isActive ? 'text-ink font-medium' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
            {stepNum < steps.length && (
              <div className={`h-0.5 flex-1 mx-1 mb-4 ${isDone ? 'bg-brand-500' : 'bg-slate-100'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
