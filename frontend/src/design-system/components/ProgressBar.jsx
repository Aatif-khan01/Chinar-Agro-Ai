import React from 'react';
import { motion } from 'framer-motion';
import { ease } from '../animations';
import { colors } from '../tokens';

/**
 * ProgressBar — Animated confidence / suitability bar (GPU-friendly scaleX)
 */

const autoColor = (value) => {
  if (value >= 75) return { bar: 'bg-forest', label: 'text-forest' };
  if (value >= 50) return { bar: 'bg-gold', label: 'text-gold-dark' };
  return { bar: 'bg-semantic-danger', label: 'text-semantic-danger' };
};

const ProgressBar = ({
  value = 0,
  label,
  showValue = true,
  size = 'md',
  color,
  delay = 0.2,
  className = '',
}) => {
  const clamped = Math.min(Math.max(value, 0), 100);
  const c = color || autoColor(clamped);
  const height = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-overline text-stone uppercase">{label}</span>}
          {showValue && (
            <span className={`text-body-sm font-medium font-mono ${c.label}`}>
              {clamped.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={`progress-track ${height}`}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: clamped / 100 }}
          transition={{ duration: 0.9, delay, ease: ease.entrance }}
          className={`progress-fill ${height} ${c.bar}`}
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </div>
  );
};

/**
 * RadialProgress — Circular confidence indicator for results
 */
export const RadialProgress = ({
  value = 0,
  size = 120,
  strokeWidth = 6,
  label,
  className = '',
}) => {
  const clamped = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const strokeColor =
    clamped >= 75 ? colors.forest : clamped >= 50 ? colors.gold : colors.semantic.danger;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(140, 138, 130, 0.2)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: ease.entrance }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-display-md text-ink">{clamped.toFixed(0)}%</span>
        {label && <span className="text-caption text-stone mt-0.5">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressBar;
