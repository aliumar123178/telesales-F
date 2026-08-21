import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, children, className = '', ...rest },
  ref
) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={`input-field appearance-none pr-10 ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}`}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
});

export default Select;