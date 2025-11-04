import { ArrowRightIcon } from "@/components/icon/home-icons";
import "./index.css";

interface ShowcaseProps {
  title?: string;
  cases?: Array<{
    cover?: string;
    title: string;
    description: string;
    buttonText?: string;
    buttonHref?: string;
  }>;
  className?: string;
}

export default function Showcase(props: ShowcaseProps) {
  const { title, cases, className } = props;

  if (!title && (!cases || cases.length === 0)) {
    return null;
  }
  return (
    <section
      className={`min-h-screen flex flex-col items-center justify-center py-12 md:py-20 lg:py-25 px-4 md:px-6 ${className || ""}`}
    >
      {title && (
        <h1 className="font-extrabold text-[#3D3D3D] dark:text-[#E5E5E5] text-2xl sm:text-3xl md:text-4xl text-center max-w-4xl">
          {title}
        </h1>
      )}
      {cases && cases.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 text-white mt-8 md:mt-12 lg:mt-15 w-full max-w-7xl">
          {cases.map((item) => (
            <figure
              key={item.title}
              className="case-item relative rounded-lg overflow-hidden w-full aspect-[7/8] sm:aspect-auto sm:h-119"
            >
              {item.cover && (
                <img
                  draggable={false}
                  className="w-full h-full object-cover"
                  src={item.cover}
                  alt={item.title}
                />
              )}
              <figcaption className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-7 md:px-8 space-y-3 md:space-y-4">
                <h2 className="text-base md:text-lg font-bold">{item.title}</h2>
                <hr className="border-white/5 dark:border-white/10" />
                <p className="case-description text-xs md:text-sm">
                  {item.description}
                </p>
                <footer>
                  {"buttonHref" in item && item.buttonHref ? (
                    <a
                      href={item.buttonHref}
                      className="flex items-center gap-2 text-white/50 dark:text-[#E5E5E5]/60 hover:text-white transition-colors duration-300 cursor-pointer text-xs md:text-sm"
                    >
                      <span>{item.buttonText || "Read More"}</span>
                      <ArrowRightIcon className="inline-flex translate-y-px w-3 h-3 md:w-auto md:h-auto" />
                    </a>
                  ) : (
                    <button
                      className="flex items-center gap-2 text-white/50 dark:text-[#E5E5E5]/60 hover:text-white transition-colors duration-300 cursor-pointer text-xs md:text-sm"
                      type="button"
                    >
                      <span>{item.buttonText || "Read More"}</span>
                      <ArrowRightIcon className="inline-flex translate-y-px w-3 h-3 md:w-auto md:h-auto" />
                    </button>
                  )}
                </footer>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
