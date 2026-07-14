import React from 'react';

/**
 * Badge — Semantic status indicator
 */

const Badge = ({
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  dot = false,
  className = '',
  children,
}) => {
  const variantClass =
    {
      success: 'badge-success',
      warning: 'badge-warning',
      danger: 'badge-danger',
      info: 'badge-info',
      neutral: 'badge-neutral',
      brand: 'badge-brand',
    }[variant] || 'badge-neutral';

  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : '';

  const dotColors = {
    success: 'bg-forest',
    warning: 'bg-gold',
    danger: 'bg-semantic-danger',
    info: 'bg-olive',
    neutral: 'bg-stone',
    brand: 'bg-forest',
  };

  return (
    <span className={`badge ${variantClass} ${sizeClass} ${className}`}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.neutral}`}
          aria-hidden
        />
      )}
      {Icon && <Icon className="w-3.5 h-3.5" aria-hidden />}
      {children}
    </span>
  );
};

export default Badge;
