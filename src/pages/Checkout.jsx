import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, MapPin, Phone, User, CreditCard, ChevronLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import apiClient from '../api/apiClient';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cartItems, cartCount, clearCart } = useContext(CartContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [verifiedOrder, setVerifiedOrder] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        setCurrentUser(parsed);
        setShippingAddress((prev) => ({
          ...prev,
          fullName: parsed.name || '',
        }));
      } catch (e) {
        console.error('Error parsing token', e);
      }
    }
  }, []);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // If cart is empty and payment has not succeeded yet, send user back to products
  useEffect(() => {
    if (cartItems.length === 0 && !paymentSuccess) {
      const timer = setTimeout(() => {
        navigate('/products');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, paymentSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { fullName, phone, addressLine1, city, state, pinCode } = shippingAddress;
    if (!fullName || !phone || !addressLine1 || !city || !state || !pinCode) {
      addToast('Please fill out all required shipping fields', 'error');
      return false;
    }
    if (phone.length < 10) {
      addToast('Please enter a valid phone number', 'error');
      return false;
    }
    if (pinCode.length < 6) {
      addToast('Please enter a valid pincode', 'error');
      return false;
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Load Razorpay SDK Script
      const resScript = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!resScript) {
        addToast('Failed to load Razorpay SDK. Please check your connection.', 'error');
        setLoading(false);
        return;
      }

      // 2. Create Order on our backend
      const orderPayload = {
        amount: cartTotal,
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || '',
        })),
        shippingAddress,
      };

      const { data } = await apiClient.post('/orders', orderPayload);

      if (!data.success) {
        throw new Error('Order creation failed on server');
      }

      // 3. Open Razorpay payment checkout
      const options = {
        key: data.keyId, // Razorpay public key ID
        amount: data.amount, // in paise
        currency: data.currency,
        name: 'Velora Cart',
        description: 'Payment for your order',
        order_id: data.orderId,
        handler: async (response) => {
          setLoading(true);
          try {
            // 4. Verify payment signature on backend
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await apiClient.post('/orders/verify', verificationPayload);

            if (verifyRes.data.success) {
              setPaymentSuccess(true);
              setVerifiedOrder(verifyRes.data.order);
              clearCart();
              addToast('Payment completed successfully!', 'success');
            } else {
              addToast('Payment signature verification failed.', 'error');
            }
          } catch (err) {
            console.error('Verification error', err);
            addToast(err.response?.data?.message || 'Error verifying payment details.', 'error');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: currentUser?.email || '',
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#2563EB',
        },
        modal: {
          ondismiss: () => {
            addToast('Payment cancelled by user.', 'warning');
            setLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error', error);
      addToast(error.response?.data?.message || error.message || 'An error occurred during checkout.', 'error');
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground py-16 flex items-center justify-center">
        <div className="w-full max-w-2xl px-4">
          <div className="bg-card rounded-3xl border border-border p-8 md:p-12 text-center shadow-xl relative overflow-hidden glass">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -mt-36 pointer-events-none"></div>

            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner scale-110">
              <ShieldCheck size={44} />
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
              Order Placed Successfully!
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Thank you for your purchase. Your payment was verified and your order is now being processed.
            </p>

            {verifiedOrder && (
              <div className="bg-muted/40 border border-border/60 rounded-2xl p-6 text-left mb-8 max-w-md mx-auto space-y-3">
                <div className="flex justify-between border-b border-border pb-2 text-sm text-muted-foreground font-medium">
                  <span>Order ID:</span>
                  <span className="text-foreground font-mono">{verifiedOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2 text-sm text-muted-foreground font-medium">
                  <span>Payment ID:</span>
                  <span className="text-foreground font-mono">{verifiedOrder.paymentId}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground font-medium">
                  <span>Total Amount Paid:</span>
                  <span className="text-foreground font-bold">₹{verifiedOrder.amount?.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/profile')}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-98"
              >
                Go to My Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-8 py-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl border border-border transition-all active:scale-98"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground py-20 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={80} className="text-muted-foreground opacity-20 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Redirecting you to the products page...</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2.5 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 lg:py-20 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-200 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-bold text-foreground">Processing Payment...</p>
          <p className="text-sm text-muted-foreground">Please do not refresh or close the page.</p>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-semibold mb-8 group transition-colors"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 border border-border bg-card/40 glass rounded-3xl p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MapPin className="text-blue-500" size={24} /> Shipping Information
            </h2>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="John Doe"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-muted/40 border border-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="9876543210"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-muted/40 border border-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Address Line 1 *</label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  placeholder="Flat No, House Name, Street"
                  value={shippingAddress.addressLine1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-muted-foreground mb-2">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Landmark, Area, Locality"
                  value={shippingAddress.addressLine2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Mumbai"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="Maharashtra"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">Pin Code *</label>
                  <input
                    type="text"
                    name="pinCode"
                    required
                    placeholder="400001"
                    value={shippingAddress.pinCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-foreground font-medium"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-8">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-98 flex items-center justify-center gap-3 text-lg"
                >
                  <CreditCard size={20} /> Pay with Razorpay <ArrowRight size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-5 border border-border bg-card/25 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 h-fit">
            <h2 className="text-xl font-bold flex items-center gap-3 border-b border-border pb-4">
              <ShoppingBag size={22} className="text-blue-500" /> Order Summary ({cartCount} items)
            </h2>

            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-muted/20 border border-border/55 rounded-2xl group transition-all hover:bg-muted/30">
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1 justify-center">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1">{item.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className="text-emerald-500 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-4 text-foreground">
                <span>Grand Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex gap-3 text-xs text-blue-600 dark:text-blue-400">
              <ShieldCheck size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Secure Checkout</p>
                <p className="mt-0.5 opacity-90">Your payment information is encrypted and processed securely by Razorpay.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
