"use client";

import { ArrowRight } from "lucide-react";

interface ServiceItem {
  id: number;
  title: string;
  description?: string;
  background: string;
}

interface ServicesProps {
  services?: ServiceItem[];
}

const defaultServices: ServiceItem[] = [
  {
    id: 1,
    title: "Screws",
    description:
      "More than 100K different kinds of fasteners, such as nuts, screws, bolts, washers, pins, anchor bolts, etc. and supplement with special items, tailored to your application.",
    background: "/images/service1.jpg",
  },
  {
    id: 2,
    title: "Terminal",
    description:
      'Serving as a "bridge" between the cable and the equipment terminal, the robust structure enables safe, reliable, and convenient electrical connections.',
    background: "/images/service3.jpg",
  },
  {
    id: 3,
    title: "Cable Lug",
    description:
      "High clamping force, reliable, user-friendly, cost-effective, broad wire range compatibility.",
    background: "/images/service2.jpg",
  },
  {
    id: 4,
    title: "Spring",
    description:
      "More than 50K different kinds of Springs, such as Compression Spring, Tension/Extension Spring, Torsion Spring, Leaf Spring, Disc Spring, etc.",
    background: "/images/service4.jpg",
  },
];

export const Services = ({ services = defaultServices }: ServicesProps) => {
  return (
    <section className="pt-14 md:pt-18 lg:pt-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 sm:gap-6 h-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="w-full md:w-[calc((100%-1.5rem)/2)] xl:flex-1 group relative h-64 sm:h-80 md:h-[420px] lg:h-[520px] overflow-hidden rounded-lg cursor-pointer"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out md:group-hover:scale-110"
                style={{ backgroundImage: `url(${service.background})` }}
              >
                {/* Dark Overlay */}
                {/* <div className="absolute inset-0 bg-black/50 md:group-hover:bg-black/60 transition-colors duration-500" /> */}
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-4 sm:p-6">
                <h3 className="text-white hover:text-[#FC5220]/90 text-xl sm:text-2xl md:text-3xl font-bold mb-3 transition-all duration-500">
                  {service.title}
                </h3>

                {/* Divider */}
                <div className="w-full h-px bg-white/20 mb-3" />

                {/* Description - Hidden by default, shown on hover */}
                {service.description && (
                  <div className="md:max-h-0 md:group-hover:max-h-60 max-h-24 overflow-hidden transition-[max-height,margin] duration-300 ease-linear mb-2 md:mb-0 md:group-hover:mb-4">
                    <p className="text-white text-sm md:text-base opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500 ease-out">
                      {service.description}
                    </p>
                  </div>
                )}

                {/* Read More Link */}
                <a
                  href="#"
                  className={`inline-flex items-center gap-2 text-sm sm:text-base font-medium transition-colors duration-300 text-white md:group-hover:text-[#FC5220]/90`}
                >
                  Read More
                  <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
