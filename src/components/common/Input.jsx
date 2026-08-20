import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
  { label, type = 'text', error, icon: Icon, className = '', ...rest },
  ref
) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && show ? 'text' : type;

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        )}
        <input
          ref={ref}
          type={inputType}
          className={`input-field ${Icon ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''} ${
            error ? 'border-danger focus:border-danger focus:ring-danger' : ''
          }`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            tabIndex={-1}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
});

export default Input;
