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
      "Screw is a cylindrical fastener with threads that generates clamping force through rotation and is used to detachably connect two or more objects.",
    background: "/images/service1.jpg",
  },
  {
    id: 2,
    title: "Terminal",
    description:
      "Terminal block is a standardized electrical connection component used to reliably connect wires to electrical devices or other wires, facilitating installation and maintenance.",
    background: "/images/service2.jpg",
  },
  {
    id: 3,
    title: "Cable Lug",
    description:
      "Cable Lug this is a screw-type terminal block assembly that clamps wires by tightening screws to achieve reliable and detachable connections in electrical circuits, commonly used in the wiring of industrial and electronic equipment.",
    background: "/images/service3.jpg",
  },
  {
    id: 4,
    title: "Spring",
    description:
      "Spring is a mechanical component made of elastic material that stores/releases energy and transmits force through deformation, widely used in buffering, resetting, clamping and other scenarios.",
    background: "/images/service4.jpg",
  },
];

export const Services = ({ services = defaultServices }: ServicesProps) => {
  return (
    <section className="py-10 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4 sm:gap-6 h-auto justify-between">
          {services.map((service) => (
            <div
              key={service.id}
              className="w-full lg:flex-1 group relative h-64 sm:h-80 md:h-[420px] lg:h-[520px] overflow-hidden rounded-lg cursor-pointer"
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
                <div className="w-full h-0.5 bg-white/50 mb-3" />

                {/* Description - Hidden by default, shown on hover */}
                {service.description && (
                  <div className="md:max-h-0 md:group-hover:max-h-40 max-h-24 overflow-hidden transition-[max-height,margin] duration-300 ease-linear mb-2 md:mb-0 md:group-hover:mb-4">
                    <p className="text-white text-sm md:text-base opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-500 ease-out">
                      {service.description}
                    </p>
                  </div>
                )}

                {/* Read More Link */}
                <a
                  href="#"
                  className={`inline-flex items-center gap-2 text-sm sm:text-base font-medium underline transition-colors duration-300 text-white md:group-hover:text-[#FC5220]/90`}
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
