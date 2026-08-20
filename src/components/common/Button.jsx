export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...rest
}) {
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} w-full text-center ${className}`}
      {...rest}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}
