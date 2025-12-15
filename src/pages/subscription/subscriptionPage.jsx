import React from "react";

export default function SubscriptionPage() {
  const plans = [
    {
      name: "Basic",
      price: "$0",
      models: "2 AR models / month",
      bgColor: "from-gray-800 to-gray-900",
      buttonColor: "bg-gray-600 hover:bg-gray-500",
    },
    {
      name: "Pro",
      price: "$6.5",
      models: "150 AR models / month",
      bgColor: "from-blue-700 to-blue-900",
      buttonColor: "bg-blue-600 hover:bg-blue-500",
      popular: true,
    },
    {
      name: "Premium",
      price: "$9.9",
      models: "500 AR models / month",
      bgColor: "from-purple-700 to-purple-900",
      buttonColor: "bg-purple-600 hover:bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col items-center py-12 px-4 sm:py-16 sm:px-6 md:px-8 font-sans">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 sm:mb-16 text-center tracking-tight">
        Choose Your Subscription Plan
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 w-full max-w-7xl">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-gradient-to-br ${plan.bgColor} p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl shadow-2xl flex flex-col justify-between min-h-[400px] sm:min-h-[450px] md:min-h-[500px] transform transition-transform duration-300 hover:scale-105`}
            style={{ backdropFilter: "blur(15px)" }}
          >
            {plan.popular && (
              <span className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-yellow-400 text-black font-bold px-4 py-1 sm:px-5 sm:py-1 rounded-full text-sm tracking-wide">
                Most Popular
              </span>
            )}

            <div className="flex flex-col items-center">
              <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-bold mb-4 sm:mb-6 tracking-wide">
                {plan.name}
              </h2>
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold mb-2 sm:mb-4 md:mb-4">
                {plan.price}
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-xl text-gray-300 mb-6 sm:mb-8 md:mb-10 text-center tracking-wide">
                {plan.models}
              </p>
            </div>

            <button
              className={`${plan.buttonColor} text-white font-semibold px-6 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4 rounded-full text-base sm:text-lg md:text-lg lg:text-lg tracking-wide transition duration-300`}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
