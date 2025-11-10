import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutUsProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  features?: string[];
  buttonSecondary?: {
    text: string;
    href: string;
  } | null;
}

export const AboutUs = ({
  title,
  description,
  imageSrc,
  imageAlt,
  features = [],
  buttonSecondary,
}: AboutUsProps) => {
  return (
    <section className="py-25">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h2 className="my-6 mt-0 text-balance text-4xl font-semibold lg:text-5xl">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground mb-8 max-w-xl lg:text-lg">
                {description}
              </p>
            )}
            <div className="flex flex-col gap-4 mb-8">
              {features.map((item) => (
                <div className="flex items-center gap-2" key={item}>
                  <div className="size-6 bg-[#FC5220]/10 rounded-full flex items-center justify-center">
                    <Check className="size-4 text-[#FC5220]" />
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            {buttonSecondary && (
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                <Button
                  variant="outline"
                  asChild
                  style={{
                    background:
                      "linear-gradient(0deg, #EA9320, #EA9320), #FFCA37",
                  }}
                  className="text-white hover:text-white rounded-sm"
                >
                  <a href={buttonSecondary.href} target="_blank">
                    {buttonSecondary.text}
                  </a>
                </Button>
              </div>
            )}
          </div>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-h-96 w-full rounded-md object-cover"
          />
        </div>
      </div>
    </section>
  );
};
