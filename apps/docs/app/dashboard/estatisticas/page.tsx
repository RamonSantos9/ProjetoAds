'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { BarChart3 } from 'lucide-react';

export default function EstatisticasPage() {
  return (
    <GenericSkeletonPage 
      title="Estatísticas" 
      icon={BarChart3} 
      description="Veja o desempenho do seu podcast. Métricas detalhadas de ouvintes, downloads e engajamento em todas as plataformas."
    />
  );
}
