import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { dialogOverlay, dialogContent } from '../animations';

/**
 * Dialog — Accessible modal primitive (no shadcn dependency)
 */

const Dialog = ({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  const panelRef = useRef(null);
  const previousFocus = useRef(null);

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size] || 'max-w-lg';

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => panelRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
    document.body.style.overflow = '';
    previousFocus.current?.focus?.();
    return undefined;
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="dialog-overlay flex items-center justify-center p-4"
          {...dialogOverlay}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'dialog-title' : undefined}
            aria-describedby={description ? 'dialog-desc' : undefined}
            className={`dialog-panel ${sizeClass} ${className}`}
            {...dialogContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 pb-0">
              <div>
                {title && (
                  <h2 id="dialog-title" className="font-display text-heading text-ink">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="dialog-desc" className="text-body-sm text-stone mt-1">
                    {description}
                  </p>
                )}
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-icon flex-shrink-0 -mr-1 -mt-1"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {children && <div className="p-6">{children}</div>}

            {footer && (
              <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-3 border-t border-stone/15 mt-2 pt-4 mx-6 mb-6">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Dialog;
