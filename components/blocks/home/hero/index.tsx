import Image from "next/image";
import { HomeBrad, HomeBrush } from "@/components/icon/home-icons";
import HeroBgLayer1 from "@/public/images/bg-1.png";
import HeroBgLayer2 from "@/public/images/bg-2.png";
import HeroBgLayer3 from "@/public/images/bg-3.png";

interface HeroProps {
  title?: string;
  title2?: string;
  brandName?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export default function Hero(props: HeroProps) {
  const {
    title,
    title2,
    brandName,
    description,
    buttonText,
    buttonHref,
    className,
  } = props;

  if (!title && !brandName && !description && !buttonText) {
    return null;
  }

  return (
    <section
      className={`overflow-hidden relative w-full flex flex-col items-center gap-6 md:gap-9 min-h-[100svh] pt-51 md:pt-49.5 2xl:pt-70 bg-[#F9F8F5] dark:bg-[#0F0F0F] transition-colors text-center px-4 md:px-6 ${className || ""}`}
    >
      <div className="absolute inset-0 -z-0 w-screen h-full flex items-bottom justify-center">
        <Image
          draggable={false}
          className="absolute -bottom-3/5 dark:invert scale-75 sm:scale-90 md:scale-100"
          src={HeroBgLayer3}
          alt="Hero Background rings"
          width={1112}
          height={1112}
          priority
        />
        <Image
          draggable={false}
          className="absolute bottom-19 scale-75 sm:scale-90 md:scale-100"
          src={HeroBgLayer2}
          alt="Hero Background dots"
          width={980}
          height={151}
          priority
        />
        <Image
          draggable={false}
          className="absolute bottom-24 scale-75 sm:scale-90 md:scale-100"
          src={HeroBgLayer1}
          alt="Hero Background logos"
          width={919}
          height={258}
          priority
        />
      </div>
      <div className="flex flex-col gap-6 items-center justify-center md:h-60">
        <h1 className="leading-[calc(1em+10px)] flex flex-col md:flex-row gap-3 relative z-10 text-6xl md:text-5xl lg:text-6xl font-extrabold text-[#151417] dark:text-white transition-colors max-w-4xl">
          {brandName && <BrandName brandName={brandName} />}{" "}
          <span>{title}</span> <span>{title2}</span>
        </h1>
        <p className="relative z-10 text-sm sm:text-base md:text-lg text-[#666666] dark:text-[#A0A0A0] transition-colors max-w-3xl px-4">
          {description}
        </p>
      </div>

      <nav className="relative z-10 flex items-center justify-center md:mt-40 top-[10px]">
        {buttonHref ? (
          <a
            href={buttonHref}
            className="font-medium px-6 py-3 md:px-8 md:py-4 w-auto md:w-45 bg-[#F14636] rounded-lg text-white cursor-pointer hover:bg-[#F14636]/80 transition-colors"
          >
            {buttonText}
          </a>
        ) : (
          <button
            type="button"
            className="font-medium px-6 py-3 md:px-8 md:py-4 w-auto md:w-45 bg-[#F14636] rounded-lg text-white cursor-pointer hover:bg-[#F14636]/80 transition-colors"
          >
            {buttonText}
          </button>
        )}
      </nav>
    </section>
  );
}

function BrandName({
  brandName,
}: {
  brandName: string;
  icons?: { brush?: string; brad?: string };
}) {
  return (
    <span className="relative">
      <HomeBrush className="absolute w-[105%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] text-[#FFCF5E]" />
      <span className="relative z-10">{brandName}</span>
      <HomeBrad className="absolute top-[0.25em] -right-[0.25em] text-[#FFCF5E]" />
    </span>
  );
}
