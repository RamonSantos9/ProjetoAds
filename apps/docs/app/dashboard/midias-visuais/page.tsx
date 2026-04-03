'use client';

import GenericSkeletonPage from '@/components/dashboard/GenericSkeletonPage';
import { Image } from 'lucide-react';

export default function MidiasVisuaisPage() {
  return (
    <GenericSkeletonPage 
      title="Mídias Visuais" 
      icon={Image} 
      description="Gerencie capas, banners e artes promocionais do seu podcast. Organize todos os materiais visuais em um só lugar."
    />
  );
}
