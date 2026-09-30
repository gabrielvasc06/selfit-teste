import { X } from 'lucide-react';
import { useEffect } from 'react';

function Modal({ open, title, subtitle, onClose, children, footer }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[8px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[calc(92vh-150px)] overflow-y-auto p-6">{children}</div>
        {footer ? <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}

export default Modal;
