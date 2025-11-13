import Image from "next/image";
import type { LogoItem, LogosConfig } from "./config";
import { defaultLogosConfig } from "./config";

interface LogosProps extends Partial<LogosConfig> {
  items?: LogoItem[];
}

export function Logos({
  title = defaultLogosConfig.title,
  subtitle = defaultLogosConfig.subtitle,
  items = defaultLogosConfig.items,
}: LogosProps) {
  return (
    <section className="w-full py-14 md:py-18 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-center text-2xl sm:text-3xl md:text-5xl font-[800] text-[#1F2937] dark:text-white">
          {title}
        </h2>
        <p className="mt-5 text-center text-sm md:text-base text-[#6B7280]">
          {subtitle}
        </p>

        <div className="mt-10 md:mt-14 flex flex-wrap justify-center gap-4 md:gap-6">
          {items.map((logo) => (
            <div
              key={logo.name}
              className="bg-white rounded-sm border border-black/5 w-[140px] sm:w-[150px] md:w-[160px] lg:w-[170px] h-[78px] flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={190}
                height={78}
                className="max-h-12 md:max-h-14 w-auto object-contain opacity-90"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
