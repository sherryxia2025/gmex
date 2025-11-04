import Icon from "@/components/icon";

interface FeaturesProps {
  title?: string;
  description?: string;
  items?: Array<{
    icon?: string;
    title: string;
    description: string;
  }>;
  className?: string;
}

export default function Features(props: FeaturesProps) {
  const { title, description, items, className } = props;

  if (!title && !description && (!items || items.length === 0)) {
    return null;
  }
  return (
    <section
      className={`min-h-screen flex flex-col items-center justify-center gap-5 py-12 md:py-20 lg:py-25 px-4 md:px-6 ${className || ""}`}
    >
      {title && (
        <h1 className="max-w-7xl text-[#3D3D3D] dark:text-[#E5E5E5] font-extrabold text-2xl sm:text-3xl md:text-4xl text-center">
          {title}
        </h1>
      )}
      {description && (
        <p className="max-w-7xl text-[#666666] dark:text-[#A0A0A0] text-base sm:text-lg md:text-xl text-center px-4">
          {description}
        </p>
      )}
      {items && items.length > 0 && (
        <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12 lg:mt-15 gap-6 md:gap-8 lg:gap-10 w-full">
          {items.map((item) => (
            <article
              key={item.title}
              className="space-y-3 md:space-y-4 h-auto md:h-53"
            >
              <h1>
                <span className="text-[#F14636] inline-flex items-center justify-center size-12 md:size-16 bg-[#F9F1EB] dark:bg-[#F14636]/20 rounded-xl">
                  {item.icon && <Icon name={item.icon as string} />}
                </span>
              </h1>
              <h2 className="text-[#555555] dark:text-[#A0A0A0] text-lg md:text-xl font-extrabold line-clamp-2">
                {item.title}
              </h2>
              <p className="text-[#666666] dark:text-[#A0A0A0] text-sm md:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
