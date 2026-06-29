import React from 'react';
import { ShoppingBag, Heart, Shield, Truck } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-background text-foreground min-h-screen py-12 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            About Velora
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We're on a mission to redefine your shopping experience. Combining elegance with everyday functionality, Velora curates a selection that brings style seamlessly into your life.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              icon: <ShoppingBag className="w-8 h-8 text-blue-500" />,
              title: "Curated Selection",
              desc: "Every product is handpicked for quality and style."
            },
            {
              icon: <Heart className="w-8 h-8 text-rose-500" />,
              title: "Customer First",
              desc: "Your satisfaction is at the core of everything we do."
            },
            {
              icon: <Shield className="w-8 h-8 text-emerald-500" />,
              title: "Secure Shopping",
              desc: "Top-tier encryption to keep your data safe and secure."
            },
            {
              icon: <Truck className="w-8 h-8 text-purple-500" />,
              title: "Fast Delivery",
              desc: "Lightning-fast shipping directly to your doorstep."
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-card glass p-8 rounded-2xl border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card/50 glass rounded-3xl p-8 lg:p-12 border border-border/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Story</h2>
            <div className="w-12 h-1.5 bg-blue-600 rounded-full"></div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded with a passion for exceptional design and uncompromising quality, Velora started as a small idea that grew into a robust retail platform. 
              We believe that shopping should be more than just acquiring things—it should be an experience of discovering items that resonate with your personal style.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we serve thousands of happy customers around the globe, constantly expanding our catalog while staying true to our core values: Integrity, Innovation, and Excellence.
            </p>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-2xl h-48 flex flex-col justify-end shadow-inner">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">10k+</span>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Happy Customers</span>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-2xl h-32 flex flex-col justify-end shadow-inner">
                <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">5k+</span>
                <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Products</span>
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-2xl h-32 flex flex-col justify-end shadow-inner">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">99%</span>
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Positive Feedback</span>
              </div>
              <div className="bg-rose-100 dark:bg-rose-900/30 p-6 rounded-2xl h-48 flex flex-col justify-end shadow-inner">
                <span className="text-3xl font-bold text-rose-600 dark:text-rose-400">24/7</span>
                <span className="text-sm font-medium text-rose-800 dark:text-rose-200">Customer Support</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
