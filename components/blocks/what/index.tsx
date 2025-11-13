"use client";

interface CaseItem {
  name: string;
  avatar: string;
  job: string;
  content: string;
  cardBg: string; // color
}

interface WhatProps {
  cases?: CaseItem[];
  title?: string;
  backgroundImage?: string;
}

const defaultTitle = "What Users Say About GMEX";
const defaultBackgroundImage = "/images/what1.jpg";

const defaultCases: CaseItem[] = [
  {
    name: "Jack Friks",
    avatar: "/images/why1.png",
    job: "Production Manager",
    content:
      "GMEX Group Fasteners has really helped our business. Would definitely recommend GMEX and will definitely be ordering again, very good customer service and efficient feedback, GMEX has made a huge difference! It is exactly what I have been looking for.",
    cardBg: "white",
  },
  {
    name: "Tom",
    avatar: "/images/why2.png",
    job: "Manufacturing Director",
    content:
      "I highly recommend GMEX Terminals. It has been so important for us as we continue to grow our company. I have been using terminals for over a year now and i love it! I can't imagine life without it. It's so easy to use, and the customer service is great. I have tried a lot of similar products and GEMEX is the best!",
    cardBg: "#EA9320",
  },
];

export const What = ({
  cases = defaultCases,
  title = defaultTitle,
  backgroundImage = defaultBackgroundImage,
}: WhatProps) => {
  return (
    <section
      className="w-full py-14 md:py-18 lg:py-20 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-white text-2xl sm:text-3xl md:text-5xl font-[800] text-center mb-10 md:mb-16">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {cases.map((item, idx) => {
            const isDarkCard = item.cardBg !== "white";
            return (
              <div
                key={`${item.name}-${idx}`}
                className="flex h-full flex-col justify-between rounded-sm py-10 px-15 shadow-xl"
                style={{ background: item.cardBg }}
              >
                <p
                  className={`text-sm md:text-base leading-relaxed ${
                    isDarkCard ? "text-white" : "text-[#3D3D3D]"
                  }`}
                >
                  {item.content}
                </p>

                <div className="flex items-center gap-3 md:gap-4 mt-auto pt-10">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="rounded-full size-12"
                  />
                  <div
                    className={`text-sm ${isDarkCard ? "text-white" : "text-[#3D3D3D]"}`}
                  >
                    <div className="font-bold">{item.name}</div>
                    <div
                      className={`${isDarkCard ? "opacity-80" : "opacity-60"}`}
                    >
                      {item.job}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
