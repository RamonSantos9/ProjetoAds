'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { Users } from 'lucide-react';

export default function ConvidadosPage() {
  return (
    <GenericSkeletonPage 
      title="Convidados" 
      icon={Users} 
      description="Gerencie sua base de convidados. Mantenha contatos, histórico de episódios e observações importantes."
    />
  );
}
