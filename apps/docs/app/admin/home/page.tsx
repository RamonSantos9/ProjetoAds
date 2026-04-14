import { Metadata } from 'next';
import AppHomePageClient from './home-page-client';

export const metadata: Metadata = {
  title: 'Início',
  description: 'Visão geral e ações rápidas do painel administrativo PodcastAds.',
};

export default function Page() {
  return <AppHomePageClient />;
}
