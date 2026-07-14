import React, { useState, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dropdown } from '../animations';

/**
 * Tooltip — Lightweight positioned hint (CSS + Framer)
 */

const Tooltip = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 200,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);
  const id = useId();

  const show = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const positionClasses = {
    top: {
      center: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      start: 'bottom-full left-0 mb-2',
      end: 'bottom-full right-0 mb-2',
    },
    bottom: {
      center: 'top-full left-1/2 -translate-x-1/2 mt-2',
      start: 'top-full left-0 mt-2',
      end: 'top-full right-0 mt-2',
    },
    left: {
      center: 'right-full top-1/2 -translate-y-1/2 mr-2',
      start: 'right-full top-0 mr-2',
      end: 'right-full bottom-0 mr-2',
    },
    right: {
      center: 'left-full top-1/2 -translate-y-1/2 ml-2',
      start: 'left-full top-0 ml-2',
      end: 'left-full bottom-0 ml-2',
    },
  };

  const pos = positionClasses[side]?.[align] || positionClasses.top.center;

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={visible ? id : undefined}>{children}</span>
      <AnimatePresence>
        {visible && content && (
          <motion.span
            id={id}
            role="tooltip"
            className={`tooltip-content ${pos}`}
            {...dropdown}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default Tooltip;
