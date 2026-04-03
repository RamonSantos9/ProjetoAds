'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { Calendar } from 'lucide-react';

export default function CronogramaPage() {
  return (
    <GenericSkeletonPage 
      title="Cronograma" 
      icon={Calendar} 
      description="Planeje seus episódios no tempo. Visualize datas de gravação, edição e lançamento num calendário interativo."
    />
  );
}
