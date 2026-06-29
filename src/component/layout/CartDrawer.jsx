import { useContext } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-100 transition-opacity animate-[fadeIn_0.3s_ease-out]"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-card shadow-2xl z-110 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3 text-foreground">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold">Your Cart ({cartCount})</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4">
              <ShoppingBag size={64} className="opacity-20" />
              <p className="text-xl font-medium">Your cart is empty</p>
              <button 
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
                className="mt-4 px-6 py-2.5 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-2xl border border-border group relative transition-all hover:bg-muted/50">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
                  <img 
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex flex-col flex-1 justify-between py-1">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg bg-background shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute -top-3 -right-3 p-2 bg-background border border-border text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-md scale-95 group-hover:scale-100"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border bg-card/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <span className="text-muted-foreground font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-foreground">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
