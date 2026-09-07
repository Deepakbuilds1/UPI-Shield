import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [justReconnected, setJustReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 3500);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/health', { method: 'GET', cache: 'no-store' });
      if (res.ok) {
        setIsOffline(false);
        setJustReconnected(true);
        setTimeout(() => setJustReconnected(false), 3500);
      } else {
        setIsOffline(true);
      }
    } catch {
      setIsOffline(true);
    } finally {
      setIsChecking(false);
    }
  };

  if (justReconnected) {
    return (
      <aside
        role="status"
        aria-live="polite"
        className="bg-emerald-600 text-white text-xs font-medium px-4 py-2 flex items-center justify-between transition-all"
      >
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>Internet connection restored. Live threat scoring active.</span>
          </div>
        </div>
      </aside>
    );
  }

  if (!isOffline) return null;

  return (
    <aside
      role="alert"
      aria-live="assertive"
      className="bg-amber-500 text-slate-950 text-xs font-medium px-4 py-2.5 shadow-sm border-b border-amber-600/30"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-5 h-5 rounded bg-amber-600/20 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5 text-slate-950" />
          </div>
          <div>
            <strong className="font-semibold">Network Disconnected:</strong>
            <span className="ml-1 text-slate-900">
              You are currently offline. Local heuristic analysis remains active if your local server is reachable.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={checkConnection}
          disabled={isChecking}
          className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 text-white text-[11px] font-semibold hover:bg-slate-800 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Checking...' : 'Check Connection'}</span>
        </button>
      </div>
    </aside>
  );
};
