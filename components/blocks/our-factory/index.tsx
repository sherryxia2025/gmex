import Image from "next/image";
import { cn } from "@/lib/utils";

interface OurFactoryProps {
  title?: string;
  description?: string;
  images?: { src: string; alt?: string; description?: string }[];
  className?: string;
}

export const OurFactory = ({
  title,
  description,
  images = [],
  className,
}: OurFactoryProps) => {
  return (
    <section className={cn("py-20 bg-[#F7F7F7]", className)}>
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">{title}</h2>
          {description && (
            <p className="text-muted-foreground md:text-lg">{description}</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {images.map((img, idx) => (
            <div
              key={`${img.src}-${idx}`}
              className="group w-full overflow-hidden rounded-md cursor-pointer"
            >
              <Image
                src={img.src}
                alt={img.alt || `factory-${idx + 1}`}
                width={1200}
                height={640}
                className="h-64 w-full object-cover md:h-72 lg:h-80 transition-transform duration-300 hover:scale-105"
              />

              {img.description && (
                <div className="rounded-md mt-5 px-4 py-4 text-center text-base font-bold bg-[#EDEDED] group-hover:bg-[#EA9320] group-hover:text-white transition-colors duration-200">
                  {img.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
