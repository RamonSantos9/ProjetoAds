import { Metadata } from 'next';
import RelatoriosPageClient from './relatorios-page-client';

export const metadata: Metadata = {
  title: 'Relatórios',
  description: 'Visualize métricas, estatísticas de uso e análises do seu podcast.',
};

export default function Page() {
  return <RelatoriosPageClient />;
}
