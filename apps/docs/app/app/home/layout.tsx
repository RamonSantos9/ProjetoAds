import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Home',
  description: 'XispeLabs — Text to Speech, Voice Cloning, Dubbing e muito mais.',
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
