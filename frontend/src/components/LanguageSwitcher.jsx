import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dropdown } from '../design-system/animations';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'hi', label: 'हिंदी', native: 'HI' },
  { code: 'ur', label: 'اردو', native: 'UR' },
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
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg
          bg-white/[0.02] border border-white/[0.08] text-white/70
          hover:bg-white/[0.06] hover:text-white hover:border-white/20
          transition-all duration-normal ease-out font-mono text-[11px] font-bold tracking-widest"
      >
        <Globe className="w-3.5 h-3.5 text-brand-400" aria-hidden />
        <span>{active.native}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...dropdown}
            role="listbox"
            aria-label="Select language"
            className="absolute bottom-full mb-2 left-0 w-36
              bg-surface-800 border border-white/[0.08] rounded-xl shadow-lg shadow-black/50
              overflow-hidden z-50 py-1"
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
                    font-mono text-[10px] font-bold tracking-wider transition-colors
                    ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-400'
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                    }`}
                >
                  <span>{lang.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]" aria-hidden />
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
