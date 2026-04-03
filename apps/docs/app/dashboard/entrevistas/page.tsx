'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { MessageSquare } from 'lucide-react';

export default function EntrevistasPage() {
  return (
    <GenericSkeletonPage 
      title="Entrevistas" 
      icon={MessageSquare} 
      description="Gerencie o histórico de diálogos e entrevistas. Organize perguntas e tópicos conversados com cada convidado."
    />
  );
}
