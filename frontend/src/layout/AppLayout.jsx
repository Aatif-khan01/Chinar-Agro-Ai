import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Lenis from 'lenis';
import {
  Sprout, Wheat, FileText, Menu, X, BrainCircuit, Microscope,
  Radio, ShieldCheck
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';

/**
 * ConsoleBackground — High-end blueprint grid with dot matrix and organic pine depth
 */
const ConsoleBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
    {/* Ambient lighting Pine blobs */}
    <motion.div
      animate={{ opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-[120px]"
    />
    <motion.div
      animate={{ opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-accent-500/5 blur-[150px]"
    />

    {/* Dot grid pattern overlay */}
    <div className="absolute inset-0 dot-grid opacity-[0.4]" />

    {/* Global noise texture overlay */}
    <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
  </div>
);

/**
 * AppLayout — Redesigned Sidebar SaaS Console Layout
 */
const AppLayout = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuGroups = [
    {
      title: 'Precision Diagnosis',
      items: [
        { to: '/pesticide-auth', label: t('nav_pesticide', 'Pesticide Auth'), icon: ShieldCheck },
        { to: '/disease', label: t('nav_disease'), icon: Microscope },
        { to: '/crop', label: t('nav_crop'), icon: Sprout },
        { to: '/yield', label: t('nav_yield'), icon: Wheat },
      ]
    },
    {
      title: 'Intelligence & Core',
      items: [
        { to: '/report', label: t('nav_report'), icon: FileText },
        { to: '/farm-assistant', label: t('nav_assistant'), icon: BrainCircuit },
      ]
    }
  ];

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface-900 text-white/80 font-sans relative flex selection:bg-brand-500/20 selection:text-brand-300">
      <ConsoleBackground />

      {/* ─── Desktop Left Sidebar ─────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/[0.04] bg-surface-850 h-screen fixed top-0 left-0 z-40 overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/[0.04] flex items-center justify-between flex-shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <img src="/AgroAi.png" alt="Logo" className="h-7 w-auto" />
            <div className="flex flex-col leading-none">
              <span className="font-heading text-xs font-semibold text-white tracking-wider">CHINAR AGRO</span>
              <span className="text-[9px] text-white/20 font-mono mt-0.5 tracking-widest uppercase">{"// SEC-04 CONSOLE"}</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav items */}
        <nav className="flex-1 px-4 py-6 space-y-7 overflow-y-auto">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h3 className="px-4 text-[9px] font-bold text-white/20 uppercase tracking-widest font-mono">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`sidebar-link ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/[0.04] bg-black/[0.04] space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
            <div className="flex items-center gap-1.5 text-[9px] text-brand-400 font-mono font-bold tracking-widest uppercase">
              <Radio className="w-3 h-3 text-brand-500 animate-pulse" />
              <span>ONLINE</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Mobile Header ───────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/[0.04] bg-surface-850/90 backdrop-blur-md z-40 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/AgroAi.png" alt="Logo" className="h-6 w-auto" />
          <span className="font-heading text-xs font-semibold text-white tracking-wider uppercase">CHINAR AGRO</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-16 left-0 right-0 border-b border-white/[0.04] bg-surface-850/95 backdrop-blur-xl z-30 p-6 space-y-6"
          >
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2.5">
                <h3 className="text-[9px] font-bold text-white/20 uppercase tracking-widest font-mono">
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 gap-1">
                  {group.items.map((item) => {
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`sidebar-link ${active ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
              <LanguageSwitcher />
              <div className="flex items-center gap-1.5 text-[9px] text-brand-400 font-mono font-bold tracking-widest uppercase">
                <Radio className="w-3 h-3 text-brand-500 animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Content Viewport ───────────────────── */}
      <div className="flex-1 lg:pl-64 flex flex-col pt-16 lg:pt-0 min-h-screen z-10 relative">
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
