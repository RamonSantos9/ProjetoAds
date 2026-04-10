'use client';

import { useEffect } from 'react';

export default function CallbackPopupPage() {
  useEffect(() => {
    // 1. A prova definitiva: gravar no LocalStorage aciona um evento automático em todas as outras abas do mesmo domínio
    try {
      localStorage.setItem('auth-status', `success-${Date.now()}`);
    } catch (e) {
      console.error("Local storage error:", e);
    }
    
    // 2. Tenta o postMessage original como backup
    if (typeof window !== 'undefined' && window.opener) {
      try {
        window.opener.postMessage('auth-success', window.location.origin);
      } catch (e) {}
    }
    
    // 3. Fecha a janela o mais rápido possível
    const timer = setTimeout(() => {
      window.close();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-8 h-8 border-4 border-fd-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-medium text-muted-foreground">Autenticação bem-sucedida!</p>
      <p className="text-xs text-muted-foreground/60 mt-1">Esta janela fechará automaticamente.</p>
    </div>
  );
}
