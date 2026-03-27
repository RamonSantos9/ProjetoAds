'use client';
import * as React from 'react';

export interface Translations {
  search: string;
  searchNoResult: string;

  toc: string;
  tocNoHeadings: string;

  lastUpdate: string;
  chooseLanguage: string;
  nextPage: string;
  previousPage: string;
  chooseTheme: string;
  editOnGithub: string;
}

export interface LocaleItem {
  name: string;
  locale: string;
}

interface I18nContextType {
  locale?: string;
  onChange?: (v: string) => void;
  text: Translations;
  locales?: LocaleItem[];
}

export const defaultTranslations: Translations = {
  search: 'Pesquisar',
  searchNoResult: 'Nenhum resultado encontrado',
  toc: 'Nesta página',
  tocNoHeadings: 'Sem cabeçalhos',
  lastUpdate: 'Última atualização em',
  chooseLanguage: 'Escolher idioma',
  nextPage: 'Próxima página',
  previousPage: 'Página anterior',
  chooseTheme: 'Tema',
  editOnGithub: 'Editar no GitHub',
};

export const I18nContext = React.createContext<I18nContextType>({
  text: defaultTranslations,
});

export function I18nLabel(props: { label: keyof Translations }): string {
  const { text } = useI18n();

  return text[props.label];
}

export function useI18n(): I18nContextType {
  return React.useContext(I18nContext);
}
