import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, Settings, PackageOpen, Calendar, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../api/apiClient';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'orders', 'settings'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      try {
        setUser(JSON.parse(token));
      } catch (e) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const response = await apiClient.get('/orders');
          // Sort by newest first
          const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sorted);
        } catch (error) {
          console.error('Error fetching orders:', error);
          addToast('Failed to load order history', 'error');
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, user, addToast]);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    window.dispatchEvent(new Event('authChange'));
    addToast('Logged out successfully', 'success');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground py-12 lg:py-20 animate-[fadeIn_0.4s_ease-out]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="col-span-1 border border-border bg-card/50 glass rounded-3xl p-6 shadow-sm h-fit">
            <div className="flex flex-col items-center pb-6 border-b border-border">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-4xl font-bold shadow-inner mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email || 'user@example.com'}</p>
            </div>
            
            <div className="py-6 flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-colors ${
                  activeTab === 'info' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <User size={20} /> Personal Info
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-colors ${
                  activeTab === 'orders' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <PackageOpen size={20} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <Settings size={20} /> Settings
              </button>
            </div>
            
            <div className="pt-6 border-t border-border">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </div>
          
          {/* Main Info Area */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            {activeTab === 'info' && (
              <div className="border border-border bg-card/50 glass rounded-3xl p-8 shadow-sm relative overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <h3 className="text-2xl font-bold mb-6 relative z-10">Personal Information</h3>
                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <User size={18} />
                        </div>
                        <input type="text" disabled value={user.name} className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none text-foreground font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                          <Mail size={18} />
                        </div>
                        <input type="email" disabled value={user.email || 'N/A'} className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none text-foreground font-medium" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
                        <Shield size={18} />
                      </div>
                      <input type="text" disabled value={user.role || 'Customer'} className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:outline-none text-foreground font-medium capitalize" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="border border-border bg-card/50 glass rounded-3xl p-8 shadow-sm relative overflow-hidden animate-[fadeIn_0.3s_ease-out] min-h-[400px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <h3 className="text-2xl font-bold mb-6 relative z-10">Order History</h3>
                
                {ordersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 relative z-10">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-muted-foreground font-medium">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 space-y-6 relative z-10">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-70">
                      <ShoppingBag size={32} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-foreground">No Orders Yet</p>
                      <p className="text-muted-foreground text-sm max-w-xs mx-auto">When you buy items, they will appear here with verification details.</p>
                    </div>
                    <button 
                      onClick={() => navigate('/products')}
                      className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md active:scale-98"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 relative z-10">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border bg-muted/20 hover:bg-muted/30 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm hover:border-blue-500/20 transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-border pb-4">
                          <div>
                            <p className="text-xs text-muted-foreground font-mono">ORDER ID: {order.id}</p>
                            {order.paymentId && (
                              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">PAYMENT ID: {order.paymentId}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar size={14} className="text-muted-foreground" />
                              <p className="text-xs text-muted-foreground font-medium">
                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
                            order.status === 'paid' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3.5">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="w-12 h-14 bg-white border border-border rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                                <img src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="grow min-w-0">
                                <h4 className="text-sm font-semibold text-foreground truncate">{item.title}</h4>
                                <p className="text-xs text-muted-foreground font-medium">Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</p>
                              </div>
                              <span className="text-sm font-bold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-border pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm">
                          <div className="text-muted-foreground max-w-md">
                            <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Shipping Address:</p>
                            <p className="text-xs mt-1 text-muted-foreground/95 leading-relaxed">
                              {order.shippingAddress?.fullName}<br/>
                              {order.shippingAddress?.addressLine1}{order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br/>
                              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}<br/>
                              Phone: {order.shippingAddress?.phone}
                            </p>
                          </div>
                          <div className="text-right w-full md:w-auto self-end">
                            <span className="text-xs text-muted-foreground block font-medium">Amount Paid</span>
                            <span className="text-2xl font-extrabold text-foreground">₹{order.amount?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="border border-border bg-card/50 glass rounded-3xl p-8 shadow-sm relative overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <h3 className="text-2xl font-bold mb-6 relative z-10">Account Settings</h3>
                <p className="text-muted-foreground relative z-10 text-sm">Settings panel is coming soon! You can configure notifications and password security options here in a future update.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
