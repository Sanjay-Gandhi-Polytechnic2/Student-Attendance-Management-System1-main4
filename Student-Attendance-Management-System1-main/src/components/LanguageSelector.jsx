// src/components/LanguageSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', labelKey: 'language.english' },
  { code: 'es', labelKey: 'language.spanish' },
  { code: 'fr', labelKey: 'language.french' },
  { code: 'hi', labelKey: 'language.hindi' },
];

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      marginLeft: '1rem',
    }}>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        style={{
          appearance: 'none',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '6px 30px 6px 12px',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {t(lang.labelKey)}
          </option>
        ))}
      </select>
      {/* Arrow Icon */}
      <span style={{
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: 'var(--text-primary)',
      }}>
        ▼
      </span>
    </div>
  );
};

export default LanguageSelector;
