import React from 'react';

/**
 * Input — Console-styled text/number input
 */
export const Input = ({
  label,
  icon: Icon,
  unit,
  error,
  className = '',
  inputClassName = '',
  ...props
}) => (
  <div className={className}>
    {label && (
      <label className="input-label flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase tracking-wider font-semibold">
          {Icon && <Icon className="w-3.5 h-3.5 opacity-60 text-brand-400" />}
          {label}
        </span>
        {unit && <span className="text-white/20 text-[9px] lowercase font-normal">({unit})</span>}
      </label>
    )}
    <input className={`console-input ${inputClassName}`} {...props} />
    {error && <p className="input-error">{error}</p>}
  </div>
);

/**
 * Select — Console-styled native select
 */
export const Select = ({
  label,
  icon: Icon,
  options = [],
  error,
  className = '',
  selectClassName = '',
  ...props
}) => (
  <div className={className}>
    {label && (
      <label className="input-label flex items-center gap-1.5 text-white/50 text-[10px] uppercase tracking-wider font-semibold">
        {Icon && <Icon className="w-3.5 h-3.5 opacity-60 text-brand-400" />}
        {label}
      </label>
    )}
    <select className={`console-select ${selectClassName}`} {...props}>
      {options.map(opt => {
        const value = typeof opt === 'string' ? opt : opt.value;
        const text  = typeof opt === 'string' ? opt : opt.label;
        return <option key={value} value={value}>{text}</option>;
      })}
    </select>
    {error && <p className="input-error">{error}</p>}
  </div>
);

/**
 * Textarea — Console-styled textarea
 */
export const Textarea = ({
  label,
  error,
  className = '',
  ...props
}) => (
  <div className={className}>
    {label && <label className="input-label text-white/50 text-[10px] uppercase tracking-wider font-semibold mb-1.5 block">{label}</label>}
    <textarea className="console-input min-h-[100px] resize-y" {...props} />
    {error && <p className="input-error">{error}</p>}
  </div>
);

/**
 * InputGroup — Grid layout
 */
export const InputGroup = ({
  cols = 2,
  gap = 'gap-4',
  className = '',
  children,
}) => (
  <div className={`grid grid-cols-1 sm:grid-cols-${cols} ${gap} ${className}`}>
    {children}
  </div>
);

export default Input;
