import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  LogOut,
  Settings,
  PackageOpen,
  Calendar,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  Award,
  CheckCircle,
  Clock,
  Lock,
  Bell,
  Globe,
  Activity,
  Check,
  Edit2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import apiClient from '../api/apiClient';

const Profile = () => {
  // Initialize state directly from localStorage to prevent flash and effect warnings
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      try {
        return JSON.parse(token);
      } catch (err) {
        console.error("Could not parse user token", err);
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('info'); // 'info', 'orders', 'settings'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);

  // Settings states
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    newsletter: false,
    smsAlerts: true,
    twoFactor: false
  });

  // Redirect to login if user session is not present
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);



  // Fetch orders when activeTab is 'orders'
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
          if (addToast) {
            addToast('Failed to load order history', 'error');
          }
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
    if (addToast) {
      addToast('Logged out successfully', 'success');
    }
    navigate('/');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      if (addToast) addToast("Fields cannot be empty!", "error");
      return;
    }
    setIsSaving(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedUser = {
      ...user,
      name: editName,
      email: editEmail
    };

    localStorage.setItem('user_token', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    setIsSaving(false);
    // Notify application header of authentication name change
    window.dispatchEvent(new Event('authChange'));
    if (addToast) {
      addToast("Profile details updated successfully!", "success");
    }
  };

  const toggleSetting = (key) => {
    setNotificationSettings((prev) => {
      const newSettings = { ...prev, [key]: !prev[key] };
      if (addToast) {
        addToast("Settings preference updated", "success");
      }
      return newSettings;
    });
  };

  if (!user) return null;

  // Calculate order stats
  const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const mockLoyaltyPoints = 420;
  const mockPointsTarget = 500;
  const progressPercent = Math.min(100, Math.round((mockLoyaltyPoints / mockPointsTarget) * 100));

  return (
    <div className="min-h-screen bg-background text-foreground py-12 lg:py-16 animate-[fadeIn_0.4s_ease-out]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl space-y-10">
        
        {/* Banner Section */}
        <div className="relative bg-linear-to-r from-blue-600 via-indigo-600 to-violet-700 text-white rounded-3xl p-8 md:p-12 overflow-hidden shadow-lg border border-blue-500/10">
          {/* Decorative light bubbles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl -ml-20 -mb-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/10">
                <Award size={12} className="animate-bounce" /> Gold Rewards Tier
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                Welcome back, {user.name}!
              </h1>
              <p className="text-white/80 text-sm md:text-base font-medium max-w-md">
                Manage your profile, view orders, and toggle configurations in your personal panel.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="text-center px-4">
                <span className="text-xs text-white/70 block font-medium">Orders placed</span>
                <span className="text-2xl font-black text-white">{orders.length || '—'}</span>
              </div>
              <div className="border-l border-white/20"></div>
              <div className="text-center px-4">
                <span className="text-xs text-white/70 block font-medium">Total Rewards</span>
                <span className="text-2xl font-black text-white">{mockLoyaltyPoints} pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Loyalty Level Card */}
          <div className="bg-card border border-border shadow-sm p-6 rounded-3xl flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 p-3 rounded-2xl">
                <Award size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Rewards Tier</p>
                <p className="text-lg font-black text-foreground">Gold Membership</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Progress to Platinum</span>
                <span className="text-foreground">{mockLoyaltyPoints} / {mockPointsTarget} pts</span>
              </div>
              <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="bg-linear-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>

          {/* Spend Summary Card */}
          <div className="bg-card border border-border shadow-sm p-6 rounded-3xl flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-2xl">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Account Purchases</p>
                <p className="text-lg font-black text-foreground">₹{totalSpent.toLocaleString("en-IN")}.00</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-500" />
              <span>All payment methods fully secured</span>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="bg-card border border-border shadow-sm p-6 rounded-3xl flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 p-3 rounded-2xl">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Account Status</p>
                <p className="text-lg font-black text-foreground">Verified Profile</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1"><Activity size={14} className="text-blue-500" /> Security Rating: Strong</span>
              <button
                onClick={() => setActiveTab('settings')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Sidebar */}
          <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col items-center pb-6 border-b border-border text-center">
              <div className="w-24 h-24 bg-linear-to-tr from-blue-600 via-indigo-600 to-violet-700 text-white rounded-full flex items-center justify-center text-4xl font-black shadow-lg mb-4 ring-4 ring-blue-500/10 relative">
                {user.name.charAt(0).toUpperCase()}
                <span className="absolute bottom-1 right-1 bg-green-500 border-2 border-card w-4 h-4 rounded-full" title="Online Status"></span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
              <p className="text-muted-foreground text-sm font-medium">{user.email || 'customer@veloracart.com'}</p>
            </div>
            
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'info', label: 'Personal Information', icon: User },
                { id: 'orders', label: 'Order History', icon: PackageOpen, count: orders.length },
                { id: 'settings', label: 'Account Settings', icon: Settings }
              ].map((tab) => {
                const IconComp = tab.icon;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between px-4 py-3.5 font-bold rounded-xl transition-all ${
                      activeTab === tab.id 
                        ? 'bg-foreground text-background scale-102 shadow-sm' 
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp size={18} />
                      <span className="text-sm">{tab.label}</span>
                    </div>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        activeTab === tab.id ? 'bg-background text-foreground' : 'bg-muted-foreground/20 text-foreground'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="pt-6 border-t border-border">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold rounded-xl transition-colors border border-transparent hover:border-red-200/30"
              >
                <LogOut size={18} /> Logout Account
              </button>
            </div>
          </div>
          
          {/* Right Column Content Card */}
          <div className="lg:col-span-8">
            {/* Personal Info Tab */}
            {activeTab === 'info' && (
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden animate-[fadeIn_0.3s_ease-out] space-y-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-foreground">Personal Information</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Manage your credentials and login parameters.</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-black bg-foreground text-background px-3.5 py-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Edit2 size={13} /> Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-foreground uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm font-semibold transition-all ${
                            isEditing ? 'border-foreground/40 bg-background text-foreground' : 'border-border text-muted-foreground'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-foreground uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          disabled={!isEditing}
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm font-semibold transition-all ${
                            isEditing ? 'border-foreground/40 bg-background text-foreground' : 'border-border text-muted-foreground'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-foreground uppercase tracking-wider">Role</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-500">
                          <Shield size={16} />
                        </div>
                        <input
                          type="text"
                          disabled
                          value={user.role || 'Customer'}
                          className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none text-sm font-semibold text-muted-foreground capitalize"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-foreground uppercase tracking-wider">Account Creation</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                          <Calendar size={16} />
                        </div>
                        <input
                          type="text"
                          disabled
                          value="June 12, 2026"
                          className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none text-sm font-semibold text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-2 animate-[fadeIn_0.2s_ease-out]">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 bg-foreground text-background font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm text-sm"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Check size={16} />
                        )}
                        Save Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditName(user.name);
                          setEditEmail(user.email || '');
                          setIsEditing(false);
                        }}
                        className="flex-1 bg-background border border-border text-foreground hover:bg-muted font-bold py-3 px-4 rounded-xl transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Orders History Tab */}
            {activeTab === 'orders' && (
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden animate-[fadeIn_0.3s_ease-out] min-h-[400px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="border-b border-border pb-4 mb-6">
                  <h3 className="text-2xl font-black tracking-tight text-foreground">Order History</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Track your packages, deliveries, and billing items.</p>
                </div>
                
                {ordersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3 relative z-10">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-muted-foreground font-bold">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 space-y-6 relative z-10">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-70">
                      <ShoppingBag size={32} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl font-black text-foreground">No Orders Yet</p>
                      <p className="text-muted-foreground text-xs max-w-xs mx-auto">When you buy items, they will appear here with verification details.</p>
                    </div>
                    <button 
                      onClick={() => navigate('/products')}
                      className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 text-sm active:scale-98"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 relative z-10">
                    {orders.map((order) => {
                      // Determine timeline step index
                      let timelineStep = 2; // default to processing/shipped
                      if (order.status === 'paid') timelineStep = 2;
                      if (order.status?.toLowerCase().includes('deliv')) timelineStep = 4;
                      if (order.status?.toLowerCase().includes('ship')) timelineStep = 3;

                      return (
                        <div key={order.id} className="border border-border bg-muted/20 hover:bg-muted/30 rounded-2xl p-5 md:p-6 space-y-6 shadow-sm hover:border-blue-500/10 transition-all">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-border pb-4">
                            <div>
                              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider font-semibold">ORDER ID: {order.id}</p>
                              {order.paymentId && (
                                <p className="text-[9px] text-muted-foreground font-mono mt-0.5">PAYMENT ID: {order.paymentId}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar size={13} className="text-muted-foreground" />
                                <p className="text-xs text-muted-foreground font-bold">
                                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                              order.status === 'paid' 
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          {/* Visual Step Tracker Timeline */}
                          <div className="space-y-3 px-1">
                            <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                              <span className={timelineStep >= 1 ? "text-blue-600 dark:text-blue-400" : ""}>Confirmed</span>
                              <span className={timelineStep >= 2 ? "text-blue-600 dark:text-blue-400" : ""}>Processing</span>
                              <span className={timelineStep >= 3 ? "text-blue-600 dark:text-blue-400" : ""}>Shipped</span>
                              <span className={timelineStep >= 4 ? "text-blue-600 dark:text-blue-400" : ""}>Delivered</span>
                            </div>
                            <div className="relative flex items-center justify-between w-full">
                              <div className="absolute left-0 right-0 h-1 bg-border rounded-full -z-10"></div>
                              <div
                                className="absolute left-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-full -z-10 transition-all duration-700"
                                style={{
                                  width: timelineStep === 1 ? "0%" : timelineStep === 2 ? "33%" : timelineStep === 3 ? "66%" : "100%"
                                }}
                              ></div>
                              {[1, 2, 3, 4].map((step) => (
                                <div
                                  key={step}
                                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                                    timelineStep >= step
                                      ? "bg-blue-600 dark:bg-blue-400 border-blue-600 dark:border-blue-400 text-white scale-110"
                                      : "bg-background border-border text-muted-foreground"
                                  }`}
                                >
                                  {timelineStep >= step ? (
                                    <Check size={10} strokeWidth={3} />
                                  ) : (
                                    <span className="text-[8px] font-bold">{step}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-4">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center group">
                                <div className="w-12 h-14 bg-white border border-border rounded-xl overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                                  <img 
                                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                  />
                                </div>
                                <div className="grow min-w-0">
                                  <h4 className="text-xs md:text-sm font-bold text-foreground truncate">{item.title}</h4>
                                  <p className="text-[10px] md:text-xs text-muted-foreground font-semibold">Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</p>
                                </div>
                                <span className="text-xs md:text-sm font-black text-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}.00</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-border pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="text-muted-foreground max-w-md">
                              <p className="font-black text-foreground text-[10px] uppercase tracking-wider">Shipping Destination</p>
                              <p className="text-xs mt-1.5 text-muted-foreground/95 leading-relaxed font-semibold">
                                {order.shippingAddress?.fullName}<br/>
                                {order.shippingAddress?.addressLine1}{order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br/>
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}<br/>
                                Phone: {order.shippingAddress?.phone}
                              </p>
                            </div>
                            <div className="text-right w-full md:w-auto self-end">
                              <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">Amount Paid</span>
                              <span className="text-2xl font-black text-foreground">₹{order.amount?.toLocaleString("en-IN")}.00</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden animate-[fadeIn_0.3s_ease-out] space-y-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="border-b border-border pb-4">
                  <h3 className="text-2xl font-black tracking-tight text-foreground">Account Settings</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Configure system parameters and authentication switches.</p>
                </div>

                <div className="space-y-6">
                  {/* Notification switches */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-foreground">Notifications</h4>
                    
                    <div className="space-y-3">
                      {[
                        { key: 'orderUpdates', label: 'Email Order Dispatches', desc: 'Receive real-time tracking updates when products are shipped.' },
                        { key: 'newsletter', label: 'Newsletters & Promotions', desc: 'Hear about discounts, new collections, and flash rewards.' },
                        { key: 'smsAlerts', label: 'SMS Delivery Status', desc: 'Text messages detailing local courier dropoff times.' }
                      ].map((item) => (
                        <div key={item.key} className="flex justify-between items-center gap-4 bg-muted/10 border p-4 rounded-2xl hover:border-foreground/10 transition-colors">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-foreground block">{item.label}</span>
                            <span className="text-[10px] text-muted-foreground block leading-relaxed max-w-sm">{item.desc}</span>
                          </div>
                          <button
                            onClick={() => toggleSetting(item.key)}
                            className={`w-11 h-6 rounded-full p-1 transition-colors outline-none shrink-0 ${
                              notificationSettings[item.key] ? 'bg-blue-600' : 'bg-muted border'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${
                              notificationSettings[item.key] ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security options */}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-black uppercase tracking-wider text-foreground">Security</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center gap-4 bg-muted/10 border p-4 rounded-2xl hover:border-foreground/10 transition-colors">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-foreground block">Two-Factor Authentication</span>
                          <span className="text-[10px] text-muted-foreground block leading-relaxed max-w-sm">Prompt for a passcode on login from unverified browsers.</span>
                        </div>
                        <button
                          onClick={() => toggleSetting('twoFactor')}
                          className={`w-11 h-6 rounded-full p-1 transition-colors outline-none shrink-0 ${
                            notificationSettings.twoFactor ? 'bg-blue-600' : 'bg-muted border'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${
                            notificationSettings.twoFactor ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-2">
                        <button
                          onClick={() => {
                            if (addToast) addToast("Change password link sent to email!", "success");
                          }}
                          className="grow bg-background border border-border hover:bg-muted text-foreground font-bold py-3.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                        >
                          <Lock size={14} /> Reset Password
                        </button>
                        <button
                          onClick={() => {
                            if (addToast) addToast("Regional preference updated to English / INR", "success");
                          }}
                          className="grow bg-background border border-border hover:bg-muted text-foreground font-bold py-3.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                        >
                          <Globe size={14} /> Language & Region
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
