'use client';

import * as React from 'react';
import { useSidebar } from '@xispedocs/ui/contexts/sidebar';
import { PodcastFeedback } from './PodcastFeedback';
import { PodcastNotifications } from './PodcastNotifications';
import { PodcastUserMenu } from './PodcastUserMenu';
import { cn } from '@xispedocs/ui/utils/cn';

export function PodcastHeader() {
  const { collapsed, setCollapsed, setOpen } = useSidebar();
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const totalCredits = 10000;
  const remainingCredits = 8634;
  const usagePercentage = Math.round((1 - (remainingCredits / totalCredits)) * 100);

  const showProgress = isDesktopMenuOpen || isMobileMenuOpen || isHovered;

  const userButtonContent = (
    <div 
      className="shrink-0 relative transition-transform duration-150"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Progress Bars (Always visible) */}
        <div className="flex relative" style={{ opacity: 1 }}>
          <div className="absolute opacity-100 transition-opacity duration-300 [transform:rotate(18deg)] css-zrlz9h" aria-valuemax={100} aria-valuemin={0} aria-valuenow={9} role="progressbar">
            <svg viewBox="0 0 100 100" className="css-1vrjaj6">
              <circle cx="50" cy="50" r="42" strokeWidth="6px" className="css-nj4szp" fill="none"></circle>
              <circle cx="50" cy="50" r="42" strokeWidth="6px" className="css-1xtv0dr" fill="none" strokeLinecap="round" strokeDashoffset="66" strokeDasharray="23.76 240.24"></circle>
            </svg>
          </div>
          <div className="!absolute left-0 top-0 opacity-100 transition-opacity duration-300 [transform:rotateY(180deg)] css-zrlz9h" aria-valuemax={100} aria-valuemin={0} aria-valuenow={81} role="progressbar">
            <svg viewBox="0 0 100 100" className="css-1vrjaj6">
              <circle cx="50" cy="50" r="42" strokeWidth="6px" className="css-nj4szp" fill="none"></circle>
              <circle cx="50" cy="50" r="42" strokeWidth="6px" className="css-i93dgl" fill="none" strokeLinecap="round" strokeDashoffset="66" strokeDasharray="213.84 50.16"></circle>
            </svg>
          </div>
        </div>

        {/* Percentage overlay - only visible on hover/open */}
        <div className="transition-opacity duration-300" style={{ opacity: showProgress ? 1 : 0 }}>
          <div className="css-f1j64i">
            <span className="text-[10px] font-bold text-foreground">{usagePercentage}%</span>
          </div>
        </div>

        {/* User Image (Scaled down, hidden on hover/open in favor of percentage) */}
        <div 
          className="absolute top-0 left-0 h-full w-full rounded-full p-px transition-all duration-300" 
          style={{ 
            opacity: showProgress ? 0 : 1, 
            transform: 'scale(0.65)' 
          }}
        >
          <img 
            alt="Ramon Santos" 
            src="https://lh3.googleusercontent.com/a/ACg8ocLh2UMVOoVbJW7Zwn-aCrzgGvZ6WwAAZjvsfIDxv-EZ0QojDjA=s96-c" 
            className="rounded-full shrink-0 bg-gray-50 object-cover h-full w-full" 
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Header */}
      <header 
        className="hidden lg:block fixed top-0 right-0 transition-[width] duration-150 group/header-fixed z-[30] border-b border-gray-alpha-150" 
        style={{ width: `calc(100% - ${collapsed ? '64px' : 'var(--eleven-sidebar-width)'})` }}
      >
        <div className="h-[var(--eleven-header-height)] w-full mx-auto hstack items-center gap-2 bg-[#FFFFFF] dark:bg-[#121212] px-2.5">
          <button 
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-ring disabled:pointer-events-auto bg-transparent hover:bg-gray-alpha-100 active:bg-gray-alpha-200 rounded-[10px] pointer-events-auto cursor-e-resize p-0 h-8 w-8 text-gray-500 hover:text-foreground duration-100 transition-colors shrink-0"
          >
            {collapsed ? (
              <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="w-5 h-5">
                <rect x="10.5" y="6.5" width="7" height="5" rx="1" transform="rotate(90 10.5 6.5)" fill="currentColor"></rect>
                <rect x="3" y="4" width="14" height="12" rx="2.8" stroke="currentColor" strokeWidth="1.5"></rect>
              </svg>
            ) : (
              <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="w-5 h-5">
                <rect x="7" y="6.5" width="7" height="1.5" rx="0.75" transform="rotate(90 7 6.5)" fill="currentColor"></rect>
                <rect x="3" y="4" width="14" height="12" rx="2.8" stroke="currentColor" strokeWidth="1.5"></rect>
              </svg>
            )}
          </button>
          
          <div className="hstack gap-1.5 items-center whitespace-nowrap min-w-0 overflow-hidden w-full py-1 px-1 -mr-1">
            <div className="shrink-0">
              <p data-testid="page-title" className="text-sm text-foreground font-medium truncate">Início</p>
            </div>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="hstack items-center max-h-full w-fit gap-2 empty:hidden">
            <div className="contents">
              <div className="hidden lg:contents">
                <PodcastFeedback>
                  <button className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none h-8 px-2.5 text-sm rounded-[0.6rem]">
                    Feedback
                  </button>
                </PodcastFeedback>

                <a href="https://elevenlabs.io/docs/introduction" target="_blank" className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none h-8 px-2.5 text-sm rounded-[0.6rem]">
                  Documentação
                </a>

                <button className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none h-8 px-2.5 text-sm flex-shrink-0 hidden lg:inline-flex rounded-[0.6rem]">
                  <svg width="16px" height="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="shrink-0 w-4 h-4 text-[inherit] opacity-100 -ml-[3px] mr-[5px]">
                    <path d="M13.4937 2.79004L13.0291 1.58215C12.9714 1.4322 12.8273 1.33325 12.6667 1.33325C12.506 1.33325 12.3619 1.4322 12.3043 1.58215L11.8397 2.79004C11.772 2.9661 11.6329 3.10523 11.4568 3.17295L10.2489 3.63753C10.0989 3.6952 10 3.83926 10 3.99992C10 4.16058 10.0989 4.30464 10.2489 4.36231L11.4568 4.82689C11.6329 4.89461 11.772 5.03374 11.8397 5.2098L12.3043 6.41769C12.3619 6.56764 12.506 6.66659 12.6667 6.66659C12.8273 6.66659 12.9714 6.56764 13.0291 6.41769L13.4937 5.2098C13.5613 5.03374 13.7005 4.89461 13.8765 4.82689L15.0845 4.36231C15.2344 4.30464 15.3333 4.16058 15.3333 3.99992C15.3333 3.83926 15.2344 3.6952 15.0845 3.63753L13.8765 3.17295C13.7005 3.10523 13.5613 2.9661 13.4937 2.79004Z" fill="currentColor"></path>
                    <path d="M8.00131 2.66675L4.00128 2.66675C2.89671 2.66675 2.00128 3.56219 2.00128 4.66675V10.0239C2.00128 11.1285 2.89671 12.0239 4.00128 12.0239H5.7677C5.92432 12.0239 6.07593 12.0791 6.19597 12.1797L7.99845 13.6906L9.82512 12.1772C9.94472 12.0781 10.0951 12.0239 10.2504 12.0239H12.0013C13.1058 12.0239 14.0013 11.1285 14.0013 10.0239V8.67868" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  Perguntar
                </button>
              </div>
            </div>

            <button aria-label="Files" className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none center p-0 h-8 w-8 shrink-0 rounded-[0.6rem] [&>div]:w-4 [&>div]:h-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-closed shrink-0 w-4 h-4">
                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                <path d="M2 10h20"></path>
              </svg>
            </button>

            <PodcastNotifications>
              <button aria-label="Notificações" className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none center p-0 h-8 w-8 shrink-0 rounded-[0.6rem] [&>div]:w-4 [&>div]:h-4">
                <div className="shrink-0 w-4 h-4 relative w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                    <path d="M16.875 13.5367C16.875 13.9997 16.4997 14.375 16.0368 14.375H3.96327C3.50031 14.375 3.125 13.9997 3.125 13.5367C3.125 13.4031 3.15696 13.2713 3.21822 13.1526L4.1665 11.3134C4.32966 10.997 4.42335 10.6494 4.44131 10.2938L4.58626 7.42413C4.7305 4.54901 7.11155 2.29166 10 2.29166C12.8884 2.29166 15.2695 4.54901 15.4137 7.42413L15.5587 10.2938C15.5767 10.6494 15.6703 10.997 15.8335 11.3134L16.7817 13.1526C16.843 13.2713 16.875 13.4031 16.875 13.5367Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M13.3332 14.375C13.3332 16.2159 11.8408 17.7083 9.99984 17.7083C8.15889 17.7083 6.6665 16.2159 6.6665 14.375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </button>
            </PodcastNotifications>

            <PodcastUserMenu open={isDesktopMenuOpen} onOpenChange={setIsDesktopMenuOpen}>
              <button data-testid="user-menu-button" aria-label="Seu perfil" className="group w-full relative group items-center gap-0.5 h-10 w-10 justify-between flex rounded-lg text-sm leading-6 font-semibold outline-foreground transition-all duration-150">
                {userButtonContent}
              </button>
            </PodcastUserMenu>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 h-[calc(var(--eleven-header-height)+var(--eleven-banner-height)+var(--eleven-mobile-tabs-height))] w-full bg-[#FFFFFF] dark:bg-[#121212] stack z-[30]">
        <div className="w-full hstack px-2.5 border-b">
          <div className="h-[var(--eleven-header-height)] hstack items-center gap-2">
            <button 
              aria-label="Abrir lateral" 
              onClick={() => setOpen(true)}
              className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-ring bg-transparent hover:bg-gray-alpha-100 active:bg-gray-alpha-200 rounded-xl center p-0 h-10 w-10 text-gray-500 hover:text-foreground duration-100 transition-colors"
            >
              <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" className="shrink-0 w-5 h-5">
                <rect x="10.5" y="6.5" width="7" height="5" rx="1" transform="rotate(90 10.5 6.5)" fill="currentColor"></rect>
                <rect x="3" y="4" width="14" height="12" rx="2.8" stroke="currentColor" strokeWidth="1.5"></rect>
              </svg>
            </button>
            <div className="hstack gap-2 items-center">
              <p data-testid="page-title" className="text-sm text-foreground whitespace-nowrap font-medium">Início</p>
            </div>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="shrink-0 hstack items-center gap-1">
            <PodcastNotifications>
              <button aria-label="Notificações" className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 hover:border-gray-alpha-300 text-foreground shadow-none center p-0 h-8 w-8 shrink-0 rounded-[0.6rem] [&>div]:w-4 [&>div]:h-4">
                <div className="shrink-0 w-4 h-4 relative w-5 h-5">
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                    <path d="M16.875 13.5367C16.875 13.9997 16.4997 14.375 16.0368 14.375H3.96327C3.50031 14.375 3.125 13.9997 3.125 13.5367C3.125 13.4031 3.15696 13.2713 3.21822 13.1526L4.1665 11.3134C4.32966 10.997 4.42335 10.6494 4.4411 10.2938L4.58626 7.42413C4.7305 4.54901 7.11155 2.29166 10 2.29166C12.8884 2.29166 15.2695 4.54901 15.4137 7.42413L15.5587 10.2938C15.5767 10.6494 15.6703 10.997 15.8335 11.3134L16.7817 13.1526C16.843 13.2713 16.875 13.4031 16.875 13.5367Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M13.3332 14.375C13.3332 16.2159 11.8408 17.7083 9.99984 17.7083C8.15889 17.7083 6.6665 16.2159 6.6665 14.375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
              </button>
            </PodcastNotifications>
            
            <PodcastUserMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <button aria-label="Seu perfil" className="relative shrink-0 rounded-full focus-ring transition-all duration-150">
                {userButtonContent}
              </button>
            </PodcastUserMenu>
          </div>
        </div>
      </header>
    </>
  );
}
