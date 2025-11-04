import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutUsProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  buttonSecondary?: {
    text: string;
    href: string;
  };
}

export const AboutUs = ({
  title = "Blocks built with Shadcn & Tailwind",
  description = "Hundreds of finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  imageSrc = "/images/what1.png",
  imageAlt = "placeholder hero",
  buttonSecondary = {
    text: "Learn More",
    href: "https://shadcnblocks.com",
  },
}: AboutUsProps) => {
  return (
    <section className="py-32">
      <div className="container">
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
              <div className="flex items-center gap-2">
                <div className="size-6 bg-[#FC5220]/10 rounded-full flex items-center justify-center">
                  <Check className="size-4 text-[#FC5220]" />
                </div>
                <p>We Are Bring Quality Services</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-6 bg-[#FC5220]/10 rounded-full flex items-center justify-center">
                  <Check className="size-4 text-[#FC5220]" />
                </div>
                <p>We Are Bring Quality Services</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-6 bg-[#FC5220]/10 rounded-full flex items-center justify-center">
                  <Check className="size-4 text-[#FC5220]" />
                </div>
                <p>We Are Bring Quality Services</p>
              </div>
            </div>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button
                variant="outline"
                asChild
                className="bg-[#FC5220] text-white hover:bg-[#FC5220]/90 hover:text-white"
              >
                <a href={buttonSecondary.href} target="_blank">
                  {buttonSecondary.text}
                </a>
              </Button>
            </div>
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
