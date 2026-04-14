import { Metadata } from 'next';
import EpisodesPageClient from './episodes-page-client';

export const metadata: Metadata = {
  title: 'Episódios',
  description: 'Gerencie os episódios do seu podcast, altere status e visualize o conteúdo.',
};

export default function Page() {
  return <EpisodesPageClient />;
}
