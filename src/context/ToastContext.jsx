import { createContext, useState, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X, Check } from 'lucide-react';

export const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [centerModal, setCenterModal] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(false);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const showConfirmModal = useCallback((props) => {
    setCenterModal(props);
    setModalSuccess(false);
  }, []);

  const closeConfirmModal = useCallback(() => {
    setCenterModal(null);
    setModalSuccess(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (centerModal?.onConfirm) {
      centerModal.onConfirm();
    }
    setModalSuccess(true);
  }, [centerModal]);

  return (
    <ToastContext.Provider value={{ addToast, showConfirmModal, closeConfirmModal }}>
      {children}
      
      {/* Bottom Right Generic Toasts */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="flex items-center gap-3 bg-card border border-border shadow-xl px-5 py-4 rounded-2xl pointer-events-auto min-w-[320px] max-w-sm transition-all animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)]"
          >
            {toast.type === 'success' && <CheckCircle className="text-green-500 shrink-0" size={24} />}
            {toast.type === 'error' && <XCircle className="text-red-500 shrink-0" size={24} />}
            {toast.type === 'info' && <Info className="text-blue-500 shrink-0" size={24} />}
            <span className="text-foreground font-semibold flex-1 text-sm tracking-wide">{toast.message}</span>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
              className="text-muted-foreground hover:text-foreground transition-colors p-1 pointer-events-auto"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Center Modal for Confirm Order */}
      {centerModal && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-background/60 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-card w-full max-w-sm m-4 p-8 rounded-4xl shadow-2xl border border-border flex flex-col items-center text-center animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)] relative">
            
            {modalSuccess ? (
              <div className="flex flex-col items-center w-full animate-[fadeIn_0.4s_ease-out]">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="text-green-500" size={48} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">Order Successful!</h3>
                <p className="text-muted-foreground mb-8 text-sm">Thank you for your purchase. We'll send you an update shortly.</p>
                <button 
                  onClick={closeConfirmModal}
                  className="w-full bg-foreground text-background font-bold py-4 rounded-xl hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <button 
                  onClick={closeConfirmModal} 
                  className="absolute top-5 right-5 text-muted-foreground hover:text-foreground bg-muted p-2 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Info className="text-blue-500" size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{centerModal.title || 'Confirm Order'}</h3>
                <p className="text-muted-foreground mb-8 text-sm">{centerModal.message}</p>
                
                <div className="flex flex-col gap-3 w-full mt-2">
                  <button 
                    onClick={handleConfirm}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5"
                  >
                    Confirm Order
                  </button>
                  <button 
                    onClick={closeConfirmModal}
                    className="w-full bg-transparent border-2 border-border text-foreground font-bold py-3.5 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* Inject custom keyframes for neat professional animations */}
      <style>{`
        @keyframes slideInRight {
          0% { transform: translateX(100%) scale(0.95); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
