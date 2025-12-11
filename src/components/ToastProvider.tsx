"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

type ToastType = "info" | "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const typeStyles: Record<ToastType, string> = {
  info: "bg-slate-800 text-slate-100 border border-slate-600",
  success: "bg-emerald-600/90 text-white",
  error: "bg-rose-600/90 text-white",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, number>>({});

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = window.setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      Object.values(timersMap).forEach((timer) =>
        window.clearTimeout(timer)
      );
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[220px] rounded-md px-4 py-2 text-sm shadow-lg shadow-black/30 transition ${typeStyles[toast.type]}`}
          >
            <div className="flex items-start gap-2">
              <span className="flex-1">{toast.message}</span>
              <button
                aria-label="Dismiss toast"
                className="text-xs uppercase tracking-wide text-white/70 hover:text-white"
                onClick={() => removeToast(toast.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx.showToast;
}
