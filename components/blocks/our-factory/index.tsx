"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface OurFactoryProps {
  title?: string;
  description?: string;
  images?: { src: string; alt?: string; description?: string }[];
  className?: string;
  carousel?: boolean;
  imageFit?: "cover" | "contain";
}

export const OurFactory = ({
  title,
  description,
  images = [],
  className,
  carousel = false,
  imageFit = "cover",
}: OurFactoryProps) => {
  const renderImageItem = (
    img: { src: string; alt?: string; description?: string },
    idx: number,
  ) => (
    <div
      key={`${img.src}-${idx}`}
      className="group w-full overflow-hidden rounded-md cursor-pointer"
    >
      <Image
        src={img.src}
        alt={img.alt || `factory-${idx + 1}`}
        width={1200}
        height={640}
        className={cn(
          "h-64 w-full md:h-72 lg:h-80 transition-transform duration-300 hover:scale-105",
          imageFit === "contain" ? "object-contain" : "object-cover"
        )}
      />

      {img.description && (
        <div className="rounded-md mt-5 px-4 py-4 text-center text-base font-bold bg-[#EDEDED] group-hover:bg-[#EA9320] group-hover:text-white transition-colors duration-200">
          {img.description}
        </div>
      )}
    </div>
  );

  return (
    <section className={cn("py-20 bg-[#F7F7F7]", className)}>
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">{title}</h2>
          {description && (
            <p className="text-muted-foreground md:text-lg">{description}</p>
          )}
        </div>
        {carousel ? (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {images.map((img, idx) => (
                  <CarouselItem
                    key={`${img.src}-${idx}`}
                    className="pl-2 md:pl-4 basis-full md:basis-1/3"
                  >
                    {renderImageItem(img, idx)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                disabled={false}
                icon={<ArrowLeft className="size-4 md:size-5" />}
                className="hidden md:flex size-10 md:size-15 bg-white/75 hover:bg-[#EA9320] shadow-lg border-0 text-gray-700 hover:text-white rounded-full absolute top-1/2 left-2 md:left-6 -translate-y-1/2 z-10"
              />
              <CarouselNext
                disabled={false}
                icon={<ArrowRight className="size-4 md:size-5" />}
                className="hidden md:flex size-10 md:size-15 bg-white/75 hover:bg-[#EA9320] shadow-lg border-0 text-gray-700 hover:text-white rounded-full absolute top-1/2 right-2 md:right-6 -translate-y-1/2 z-10"
              />
            </Carousel>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {images.map((img, idx) => renderImageItem(img, idx))}
          </div>
        )}
      </div>
    </section>
  );
};
