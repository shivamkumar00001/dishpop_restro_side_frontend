// import React from "react";
// import { Camera, Utensils, TrendingUp, Users } from "lucide-react";

// const About = () => {
//   const values = [
//     {
//       icon: Camera,
//       title: "Dishpop Menu Experience",
//       description:
//         "We bring menus to life using augmented reality so customers can visualize dishes before ordering.",
//     },
//     {
//       icon: TrendingUp,
//       title: "AI-Powered Growth",
//       description:
//         "Smart analytics help restaurant owners understand customers and increase revenue.",
//     },
//     {
//       icon: Utensils,
//       title: "Modern Dining",
//       description:
//         "We blend technology with hospitality to create unforgettable dining experiences.",
//     },
//     {
//       icon: Users,
//       title: "Customer First",
//       description:
//         "Every feature is built to enhance customer satisfaction and restaurant success.",
//     },
//   ];

//   return (
//     <div className="bg-black text-white min-h-screen px-4 py-20">
//       <div className="max-w-7xl mx-auto space-y-16">

//         {/* Header */}
//         <div className="text-center space-y-4">
//           <h1 className="text-5xl font-bold">
//             About <span className="text-cyan-400">Dishpop</span>
//           </h1>
//           <p className="text-gray-400 max-w-3xl mx-auto text-lg">
//             Dishpop is transforming the restaurant industry by combining
//             augmented reality, artificial intelligence, and modern design to
//             redefine how customers experience food.
//           </p>
//         </div>

//         {/* Mission */}
//         <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 border border-gray-800">
//           <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
//           <p className="text-gray-400 text-lg leading-relaxed">
//             Our mission is to empower restaurants with immersive technology that
//             increases engagement, boosts trust, and improves decision-making.
//             We believe food should be experienced before it’s ordered.
//           </p>
//         </div>

//         {/* Values */}
//         <div>
//           <h2 className="text-3xl font-bold text-center mb-12">
//             What We Stand For
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {values.map((item, index) => {
//               const Icon = item.icon;
//               return (
//                 <div
//                   key={index}
//                   className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:scale-105 transition-all"
//                 >
//                   <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
//                     <Icon className="w-6 h-6 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">
//                     {item.title}
//                   </h3>
//                   <p className="text-gray-400 text-sm">
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
//             Join the future of dining with{" "}
//             <span className="text-cyan-400 font-semibold">Dishpop</span>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;
import React from "react";
import { Camera, Utensils, TrendingUp, Users } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Camera,
      title: "Immersive Menu Experience",
      description:
        "Dishpop transforms traditional menus into interactive visual experiences, allowing customers to preview dishes in stunning detail before ordering.",
    },
    {
      icon: TrendingUp,
      title: "AI-Driven Growth",
      description:
        "Advanced analytics and insights empower restaurant owners to understand customer behavior, optimize menus, and drive sustainable growth.",
    },
    {
      icon: Utensils,
      title: "Next-Gen Dining",
      description:
        "We seamlessly blend technology with hospitality to create modern dining experiences that feel intuitive, engaging, and memorable.",
    },
    {
      icon: Users,
      title: "Customer-Centric Design",
      description:
        "Every feature is thoughtfully designed to enhance customer satisfaction while helping restaurants build trust and loyalty.",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            About <span className="text-cyan-400">Dishpop</span>
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            Dishpop is redefining the future of dining by combining augmented
            reality, artificial intelligence, and elegant design to elevate how
            customers discover and experience food.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl p-12 border border-gray-800 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-4xl">
            Our mission is to empower restaurants with immersive, intelligent
            technology that builds confidence, increases engagement, and drives
            better decision-making. We believe great food deserves to be
            experienced before it’s ordered.
          </p>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-14">
            What We Stand For
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="w-14 h-14 bg-cyan-500/90 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing */}
        <div className="text-center">
          <p className="text-gray-400 text-lg">
            Join the next evolution of dining with{" "}
            <span className="text-cyan-400 font-semibold">Dishpop</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
