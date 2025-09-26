
"use client";

import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';

type Language = 'en' | 'sw';
type TranslationSet = Record<string, string>;
export type Translations = Record<Language, TranslationSet>;

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = (translations: Translations) => {
  const { language } = useLanguage();

  const t = (key: string, replacements: Record<string, string | number> = {}): string => {
    let translation = translations[language][key] || translations['en'][key] || key;
    
    Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(`{${placeholder}}`, 'g');
        translation = translation.replace(regex, String(replacements[placeholder]));
    });

    return translation;
  };

  return { t, language };
};
