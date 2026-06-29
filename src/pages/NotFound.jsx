import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ShoppingBag, Grid, User, ArrowRight } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const helpfulLinks = [
    {
      title: 'Shop Products',
      description: 'Explore our latest collection of premium items.',
      icon: ShoppingBag,
      to: '/products'
    },
    {
      title: 'Browse Categories',
      description: 'Find exactly what you are looking for by category.',
      icon: Grid,
      to: '/categories'
    },
    {
      title: 'Your Profile',
      description: 'Manage your account settings, orders, and preferences.',
      icon: User,
      to: '/profile'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-6 lg:px-12 relative overflow-hidden bg-(--background)">
      {/* Subtle Grid Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--foreground) 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />
      
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center z-10 relative">
        
        {/* Left Content Area */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-(--border) bg-(--muted)/50 px-3 py-1 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              404 Error
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-(--foreground) leading-[1.1]">
              Page not<br />found
            </h1>
            <p className="max-w-md text-lg text-(--muted-foreground) leading-relaxed">
              We searched high and low, but couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl border border-(--border) bg-(--background) text-(--foreground) font-medium hover:bg-(--muted) transition-colors duration-200 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Go back
            </button>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-(--foreground) text-(--background) font-medium hover:opacity-90 shadow-lg shadow-black/5 dark:shadow-white/5 transition-all duration-200"
            >
              <Home size={18} />
              Back to homepage
            </Link>
          </div>
        </div>

        {/* Right Content Area - Helpful Links */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <h2 className="text-sm font-semibold tracking-wider text-(--muted-foreground) uppercase mb-6">Popular Destinations</h2>
          <div className="flex flex-col gap-4">
            {helpfulLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className="group flex items-center gap-5 p-5 rounded-2xl border border-(--border) bg-(--card)/50 backdrop-blur-sm hover:bg-(--card) hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-(--muted) text-(--foreground) group-hover:bg-(--foreground) group-hover:text-(--background) transition-colors duration-300">
                  <link.icon size={20} className="stroke-[1.75]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-(--foreground) flex items-center gap-2">
                    {link.title}
                  </h3>
                  <p className="mt-1 text-sm text-(--muted-foreground) line-clamp-1">{link.description}</p>
                </div>
                <div className="text-(--muted-foreground) group-hover:text-(--foreground) group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Modern blurred ambient background glow */}
      <div className="absolute top-0 right-0 -z-10 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[40rem] h-[40rem] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
    </div>
  );
};

export default NotFound;
