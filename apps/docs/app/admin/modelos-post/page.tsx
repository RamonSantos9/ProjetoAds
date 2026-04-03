'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { Layout } from 'lucide-react';

export default function ModelosAdminPage() {
  return (
    <GenericSkeletonPage 
      title="Modelos de Post" 
      icon={Layout} 
      description="Gerencie templates para redes sociais (Instagram, LinkedIn, X). Padronize a comunicação visual do seu podcast."
    />
  );
}
