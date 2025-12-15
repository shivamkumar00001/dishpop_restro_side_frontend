import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Utensils, TrendingUp, Users, ChevronRight } from 'lucide-react';
import DynamicGradientText from '../../components/DynamicGradient';
import TypewriterText from '../../components/TypeWriter';

const LandingPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';

    let animationId;
    let rotation = 0;
    let scale = 1;
    let scaleDirection = 1;
    let floatY = 0;
    let floatDirection = 1;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with subtle gradient
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
      gradient.addColorStop(0, 'rgba(17, 24, 39, 1)');
      gradient.addColorStop(1, 'rgba(31, 41, 55, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      // Move to center with floating effect
      floatY += 0.3 * floatDirection;
      if (floatY > 15 || floatY < -15) floatDirection *= -1;
      ctx.translate(width / 2, height / 2 + floatY);

      // Smooth slow rotation
      rotation += 0.003;
      ctx.rotate(rotation);

      // Smooth breathing scale effect
      scale += 0.0003 * scaleDirection;
      if (scale > 1.03 || scale < 0.97) scaleDirection *= -1;
      ctx.scale(scale, scale);

      // Add glow effect
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';

      // Draw image
      const imgSize = Math.min(width, height) * 0.85;
      if (img.complete) {
        // Create circular clip
        ctx.beginPath();
        ctx.arc(0, 0, imgSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
      }

      ctx.restore();

      // Add sparkle particles
      ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
      for (let i = 0; i < 3; i++) {
        const angle = rotation + (i * Math.PI * 2) / 3;
        const distance = (width / 2) * 0.7;
        const x = width / 2 + Math.cos(angle) * distance;
        const y = height / 2 + Math.sin(angle) * distance + floatY;
        const size = 2 + Math.sin(rotation * 2 + i) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    img.onload = () => {
      handleResize();
      animate();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const features = [
    {
      title: "Menu Visualization",
      description: "Let customers see dishes in 3D before ordering with augmented reality technology.",
      icon: Camera,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80"
    },
    {
      title: "AI-Powered Insights",
      description: "Get real-time analytics and recommendations to optimize your menu and operations.",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80"
    },
    {
      title: "AR Order Modes",
      description: "Interactive ordering experience that increases customer engagement and satisfaction.",
      icon: Utensils,
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80"
    },
    {
      title: "Customer Analytics",
      description: "Understand dining preferences and behavior patterns to improve service quality.",
      icon: Users,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80"
    }
  ];

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transform Dining<br />
              <DynamicGradientText/>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Revolutionize your restaurant experience with cutting-edge augmented reality 
              and AI-powered insights. Enhance customer engagement, streamline operations, 
              and boost sales with immersive menu visualization.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleGetStarted}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
              {/* <button 
                onClick={handleRequestDemo}
                className="border border-gray-700 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Request Demo
              </button> */}
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="relative w-full aspect-square">
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-full"
              />
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-4 rounded-full border border-cyan-400/10 animate-pulse" style={{ animationDuration: '4s' }}></div>
            </div>
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl animate-pulse"></div>
          </div>
        </div>
        
        {/* Background ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              About AR Restro:<br />
              <TypewriterText text="The future of Dining" 
              className="text-cyan-400"  
              speed={90}/>
            </h2>
            <p>
              <TypewriterText text="AR Restro is an innovative platform that combines augmented reality 
              technology with artificial intelligence to transform the restaurant industry. 
              Our solution enables customers to visualize menu items in stunning 3D, 
              provides real-time analytics for restaurant owners, and creates an 
              unforgettable dining experience that drives customer satisfaction and loyalty."
              className="text-gray-400 text-lg leading-relaxed"
              speed={15}
              />
            </p>
            <p className="text-gray-100 text-lg leading-relaxed">
              Join thousands of restaurants worldwide who have already elevated their 
              dining experience with AR Restro technology.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80" 
                alt="Restaurant interior" 
                className="w-full h-48 object-cover rounded-lg shadow-lg"
              />
              <div className="bg-white rounded-lg p-4 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" 
                  alt="Food menu" 
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            </div>
            <div className="mt-8">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" 
                alt="Fine dining" 
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            How Food Appears in AR
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Experience the future of menu presentation with our innovative AR technology
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="bg-black rounded-xl p-6 hover:bg-gray-800 transition-all hover:transform hover:scale-105 border border-gray-800 shadow-lg"
                >
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="bg-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Register Your Restaurant Today
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the AR dining revolution. Transform your restaurant's customer experience 
            with cutting-edge technology. Start your free trial today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Partner With Us <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={handleGetStarted}
              className="border border-cyan-500 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Register Now
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            No credit card required • Free 30-day trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2025 AR Restro. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;