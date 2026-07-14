import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navIndicator } from '../animations';

/**
 * Nav — Editorial horizontal navigation (not sidebar boilerplate)
 *
 * Items: { to, label, end? }
 * Active state uses gold underline via layoutId animation.
 */

const Nav = ({
  items = [],
  logo,
  logoTo = '/',
  trailing,
  className = '',
  mobileOpen = false,
  onMobileClose,
}) => {
  const location = useLocation();

  const isActive = (item) => {
    if (item.end) return location.pathname === item.to;
    return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
  };

  return (
    <nav className={className} aria-label="Main">
      {/* Desktop */}
      <div className="hidden md:flex items-center w-full">
        {logo && (
          <Link to={logoTo} className="mr-8 flex-shrink-0" aria-label="Home">
            {logo}
          </Link>
        )}
        <div className="flex items-center gap-0.5">
          {items.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link relative ${active ? 'nav-link-active' : ''}`}
              >
                {item.label}
                {active && (
                  <motion.span
                    {...navIndicator}
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-gold rounded-full"
                    layoutId="navActiveIndicator"
                  />
                )}
              </Link>
            );
          })}
        </div>
        {trailing && <div className="ml-auto flex items-center gap-3">{trailing}</div>}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-full left-0 right-0 bg-canvas border-b border-forest/10 shadow-soft py-4 px-6 z-40"
          >
            <div className="flex flex-col gap-1">
              {items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onMobileClose}
                    className={`px-3 py-3 rounded-lg text-body-sm font-medium transition-colors ${
                      active
                        ? 'text-forest bg-forest/5 border-l-2 border-gold pl-[10px]'
                        : 'text-stone hover:text-forest hover:bg-stone/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            {trailing && <div className="mt-4 pt-4 border-t border-stone/20">{trailing}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/**
 * NavBar — Sticky header shell wrapping Nav
 */
export const NavBar = ({
  items,
  logo,
  logoTo,
  trailing,
  className = '',
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      ref={barRef}
      className={`sticky top-0 z-40 bg-canvas/90 backdrop-blur-sm border-b border-forest/10 ${className}`}
    >
      <div className="container-content px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between relative">
        {/* Mobile logo + menu */}
        <div className="md:hidden flex items-center justify-between w-full">
          {logo && (
            <Link to={logoTo || '/'} aria-label="Home">
              {logo}
            </Link>
          )}
          <button
            type="button"
            className="btn-icon"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <Nav
          items={items}
          logo={logo}
          logoTo={logoTo}
          trailing={trailing}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          className="w-full"
        />
      </div>
    </header>
  );
};

export default Nav;
