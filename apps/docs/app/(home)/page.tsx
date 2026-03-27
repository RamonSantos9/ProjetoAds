import { LandingShell } from './_components/chrome/LandingShell';
import { ElevenLabsHero } from './_sections/ElevenLabsHero';
import { ElevenLabsMainDemo } from './_sections/ElevenLabsMainDemo';
import { ElevenLabsModels } from './_sections/ElevenLabsModels';
import { ElevenLabsProjectInfo } from './_sections/ElevenLabsProjectInfo';

export default function ElevenLabsPage() {
  return (
    <LandingShell>
      <main className="mx-auto w-full max-w-[1100px] px-4 py-4 sm:px-6 lg:py-8">
        <div className="relative isolate flex min-h-[calc(100vh-9rem)] flex-col overflow-hidden border border-dashed border-fd-border bg-transparent">
          <ElevenLabsHero />
          <ElevenLabsMainDemo />
          <ElevenLabsModels />
          <ElevenLabsProjectInfo />
        </div>
      </main>
    </LandingShell>
  );
}
