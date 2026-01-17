// // import React from "react";
// // import { Camera, Utensils, TrendingUp, Users } from "lucide-react";

// // const About = () => {
// //   const values = [
// //     {
// //       icon: Camera,
// //       title: "Dishpop Menu Experience",
// //       description:
// //         "We bring menus to life using augmented reality so customers can visualize dishes before ordering.",
// //     },
// //     {
// //       icon: TrendingUp,
// //       title: "AI-Powered Growth",
// //       description:
// //         "Smart analytics help restaurant owners understand customers and increase revenue.",
// //     },
// //     {
// //       icon: Utensils,
// //       title: "Modern Dining",
// //       description:
// //         "We blend technology with hospitality to create unforgettable dining experiences.",
// //     },
// //     {
// //       icon: Users,
// //       title: "Customer First",
// //       description:
// //         "Every feature is built to enhance customer satisfaction and restaurant success.",
// //     },
// //   ];

// //   return (
// //     <div className="bg-black text-white min-h-screen px-4 py-20">
// //       <div className="max-w-7xl mx-auto space-y-16">

// //         {/* Header */}
// //         <div className="text-center space-y-4">
// //           <h1 className="text-5xl font-bold">
// //             About <span className="text-cyan-400">Dishpop</span>
// //           </h1>
// //           <p className="text-gray-400 max-w-3xl mx-auto text-lg">
// //             Dishpop is transforming the restaurant industry by combining
// //             augmented reality, artificial intelligence, and modern design to
// //             redefine how customers experience food.
// //           </p>
// //         </div>

// //         {/* Mission */}
// //         <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 border border-gray-800">
// //           <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
// //           <p className="text-gray-400 text-lg leading-relaxed">
// //             Our mission is to empower restaurants with immersive technology that
// //             increases engagement, boosts trust, and improves decision-making.
// //             We believe food should be experienced before it’s ordered.
// //           </p>
// //         </div>

// //         {/* Values */}
// //         <div>
// //           <h2 className="text-3xl font-bold text-center mb-12">
// //             What We Stand For
// //           </h2>

// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //             {values.map((item, index) => {
// //               const Icon = item.icon;
// //               return (
// //                 <div
// //                   key={index}
// //                   className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:scale-105 transition-all"
// //                 >
// //                   <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
// //                     <Icon className="w-6 h-6 text-white" />
// //                   </div>
// //                   <h3 className="text-xl font-semibold mb-2">
// //                     {item.title}
// //                   </h3>
// //                   <p className="text-gray-400 text-sm">
// //                     {item.description}
// //                   </p>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>

// //         {/* Closing */}
// //         <div className="text-center">
// //           <p className="text-gray-400 text-lg">
// //             Join the future of dining with{" "}
// //             <span className="text-cyan-400 font-semibold">Dishpop</span>.
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default About;
// import React from "react";
// import { Camera, Utensils, TrendingUp, Users } from "lucide-react";

// const About = () => {
//   const values = [
//     {
//       icon: Camera,
//       title: "Immersive Menu Experience",
//       description:
//         "Dishpop transforms traditional menus into interactive visual experiences, allowing customers to preview dishes in stunning detail before ordering.",
//     },
//     {
//       icon: TrendingUp,
//       title: "AI-Driven Growth",
//       description:
//         "Advanced analytics and insights empower restaurant owners to understand customer behavior, optimize menus, and drive sustainable growth.",
//     },
//     {
//       icon: Utensils,
//       title: "Next-Gen Dining",
//       description:
//         "We seamlessly blend technology with hospitality to create modern dining experiences that feel intuitive, engaging, and memorable.",
//     },
//     {
//       icon: Users,
//       title: "Customer-Centric Design",
//       description:
//         "Every feature is thoughtfully designed to enhance customer satisfaction while helping restaurants build trust and loyalty.",
//     },
//   ];

//   return (
//     <div className="bg-black text-white min-h-screen px-4 py-20">
//       <div className="max-w-7xl mx-auto space-y-20">

//         {/* Header */}
//         <div className="text-center space-y-6">
//           <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
//             About <span className="text-cyan-400">Dishpop</span>
//           </h1>
//           <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
//             Dishpop is redefining the future of dining by combining augmented
//             reality, artificial intelligence, and elegant design to elevate how
//             customers discover and experience food.
//           </p>
//         </div>

//         {/* Mission */}
//         <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl p-12 border border-gray-800 shadow-xl">
//           <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
//           <p className="text-gray-400 text-lg leading-relaxed max-w-4xl">
//             Our mission is to empower restaurants with immersive, intelligent
//             technology that builds confidence, increases engagement, and drives
//             better decision-making. We believe great food deserves to be
//             experienced before it’s ordered.
//           </p>
//         </div>

//         {/* Values */}
//         <div>
//           <h2 className="text-3xl font-bold text-center mb-14">
//             What We Stand For
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {values.map((item, index) => {
//               const Icon = item.icon;
//               return (
//                 <div
//                   key={index}
//                   className="bg-gray-900 border border-gray-800 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-2xl"
//                 >
//                   <div className="w-14 h-14 bg-cyan-500/90 rounded-xl flex items-center justify-center mb-6">
//                     <Icon className="w-7 h-7 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-3">
//                     {item.title}
//                   </h3>
//                   <p className="text-gray-400 text-sm leading-relaxed">
//                     {item.description}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Closing */}
//         <div className="text-center">
//           <p className="text-gray-400 text-lg">
//             Join the next evolution of dining with{" "}
//             <span className="text-cyan-400 font-semibold">Dishpop</span>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;


import React, { useEffect } from "react";
import { Camera, Utensils, TrendingUp, Users, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Lenis from '@studio-freight/lenis';

const GradientText = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ${className}`}>
    {children}
  </span>
);

const About = () => {
  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const values = [
    {
      icon: Camera,
      title: "Immersive Menu Experience",
      description:
        "Dishpop transforms traditional menus into interactive visual experiences, allowing customers to preview dishes in stunning detail before ordering.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: TrendingUp,
      title: "AI-Driven Growth",
      description:
        "Advanced analytics and insights empower restaurant owners to understand customer behavior, optimize menus, and drive sustainable growth.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Utensils,
      title: "Next-Gen Dining",
      description:
        "We seamlessly blend technology with hospitality to create modern dining experiences that feel intuitive, engaging, and memorable.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: Users,
      title: "Customer-Centric Design",
      description:
        "Every feature is thoughtfully designed to enhance customer satisfaction while helping restaurants build trust and loyalty.",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
    },
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* --- SUBTLE FILM GRAIN (Cinematic Feel) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* --- NAVBAR (Floating Pill) --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-center">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 px-6 py-3 rounded-full shadow-sm flex items-center gap-8 transition-all hover:bg-white">
          <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" /> DISHPOP
          </span>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="/about" className="hover:text-blue-600 transition-colors text-blue-600">About</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
          </div>
          <button 
            className="bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-lg hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-24">

        {/* Header Section */}
        <section className="min-h-[60vh] flex items-center justify-center px-6 md:px-20 lg:px-32 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase"
            >
              <Sparkles className="w-3 h-3" />
              Our Story
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]"
            >
              About <GradientText>Dishpop</GradientText>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed"
            >
              Dishpop is redefining the future of dining by combining augmented
              reality, artificial intelligence, and elegant design to elevate how
              customers discover and experience food.
            </motion.p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-6 md:px-20 lg:px-32 bg-blue-50/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-slate-100 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Mission</h2>
              </div>
              
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-4xl">
                Our mission is to empower restaurants with immersive, intelligent
                technology that builds confidence, increases engagement, and drives
                better decision-making. We believe great food deserves to be
                experienced before it's ordered.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-sm text-slate-600 font-medium">Restaurants Partnered</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-3xl font-bold text-slate-900 mb-2">2M+</div>
                  <div className="text-sm text-slate-600 font-medium">AR Views Generated</div>
                </div>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-sm text-slate-600 font-medium">Customer Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-32 px-6 md:px-20 lg:px-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                What We <GradientText>Stand For</GradientText>
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Our core values drive everything we do, from product development to customer support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-slate-900">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 px-6 md:px-20 lg:px-32 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Building the <br />
                <GradientText>Future of Dining</GradientText>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                We're not just creating software – we're crafting experiences that bridge
                the physical and digital worlds. Every line of code, every design decision,
                and every feature is built with one goal: making dining more delightful.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex-1 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-1">Innovation</div>
                  <div className="text-xs text-slate-500">Pushing boundaries daily</div>
                </div>
                <div className="flex-1 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-1">Excellence</div>
                  <div className="text-xs text-slate-500">Quality in every detail</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-100 shadow-sm overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
                  alt="Restaurant Technology"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-32 px-6 md:px-20 lg:px-32 relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Join the next evolution of dining with{" "}
                <span className="text-blue-400">Dishpop</span>
              </h2>
              <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
                Let's transform how people discover and experience food together.
              </p>
              <button className="bg-white text-blue-900 px-12 py-4 rounded-xl font-bold text-lg shadow-2xl hover:bg-blue-50 transition-all">
                Get Started Today
              </button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-slate-100 bg-white text-slate-500 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30" />
              <span className="font-bold text-slate-900 text-lg">Dishpop</span>
            </div>
            <div className="flex gap-8 font-medium">
              <a href="/privacy-policy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="/contact" className="hover:text-blue-600 transition-colors">
                Contact
              </a>
              <a href="/about" className="hover:text-blue-600 transition-colors">
                About us
              </a>
              <a href="/terms-of-service" className="hover:text-blue-600 transition-colors">
                Terms Policy
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default About;