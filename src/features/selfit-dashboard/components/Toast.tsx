import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ToastMessage } from '../types';

export function Toast({ toast }: { toast: NonNullable<ToastMessage> }) {
  const isSuccess = toast.type === 'success';

  return (
    <div className={`mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${isSuccess ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
      {isSuccess ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <AlertCircle className="mt-0.5 h-4 w-4" />}
      {toast.text}
    </div>
  );
}
