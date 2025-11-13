interface WhyProps {
  title?: string;
  description?: string;
  items?: Array<{
    title: string;
    description: string;
    cover?: string;
  }>;
  className?: string;
}

const defaultTitle = "Why choose us?";
const defaultDescription =
  "By seamlessly integrating high quality, low cost, and accelerated timelines to optimize your entire operation.";
const defaultItems: WhyProps["items"] = [
  {
    title: "High Quality",
    description:
      "With global expertise, we deliver tailored solutions and cutting-edge tech to accelerate your market entry, boost satisfaction and maximize performance",
    cover: "/images/why1.png",
  },
  {
    title: "Low Cost",
    description:
      "Cost-effective manufacturing with precise costing, economies of Scale,  global sourcing and direct to consumer to drive large-scale growth",
    cover: "/images/why2.png",
  },
  {
    title: "Short Lead Time",
    description:
      "Our customized intelligent logistics ensure a reliable supply chain, giving you full control and more time for your core business.",
    cover: "/images/why3.png",
  },
];

export default function Why(props: WhyProps) {
  const {
    title = defaultTitle,
    description = defaultDescription,
    items = defaultItems,
    className,
  } = props;

  if (!title && !description && (!items || items.length === 0)) {
    return null;
  }

  return (
    <section
      className={`pt-14 md:pt-18 lg:pt-20 flex flex-col items-center gap-5 ${className || ""}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {title && (
          <h1 className="max-w-3xl text-[#3D3D3D] dark:text-[#E5E5E5] font-extrabold text-2xl sm:text-3xl md:text-4xl text-center mx-auto">
            {title}
          </h1>
        )}
        {description && (
          <p className="max-w-3xl text-[#666666] dark:text-[#A0A0A0] text-base sm:text-lg md:text-xl text-center px-4 mx-auto mt-5">
            {description}
          </p>
        )}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12 lg:mt-15 gap-6 md:gap-8 lg:gap-10 w-full">
            {items.map((item, index) => (
              <figure
                key={index}
                className={`flex flex-col rounded-lg overflow-hidden w-full h-auto bg-[#F7F7F7] dark:bg-[#2A2A2A] ${index === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                {item.cover && (
                  <img
                    draggable={false}
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-48 md:h-56 lg:h-64 object-cover"
                  />
                )}
                <figcaption className="flex-1 p-4 md:p-6 space-y-3 md:space-y-4">
                  <h2 className="text-[#3D3D3D] dark:text-[#E5E5E5] text-lg md:text-xl font-extrabold line-clamp-1">
                    {item.title}
                  </h2>
                  <p className="text-[#666666] dark:text-[#A0A0A0] text-sm md:text-base line-clamp-6">
                    {item.description}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
