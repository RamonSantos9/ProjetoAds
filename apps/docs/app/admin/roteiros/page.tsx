'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { FileText } from 'lucide-react';

export default function RoteirosAdminPage() {
  return (
    <GenericSkeletonPage 
      title="Roteiros" 
      icon={FileText} 
      description="Gerencie os scripts e roteiros de cada episódio. Crie novos rascunhos e organize a pauta do seu podcast."
    />
  );
}
