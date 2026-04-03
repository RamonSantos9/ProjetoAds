'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { Music } from 'lucide-react';

export default function VinhetasTrilhasPage() {
  return (
    <GenericSkeletonPage 
      title="Vinhetas e Trilhas" 
      icon={Music} 
      description="Gerencie a identidade sonora do seu podcast. Biblioteca de trilhas, vinhetas e efeitos sonoros para as edições."
    />
  );
}
