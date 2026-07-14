import React from 'react';

/**
 * SectionHeader — Consistent in-page section label
 */

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  className = '',
  onClick,
}) => (
  <div
    className={`flex items-center justify-between mb-5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-forest/[0.06] border border-forest/[0.12] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-forest" aria-hidden />
        </div>
      )}
      <div>
        <h3 className="section-label">{title}</h3>
        {subtitle && <p className="text-caption text-stone mt-0.5 normal-case tracking-normal">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default SectionHeader;
