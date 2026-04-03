'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { Settings } from 'lucide-react';

export default function EstudioAdminPage() {
  return (
    <GenericSkeletonPage 
      title="Estúdio do Podcast" 
      icon={Settings} 
      description="Espaço administrativo para configuração técnica do estúdio, gravação remota e conexões de áudio."
    />
  );
}
