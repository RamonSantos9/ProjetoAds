'use client';

import React from 'react';
import {
  FilePlus2,
  Mic,
  Trash,
  ChevronDown,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/cn';

export default function EditEpisodeStudioPage() {
  return (
    <div className="stack min-h-100advh pt-studio-calc lg-studio-transition lg-studio-pb box-border lg:w-full lg:mx-auto">
      <main className="relative flex-[1_1_0] mx-auto w-full flex flex-col lg:flex-row">
        {/* Main Editor Area */}
        <div className="overlay flex flex-col flex-1 min-w-0">
          <div className="hstack flex-1 max-h-full">
            <div className="relative @container self-stretch stack grow h-full [--px:1rem] pb-4 xl:[--px:3rem] xl:pb-12 gap-4 2xl:[--px:5rem] 2xl:pb-20 [--max-w:1000px]">
              <div
                className="relative h-full flex-1 min-h-0"
                style={
                  {
                    '--textarea-px':
                      'calc(max(50% - 0.5*var(--max-w), 0px) + var(--px))',
                  } as React.CSSProperties
                }
              >
                <div
                  className="flex-1 h-full lg:flex-none relative overflow-y-auto max-h-full py-20 pb-40 no-scrollbar"
                  style={{
                    paddingInline:
                      'calc(max(50% - 0.5*var(--max-w), 0px) + var(--px))',
                  }}
                >
                  <div
                    className="flex justify-center items-center h-full"
                    style={{ opacity: 1 }}
                  >
                    <div
                      data-agent-id="file-upload-_r_cj_"
                      role="presentation"
                      tabIndex={0}
                      className="stack items-center justify-center bg-gray-50 dark:bg-fd-card/30 h-[248px] rounded-[14px] outline-2 -outline-offset-1 outline-dotted transition-[outline-color] duration-150 outline-gray-300 dark:outline-fd-border cursor-pointer w-full max-w-[560px] static before:content-[''] md:before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0"
                    >
                      <div
                        className="stack items-center py-9"
                        style={{ opacity: 1 }}
                      >
                        <input
                          accept="audio/aac,audio/x-aac,audio/x-aiff,audio/ogg,audio/mpeg,audio/mp3,audio/mpeg3,audio/x-mpeg-3,audio/opus,audio/wav,audio/x-wav,audio/webm,audio/flac,audio/x-flac,audio/mp4,audio/aiff,audio/x-m4a,video/mp4,video/x-msvideo,video/x-matroska,video/quicktime,video/x-ms-wmv,video/x-flv,video/webm,video/mpeg,video/3gpp"
                          multiple
                          tabIndex={-1}
                          type="file"
                          style={{ display: 'none' }}
                        />
                        <div className="h-11 w-11 rounded-[10px] bg-background border border-gray-200 dark:border-fd-border flex items-center justify-center">
                          <FilePlus2 className="w-5 h-5 text-fd-foreground" />
                        </div>
                        <p className="text-sm text-foreground font-medium mt-2.5">
                          Click to upload, or drag and drop
                        </p>
                        <p className="text-sm text-subtle font-normal mt-0.5 text-fd-muted-foreground">
                          Audio or video files up to 50MB each
                        </p>
                        <div className="inline-flex items-center text-xs px-2.5 h-6 rounded-full font-medium transition-colors whitespace-nowrap focus-ring border border-transparent bg-gray-alpha-100 text-foreground my-2.5">
                          or
                        </div>
                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none rounded-[10px] bg-background relative z-10 h-9 px-3">
                          <Mic className="shrink-0 w-[18px] h-[18px] mr-[6px] text-fd-primary" />
                          Record audio
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none bg-gradient-to-b from-transparent to-background"></div>
              </div>

              {/* Toolbar / Footer of Editor */}
              <div
                className="mx-auto w-full bg-background stack justify-end relative duration-300 z-20"
                style={{ maxWidth: 'var(--max-w)', paddingInline: 'var(--px)' }}
              >
                <div className="stack gap-3" style={{ opacity: 1 }}>
                  <div className="hidden md:grid grid-cols-1 @md:grid-cols-[auto,auto] gap-3 justify-between items-center">
                    <div className="relative order-1 @md:order-none flex gap-2 items-center min-w-0">
                      <div className="text-xs text-subtle font-normal min-w-0">
                        <div className="hstack gap-1 md:gap-2 items-center whitespace-nowrap min-w-0">
                          <div
                            className="flex relative items-center justify-center w-5 h-5"
                            style={{ opacity: 1 }}
                          >
                            {/* Circular Progress Simplified */}
                            <svg
                              viewBox="0 0 100 100"
                              className="w-full h-full rotate-[-90deg]"
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r="42"
                                strokeWidth="10"
                                className="stroke-gray-200 fill-none"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="42"
                                strokeWidth="10"
                                strokeDasharray="213 264"
                                className="stroke-fd-primary fill-none"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                          <span className="overflow-hidden overflow-ellipsis text-fd-muted-foreground">
                            8,634 credits remaining
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hstack gap-3 items-center justify-between">
                      <p className="text-xs text-subtle font-normal hstack items-center whitespace-nowrap text-fd-muted-foreground mr-4">
                        0:00 total duration
                      </p>
                      <div className="hstack gap-2 items-center justify-between">
                        <button
                          aria-label="Clear queue"
                          className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 text-foreground shadow-none rounded-[10px] center p-0 h-9 w-9 hidden @2xl:flex"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        <button className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors duration-75 focus-ring bg-fd-primary text-fd-primary-foreground shadow-none hover:bg-fd-primary/90 active:bg-fd-primary/80 h-9 px-4 rounded-[10px]">
                          Generate speech
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Settings Area */}
        <section className="stack hidden md:flex w-[420px] xl:w-[500px] border-l border-fd-border bg-fd-card">
          <div className="stack h-full">
            <div className="relative flex-1 min-h-0 overflow-hidden">
              <div
                className="w-full h-full overflow-y-auto overflow-x-hidden stack gap-4 p-5 pt-2 no-scrollbar"
                style={{ opacity: 1 }}
              >
                {/* Tabs */}
                <div dir="ltr" data-orientation="horizontal">
                  <div
                    role="tablist"
                    aria-orientation="horizontal"
                    className="inline-flex text-subtle gap-3.5 w-full h-11 pt-0.5 border-b border-gray-alpha-200"
                    style={{ outline: 'none' }}
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected="true"
                      className="whitespace-nowrap transition-all inline-flex -mb-[1px] items-center justify-center border-b-[1.5px] px-0 py-1 text-sm font-medium border-gray-alpha-800 text-fd-foreground"
                    >
                      Settings
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected="false"
                      className="whitespace-nowrap transition-all inline-flex -mb-[1px] items-center justify-center border-b-[1.5px] px-0 py-1 text-sm font-medium border-transparent text-fd-muted-foreground"
                    >
                      History
                    </button>
                  </div>
                </div>

                <div className="relative flex-1 min-h-0 mt-2">
                  {/* Promo Card */}
                  <div className="pb-5">
                    <div className="@container group/card">
                      <div className="w-full p-3 items-center border border-gray-alpha-100 rounded-[16px] bg-fd-background transition duration-200 min-h-[92px] hstack hover:shadow-md relative">
                        <div className="relative hidden @[20rem]:block overflow-hidden bg-gray-alpha-100 min-w-[92px] flex-1 rounded-[9px] self-stretch mr-4 max-w-[92px]">
                          <div className="w-full h-full bg-fd-muted flex items-center justify-center">
                            <RotateCcw className="w-6 h-6 text-fd-muted-foreground" />
                          </div>
                        </div>
                        <div className="text-left grow @sm:mr-4 @sm:py-2 pr-8">
                          <p className="text-sm font-medium text-fd-foreground uppercase tracking-tight">
                            Audio & Video Tools
                          </p>
                          <p className="text-[13px] font-normal mt-0.5 text-fd-muted-foreground">
                            Novas ferramentas de mixagem e edição profissional.
                          </p>
                        </div>
                        <div className="absolute top-1.5 right-1.5">
                          <button className="p-1 rounded-md hover:bg-fd-muted">
                            <ChevronRight className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voice Settings Form */}
                  <div className="stack gap-6 pb-4">
                    {/* Voice Select */}
                    <div className="stack gap-2">
                      <label className="text-sm text-foreground font-medium">
                        Voice
                      </label>
                      <div className="w-full stack">
                        <button className="flex items-center justify-between border border-gray-alpha-200 hover:border-gray-alpha-300 bg-fd-background rounded-[10px] px-3 h-10 w-full transition-colors group">
                          <span className="hstack items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-fd-primary/30 to-fd-primary" />
                            <span className="text-sm font-medium truncate">
                              Roger - Laid-Back, Casual, Resonant
                            </span>
                          </span>
                          <ChevronDown className="w-4 h-4 text-fd-muted-foreground group-hover:text-fd-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Model Select */}
                    <div className="stack gap-2">
                      <label className="text-sm text-foreground font-medium">
                        Model
                      </label>
                      <button className="flex items-center justify-between border border-gray-alpha-200 hover:border-gray-alpha-300 bg-fd-background rounded-[10px] px-3 h-10 w-full transition-colors group">
                        <span className="hstack items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-fd-primary/10 flex items-center justify-center text-[10px] font-bold text-fd-primary">
                            v2
                          </div>
                          <span className="text-sm font-medium">
                            Eleven Multilingual v2
                          </span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-fd-muted-foreground" />
                      </button>
                    </div>

                    {/* Sliders */}
                    <div className="stack gap-8">
                      {/* Stability */}
                      <div className="stack gap-1.5">
                        <label className="text-sm text-foreground font-medium">
                          Stability
                        </label>
                        <div className="hstack justify-between">
                          <span className="text-[11px] text-fd-muted-foreground">
                            More variable
                          </span>
                          <span className="text-[11px] text-fd-muted-foreground">
                            More stable
                          </span>
                        </div>
                        <div className="relative h-1 w-full bg-gray-alpha-200 rounded-full mt-1">
                          <div
                            className="absolute left-0 top-0 h-full bg-fd-primary rounded-full"
                            style={{ width: '50%' }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-fd-primary rounded-full shadow-sm"
                            style={{ left: '50%' }}
                          />
                        </div>
                      </div>

                      {/* Similarity */}
                      <div className="stack gap-1.5">
                        <label className="text-sm text-foreground font-medium">
                          Similarity
                        </label>
                        <div className="hstack justify-between">
                          <span className="text-[11px] text-fd-muted-foreground">
                            Low
                          </span>
                          <span className="text-[11px] text-fd-muted-foreground">
                            High
                          </span>
                        </div>
                        <div className="relative h-1 w-full bg-gray-alpha-200 rounded-full mt-1">
                          <div
                            className="absolute left-0 top-0 h-full bg-fd-primary rounded-full"
                            style={{ width: '75%' }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-fd-primary rounded-full shadow-sm"
                            style={{ left: '75%' }}
                          />
                        </div>
                      </div>

                      {/* Style Exaggeration */}
                      <div className="stack gap-1.5">
                        <label className="text-sm text-foreground font-medium">
                          Style Exaggeration
                        </label>
                        <div className="hstack justify-between">
                          <span className="text-[11px] text-fd-muted-foreground">
                            None
                          </span>
                          <span className="text-[11px] text-fd-muted-foreground">
                            Exaggerated
                          </span>
                        </div>
                        <div className="relative h-1 w-full bg-gray-alpha-200 rounded-full mt-1">
                          <div
                            className="absolute left-0 top-0 h-full bg-fd-primary rounded-full"
                            style={{ width: '0%' }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-fd-primary rounded-full shadow-sm border border-fd-border"
                            style={{ left: '0%' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="stack gap-3 pt-2">
                      <div className="hstack gap-2 items-center">
                        <div className="w-8 h-4 bg-gray-alpha-200 rounded-full relative">
                          <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full translate-x-0" />
                        </div>
                        <label className="text-sm font-medium text-fd-foreground">
                          Remove Background Noise
                        </label>
                      </div>

                      <div className="stack gap-1.5 mt-2">
                        <label className="text-sm font-medium text-fd-foreground">
                          Output Format
                        </label>
                        <button className="flex items-center justify-between border border-gray-alpha-200 bg-fd-background rounded-[10px] px-3 h-10 w-full transition-colors">
                          <span className="text-sm font-medium">
                            MP3 (128kbps)
                          </span>
                          <ChevronDown className="w-4 h-4 text-fd-muted-foreground" />
                        </button>
                      </div>

                      <div className="hstack justify-between items-center mt-2">
                        <div className="hstack gap-2 items-center">
                          <div className="w-8 h-4 bg-fd-foreground rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-fd-background rounded-full" />
                          </div>
                          <label className="text-sm font-medium text-fd-foreground">
                            Speaker boost
                          </label>
                        </div>
                        <button className="hstack gap-1.5 text-xs font-medium text-fd-muted-foreground hover:text-fd-foreground">
                          <RotateCcw className="size-3" /> Reset values
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
