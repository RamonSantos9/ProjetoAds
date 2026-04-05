'use client';

import { ThemeToggle } from '@xispedocs/ui/components/layout/theme-toggle';
import { HomeBadge } from '@/components/home/HomeBadge';
import { cn } from '@/lib/cn';
import { useAudioPlayer } from '@/lib/audio-context';
import { Pause } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Episode } from '@/lib/db';

/**
 * Componente principal do Dashboard Administrativo do PodcastAds.
 * 
 * Interface personalizada para gestão de episódios (CMS) do PodcastAds.
 * Permite o cadastro, edição, publicação e análise de dados (BI).
 * 
 * @returns {JSX.Element} Painel de controle do projeto.
 */
export default function AppHomePage() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const basePath = isAdmin ? '/admin' : '/dashboard';

  const { playTrack, currentVoice, isPlaying } = useAudioPlayer();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    async function loadEpisodes() {
      try {
        const res = await fetch('/api/episodes');
        if (res.ok) {
          const data = await res.json();
          // Pegar os últimos 5 episódios
          setEpisodes(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to load episodes:', error);
      }
    }
    loadEpisodes();
  }, []);

  const podcastVoices = [
    {
      name: 'Abertura institucional',
      desc: 'Vinheta de abertura para apresentar o podcast, o curso de ADS e o objetivo do projeto acadêmico.',
      img: 'orb-5.png',
      hue: 91,
      professional: true,
    },
    {
      name: 'Apresentador principal',
      desc: 'Locução para conduzir a introdução do episódio, apresentar o tema e conectar os blocos da conversa.',
      img: 'orb-1.png',
      hue: 0,
      professional: true,
    },
    {
      name: 'Entrevista com convidado',
      desc: 'Demo de interação para episódios com professores, empreendedores, desenvolvedores e convidados externos.',
      img: 'orb-5.png',
      hue: 164,
      professional: true,
    },
    {
      name: 'Encerramento do episódio',
      desc: 'Mensagem final com agradecimento ao público, chamada para redes sociais e divulgação do próximo episódio.',
      img: 'orb-4.png',
      hue: 332,
      professional: true,
    },
    {
      name: 'Chamada para divulgação',
      desc: 'Trecho curto para reels, stories e posts de divulgação do podcast acadêmico nas redes sociais.',
      img: 'orb-5.png',
      hue: 339,
      professional: true,
    },
  ];

  return (
    <div className="rebrand-body flex min-h-screen flex-col bg-[#FFFFFF] dark:bg-fd-background px-8 py-8 text-fd-foreground">

      {/* Main content */}
      <main className="relative flex-[1_1_0] mx-auto w-full max-w-6xl pb-8">
        <div className="hstack justify-center">
          <div className="w-full">
            <div>
              {/* Top Banner & Theme Toggle */}

              <div className="flex gap-4 mb-4 md:mb-8 justify-between max-w-full">
                <HomeBadge 
                  text={isAdmin ? "Painel do Projeto de Podcast" : "Métricas e Episódios do Projeto"} 
                  href={`${basePath}/home`} 
                />
                
                <ThemeToggle mode="light-dark" />
              </div>

              {/* Greeting */}
              <div className="stack">
                <div className="hstack items-center justify-between mb-4 md:mb-6">
                  <div className="hstack">
                    <div className="text-start overflow-hidden">
                      <div>
                        <p aria-hidden="true" className="truncate inter font-medium text-sm text-gray-500 dark:text-gray-400 min-h-[20px]">Gestão do Podcast</p>
                        <h5 aria-hidden="true" className="font-waldenburg-ht font-medium line-clamp-1 text-2xl md:text-3xl text-gray-950 dark:text-gray-100 min-h-[30px]">{greeting}, Ramon</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Quick action grid */}
              {isAdmin && (
                <div className="grid grid-cols-2 2xs:grid-cols-3 gap-y-6 gap-x-3 md:gap-3 md:grid-cols-6 mb-8 md:mb-12">
                  {/* New episode */}
                  <a data-agent-id="link-_r_8f_" aria-label="Novo episódio" className="group stack items-center outline-none" data-testid="home-card-text-to-speech" href={`${basePath}/episodios`}>
                  <div className="stack gap-2 w-full max-w-[180px]">
                    <div className="relative overflow-hidden flex-1 rounded-[20px] flex items-center justify-center bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-200 w-full outline-none group-focus-visible:outline-none group-focus-visible:ring-[1.5px] group-focus-visible:ring-ring">
                      <div className="relative w-full pb-[100%]"></div>
                      <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center [&_svg]:max-w-[90%]">
                        <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hue-rotate-180 dark:invert dark:mix-blend-plus-lighter">
                          <g className="md:group-hover:scale-110 md:group-hover:rotate-3 origin-center transition-all duration-200 ease-in-out">
                            <rect x="26" y="27" width="58" height="42" rx="9" fill="url(#paint0_linear_106_573)"></rect>
                            <rect x="34" y="35" width="39" height="4" rx="2" fill="#C7D5F4"></rect>
                            <rect x="34" y="42" width="28" height="4" rx="2" fill="#C7D5F4"></rect>
                            <rect x="34" y="49" width="32" height="4" rx="2" fill="#C7D5F4"></rect>
                            <rect x="65" y="57" width="13" height="5" rx="2.5" fill="#5D79DF"></rect>
                            <path d="M26 50.661V35C26 30.5817 29.5817 27 34 27H76C80.4183 27 84 30.5817 84 35V64" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"></path>
                          </g>
                          <g className="md:group-hover:scale-125 md:group-hover:-rotate-12 origin-[30px_70px] transition-all duration-200 ease-in-out">
                            <rect x="10" y="55" width="32" height="32" rx="16" fill="#5D79DF" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                            <path d="M23.8668 76.3333V73.6L25.1335 73.7333C25.5023 73.7128 25.8512 73.5599 26.1163 73.3027C26.3813 73.0455 26.5446 72.7013 26.5762 72.3333V68.5333C26.5806 67.5729 26.2033 66.65 25.5273 65.9678C24.8513 65.2855 23.9319 64.8997 22.9715 64.8953C22.0111 64.8909 21.0882 65.2682 20.4059 65.9442C19.7237 66.6202 19.3379 67.5395 19.3335 68.5C19.3335 70.3666 19.7708 70.536 20.0002 71.5333C20.1552 72.1356 20.1618 72.7665 20.0195 73.372L19.3335 76.3333" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M31.2002 74.8666C32.1374 73.9293 32.6641 72.6582 32.6645 71.3327C32.6648 70.0072 32.1389 68.7358 31.2022 67.798" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M29.3331 73C29.5512 72.7819 29.7239 72.5228 29.8412 72.2376C29.9586 71.9523 30.0182 71.6466 30.0166 71.3382C30.0151 71.0298 29.9524 70.7247 29.8322 70.4407C29.712 70.1566 29.5367 69.8992 29.3164 69.6833" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                          </g>
                          <defs>
                            <linearGradient id="paint0_linear_106_573" x1="55" y1="27" x2="55" y2="69" gradientUnits="userSpaceOnUse">
                              <stop stopColor="white"></stop>
                              <stop offset="1" stopColor="white" stopOpacity="0"></stop>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div className="text-center"><p className="font-medium text-xs xs:text-sm text-gray-950 dark:text-gray-100">Novo episódio</p></div>
                  </div>
                </a>

                {/* Edit episode */}
                <a data-agent-id="link-_r_8g_" aria-label="Editar episódio" className="group stack items-center outline-none" data-testid="home-card-audiobook" href={`${basePath}/episodios`}>
                  <div className="stack gap-2 w-full max-w-[180px]">
                    <div className="relative overflow-hidden flex-1 rounded-[20px] flex items-center justify-center bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-200 w-full outline-none group-focus-visible:outline-none group-focus-visible:ring-[1.5px] group-focus-visible:ring-ring">
                      <div className="relative w-full pb-[100%]"></div>
                      <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center [&_svg]:max-w-[90%]">
                        <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hue-rotate-180 dark:invert dark:mix-blend-plus-lighter">
                          <g className="md:group-hover:scale-110 origin-center transition-all duration-200 ease-in-out">
                            <rect x="24" y="19" width="58" height="42" rx="9" fill="url(#paint0_linear_106_572)"></rect>
                            <rect x="39" y="53" width="30" height="4" rx="2" fill="#E5E7EB"></rect>
                            <rect x="39" y="60" width="24" height="4" rx="2" fill="#E5E7EB"></rect>
                            <circle cx="3" cy="3" r="3" transform="matrix(-1 0 0 1 36.1089 26)" fill="#EB524B"></circle>
                            <rect x="39" y="27" width="34" height="4" rx="2" fill="#FDCDCB"></rect>
                            <rect x="39" y="34" width="28" height="4" rx="2" fill="#FDCDCB"></rect>
                            <rect x="39" y="41" width="32" height="4" rx="2" fill="#FDCDCB"></rect>
                            <path d="M24 38.661V27C24 22.5817 27.5817 19 32 19H74C78.4183 19 82 22.5817 82 27V38" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"></path>
                          </g>
                          <g className="md:group-hover:scale-125 md:group-hover:-rotate-12 md:group-hover:translate-y-2 origin-[10px_60px] transition-all duration-200 ease-in-out">
                            <rect x="4" y="41" width="32" height="32" rx="16" fill="#EB524B" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                            <path d="M14.6665 57.8519H16.4443C16.7586 57.8519 17.0601 57.9768 17.2823 58.199C17.5046 58.4213 17.6295 58.7227 17.6295 59.0371V60.8149C17.6295 61.1292 17.5046 61.4306 17.2823 61.6529C17.0601 61.8752 16.7586 62 16.4443 62H15.8517C15.5374 62 15.2359 61.8752 15.0136 61.6529C14.7914 61.4306 14.6665 61.1292 14.6665 60.8149V56.6667C14.6665 55.2522 15.2284 53.8957 16.2286 52.8955C17.2288 51.8953 18.5853 51.3334 19.9998 51.3334C21.4143 51.3334 22.7709 51.8953 23.7711 52.8955C24.7713 53.8957 25.3332 55.2522 25.3332 56.6667V60.8149C25.3332 61.1292 25.2083 61.4306 24.986 61.6529C24.7638 61.8752 24.4623 62 24.148 62H23.5554C23.2411 62 22.9396 61.8752 22.7173 61.6529C22.4951 61.4306 22.3702 61.1292 22.3702 60.8149V59.0371C22.3702 58.7227 22.4951 58.4213 22.7173 58.199C22.9396 57.9768 23.2411 57.8519 23.5554 57.8519H25.3332" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                          </g>
                          <defs>
                            <linearGradient id="paint0_linear_106_572" x1="53" y1="19" x2="53" y2="61" gradientUnits="userSpaceOnUse"><stop stopColor="white"></stop><stop offset="1" stopColor="white" stopOpacity="0"></stop></linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div className="text-center"><p className="font-medium text-xs xs:text-sm text-gray-950 dark:text-gray-100">Editar episódio</p></div>
                  </div>
                </a>

                {/* Publish episode */}
                <a data-agent-id="link-_r_8h_" aria-label="Publicar episódio" className="group stack items-center outline-none" data-testid="home-card-image-video" href={`${basePath}/publicacao`}>
                  <div className="stack gap-2 w-full max-w-[180px]">
                    <div className="relative overflow-hidden flex-1 rounded-[20px] flex items-center justify-center bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-200 w-full outline-none group-focus-visible:outline-none group-focus-visible:ring-[1.5px] group-focus-visible:ring-ring">
                      <div className="relative w-full pb-[100%]"></div>
                      <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center [&_svg]:max-w-[90%]">
                        <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hue-rotate-180 dark:invert dark:mix-blend-plus-lighter">
                          <g className="md:group-hover:scale-110 origin-center transition-all duration-200 ease-in-out">
                            <path d="M74 22H34C28.4772 22 24 26.4772 24 32V56C24 61.5228 28.4772 66 34 66H74C79.5228 66 84 61.5228 84 56V32C84 26.4772 79.5228 22 74 22Z" fill="url(#paint0_linear_297_5)"></path>
                            <path d="M56 37H34C32.8954 37 32 37.8954 32 39C32 40.1046 32.8954 41 34 41H56C57.1046 41 58 40.1046 58 39C58 37.8954 57.1046 37 56 37Z" fill="#CAEADC"></path>
                            <path d="M50 44H34C32.8954 44 32 44.8954 32 46C32 47.1046 32.8954 48 34 48H50C51.1046 48 52 47.1046 52 46C52 44.8954 51.1046 44 50 44Z" fill="#CAEADC"></path>
                            <path d="M24 42V32C24 26.4772 28.4772 22 34 22H74C79.5228 22 84 26.4772 84 32V54" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"></path>
                            <rect x="32" y="30" width="6" height="4" rx="1" fill="#CAEADC"></rect>
                            <rect x="40" y="30" width="6" height="4" rx="1" fill="#CAEADC"></rect>
                          </g>
                          <g className="md:group-hover:scale-125 md:group-hover:rotate-12 origin-[60px_60px] transition-all duration-200 ease-in-out">
                            <path d="M64 57.2a9.2 9.2 0 019.2-9.2h9.2a9.2 9.2 0 019.2 9.2v4.6a9.2 9.2 0 01-9.2 9.2h-9.2a9.2 9.2 0 01-9.2-9.2v-4.6z" fill="#5D79DF" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></path>
                            <path d="M74.925 62.375v-5.75L81.25 59.5l-6.325 2.875z" fill="#fff" stroke="#fff" strokeWidth="1.25" strokeLinejoin="round"></path>
                          </g>
                          <g className="md:group-hover:scale-125 md:group-hover:-rotate-12 md:group-hover:translate-y-1 origin-[30px_60px] transition-all duration-200 ease-in-out">
                            <path d="M45 66c0-9.389-7.611-17-17-17s-17 7.611-17 17 7.611 17 17 17 17-7.611 17-17z" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></path>
                            <path d="M32.667 60h-9.334c-.736 0-1.333.597-1.333 1.333v9.334c0 .736.597 1.333 1.333 1.333h9.334c.736 0 1.333-.597 1.333-1.333v-9.334c0-.736-.597-1.333-1.333-1.333z" stroke="#fff" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M26 65.333a1.333 1.333 0 100-2.666 1.333 1.333 0 000 2.666zM34 68l-2.057-2.057a1.334 1.334 0 00-1.886 0L24 72" stroke="#fff" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                          </g>
                          <defs>
                            <linearGradient id="paint0_linear_297_5" x1="54" y1="22" x2="54" y2="66" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#fff"></stop>
                              <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div className="text-center"><p className="font-medium text-xs xs:text-sm text-gray-950 dark:text-gray-100">Publicar episódio</p></div>
                  </div>
                </a>

                {/* Guests */}
                <a data-agent-id="link-_r_8i_" aria-label="Convidados" className="group stack items-center outline-none" data-testid="home-card-ai-agent" href={`${basePath}/convidados`}>
                  <div className="stack gap-2 w-full max-w-[180px]">
                    <div className="relative overflow-hidden flex-1 rounded-[20px] flex items-center justify-center bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-200 w-full outline-none group-focus-visible:outline-none group-focus-visible:ring-[1.5px] group-focus-visible:ring-ring">
                      <div className="relative w-full pb-[100%]"></div>
                      <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center [&_svg]:max-w-[90%]">
                        <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="dark:hue-rotate-180 dark:invert dark:mix-blend-plus-lighter">
                          <g className="md:group-hover:scale-110 origin-center transition-all duration-200 ease-in-out">
                            <rect x="28.8779" y="23" width="57.6076" height="57.6076" rx="28.8038" transform="rotate(4.85741 28.8779 23)" fill="url(#pattern0_188_182)" className="dark:hue-rotate-180 dark:invert"></rect>
                            <rect x="28.8779" y="23" width="57.6076" height="57.6076" rx="28.8038" transform="rotate(4.85741 28.8779 23)" fill="url(#pattern1_188_182)" className="dark:hue-rotate-180 dark:invert"></rect>
                          </g>
                          <g className="md:group-hover:scale-125 md:group-hover:-rotate-6 origin-center transition-all duration-200 ease-in-out ">
                            <rect x="18" y="62" width="43" height="16" rx="5.02641" fill="#A94BD2" stroke="#F3F4F6" strokeWidth="2" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                            <line x1="24.5361" y1="73.2509" x2="24.5361" y2="66.7509" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="27.7954" y1="73.1494" x2="27.7954" y2="66.8524" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="31.0552" y1="72.0818" x2="31.0552" y2="67.9197" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="34.3145" y1="72.7681" x2="34.3145" y2="67.2335" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="37.5742" y1="70.4708" x2="37.5742" y2="69.5303" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="40.8335" y1="70.5399" x2="40.8335" y2="69.4612" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="44.0928" y1="71.6112" x2="44.0928" y2="68.3902" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="47.3525" y1="71.6689" x2="47.3525" y2="68.3325" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="50.6118" y1="71.7091" x2="50.6118" y2="68.2922" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="53.8716" y1="72.3105" x2="53.8716" y2="67.6911" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                          </g>
                          <g className="md:group-hover:scale-110 md:group-hover:rotate-12 origin-[60px_20px] transition-all duration-200 ease-in-out">
                            <rect x="58" y="12" width="32" height="32" rx="16" fill="#A94BD2" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                            <path d="M71.8668 33.3333V30.6L73.1335 30.7333C73.5023 30.7128 73.8512 30.5599 74.1163 30.3027C74.3813 30.0455 74.5446 29.7013 74.5762 29.3333V25.5333C74.5806 24.5729 74.2033 23.65 73.5273 22.9678C72.8513 22.2855 71.9319 21.8997 70.9715 21.8953C70.0111 21.8909 69.0882 22.2682 68.4059 22.9442C67.7237 23.6202 67.3379 24.5395 67.3335 25.5C67.3335 27.3666 67.7708 27.536 68.0002 28.5333C68.1552 29.1356 68.1618 29.7665 68.0195 30.372L67.3335 33.3333" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M79.2002 31.8666C80.1374 30.9293 80.6641 29.6582 80.6645 28.3327C80.6648 27.0072 80.1389 25.7358 79.2022 24.798" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M77.3331 30C77.5512 29.7819 77.7239 29.5228 77.8412 29.2376C77.9586 28.9523 78.0182 28.6466 78.0166 28.3382C78.0151 28.0298 77.9524 27.7247 77.8322 27.4407C77.712 27.1566 77.5367 26.8992 77.3164 26.6833" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                          </g>
                          <defs>
                            <pattern id="pattern0_188_182" patternContentUnits="objectBoundingBox" width="1" height="1">
                              <image xlinkHref="/images/home/conversational-ai.png" width="240" height="382" transform="translate(0 -0.295833) scale(0.00416667)"></image>
                            </pattern>
                            <pattern id="pattern1_188_182" patternContentUnits="objectBoundingBox" width="1" height="1">
                              <image xlinkHref="/images/home/conversational-ai.png" width="872" height="860" transform="translate(-0.00697674) scale(0.00116279)"></image>
                            </pattern>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div className="text-center"><p className="font-medium text-xs xs:text-sm text-gray-950 dark:text-gray-100">Convidados</p></div>
                  </div>
                </a>

                {/* Music */}
                <a data-agent-id="link-_r_8j_" aria-label="Música" className="group stack items-center outline-none" data-testid="home-card-music" href={`${basePath}/vinhetas-trilhas`}>
                  <div className="stack gap-2 w-full max-w-[180px]">
                    <div className="relative overflow-hidden flex-1 rounded-[20px] flex items-center justify-center bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-200 w-full outline-none group-focus-visible:outline-none group-focus-visible:ring-[1.5px] group-focus-visible:ring-ring">
                      <div className="relative w-full pb-[100%]"></div>
                      <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center [&_svg]:max-w-[90%]">
                        <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="dark:hue-rotate-180 dark:invert dark:mix-blend-plus-lighter">
                          <g clipPath="url(#clip0_218_14)">
                            <mask id="mask0_218_14" maskUnits="userSpaceOnUse" x="0" y="0" width="108" height="108" style={{ maskType: 'luminance' }}>
                              <path d="M108 0H0V108H108V0Z" fill="white"></path>
                            </mask>
                            <g mask="url(#mask0_218_14)">
                              <g className="md:group-hover:scale-110 origin-center transition-all duration-200 ease-in-out">
                                <path d="M62.999 40.0615C68.4352 40.0615 72.9385 44.2278 72.9385 49.4824V59.5176C72.9385 64.7722 68.4352 68.9385 62.999 68.9385H4.00098C-1.43517 68.9385 -5.93848 64.7722 -5.93848 59.5176V49.4824C-5.93848 44.2278 -1.43517 40.0615 4.00098 40.0615H62.999Z" stroke="url(#paint0_linear_218_14)" strokeWidth="1.87738"></path>
                                <path d="M62.9992 41H4.00078C-0.970214 41 -5 44.7976 -5 49.4821V59.5179C-5 64.2024 -0.970214 68 4.00078 68H62.9992C67.9702 68 72 64.2024 72 59.5179V49.4821C72 44.7976 67.9702 41 62.9992 41Z" fill="url(#paint1_linear_218_14)"></path>
                                <path d="M15.8223 60.1468V49.333" stroke="#F58633" strokeOpacity="0.4" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M10 60.1468V49.333" stroke="#F58633" strokeOpacity="0.2" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M4 57V52" stroke="#F58633" strokeOpacity="0.1" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M21.4199 58.3135V51.166" stroke="#F58633" strokeOpacity="0.5" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M27.0166 59.4919V49.9873" stroke="#F58633" strokeOpacity="0.6" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M32.6143 55.5473V53.9321" stroke="#F58633" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M38.2139 55.6655V53.813" stroke="#F58633" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M43.8086 57.505V51.9736" stroke="#F58633" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M49.4072 57.6046V51.875" stroke="#F58633" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M55.0078 61.4791L55 48" stroke="#F58633" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M61 59V50" stroke="#F58633" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M67.9219 58.7063V50.7734" stroke="#E5E7EB" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M87.001 40.0615C81.5648 40.0615 77.0615 44.2278 77.0615 49.4824V59.5176C77.0615 64.7722 81.5648 68.9385 87.001 68.9385H145.999C151.435 68.9385 155.938 64.7722 155.938 59.5176V49.4824C155.938 44.2278 151.435 40.0615 145.999 40.0615H87.001Z" stroke="url(#paint2_linear_218_14)" strokeWidth="1.87738"></path>
                                <path d="M87.0008 41H145.999C150.97 41 155 44.7976 155 49.4821V59.5179C155 64.2024 150.97 68 145.999 68H87.0008C82.0298 68 78 64.2024 78 59.5179V49.4821C78 44.7976 82.0298 41 87.0008 41Z" fill="url(#paint3_linear_218_14)"></path>
                                <path d="M106.191 57.505V51.9736" stroke="#F58633" strokeOpacity="0.1" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M101 59V51" stroke="#F58633" strokeOpacity="0.2" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M94.9961 57.6735V51.8057" stroke="#F58633" strokeOpacity="0.4" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M89 60V49" stroke="#F58633" strokeOpacity="0.6" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <path d="M82.0781 58.7063V50.7734" stroke="#E5E7EB" strokeWidth="2.57594" strokeLinecap="round"></path>
                                <g filter="url(#filter0_d_218_14)">
                                  <path d="M62 29H64H66C67.1046 29 68 29.8954 68 31V33.7408C68 34.7475 67.4951 35.6871 66.6556 36.2426L66 36.6765L64.5519 37.6348C64.2173 37.8562 63.7827 37.8562 63.4481 37.6348L61.3444 36.2426C60.5049 35.6871 60 34.7475 60 33.7408V31C60 29.8954 60.8954 29 62 29Z" fill="black"></path>
                                </g>
                                <path d="M65 33H63V75H65V33Z" fill="url(#paint4_linear_218_14)"></path>
                              </g>
                              <g className="md:group-hover:scale-110 md:group-hover:rotate-12 origin-[60px_20px] transition-all duration-200 ease-in-out">
                                <g className="md:group-hover:translate-x-1.5 md:group-hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
                                  <path d="M20.6432 30.8138C18.5534 25.0291 21.5487 18.6455 27.3333 16.5557C33.118 14.4659 39.5016 17.4612 41.5914 23.2459C43.6812 29.0306 40.6859 35.4141 34.9012 37.5039C29.1165 39.5937 22.733 36.5985 20.6432 30.8138Z" className="fill-black dark:fill-[#ddd]"></path>
                                  <path d="M29.9888 23.9055L29.9888 23.9055C28.2634 24.5289 27.3699 26.4329 27.9933 28.1584L27.9933 28.1584C28.6166 29.8839 30.5207 30.7773 32.2462 30.1539L32.2462 30.1539C33.9716 29.5306 34.8651 27.6265 34.2417 25.9011L34.2417 25.901C33.6184 24.1756 31.7143 23.2822 29.9888 23.9055Z" fill="#FE9641"></path>
                                </g>
                                <path d="M27.5508 13.2773L9.8252 19.6806C7.39608 20.5582 6.13818 23.2388 7.01562 25.6679L13.4189 43.3935C14.2965 45.8226 16.9771 47.0805 19.4062 46.2031L37.1318 39.7998C38.2137 39.409 39.0629 38.6604 39.5947 37.7357" stroke="#F3F4F6" strokeWidth="2.5" strokeLinecap="round" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></path>
                                <path d="M27.4364 14.6474L10.7894 20.6614C8.71166 21.412 7.63583 23.7048 8.38644 25.7825L14.4004 42.4295C15.151 44.5072 17.4439 45.5831 19.5216 44.8324L36.1685 38.8184C38.2463 38.0678 39.3221 35.775 38.5715 33.6973L32.5575 17.0503C31.8069 14.9726 29.5141 13.8968 27.4364 14.6474Z" fill="#FE9641"></path>
                                <path d="M27.4364 14.6474L10.7894 20.6614C8.71166 21.412 7.63583 23.7048 8.38644 25.7825L14.4004 42.4295C15.151 44.5072 17.4439 45.5831 19.5216 44.8324L36.1685 38.8184C38.2463 38.0678 39.3221 35.775 38.5715 33.6973L32.5575 17.0503C31.8069 14.9726 29.5141 13.8968 27.4364 14.6474Z" fill="url(#pattern1_218_14)" fillOpacity="0.5"></path>
                                <mask id="mask1_218_14" maskUnits="userSpaceOnUse" x="15" y="21" width="17" height="17" style={{ maskType: 'luminance' }}>
                                  <path d="M27.1333 21.9519L15.6914 26.0854L19.825 37.5274L31.2669 33.3938L27.1333 21.9519Z" fill="white"></path>
                                </mask>
                                <g mask="url(#mask1_218_14)">
                                  <path d="M22.8657 32.817C23.1036 33.4755 22.6557 34.2407 21.8662 34.526C21.0767 34.8112 20.2431 34.5089 20.0052 33.8504C19.7675 33.1925 20.2155 32.4273 21.0049 32.142C21.7944 31.8568 22.628 32.1591 22.8657 32.817ZM22.8657 32.817L21.1759 28.1395C21.0238 27.7185 21.166 27.2474 21.5255 26.9804L22.2393 26.3066M27.323 30.2366C27.5609 30.8951 27.1135 31.6601 26.3235 31.9456C25.534 32.2308 24.7004 31.9285 24.4625 31.27C24.2248 30.6121 24.6727 29.8468 25.4622 29.5616C26.2523 29.2762 27.0853 29.5787 27.323 30.2366ZM27.323 30.2366L26.4457 27.8048" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></path>
                                  <path d="M23.6923 25.4229L24.2167 24.8713C24.256 24.8301 24.281 24.7773 24.2878 24.7207L24.3769 23.9648C24.4017 23.7489 24.6626 23.6546 24.8203 23.8046L25.3719 24.3291C25.4128 24.3687 25.4663 24.3933 25.5225 24.4002L26.2789 24.4891C26.4945 24.5147 26.5886 24.775 26.4391 24.9325L25.9141 25.4843C25.8748 25.5257 25.8499 25.5787 25.8432 25.6354L25.7539 26.3907C25.748 26.4393 25.7288 26.4852 25.6984 26.5234C25.668 26.5617 25.6275 26.5907 25.5815 26.6073C25.5356 26.6239 25.4859 26.6274 25.4381 26.6175C25.3902 26.6075 25.3461 26.5845 25.3105 26.5509L24.7591 26.027C24.7179 25.9877 24.6651 25.9628 24.6086 25.956L23.8521 25.8671C23.8035 25.8613 23.7574 25.8421 23.719 25.8117C23.6806 25.7812 23.6515 25.7407 23.6349 25.6946C23.6182 25.6485 23.6147 25.5987 23.6248 25.5508C23.6348 25.5028 23.6586 25.4584 23.6923 25.4229Z" fill="white"></path>
                                </g>
                              </g>
                            </g>
                            <defs>
                              <filter id="filter0_d_218_14" x="59" y="29" width="10" height="10.8008" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                                <feOffset dy="1"></feOffset>
                                <feGaussianBlur stdDeviation="0.5"></feGaussianBlur>
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0"></feColorMatrix>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_218_14"></feBlend>
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_218_14" result="shape"></feBlend>
                              </filter>
                              <pattern id="pattern1_218_14" patternContentUnits="objectBoundingBox" width="1" height="1">
                                <image xlinkHref="/images/home/music.jpg" width="3840" height="2160" preserveAspectRatio="none" transform="translate(-0.36 0.35) scale(0.0003999) rotate(-19.5)"></image>
                              </pattern>
                              <linearGradient id="paint0_linear_218_14" x1="72" y1="54.5" x2="-4.99999" y2="54.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#E6E7EB"></stop>
                                <stop offset="0.840291" stopColor="#E5E7EB" stopOpacity="0"></stop>
                              </linearGradient>
                              <linearGradient id="paint1_linear_218_14" x1="72" y1="50.1103" x2="5.5" y2="50.1103" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"></stop>
                                <stop offset="1" stopColor="white" stopOpacity="0"></stop>
                              </linearGradient>
                              <linearGradient id="paint2_linear_218_14" x1="78" y1="54.5" x2="155" y2="54.5" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#E6E7EB"></stop>
                                <stop offset="0.4" stopColor="#E5E7EB" stopOpacity="0"></stop>
                              </linearGradient>
                              <linearGradient id="paint3_linear_218_14" x1="78" y1="50.1103" x2="144.5" y2="50.1103" gradientUnits="userSpaceOnUse">
                                <stop stopColor="white"></stop>
                                <stop offset="0.35" stopColor="white" stopOpacity="0"></stop>
                              </linearGradient>
                              <linearGradient id="paint4_linear_218_14" x1="64" y1="33" x2="64" y2="75" gradientUnits="userSpaceOnUse">
                                <stop offset="0.278469"></stop>
                                <stop offset="1" stopOpacity="0"></stop>
                              </linearGradient>
                              <clipPath id="clip0_218_14">
                                <rect width="108" height="108" fill="white"></rect>
                              </clipPath>
                            </defs>
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div className="text-center"><p className="font-medium text-xs xs:text-sm text-gray-950 dark:text-gray-100">Música</p></div>
                  </div>
                </a>

                {/* Dubbed video */}
                <a data-agent-id="link-_r_8k_" aria-label="Vídeo dublado" className="group stack items-center outline-none" data-testid="home-card-dubbing-studio" href={`${basePath}/midias-visuais`}>
                  <div className="stack gap-2 w-full max-w-[180px]">
                    <div className="relative overflow-hidden flex-1 rounded-[20px] flex items-center justify-center bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-200 w-full outline-none group-focus-visible:outline-none group-focus-visible:ring-[1.5px] group-focus-visible:ring-ring">
                      <div className="relative w-full pb-[100%]"></div>
                      <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center [&_svg]:max-w-[90%]">
                        <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hue-rotate-180 dark:invert dark:mix-blend-plus-lighter">
                          <g className="md:group-hover:scale-110 origin-center transition-all duration-200 ease-in-out">
                            <rect x="25.7578" y="25.1987" width="67.8246" height="51.5787" rx="8" transform="rotate(4.85741 25.7578 25.1987)" fill="url(#pattern0_106_568)" className="dark:invert dark:hue-rotate-180"></rect>
                          </g>
                          <g className="md:group-hover:scale-110 md:group-hover:-rotate-3 origin-center transition-all duration-200 ease-in-out">
                            <rect x="9" y="51" width="42" height="16" rx="5" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                            <line x1="15.4713" y1="62.185" x2="15.4713" y2="55.8149" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                            <line x1="18.7305" y1="62.0834" x2="18.7305" y2="55.9163" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                            <line x1="21.9903" y1="61.0161" x2="21.9903" y2="56.9838" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                            <line x1="25.2496" y1="61.7023" x2="25.2496" y2="56.2976" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                            <line x1="28.5094" y1="59.4053" x2="28.5093" y2="58.5946" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                            <line x1="31.7686" y1="59.4744" x2="31.7686" y2="58.5255" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                            <line x1="35.0279" y1="60.5455" x2="35.0279" y2="57.4543" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                            <line x1="38.2877" y1="60.6032" x2="38.2877" y2="57.3966" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                            <line x1="41.5469" y1="60.6435" x2="41.5469" y2="57.3565" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                            <line x1="44.8067" y1="61.2447" x2="44.8067" y2="56.7552" stroke="white" strokeWidth="1.62974" strokeLinecap="round"></line>
                          </g>
                          <g className="md:group-hover:scale-110 md:group-hover:translate-y-1 origin-center transition-all duration-200 ease-in-out">
                            <rect x="33" y="73" width="30" height="16" rx="5" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                            <line x1="40.25" y1="84.25" x2="40.25" y2="77.75" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="43.4497" y1="83.1548" x2="43.4497" y2="78.8453" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="46.6499" y1="83.8589" x2="46.6499" y2="78.1412" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="49.8501" y1="81.502" x2="49.8501" y2="80.4979" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="53.0503" y1="81.573" x2="53.0503" y2="80.4271" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                            <line x1="56.25" y1="82.672" x2="56.25" y2="79.3281" stroke="white" strokeWidth="1.5" strokeLinecap="round"></line>
                          </g>
                          <g className="md:group-hover:scale-110 md:group-hover:rotate-6 origin-center transition-all duration-200 ease-in-out">
                            <rect x="66" y="17" width="32" height="32" rx="16" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                            <g clipPath="url(#clip0_106_568)">
                              <path d="M77.3335 30.3334L81.3335 34.3334" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M76.6665 34.3334L80.6665 30.3334L81.9998 28.3334" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M75.3335 28.3334H83.3335" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M78.6665 26.3334H79.3332" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M88.6667 39.6667L85.3333 33L82 39.6667" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M83.3335 37H87.3335" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                            </g>
                          </g>
                          <defs>
                            <pattern id="pattern0_106_568" patternContentUnits="objectBoundingBox" width="1" height="1">
                              <image xlinkHref="/images/home/dubbing.png" width="401" height="305" transform="scale(0.00249377 0.00327924)"></image>
                            </pattern>
                            <clipPath id="clip0_106_568">
                              <rect width="16" height="16" fill="white" transform="translate(74 25)"></rect>
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div className="text-center"><p className="font-medium text-xs xs:text-sm text-gray-950 dark:text-gray-100">Vídeo dublado</p></div>
                  </div>
                </a>
              </div>
              )}


              {/* Two-column grid: Library and Creation */}
              <div className={isAdmin ? "grid md:grid-cols-2 gap-10 mb-12" : "grid md:grid-cols-1 gap-10 mb-12"}>
                {/* Latest from the library */}
                <div>
                  <p className="text-lg text-fd-foreground font-semibold mb-3">Últimos Podcasts</p>
                  <ul className="eleven-list mb-2">
                    {episodes.length > 0 ? (
                      episodes.map((ep, idx) => {
                        const fallbackVoice = podcastVoices[idx % podcastVoices.length];
                        const displayVoice = {
                          name: ep.title,
                          desc: ep.summary,
                          img: fallbackVoice.img,
                          hue: fallbackVoice.hue,
                          professional: true
                        };
                        const isCurrent = currentVoice?.name === displayVoice.name;
                        const active = isCurrent && isPlaying;
                        
                        const handlePlay = (e: React.MouseEvent) => {
                          e.stopPropagation();
                          playTrack({
                            ...displayVoice,
                            url: ep.audioUrl || 'https://storage.googleapis.com/eleven-public-prod/database/workspace/9ffd9eb76f364648abbfb2c74b299b4a/voices/goT3UYdM9bhm0n2lmKQx/8e1e53b7-9320-4bab-acf2-86d7e77d1b8b.mp3'
                          });
                        };
                        
                        return (
                        <li key={ep.id || idx} onClick={handlePlay} className="eleven-list-item hstack items-center px-3 gap-3 transition-colors duration-75 relative hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer group rounded-xl">
                          <div className="w-full hstack items-center py-3 gap-2">
                            <div className="shrink-0 center rounded-[10px] bg-transparent w-8 h-8 self-start my-1 focus-within:ring-0">
                              <div className="relative group shrink-0 h-8 w-8">
                                <div className="block opacity-100 transition-opacity duration-100 h-full w-full">
                                  <div className="relative w-full h-full rounded-full overflow-hidden bg-[#FFFFFF] dark:bg-fd-background">
                                    <div className="absolute inset-0 bg-black/40 transition-opacity duration-100 opacity-0 group-hover:opacity-100 z-10" />
                                    <img 
                                      alt={displayVoice.name} 
                                      loading="lazy" 
                                      width="60" 
                                      height="60" 
                                      className="w-full h-full max-w-full max-h-full object-cover" 
                                      style={{ filter: `hue-rotate(${displayVoice.hue}deg) saturate(120%)`, transform: `rotate(${displayVoice.hue}deg)`, objectPosition: 'center center' }} 
                                      src={`/images/home/${displayVoice.img}`} 
                                    />
                                  </div>
                                </div>
                                
                                <div className={cn("absolute inset-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-100 z-10", active ? "opacity-100" : "opacity-0")}>
                                  <button 
                                    onClick={handlePlay}
                                  tabIndex={0} 
                                  aria-label="Reproduzir demo" 
                                  type="button" 
                                  className="center p-0 relative h-full w-full rounded-full bg-black text-background hover:bg-black transition-colors"
                                >
                                  <div className="absolute inset-0 center">
                                    {active ? (
                                      <Pause className="w-4 h-4 fill-white text-white" />
                                    ) : (
                                      <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="white" className="shrink-0 w-[18px] h-[18px]">
                                        <path d="M8.38399 3.68914C7.05155 2.86616 5.33301 3.82463 5.33301 5.39074V14.6094C5.33301 16.1755 7.05155 17.134 8.38399 16.311L15.8467 11.7016C17.1121 10.9201 17.1121 9.07998 15.8467 8.29846L8.38399 3.68914Z" fill="currentColor"></path>
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              </div>
                              
                              {/* Professional Badge */}
                              {displayVoice.professional && (
                                <span className="absolute top-0 right-0 translate-y-[-30%] translate-x-[30%] z-20">
                                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                    <path className="fill-background" fillRule="evenodd" d="m13.02 2.944 1.664-.02a2.5 2.5 0 0 1 2.53 2.53l-.02 1.663 1.19 1.163a2.5 2.5 0 0 1 0 3.577l-1.19 1.163.02 1.664a2.5 2.5 0 0 1-2.53 2.53l-1.664-.02-1.163 1.19a2.5 2.5 0 0 1-3.577 0l-1.163-1.19-1.663.02a2.5 2.5 0 0 1-2.53-2.53l.02-1.664-1.19-1.163a2.5 2.5 0 0 1 0-3.577l1.19-1.163-.02-1.663a2.5 2.5 0 0 1 2.53-2.53l1.663.02 1.163-1.19a2.5 2.5 0 0 1 3.577 0l1.163 1.19Z" clipRule="evenodd"></path>
                                    <path fill="#DDBF22" fillRule="evenodd" d="M12.755 4.378a1 1 0 0 1-.727-.302l-1.313-1.343a1 1 0 0 0-1.43 0L7.972 4.076a1 1 0 0 1-.727.302l-1.878-.023a1 1 0 0 0-1.012 1.012l.023 1.878a1 1 0 0 1-.302.728L2.733 9.284a1 1 0 0 0 0 1.43l1.343 1.313a1 1 0 0 1 .302.727l-.023 1.878a1 1 0 0 0 1.012 1.012l1.878-.023a1 1 0 0 1 .728.302l1.312 1.343a1 1 0 0 0 1.43 0l1.313-1.343a1 1 0 0 1 .727-.302l1.878.023a1 1 0 0 0 1.012-1.012l-.023-1.878a1 1 0 0 1 .302-.727l1.343-1.313a1 1 0 0 0 0-1.43l-1.343-1.313a1 1 0 0 1-.302-.727l.023-1.878a1 1 0 0 0-1.012-1.012l-1.878.023Z" clipRule="evenodd"></path>
                                    <path className="fill-background" fillRule="evenodd" d="m13.53 8.53-1.06-1.06L9 10.94 7.53 9.47l-1.06 1.06L9 13.06l4.53-4.53Z" clipRule="evenodd"></path>
                                  </svg>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="relative flex-1 min-w-0">
                            <p className="text-sm text-fd-foreground font-semibold line-clamp-1">{displayVoice.name}</p>
                            <p className="text-sm text-fd-muted-foreground font-normal line-clamp-1">{displayVoice.desc}</p>
                          </div>
                          <div className="relative hstack items-center w-fit hidden group-hover:flex gap-2">
                            <button className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 bg-[#FFFFFF] dark:bg-fd-background border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-fd-foreground h-8 px-2.5 rounded-lg text-xs">Ouvir demo</button>
                          </div>
                        </div>
                      </li>
                      );
                    })
                    ) : (
                      <li className="text-center p-3 text-sm text-gray-500">Nenhum episódio cadastrado.</li>
                    )}
                  </ul>
                  <a href={`${basePath}/episodios`}>
                    <button className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 bg-[#FFFFFF] dark:bg-fd-background border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-fd-foreground h-8 px-2.5 rounded-lg text-xs">Ver acervo do podcast</button>
                  </a>
                </div>

                {/* Content Card matches modern PodcastAds layout rounded-[24px] box */}
                {isAdmin && (
                  <div>
                    <p className="text-lg text-fd-foreground font-semibold mb-3">Ações rápidas do projeto</p>
                    <div className="stack gap-2">
                    {/* Voice Design */}
                    <div className="h-full @container group">
                      <div className="hstack gap-4 h-full w-full -mx-1.5 p-1.5 relative items-center rounded-[16px] bg-[#FFFFFF] dark:bg-fd-background transition duration-200 min-h-[92px]">
                        <div className="relative overflow-hidden bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-all duration-200 max-w-[122px] min-w-[122px] flex-1 rounded-[16px] shrink-0 block">
                          <div className="relative w-full pb-[75%]"></div>
                          <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center [&_svg]:max-w-[90%]">
                            <svg width="78" height="48" viewBox="0 0 78 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hue-rotate-180 dark:invert dark:mix-blend-plus-lighter">
                              <g className="md:group-hover:scale-[1.15] origin-center transition-all duration-200 ease-in-out">
                                <rect x="21" y="6" width="36" height="36" rx="10" fill="#EB524B" stroke="#F3F4F6" strokeWidth="3" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                                <path d="M38.705 29.7528C37.8373 29.9893 36.9267 30.022 36.0443 29.8484C35.162 29.6749 34.3316 29.2997 33.6181 28.7523C32.9047 28.2048 32.3274 27.4999 31.9313 26.6925C31.5353 25.8851 31.3312 24.9971 31.335 24.0978C31.3388 23.1985 31.5504 22.3123 31.9533 21.5082C32.3562 20.7042 32.9394 20.0042 33.6575 19.4628C34.3756 18.9215 35.2091 18.5534 36.093 18.3873C36.9768 18.2212 37.8871 18.2617 38.7527 18.5055" stroke="white" strokeWidth="1.40625" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M38.5507 21.3C38.5507 21.1807 38.5981 21.0662 38.6825 20.9818C38.7669 20.8974 38.8814 20.85 39.0007 20.85H41.9257C42.0451 20.85 42.1595 20.8974 42.2439 20.9818C42.3283 21.0662 42.3757 21.1807 42.3757 21.3C42.3757 21.4193 42.3283 21.5338 42.2439 21.6182C42.1595 21.7026 42.0451 21.75 41.9257 21.75H39.0007C38.8814 21.75 38.7669 21.7026 38.6825 21.6182C38.5981 21.5338 38.5507 21.4193 38.5507 21.3ZM38.9998 22.65C38.8805 22.65 38.766 22.6974 38.6816 22.7818C38.5972 22.8662 38.5498 22.9807 38.5498 23.1C38.5498 23.2193 38.5972 23.3338 38.6816 23.4182C38.766 23.5026 38.8805 23.55 38.9998 23.55H40.3507C40.4701 23.55 40.5845 23.5026 40.6689 23.4182C40.7533 23.3338 40.8007 23.2193 40.8007 23.1C40.8007 22.9807 40.7533 22.8662 40.6689 22.7818C40.5845 22.6974 40.4701 22.65 40.3507 22.65H38.9998ZM45.5482 21.3C45.4646 21.2163 45.3654 21.1499 45.2561 21.1046C45.1468 21.0594 45.0297 21.036 44.9115 21.036C44.7932 21.036 44.6761 21.0594 44.5668 21.1046C44.4576 21.1499 44.3583 21.2163 44.2747 21.3L40.4821 25.0926C40.4403 25.1345 40.4072 25.1842 40.3847 25.2388C40.3622 25.2935 40.3506 25.3521 40.3507 25.4112V27.15C40.3507 27.2693 40.3981 27.3838 40.4825 27.4682C40.5669 27.5526 40.6814 27.6 40.8007 27.6H42.5395C42.5986 27.6001 42.6572 27.5886 42.7119 27.566C42.7665 27.5435 42.8162 27.5104 42.8581 27.4686L46.6507 23.676C46.7344 23.5924 46.8008 23.4932 46.8461 23.3839C46.8913 23.2746 46.9147 23.1575 46.9147 23.0392C46.9147 22.921 46.8913 22.8039 46.8461 22.6946C46.8008 22.5853 46.7344 22.4861 46.6507 22.4025L45.5482 21.3Z" fill="white"></path>
                              </g>
                            </svg>
                          </div>
                        </div>
                        <div className="text-left shrink">
                          <p className="text-sm font-medium text-fd-foreground">Criar novo episódio</p>
                          <p className="text-sm font-normal mt-0.5 text-fd-muted-foreground">Cadastre título, descrição, categoria, capa e arquivo de áudio</p>
                        </div>
                        <a data-agent-id="link-_r_8d_" aria-label="Voice Design" className="absolute top-0 right-0 bottom-0 left-0 outline-none rounded-[24px] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring" data-testid="home-voice-design-card" href={`${basePath}/episodios`}></a>
                      </div>
                    </div>
                    
                    {/* Clone your Voice */}
                    <div className="hstack gap-4 h-full w-full -mx-1.5 p-1.5 relative items-center rounded-[16px] bg-[#FFFFFF] dark:bg-fd-background transition duration-200 group">
                      <div className="relative overflow-hidden bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-all duration-200 max-w-[122px] min-w-[122px] flex-1 rounded-[16px] shrink-0 block">
                        <div className="relative w-full pb-[75%]"></div>
                        <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center">
                          <svg width="78" height="48" viewBox="0 0 78 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hue-rotate-180 dark:invert dark:mix-blend-plus-lighter">
                            <g className="md:group-hover:scale-[1.15] md:group-hover:-translate-x-0.5 origin-center transition-all duration-200 ease-in-out">
                              <rect x="8" y="13.2822" width="32" height="32" rx="10" transform="rotate(-15 8 13.2822)" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                              <g clipPath="url(#clip0_100_4687)">
                                <rect width="16" height="16" transform="translate(17.7979 18.9391) rotate(-15)" fill="#2DD28D"></rect>
                                <path d="M28.6659 29.6032C27.9754 30.0059 27.2011 30.2434 26.4035 30.2974C25.606 30.3514 24.8067 30.2204 24.0682 29.9145C23.3297 29.6086 22.6718 29.1361 22.146 28.534C21.6202 27.9319 21.2407 27.2164 21.0371 26.4434C20.8335 25.6704 20.8113 24.8607 20.9722 24.0777C21.1332 23.2947 21.4729 22.5595 21.9649 21.9295C22.4569 21.2994 23.0878 20.7916 23.8085 20.4457C24.5292 20.0998 25.32 19.9251 26.1193 19.9353" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M29.1322 20.3331C29.1831 20.2287 29.2559 20.1364 29.3455 20.0625C29.4351 19.9886 29.5396 19.9348 29.6518 19.9048C29.764 19.8747 29.8814 19.869 29.996 19.8882C30.1106 19.9074 30.2197 19.9509 30.316 20.0159L31.0032 20.4786C31.0048 20.4797 31.0067 20.4803 31.0086 20.4805C31.0105 20.4808 31.0125 20.4805 31.0143 20.4798L31.7712 20.1428C31.8774 20.0955 31.9925 20.0715 32.1087 20.0725C32.2249 20.0735 32.3396 20.0994 32.4449 20.1485C32.5502 20.1976 32.6438 20.2688 32.7193 20.3572C32.7948 20.4455 32.8504 20.5491 32.8824 20.6608L33.1106 21.4569C33.1116 21.4608 33.115 21.464 33.1187 21.4655L33.9152 21.6935C34.3899 21.8297 34.6339 22.354 34.4335 22.8053L34.0961 23.5615C34.0954 23.5634 34.0951 23.5654 34.0954 23.5673C34.0956 23.5693 34.0963 23.5712 34.0975 23.5728L34.5608 24.2603C34.8368 24.6692 34.6877 25.2284 34.2436 25.4443L33.4985 25.8071C33.4967 25.8081 33.4951 25.8095 33.494 25.8113C33.4929 25.813 33.4922 25.815 33.4921 25.8171L33.4054 26.6404C33.3547 27.1311 32.8806 27.4635 32.4012 27.3435L31.5971 27.1432C31.5952 27.1427 31.5933 27.1428 31.5914 27.1433C31.5895 27.1438 31.5878 27.1447 31.5863 27.1461L30.9902 27.7216C30.635 28.0652 30.0582 28.0144 29.7689 27.6148L29.283 26.945C29.2818 26.9431 29.2801 26.9417 29.2781 26.9407C29.2761 26.9398 29.2738 26.9395 29.2716 26.9397L28.445 26.9981C28.329 27.0062 28.2126 26.9894 28.1037 26.9486C27.9947 26.9079 27.8958 26.8443 27.8136 26.762C27.7314 26.6797 27.6679 26.5808 27.6272 26.4718C27.5866 26.3629 27.5698 26.2465 27.5781 26.1305L27.6358 25.3042C27.636 25.3022 27.6357 25.3002 27.6349 25.2984C27.6341 25.2966 27.6329 25.295 27.6313 25.2938L26.9608 24.8067C26.8668 24.7384 26.7885 24.6508 26.7313 24.5496C26.6741 24.4485 26.6392 24.3363 26.6291 24.2205C26.619 24.1047 26.6338 23.9882 26.6726 23.8786C26.7114 23.7691 26.7732 23.6691 26.8539 23.5856L27.4298 22.9898C27.4312 22.9883 27.4322 22.9865 27.4327 22.9844C27.4331 22.9824 27.4331 22.9803 27.4325 22.9783L27.2321 22.1748C27.204 22.0621 27.2003 21.9446 27.2215 21.8303C27.2427 21.716 27.2881 21.6076 27.3548 21.5124C27.4215 21.4172 27.5078 21.3374 27.608 21.2784C27.7081 21.2195 27.8198 21.1827 27.9354 21.1706L28.7594 21.084C28.7633 21.0829 28.7669 21.0811 28.7692 21.0772L29.1322 20.3331ZM31.8444 23.1296C31.8707 23.0841 31.8877 23.0338 31.8946 22.9816C31.9015 22.9295 31.898 22.8765 31.8844 22.8257C31.8708 22.7749 31.8473 22.7273 31.8153 22.6855C31.7833 22.6438 31.7433 22.6088 31.6978 22.5825C31.6522 22.5562 31.602 22.5391 31.5498 22.5323C31.4977 22.5254 31.4447 22.5289 31.3939 22.5425C31.3431 22.5561 31.2954 22.5796 31.2537 22.6116C31.212 22.6436 31.177 22.6836 31.1507 22.7291L30.3612 24.0977L29.973 23.8729C29.881 23.8198 29.7717 23.8054 29.6691 23.8329C29.5665 23.8604 29.479 23.9275 29.4259 24.0195C29.3728 24.1115 29.3584 24.2208 29.3859 24.3234C29.4134 24.426 29.4805 24.5135 29.5725 24.5666L30.1347 24.8905C30.2724 24.9699 30.4361 24.9914 30.5896 24.9503C30.7432 24.9091 30.8742 24.8087 30.9538 24.671L31.8444 23.1296Z" fill="white"></path>
                              </g>
                            </g>
                            <g className="md:group-hover:scale-[1.15] md:group-hover:translate-x-0.5 origin-center transition-all duration-200 ease-in-out">
                              <rect x="39.4741" y="4" width="32" height="32" rx="10" transform="rotate(15 39.4741 4)" fill="#2DD28D" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                              <g clipPath="url(#clip1_100_4687)">
                                <rect width="16" height="16" transform="translate(45.1309 13.798) rotate(15)" fill="#2DD28D"></rect>
                                <path d="M49.211 28.4674C48.4117 28.4708 47.6223 28.2894 46.9046 27.9374C46.1869 27.5854 45.5603 27.0722 45.0737 26.4381C44.587 25.8039 44.2535 25.0658 44.0992 24.2814C43.9449 23.4971 43.974 22.6877 44.1842 21.9164C44.3944 21.1452 44.7799 20.4329 45.3108 19.8353C45.8417 19.2377 46.5035 18.7708 47.2446 18.4712C47.9857 18.1716 48.7861 18.0473 49.5831 18.108C50.3802 18.1688 51.1524 18.4129 51.8396 18.8214" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M55.6452 20.922C55.7986 20.3494 55.1165 19.9248 54.6702 20.3171L50.3012 24.1563C50.2197 24.228 50.1591 24.3205 50.1259 24.4239C50.0928 24.5273 50.0884 24.6378 50.1131 24.7435C50.1378 24.8493 50.1907 24.9463 50.2663 25.0243C50.3418 25.1024 50.4371 25.1584 50.542 25.1865L52.6925 25.7628L52.1128 27.9264C51.9593 28.499 52.6423 28.9239 53.0886 28.5316L57.4575 24.6924C57.5391 24.6207 57.5997 24.5282 57.6328 24.4248C57.666 24.3214 57.6704 24.2109 57.6457 24.1051C57.621 23.9994 57.568 23.9023 57.4925 23.8243C57.417 23.7463 57.3217 23.6903 57.2168 23.6621L55.0655 23.0857L55.6452 20.922Z" fill="white"></path>
                              </g>
                            </g>
                            <defs>
                              <clipPath id="clip0_100_4687"><rect width="16" height="16" fill="white" transform="translate(17.7979 18.9391) rotate(-15)"></rect></clipPath>
                              <clipPath id="clip1_100_4687"><rect width="16" height="16" fill="white" transform="translate(45.1309 13.798) rotate(15)"></rect></clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div className="text-left shrink">
                          <p className="text-sm font-medium text-gray-950 dark:text-gray-100">Editar episódio</p>
                          <p className="text-sm font-normal mt-0.5 text-gray-500 dark:text-gray-400">Atualize informações, convidados, capa e status de publicação</p>
                      </div>
                      <a className="absolute top-0 right-0 bottom-0 left-0 outline-none rounded-[24px]" href={`${basePath}/episodios`}></a>
                    </div>

                    <div className="h-full @container group">
                      <div className="hstack gap-4 h-full w-full -mx-1.5 p-1.5 relative items-center rounded-[16px] bg-[#FFFFFF] dark:bg-fd-background transition duration-200 min-h-[92px]">
                        <div className="relative overflow-hidden bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-all duration-200 max-w-[122px] min-w-[122px] flex-1 rounded-[16px] shrink-0 block">
                          <div className="relative w-full pb-[75%]"></div>
                          <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center [&_svg]:max-w-[90%]">
                            <svg width="78" height="48" viewBox="0 0 78 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="dark:hue-rotate-180 dark:invert dark:mix-blend-plus-lighter">
                              <g className="md:group-hover:scale-[1.15] md:group-hover:-translate-x-0.5 origin-center transition-all duration-200 ease-in-out">
                                <rect x="7" y="12.2822" width="32" height="32" rx="10" transform="rotate(-15 7 12.2822)" fill="url(#pattern0_100_4678)" className="dark:hue-rotate-180 dark:invert"></rect>
                                <rect x="7" y="12.2822" width="32" height="32" rx="10" transform="rotate(-15 7 12.2822)" fill="url(#paint0_linear_100_4678)" fillOpacity="0.8"></rect>
                                <rect x="7" y="12.2822" width="32" height="32" rx="10" transform="rotate(-15 7 12.2822)" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                              </g>
                              <g className="md:group-hover:scale-[1.15] md:group-hover:translate-x-0.5 origin-center transition-all duration-200 ease-in-out">
                                <rect x="39.4741" y="4.42325" width="32" height="32" rx="10" transform="rotate(15 39.4741 4.42325)" fill="#5D79DF" stroke="#F3F4F6" strokeWidth="2.5" className="md:group-hover:stroke-[#E5E7EB] transition-all duration-200 ease-in-out"></rect>
                                <g clipPath="url(#clip0_100_4678)">
                                  <path d="M48.9429 18.3485C48.7192 18.2834 48.4847 18.2636 48.2532 18.2903C48.0217 18.317 47.7979 18.3897 47.5949 18.504C47.3918 18.6184 47.2137 18.7721 47.0708 18.9562C46.928 19.1403 46.8234 19.3511 46.7631 19.5762C46.7027 19.8012 46.688 20.0361 46.7196 20.2669C46.7513 20.4978 46.8287 20.72 46.9474 20.9205C47.066 21.1211 47.2235 21.2959 47.4106 21.4348C47.5978 21.5737 47.8107 21.6738 48.037 21.7292C48.4816 21.8382 48.9512 21.7687 49.3452 21.5356C49.7391 21.3025 50.0261 20.9244 50.1446 20.4822C50.263 20.0401 50.2036 19.5691 49.979 19.1702C49.7543 18.7714 49.3824 18.4764 48.9429 18.3485ZM45.8332 19.3274C45.9266 18.9786 46.0879 18.6516 46.3077 18.3651C46.5276 18.0786 46.8017 17.8382 47.1145 17.6576C47.4272 17.477 47.7725 17.3598 48.1305 17.3127C48.4886 17.2655 48.8524 17.2894 49.2012 17.3829C49.55 17.4763 49.8771 17.6376 50.1636 17.8574C50.4501 18.0773 50.6905 18.3514 50.871 18.6642C51.0516 18.9769 51.1688 19.3222 51.2159 19.6802C51.2631 20.0383 51.2392 20.4021 51.1458 20.7509C50.957 21.4554 50.4961 22.0561 49.8645 22.4207C49.2328 22.7854 48.4822 22.8842 47.7777 22.6955C47.0732 22.5067 46.4726 22.0458 46.1079 21.4142C45.7432 20.7825 45.6444 20.0319 45.8332 19.3274ZM47.2606 24.627C47.0368 24.5619 46.8023 24.5421 46.5709 24.5688C46.3394 24.5956 46.1156 24.6682 45.9125 24.7826C45.7095 24.8969 45.5314 25.0506 45.3885 25.2347C45.2457 25.4188 45.141 25.6296 45.0807 25.8547C45.0204 26.0797 45.0057 26.3146 45.0373 26.5455C45.069 26.7763 45.1464 26.9985 45.265 27.1991C45.3837 27.3996 45.5412 27.5744 45.7283 27.7133C45.9154 27.8522 46.1284 27.9523 46.3547 28.0078C46.7993 28.1168 47.2689 28.0473 47.6628 27.8142C48.0568 27.5811 48.3438 27.2029 48.4622 26.7607C48.5807 26.3186 48.5213 25.8476 48.2966 25.4488C48.072 25.0499 47.7001 24.7549 47.2606 24.627ZM44.1508 25.6059C44.2443 25.2571 44.4056 24.9301 44.6254 24.6436C44.8453 24.3571 45.1194 24.1167 45.4321 23.9361C45.7449 23.7555 46.0901 23.6383 46.4482 23.5912C46.8062 23.5441 47.1701 23.5679 47.5189 23.6614C47.8677 23.7549 48.1947 23.9161 48.4812 24.136C48.7677 24.3558 49.0081 24.6299 49.1887 24.9427C49.3693 25.2554 49.4865 25.6007 49.5336 25.9587C49.5808 26.3168 49.5569 26.6806 49.4634 27.0294C49.2747 27.7339 48.8138 28.3346 48.1821 28.6992C47.5505 29.0639 46.7999 29.1627 46.0954 28.974C45.3909 28.7852 44.7902 28.3243 44.4256 27.6927C44.0609 27.061 43.9621 26.3104 44.1508 25.6059ZM55.2214 20.0308C54.9977 19.9657 54.7632 19.9459 54.5317 19.9727C54.3002 19.9994 54.0764 20.072 53.8734 20.1864C53.6704 20.3007 53.4922 20.4544 53.3494 20.6385C53.2065 20.8226 53.1019 21.0334 53.0416 21.2585C52.9813 21.4836 52.9665 21.7184 52.9982 21.9493C53.0298 22.1801 53.1072 22.4023 53.2259 22.6029C53.3445 22.8034 53.502 22.9782 53.6892 23.1171C53.8763 23.256 54.0892 23.3561 54.3155 23.4116C54.7601 23.5206 55.2297 23.4511 55.6237 23.218C56.0176 22.9849 56.3046 22.6067 56.4231 22.1646C56.5416 21.7224 56.4821 21.2514 56.2575 20.8526C56.0329 20.4537 55.6609 20.1587 55.2214 20.0308ZM52.1117 21.0097C52.3005 20.3052 52.7614 19.7046 53.393 19.3399C54.0246 18.9752 54.7752 18.8764 55.4797 19.0652C56.1842 19.254 56.7849 19.7149 57.1496 20.3465C57.5142 20.9781 57.613 21.7287 57.4243 22.4332C57.2355 23.1377 56.7746 23.7384 56.143 24.1031C55.5114 24.4677 54.7607 24.5665 54.0562 24.3778C53.3517 24.189 52.7511 23.7281 52.3864 23.0965C52.0217 22.4649 51.9229 21.7142 52.1117 21.0097ZM53.5391 26.3093C53.3153 26.2442 53.0809 26.2245 52.8494 26.2512C52.6179 26.2779 52.3941 26.3505 52.1911 26.4649C51.988 26.5792 51.8099 26.7329 51.667 26.9171C51.5242 27.1012 51.4196 27.3119 51.3592 27.537C51.2989 27.7621 51.2842 27.9969 51.3158 28.2278C51.3475 28.4586 51.4249 28.6808 51.5436 28.8814C51.6622 29.0819 51.8197 29.2568 52.0068 29.3956C52.1939 29.5345 52.4069 29.6346 52.6332 29.6901C53.0778 29.7991 53.5474 29.7296 53.9414 29.4965C54.3353 29.2634 54.6223 28.8852 54.7408 28.4431C54.8592 28.0009 54.7998 27.5299 54.5752 27.1311C54.3505 26.7322 53.9786 26.4372 53.5391 26.3093ZM50.4294 27.2882C50.6181 26.5838 51.079 25.9831 51.7107 25.6184C52.3423 25.2538 53.0929 25.1549 53.7974 25.3437C54.5019 25.5325 55.1026 25.9934 55.4672 26.625C55.8319 27.2566 55.9307 28.0073 55.742 28.7118C55.5532 29.4162 55.0923 30.0169 54.4607 30.3816C53.829 30.7462 53.0784 30.8451 52.3739 30.6563C51.6694 30.4675 51.0688 30.0066 50.7041 29.375C50.3394 28.7434 50.2406 27.9927 50.4294 27.2882Z" fill="white"></path>
                                </g>
                              </g>
                              <defs>
                                <pattern id="pattern0_100_4678" patternContentUnits="objectBoundingBox" width="1" height="1">
                                  <use xlinkHref="#image0_100_4678" transform="translate(-0.39153) scale(0.00148588)"></use>
                                </pattern>
                                <linearGradient id="paint0_linear_100_4678" x1="23" y1="12.2822" x2="23" y2="44.2822" gradientUnits="userSpaceOnUse">
                                  <stop stopColor="#3B7DCA" stopOpacity="0"></stop>
                                  <stop offset="1" stopColor="#3B7DCA"></stop>
                                </linearGradient>
                                <clipPath id="clip0_100_4678">
                                  <rect width="16" height="16" fill="white" transform="translate(45.1309 14.2212) rotate(15)"></rect>
                                </clipPath>
                                <image id="image0_100_4678" width="1200" height="673" xlinkHref="/images/home/voice-collections.png"></image>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <div className="text-left shrink">
                          <p className="text-sm font-medium text-fd-foreground">Excluir episódio</p>
                          <p className="text-sm font-normal mt-0.5 text-fd-muted-foreground">Remova episódios de teste, duplicados ou conteúdos que não serão publicados</p>
                        </div>
                        <a data-agent-id="link-_r_8f_" aria-label="Voice Collections" className="absolute top-0 right-0 bottom-0 left-0 outline-none rounded-[24px] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring" data-testid="home-instant-voice-cloning-card" href={`${basePath}/episodios`}></a>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
