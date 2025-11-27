import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Package, TrendingUp, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Order Tracking",
      description: "Monitor all orders in real-time with comprehensive tracking and status updates"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Business Analytics",
      description: "Get insights into sales trends, revenue, and performance metrics"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Staff Management",
      description: "Manage your team efficiently with scheduling and performance tracking"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Inventory Control",
      description: "Track stock levels, automate reordering, and prevent shortages"
    }
  ];

  const benefits = [
    "Reduce manual paperwork by 90%",
    "Improve order accuracy",
    "Real-time inventory visibility",
    "Streamlined staff coordination",
    "Data-driven decision making",
    "Automated reporting"
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-sm border-b border-cyan-500/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <Package className="w-8 h-8 text-cyan-400 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                BuildFlow
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">Features</a>
              <a href="#benefits" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">Benefits</a>
              <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden text-cyan-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 animate-fadeIn">
              <a href="#features" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-200">Features</a>
              <a href="#benefits" className="block text-gray-300 hover:text-cyan-400 transition-colors duration-200">Benefits</a>
              <button className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors duration-200">
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fadeIn">
              Manage Your Construction
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Materials Business
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fadeIn" style={{animationDelay: '0.2s'}}>
              Streamline orders, track inventory, manage staff, and grow your business with powerful analytics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{animationDelay: '0.4s'}}>
              <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button className="px-8 py-4 border-2 border-cyan-500 hover:bg-cyan-500/10 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful tools designed for construction material providers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group cursor-pointer"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-cyan-400 mb-4 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Transform Your
                <span className="block text-cyan-400">Operations</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Join hundreds of construction material providers who have modernized their business operations
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20">
              <div className="space-y-6">
                <div className="bg-black/50 p-6 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Monthly Revenue</span>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-cyan-400">+45%</p>
                </div>
                <div className="bg-black/50 p-6 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Order Processing Time</span>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-cyan-400">-60%</p>
                </div>
                <div className="bg-black/50 p-6 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Customer Satisfaction</span>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-cyan-400">98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join leading construction material providers and modernize your operations today
          </p>
          <button className="px-10 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center gap-2 group">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <p className="text-gray-500 mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2024 BuildFlow. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}