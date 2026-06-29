import { useContext } from 'react';
import { X, Trash2, Heart, ArrowRight } from 'lucide-react';
import { WishlistContext } from '../../context/WishlistContext';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const WishlistDrawer = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist, wishlistCount } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

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
            <Heart size={24} className="text-red-500 fill-current" />
            <h2 className="text-xl font-bold">Your Wishlist ({wishlistCount})</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4">
              <Heart size={64} className="opacity-20" />
              <p className="text-xl font-medium">Your wishlist is empty</p>
              <button 
                onClick={() => {
                  onClose();
                  navigate('/products');
                }}
                className="mt-4 px-6 py-2.5 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-colors"
              >
                Discover Products
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-2xl border border-border group relative transition-all hover:bg-muted/50">
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-white shadow-sm shrink-0 cursor-pointer" onClick={() => { onClose(); navigate(`/products/${item.id}`); }}>
                  <img 
                    src={item.images?.[0] || item.cleanImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                  />
                </div>
                
                <div className="flex flex-col flex-1 justify-between py-1">
                  <div>
                    <h3 
                      className="font-semibold text-foreground line-clamp-1 cursor-pointer hover:text-blue-500 transition-colors"
                      onClick={() => { onClose(); navigate(`/products/${item.id}`); }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(item.id);
                    }}
                    className="mt-3 px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-lg hover:bg-foreground/90 transition-colors self-start shadow-sm"
                  >
                    Add to Cart
                  </button>
                </div>

                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute -top-3 -right-3 p-2 bg-background border border-border text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-md scale-95 group-hover:scale-100"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;
