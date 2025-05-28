import React from 'react';
import Typewriter from 'typewriter-effect';

const HomeHero = () => {
  return (
    <section className="bg-white dark:bg-black text-black dark:text-white py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Left: Text Content */}
          <div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
              📒Made with love by Mujaer Team ITB 
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
              Aerthera-Smart Weather Dashboard
            </h1>
            <div className="text-2xl font-medium h-[60px] text-neutral-700 dark:text-neutral-300 mb-6">
              <Typewriter
                options={{
                  strings: [
                    'Hello Friends!',
                    'Check Today\'s Weather',
                    'Plan Your Day Wisely',
                    'Stay Weather-Ready'
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 60,
                  deleteSpeed: 40
                }}
              />
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg mb-6">
              Your intelligent weather companion that helps you make informed decisions — with clarity and focus.
            </p>
          </div>

          {/* Right: Illustration (switches based on mode) */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            {/* Light Mode Image */}
            <img
              src="/main-light.gif"
              alt="Weather illustration (light mode)"
              className="block dark:hidden w-full max-w-none h-auto object-contain"
              style={{ maxHeight: "400px" }}
            />
            {/* Dark Mode Image */}
            <img
              src="/main-light.gif"
              alt="Weather illustration (dark mode)"
              className="hidden dark:block w-full max-w-none h-auto object-contain"
              style={{ maxHeight: "400px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
