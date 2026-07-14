import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dropdown } from '../design-system/animations';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'hi', label: 'हिंदी', native: 'HI' },
  { code: 'mr', label: 'मराठी', native: 'MR' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setOpen(false);
  };

  const active = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
          bg-transparent border border-stone/30 text-stone
          hover:bg-stone/10 hover:text-forest hover:border-forest/25
          transition-all duration-normal ease-snappy text-body-sm font-medium"
      >
        <Globe className="w-3.5 h-3.5 text-forest" aria-hidden />
        <span className="tracking-wider">{active.native}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...dropdown}
            role="listbox"
            aria-label="Select language"
            className="absolute right-0 mt-2 w-36
              bg-canvas border border-forest/10 rounded-xl shadow-soft
              overflow-hidden z-50"
          >
            {LANGUAGES.map((lang) => {
              const isActive = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-2.5
                    text-body-sm transition-all duration-fast
                    ${
                      isActive
                        ? 'bg-forest/[0.06] text-forest font-medium'
                        : 'text-stone hover:bg-stone/10 hover:text-ink'
                    }`}
                >
                  <span>{lang.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" aria-hidden />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
