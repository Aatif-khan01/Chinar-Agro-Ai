import React from 'react';

/**
 * PageHeader — Redesigned Left-aligned Editorial Header (Linear style)
 */
const PageHeader = ({
  icon: Icon,
  title,
  subtitle,
  className = '',
}) => (
  <div className={`border-b border-white/[0.04] pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${className}`}>
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        {Icon && <Icon className="w-4 h-4 text-brand-400" />}
        {subtitle && (
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold font-mono">
            {"// "}{subtitle}
          </span>
        )}
      </div>
      <h1 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-white">
        {title}
      </h1>
    </div>
  </div>
);

export default PageHeader;
