'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { Radio } from 'lucide-react';

export default function PublicacaoAdminPage() {
  return (
    <GenericSkeletonPage 
      title="Publicação" 
      icon={Radio} 
      description="Gerencie a distribuição dos episódios para todas as plataformas de áudio e vídeo de forma automatizada."
    />
  );
}
