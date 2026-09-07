import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgClass = 'bg-white border-slate-200 text-slate-800';
        let iconColor = 'text-emerald-500';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          bgClass = 'bg-red-50 border-red-200 text-red-900';
          iconColor = 'text-red-500';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgClass = 'bg-amber-50 border-amber-200 text-amber-900';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          bgClass = 'bg-slate-900 border-slate-800 text-white';
          iconColor = 'text-sky-400';
        }

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto rounded-xl border p-3.5 shadow-md flex items-center justify-between gap-3 text-xs transition-all ${bgClass}`}
          >
            <div className="flex items-center space-x-2.5">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <span className="font-medium leading-tight">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
