import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card — Redesigned Console Card
 */
const Card = ({
  variant = 'glass',
  padding = 'md',
  glow,
  animate = false,
  className = '',
  style = {},
  children,
  ...props
}) => {
  const baseClass = 'console-card';
  const paddingClasses = { none: '', sm: 'p-3.5', md: 'p-6', lg: 'p-8', xl: 'p-10' }[padding] || 'p-6';
  const combinedClass = `${baseClass} ${paddingClasses} ${className}`.trim();

  const glowStyle = glow
    ? { boxShadow: `0 0 30px ${glow}10, 0 4px 20px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.02)` }
    : {};

  if (animate || variant === 'interactive') {
    return (
      <motion.div
        className={combinedClass}
        style={{ ...glowStyle, ...style }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedClass} style={{ ...glowStyle, ...style }} {...props}>
      {children}
    </div>
  );
};

export default Card;
