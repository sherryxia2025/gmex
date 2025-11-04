"use client";

import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";

const items = [
  "/images/comment2.png",
  "/images/comment3.png",
  "/images/comment4.png",
  "/images/comment5.png",
  "/images/comment1.png",
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay: 0.25,
      staggerChildren: 0.2,
    },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 200 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

function AnimatedContent({ index }: { index: number }) {
  const { api } = useCarousel();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setIsSelected(api.selectedScrollSnap() === index);
    };

    setIsSelected(api.selectedScrollSnap() === index);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, index]);

  return (
    <motion.div
      className="w-full max-w-[600px] md:w-[600px] text-white flex flex-col gap-3 md:gap-4 px-4 md:px-0"
      variants={staggerContainer}
      initial="hidden"
      animate={isSelected ? "show" : "hidden"}
      key={index}
    >
      <motion.h1
        variants={staggerItem}
        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-[800] leading-tight"
      >
        Special industrial production process in our places
      </motion.h1>
      <motion.p
        variants={staggerItem}
        className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed"
      >
        A wide range of work – from planning and establishing the Framework
        completing and dispatching. Tight cutoff times, sensible.
      </motion.p>
      <motion.div variants={staggerItem}>
        <Button className="bg-[#FC5220] hover:bg-[#FC5220]/90 rounded-sm text-xs sm:text-sm px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-6 font-bold mt-3 sm:mt-4 md:mt-8 w-full sm:w-auto">
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const plugin = useRef(Autoplay({ delay: 10000, stopOnInteraction: true }));

  return (
    <div className="w-screen h-screen flex justify-center items-center relative">
      <Carousel
        className="w-full h-full"
        opts={{ loop: true }}
        plugins={[plugin.current, Fade()]}
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={item} className="w-full h-full">
              <div
                className="bg-cover bg-center w-full h-screen flex flex-col justify-center px-4 sm:px-6 md:px-0 md:items-center 2xl:items-start 2xl:pl-80"
                style={{ backgroundImage: `url(${item})` }}
              >
                <AnimatedContent index={index} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          icon={<ArrowLeft className="size-4 md:size-6" />}
          disabled={false}
          className="size-10 md:size-16 bg-[#FC5220] hover:bg-[#FC5220] opacity-20 hover:opacity-100 text-white hover:text-white rounded-full absolute top-1/2 left-2 md:left-4 -translate-y-1/2 cursor-pointer z-10 hidden md:flex"
        />
        <CarouselNext
          icon={<ArrowRight className="size-4 md:size-6" />}
          disabled={false}
          className="size-10 md:size-16 bg-[#FC5220] hover:bg-[#FC5220] opacity-20 hover:opacity-100 text-white hover:text-white rounded-full absolute top-1/2 right-2 md:right-4 -translate-y-1/2 cursor-pointer z-10 hidden md:flex"
        />
      </Carousel>
    </div>
  );
}
