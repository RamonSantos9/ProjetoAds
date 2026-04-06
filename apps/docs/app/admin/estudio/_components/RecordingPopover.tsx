'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

const BAR_COUNT = 25;

interface AudioDevice {
  deviceId: string;
  label: string;
}

interface RecordingPopoverProps {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onRecordingComplete?: (blob: Blob, filename: string) => void;
}

export function RecordingPopover({
  isOpen,
  anchorEl,
  onClose,
  onRecordingComplete,
}: RecordingPopoverProps) {
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('default');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<
    'idle' | 'countdown' | 'recording'
  >('idle');
  const recordingStatusRef = useRef(recordingStatus);
  useEffect(() => {
    recordingStatusRef.current = recordingStatus;
  }, [recordingStatus]);

  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [bars, setBars] = useState<number[]>(new Array(BAR_COUNT).fill(2));
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    calculated: false,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  /* ── Position relative to anchor ── */
  useEffect(() => {
    if (!isOpen || !anchorEl) {
      if (position.calculated)
        setPosition((p) => ({ ...p, calculated: false }));
      return;
    }

    requestAnimationFrame(() => {
      const rect = anchorEl.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      let calcLeft = rect.left + rect.width / 2 - 160;
      if (calcLeft < 10) calcLeft = 10;
      if (calcLeft + 320 > window.innerWidth)
        calcLeft = window.innerWidth - 330;

      const popoverHeight = 240;
      let calcTop = rect.bottom + 8;

      // If no space below, flip to top
      if (calcTop + popoverHeight > window.innerHeight) {
        calcTop = rect.top - popoverHeight - 8;
      }

      setPosition({ top: calcTop, left: calcLeft, calculated: true });
    });
  }, [isOpen, anchorEl, position.calculated]);

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      // Allow closing select dropdown instead of full popover if clicking outside select
      if (
        isSelectOpen &&
        selectRef.current &&
        !selectRef.current.contains(e.target as Node)
      ) {
        setIsSelectOpen(false);
        // Do not close popover yet, wait for another click
        return;
      }

      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        e.target !== anchorEl &&
        !anchorEl?.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, anchorEl, onClose, isSelectOpen]);

  /* ── Live Audio & Visualizer (Starts before recording) ── */
  useEffect(() => {
    if (!isOpen) return;

    let activeStream: MediaStream | null = null;
    let audioCtx: AudioContext | null = null;
    let animFrame: number;
    let isCancelled = false;
    let analyser: AnalyserNode | null = null;

    const initAudio = async () => {
      try {
        // Obter permissão para áudio e enumerar dispositivos
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const list = await navigator.mediaDevices.enumerateDevices();
        const inputs = list
          .filter((d) => d.kind === 'audioinput')
          .map((d) => ({
            deviceId: d.deviceId,
            label: d.label || `Microfone ${d.deviceId.slice(0, 8)}`,
          }));

        if (!isCancelled) {
          if (inputs.length === 0) {
            setDevices([{ deviceId: 'default', label: 'Microfone padrão' }]);
          } else {
            setDevices(inputs);
          }
        }

        // Se o dispositivo foi selecionado, inicia a stream para ele
        const constraints: MediaStreamConstraints = {
          audio:
            selectedDeviceId === 'default'
              ? true
              : { deviceId: { exact: selectedDeviceId } },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        activeStream = stream;
        streamRef.current = stream; // Armazena pra usar no MediaRecorder

        // Inicia Contexto de Áudio para o visualizador (Waveform)
        audioCtx = new window.AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const animate = () => {
          if (!analyser || isCancelled) return;
          const data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          const newBars = Array.from({ length: BAR_COUNT }, (_, i) => {
            if (recordingStatusRef.current === 'recording') {
              const idx = Math.floor((i / BAR_COUNT) * data.length * 0.65);
              return Math.max(2, (data[idx] / 255) * 36);
            }
            return 2;
          });
          setBars(newBars);
          animFrame = requestAnimationFrame(animate);
        };
        animate();
      } catch (err) {
        console.error('Erro ao iniciar áudio:', err);
      }
    };

    initAudio();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animFrame);
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [isOpen, selectedDeviceId]);

  /* ── Handles countdown before recording ── */
  const handleStartProcess = () => {
    setRecordingStatus('countdown');
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        startRecording();
      }
    }, 1000);
  };

  /* ── Start recording ── */
  const startRecording = async () => {
    try {
      if (!streamRef.current) return;
      const stream = streamRef.current;

      const recorder = new MediaRecorder(stream, {
        mimeType: getSupportedMime(),
      });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: chunksRef.current[0]?.type || recorder.mimeType,
        });
        const ext = recorder.mimeType.includes('ogg')
          ? 'ogg'
          : recorder.mimeType.includes('mp4')
            ? 'mp4'
            : 'webm';
        const name = `recording-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.${ext}`;
        onRecordingComplete?.(blob, name);
      };

      recorder.start(100);
      setRecordingStatus('recording');
      setElapsed(0);

      timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
    }
  };

  /* ── Stop recording ── */
  const stopRecording = () => {
    setRecordingStatus('idle');
    setElapsed(0);
    setBars(new Array(BAR_COUNT).fill(2));
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    onClose();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!isOpen || !position.calculated) return null;

  const currentDeviceLabel =
    devices.find((d) => d.deviceId === selectedDeviceId)?.label ||
    'Microfone padrão';

  return (
    <div
      ref={popoverRef}
      role="dialog"
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 50,
      }}
      className="w-[320px] rounded-[10px] bg-white dark:bg-black border shadow-xl text-foreground outline-none animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-100"
    >
      <div className="flex items-center justify-center relative h-32 pb-10 px-4">
        {/* Controls block */}
        <div className="flex w-full items-center justify-center z-10 transition-all duration-300">
          {recordingStatus === 'idle' && (
            <div className="flex gap-2 items-center animate-in fade-in zoom-in-95 duration-200">
              {/* Custom Select (Like Radix) */}
              <div className="relative" ref={selectRef}>
                <button
                  type="button"
                  onClick={() => setIsSelectOpen((prev) => !prev)}
                  className="flex gap-0.5 items-center justify-between whitespace-nowrap transition-colors border hover:bg-fd-accent/50 text-foreground pl-3 pr-2 py-2 text-sm rounded-[10px] w-48 h-10 bg-white dark:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="text-gray-500 w-[18px] h-[18px] shrink-0 -ml-1 mr-0.5" />
                  <span className="inline-block truncate mr-auto">
                    {currentDeviceLabel}
                  </span>
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center opacity-50 transition-transform duration-200',
                      isSelectOpen ? 'rotate-180' : 'rotate-0',
                    )}
                  >
                    <ChevronDown className="h-4 w-4 min-w-fit" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isSelectOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-[300px] z-[60] bg-white dark:bg-black border rounded-lg shadow-xl overflow-hidden p-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100 text-sm">
                    {devices.map((d) => {
                      const isSelected = d.deviceId === selectedDeviceId;
                      return (
                        <button
                          key={d.deviceId}
                          className={cn(
                            'flex items-center justify-between px-2 py-1.5 text-sm rounded-sm text-left transition-colors w-full outline-none',
                            isSelected
                              ? 'bg-fd-accent text-foreground'
                              : 'hover:bg-fd-accent focus-visible:bg-fd-accent text-foreground',
                          )}
                          onClick={() => {
                            setSelectedDeviceId(d.deviceId);
                            setIsSelectOpen(false);
                          }}
                        >
                          <span className="truncate pr-4">{d.label}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 shrink-0 opacity-70" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Start button */}
              <button
                type="button"
                onClick={handleStartProcess}
                className="h-10 px-4 rounded-xl text-sm font-medium transition-colors whitespace-nowrap bg-black dark:bg-white text-white dark:text-black hover:bg-foreground/90"
              >
                Start
              </button>
            </div>
          )}

          {/* Countdown State */}
          {recordingStatus === 'countdown' && (
            <div
              key={countdown}
              className="flex items-center justify-center animate-in zoom-in-50 fade-in duration-300"
            >
              <span className="text-5xl font-bold text-foreground tabular-nums tracking-tighter">
                {countdown}
              </span>
            </div>
          )}

          {/* Recording (Stop Button) State */}
          {recordingStatus === 'recording' && (
            <div className="flex items-center justify-center animate-in zoom-in-95 fade-in duration-300">
              <button
                aria-label="Stop recording"
                onClick={stopRecording}
                className="relative inline-flex items-center justify-center text-sm font-medium transition-colors duration-75 bg-black dark:bg-white shadow-none hover:opacity-80 p-0 w-12 h-12 rounded-full cursor-pointer"
              >
                <div className="shrink-0 w-4 h-4 bg-white dark:bg-black rounded-[3px]" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom bar: waveform + timer */}
        <div className="absolute bottom-5 inset-x-6 flex justify-between items-center">
          {/* Waveform bars */}
          <div className="absolute h-9 left-0 flex gap-0.5 items-center">
            {bars.map((h, i) => (
              <div
                key={i}
                className={cn(
                  'w-0.5 bg-black dark:bg-white rounded-full',
                  recordingStatus === 'recording'
                    ? 'transition-none'
                    : 'transition-all duration-75',
                )}
                style={{ height: `${h}px`, maxHeight: '36px' }}
              />
            ))}
          </div>

          {/* Background Noise Alert (visible during recording) */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 md:bottom-auto md:mb-0 pointer-events-none">
            {recordingStatus === 'recording' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="inline-flex items-center text-xs px-2.5 h-6 rounded-full font-medium transition-colors whitespace-nowrap border border-transparent text-[#B52620] bg-[#FDE4E3]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-alert w-3 h-3 mr-1"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  Background noise detected
                </div>
              </div>
            )}
          </div>

          {/* Timer badge */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="inline-flex items-center text-xs px-2.5 h-6 rounded-full font-medium transition-colors whitespace-nowrap border border-transparent bg-fd-accent text-foreground tabular-nums">
              {fmt(elapsed)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSupportedMime() {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? '';
}
