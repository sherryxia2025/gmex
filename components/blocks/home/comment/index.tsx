"use client";

import Image from "next/image";
import { useState } from "react";
import ArrowIcon from "@/components/icon/arrow-icon";

interface CommentProps {
  testimonials?: Array<{
    title: string;
    description: string;
    cover?: string;
    author: {
      name: string;
      role: string;
      avatar?: string;
    };
  }>;
  className?: string;
}

export default function Comment(props: CommentProps) {
  const { testimonials, className } = props;

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    const newIndex =
      (currentIndex - 1 + (testimonials?.length || 0)) %
      (testimonials?.length || 0);
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % (testimonials?.length || 0);
    setCurrentIndex(newIndex);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  const currentCase = testimonials[currentIndex];

  return (
    <section className={`relative h-[50vh] md:h-screen  ${className || ""}`}>
      <div className="w-full h-full pb-10 md:pb-14 relative overflow-hidden">
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0">
            {currentCase.cover && (
              <Image
                fill
                className="object-cover"
                src={currentCase.cover}
                alt={currentCase.title}
                priority
              />
            )}
          </div>
        </div>
      </div>
      <div className="relative z-50 w-[90%] mx-auto max-w-7xl px-4 md:px-6">
        <article className="min-h-[40vh] md:min-h-132 absolute w-full md:w-xl bottom-10 md:bottom-14 left-0 md:left-auto right-0 flex flex-col gap-6 md:gap-10 p-5 md:p-8 rounded-t-lg bg-[#201F22] dark:bg-[#2A2A2A] text-white overflow-hidden">
          <h1 className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl line-clamp-2">
            {currentCase.title}
          </h1>
          <p
            className="text-[#C5C5C5] dark:text-[#A0A0A0] text-sm sm:text-base"
            style={{ lineHeight: 1.5 }}
          >
            {currentCase.description}
          </p>
          <div className="mt-auto relative overflow-hidden">
            <aside className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {currentCase.author.avatar && (
                  <Image
                    width={48}
                    height={48}
                    src={currentCase.author.avatar}
                    alt={currentCase.author.name}
                    className="rounded-full size-10 md:size-12 object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 overflow-hidden min-w-0">
                <h2 className="font-semibold text-sm md:text-base whitespace-nowrap">
                  {currentCase.author.name}
                </h2>
                <p className="text-[#848484] dark:text-[#707070] text-xs md:text-sm whitespace-nowrap">
                  {currentCase.author.role}
                </p>
              </div>
            </aside>
          </div>
        </article>
        <footer className="absolute w-full md:w-xl -bottom-2 md:-bottom-[9px] left-0 md:left-auto right-0 flex justify-end items-center gap-4 md:gap-5 bg-[#F14636] dark:bg-[#F14636]/90 rounded-b-lg px-5 md:px-10 py-4 md:py-6">
          <button
            type="button"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handlePrevious}
            aria-label="Previous testimonial"
          >
            <ArrowIcon className="w-4 h-4 md:w-auto md:h-auto" />
          </button>
          <button
            type="button"
            className="cursor-pointer rotate-180 hover:opacity-80 transition-opacity"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <ArrowIcon className="w-4 h-4 md:w-auto md:h-auto" />
          </button>
        </footer>
      </div>
    </section>
  );
}
