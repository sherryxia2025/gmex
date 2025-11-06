interface ScenariosProps {
  title?: string;
  description?: string;
  items?: Array<{
    title: string;
    cover?: string;
  }>;
  className?: string;
}

const defaultTitle = "Application Scenarios";
const defaultDescription =
  "Everything you need to launch your AI SaaS startup quickly and efficiently.";
const defaultItems: ScenariosProps["items"] = [
  {
    title: "Wind Power Generation",
    cover: "/images/scenarios1.png",
  },
  {
    title: "Electrical Prower",
    cover: "/images/scenarios2.png",
  },
  {
    title: "New Energy Vehicles",
    cover: "/images/scenarios3.png",
  },
  {
    title: "Photovoltaic Industry",
    cover: "/images/scenarios4.png",
  },
  {
    title: "Telecommunication",
    cover: "/images/scenarios5.png",
  },
  {
    title: "Next",
    cover: "/images/scenarios6.png",
  },
];

export default function Scenarios(props: ScenariosProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12 lg:mt-15 gap-6 md:gap-8 lg:gap-10 w-full max-w-7xl cursor-pointer">
          {items.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="group relative h-48 sm:h-56 md:h-60 lg:h-64 overflow-hidden rounded-xl border border-transparent transition-colors duration-300 shadow-[0_2px_18px_rgba(0,0,0,0.08)]"
            >
              <div
                className="absolute inset-0 bg-center bg-cover transition-transform duration-700 ease-out md:group-hover:scale-105"
                style={{ backgroundImage: `url(${item.cover || ""})` }}
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0">
                <div className="w-full bg-black/45 md:group-hover:bg-black/55 backdrop-blur-[2px] px-3 py-2">
                  <p className="text-white text-lg md:text-xl font-semibold drop-shadow-sm">
                    {item.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
