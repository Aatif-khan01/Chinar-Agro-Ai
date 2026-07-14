import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * Button — Redesigned Console Button
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  to,
  className = '',
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const baseClasses = variant === 'primary' ? 'console-btn-primary' : 'console-btn-secondary';
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs gap-1.5' : size === 'lg' ? 'px-6 py-3 text-body-md gap-3' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const classes = `${baseClasses} ${sizeClasses} ${widthClasses} ${className}`.trim();

  const content = (
    <>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children && <span>{children}</span>}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </>
  );

  const motionProps = !isDisabled ? {
    whileTap: { scale: 0.98 },
  } : {};

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-flex">
        <Link to={to} className={classes} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      disabled={isDisabled}
      className={classes}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;
