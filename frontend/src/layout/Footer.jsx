import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Footer — Editorial site footer with nav links and brand
 */

const footerLinks = [
  { key: 'nav_disease', path: '/disease' },
  { key: 'nav_crop', path: '/crop' },
  { key: 'nav_yield', path: '/yield' },
  { key: 'nav_report', path: '/report' },
  { key: 'nav_assistant', path: '/farm-assistant' },
];

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-forest/10 bg-canvas mt-auto">
      <div className="container-content px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/AgroAi.png"
                alt="Chinar Agro AI"
                className="h-10 w-auto transition-transform duration-normal ease-snappy group-hover:scale-[1.02]"
              />
            </Link>
            <p className="mt-4 text-body-sm text-stone max-w-sm leading-relaxed">
              {t('footer_tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-4">
            <p className="text-overline text-stone uppercase mb-4">{t('footer_nav_label')}</p>
            <ul className="space-y-2.5">
              {footerLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-body-sm text-ink-muted hover:text-forest transition-colors duration-normal ease-snappy"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="md:col-span-3">
            <p className="text-overline text-stone uppercase mb-4">{t('footer_platform_label')}</p>
            <ul className="space-y-2.5">
              <li>
                <span className="text-body-sm text-stone">{t('footer_feature_detection')}</span>
              </li>
              <li>
                <span className="text-body-sm text-stone">{t('footer_feature_forecast')}</span>
              </li>
              <li>
                <span className="text-body-sm text-stone">{t('footer_feature_assistant')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-stone/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-caption text-stone">
            © {year} Chinar Agro AI. {t('footer_rights')}
          </p>
          <p className="text-caption text-stone">
            {t('footer_built_for')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
