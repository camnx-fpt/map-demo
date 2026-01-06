import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const languages = [
    { code: 'en', flag: '🇺🇸', label: 'EN' },
    { code: 'ja', flag: '🇯🇵', label: 'JP' },
    { code: 'vi', flag: '🇻🇳', label: 'VN' }
  ];

  return (
    <div className="language-switcher">
      {languages.map(lang => (
        <button
          key={lang.code}
          className={`lang-button ${i18n.language === lang.code ? 'active' : ''}`}
          onClick={() => changeLanguage(lang.code)}
          title={lang.label}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
