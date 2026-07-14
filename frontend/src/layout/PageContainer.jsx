import React from 'react';

/**
 * PageContainer — Consistent horizontal rhythm and max-width for inner pages.
 * Landing page may omit this for full-bleed sections.
 */

const widthMap = {
  default: 'max-w-content',
  narrow: 'max-w-narrow',
  prose: 'max-w-prose',
  wide: 'max-w-[90rem]',
  full: 'max-w-none',
};

const PageContainer = ({
  children,
  width = 'default',
  pad = 'section-sm',
  className = '',
  as: Tag = 'div',
}) => {
  const padClass = pad === 'section' ? 'py-section' : pad === 'section-sm' ? 'py-section-sm' : pad === 'none' ? '' : 'py-section-sm';
  const widthClass = widthMap[width] || widthMap.default;

  return (
    <Tag
      className={`w-full mx-auto px-6 md:px-10 lg:px-16 ${padClass} ${widthClass} ${className}`}
    >
      {children}
    </Tag>
  );
};

export default PageContainer;
