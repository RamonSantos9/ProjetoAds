'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  type Voice,
  voices as fallbackVoices,
  type Language,
  languages,
} from '../_data/landing';
import { toast } from 'sonner';

export interface CharAlignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

export function usePodcastVoice() {
  const [voices, setVoices] = useState<Voice[]>(fallbackVoices);
  const [selectedVoiceId, setSelectedVoiceId] = useState(
    fallbackVoices[0]?.id || '',
  );
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0],
  );
  const [currentPreviewingId, setCurrentPreviewingId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // Character index currently being spoken: index into the original text string
  const [highlightCharIndex, setHighlightCharIndex] = useState<number>(-1);
  const alignmentRef = useRef<CharAlignment | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = document.createElement('audio');
    audio.className = 'hidden';
    audio.crossOrigin = 'anonymous';
    document.body.appendChild(audio);
    audioRef.current = audio;

    async function fetchVoices() {
      try {
        const response = await fetch('/api/tts/voices');
        if (response.ok) {
          const data = await response.json();
          if (data.voices && data.voices.length > 0) {
            setVoices(data.voices);
            setSelectedVoiceId((prev) => prev || data.voices[0].id);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar vozes dinâmicas:', error);
      }
    }
    fetchVoices();

    return () => {
      if (audioRef.current) {
        document.body.removeChild(audioRef.current);
        audioRef.current = null;
      }
    };
  }, []);

  // RAF loop: while audio is playing, map currentTime to the character index
  const startAlignmentLoop = useCallback(() => {
    const tick = () => {
      const audio = audioRef.current;
      const alignment = alignmentRef.current;
      if (!audio || !alignment) return;

      const t = audio.currentTime;
      const starts = alignment.character_start_times_seconds;
      const ends = alignment.character_end_times_seconds;

      // Binary search for the current char index
      let lo = 0,
        hi = starts.length - 1,
        found = -1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (t >= starts[mid] && t <= ends[mid]) {
          found = mid;
          break;
        } else if (t < starts[mid]) hi = mid - 1;
        else lo = mid + 1;
      }
      // If between chars, always advance to nearest past char
      if (found === -1) {
        for (let i = starts.length - 1; i >= 0; i--) {
          if (t >= starts[i]) {
            found = i;
            break;
          }
        }
      }
      setHighlightCharIndex(found);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopAlignmentLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setHighlightCharIndex(-1);
    alignmentRef.current = null;
    stopAlignmentLoop();
  }, [stopAlignmentLoop]);

  const generateTTS = useCallback(
    async (text: string, languageCode: string, overrideVoiceId?: string) => {
      const targetVoiceId = overrideVoiceId || selectedVoiceId;
      if (isLoading || !text || !audioRef.current || !targetVoiceId) return;

      stopAudio();
      setIsLoading(true);
      try {
        const response = await fetch('/api/tts/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voiceId: targetVoiceId, languageCode }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Falha ao gerar áudio');
        }

        const data = await response.json();
        if (!data.audioBase64) throw new Error('Resposta da API sem áudio');

        // Store alignment for real-time sync
        alignmentRef.current = data.alignment || null;

        // Convert base64 → blob → object URL
        const byteChars = atob(data.audioBase64);
        const byteArr = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++)
          byteArr[i] = byteChars.charCodeAt(i);
        const blob = new Blob([byteArr], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);

        audioRef.current.src = audioUrl;

        await audioRef.current.play().catch((e) => {
          if (e.name === 'NotSupportedError')
            throw new Error('Formato de áudio não suportado.');
          throw e;
        });

        setIsPlaying(true);
        startAlignmentLoop();

        audioRef.current.onended = () => {
          setIsPlaying(false);
          setHighlightCharIndex(-1);
          stopAlignmentLoop();
        };
      } catch (error: any) {
        console.error('Erro ao reproduzir áudio:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      isLoading,
      selectedVoiceId,
      stopAudio,
      startAlignmentLoop,
      stopAlignmentLoop,
    ],
  );

  const handlePreview = useCallback(
    async (previewUrl: string, id: string) => {
      stopAudio();
      if (currentPreviewingId === id) {
        setCurrentPreviewingId(null);
        return;
      }

      setCurrentPreviewingId(id);

      if (!previewUrl || !audioRef.current) {
        try {
          await generateTTS(
            'Olá, eu sou uma das vozes em português.',
            'pt',
            id,
          );
        } catch {
          toast.error('Sem áudio: verifique sua Chave da API do PodcastAds.');
          setCurrentPreviewingId(null);
        }
        return;
      }

      audioRef.current.src = previewUrl;
      audioRef.current
        .play()
        .catch(() => setTimeout(() => setCurrentPreviewingId(null), 1500));
      audioRef.current.onended = () => setCurrentPreviewingId(null);
    },
    [currentPreviewingId, stopAudio, generateTTS],
  );

  return {
    voices,
    selectedVoiceId,
    setSelectedVoiceId,
    selectedLanguage,
    setSelectedLanguage,
    currentPreviewingId,
    isLoading,
    isPlaying,
    highlightCharIndex,
    handlePreview,
    generateTTS,
    stopAudio,
  };
}
