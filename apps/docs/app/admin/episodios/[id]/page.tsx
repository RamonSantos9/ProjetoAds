import { Metadata } from 'next';
import EpisodeDetailClient from './episode-detail-client';

export const metadata: Metadata = {
  title: 'Episódio',
  description: 'Detalhes e gerenciamento individual do episódio selecionado.',
};

export default function Page() {
  return <EpisodeDetailClient />;
}
