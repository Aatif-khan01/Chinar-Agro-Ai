import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClass =
    {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
    }[size] || 'w-5 h-5';

  return <Loader2 className={`animate-spin text-forest ${sizeClass} ${className}`} />;
};

export const PageSpinner = ({
  icon: Icon,
  label = 'Loading...',
  sublabel,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className={`card-surface p-16 flex flex-col items-center justify-center text-center min-h-[400px] ${className}`}
  >
    <div className="relative mb-6">
      <div className="w-14 h-14 rounded-full border-2 border-stone/20 border-t-gold animate-spin" />
      {Icon && (
        <Icon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-forest" />
      )}
    </div>
    <h3 className="text-overline text-stone uppercase">{label}</h3>
    {sublabel && <p className="text-caption text-stone mt-2">{sublabel}</p>}
  </motion.div>
);

export const Skeleton = ({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-md',
  className = '',
}) => (
  <div
    className={`${width} ${height} ${rounded} bg-stone/10 overflow-hidden relative ${className}`}
    aria-hidden
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone/10 to-transparent animate-shimmer" />
  </div>
);

export const PulseLoader = ({ className = '' }) => (
  <div className={`flex items-center gap-1.5 ${className}`} aria-label="Loading">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-gold"
        animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] }}
        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
      />
    ))}
  </div>
);

export default Spinner;
