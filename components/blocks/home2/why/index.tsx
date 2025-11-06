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
  "We are a team of experienced professionals who are dedicated to providing the best possible service to our clients.";
const defaultItems: WhyProps["items"] = [
  {
    title: "Why Choose GMEX",
    description:
      "We are a team of experienced professionals who are dedicated to providing the best possible service to our clients.",
    cover: "/images/why1.png",
  },
  {
    title: "Why Choose GMEX",
    description:
      "We are a team of experienced professionals who are dedicated to providing the best possible service to our clients.",
    cover: "/images/why2.png",
  },
  {
    title: "Why Choose GMEX",
    description:
      "We are a team of experienced professionals who are dedicated to providing the best possible service to our clients.",
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
      className={`min-h-screen flex flex-col items-center justify-center gap-5 py-12 md:py-20 lg:py-25 px-4 md:px-6 ${className || ""}`}
    >
      {title && (
        <h1 className="max-w-3xl text-[#3D3D3D] dark:text-[#E5E5E5] font-extrabold text-2xl sm:text-3xl md:text-4xl text-center">
          {title}
        </h1>
      )}
      {description && (
        <p className="max-w-3xl text-[#666666] dark:text-[#A0A0A0] text-base sm:text-lg md:text-xl text-center px-4">
          {description}
        </p>
      )}
      {items && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12 lg:mt-15 gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl">
          {items.map((item, index) => (
            <figure
              key={index}
              className="flex flex-col rounded-lg overflow-hidden w-full h-auto bg-[#F7F7F7] dark:bg-[#2A2A2A]"
            >
              {item.cover && (
                <img
                  draggable={false}
                  src={item.cover}
                  alt={item.title}
                  className="w-full object-cover"
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
    </section>
  );
}
