import { createContext, useCallback, useState } from 'react';

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, variant = 'info', duration = 3500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, variant }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

const VARIANT_STYLES = {
  success: 'bg-success text-white',
  error: 'bg-danger text-white',
  info: 'bg-ink text-white',
};

function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[min(90vw,380px)]">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => onDismiss(t.id)}
          className={`rounded-xl px-4 py-3 text-sm font-medium shadow-card text-left ${VARIANT_STYLES[t.variant] || VARIANT_STYLES.info}`}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
