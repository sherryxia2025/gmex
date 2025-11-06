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
}

const defaultTitle = "What Users Say About GMEX";

const defaultCases: CaseItem[] = [
  {
    name: "Jack Friks",
    avatar: "/images/why1.png",
    job: "Designer",
    content:
      "I highly recommend industrial. It has been so important for us as we continue to grow our company. I have been using industrial for over a year now and i love it! I can't imagine life without it. It's so easy to use, and the customer service is great. I have tried a lot of similar products and Industrial is the best!",
    cardBg: "white",
  },
  {
    name: "Tom",
    avatar: "/images/why2.png",
    job: "Designer",
    content:
      "I can't say enough about industrial. Industrial has really helped our business. Would definitely recommend industrial and will definitely be ordering again. Industrial has made a huge difference! I have tried a few software of this kind and industrial is the best by far! Industrial is exactly what i've been looking for.",
    cardBg: "#EA9320",
  },
];

export const What = ({
  cases = defaultCases,
  title = defaultTitle,
}: WhatProps) => {
  return (
    <section
      className="w-full py-16 md:py-24 lg:py-28 bg-cover bg-center"
      style={{ backgroundImage: "url(/images/comment.png)" }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-white text-2xl sm:text-3xl md:text-5xl font-[800] text-center mb-10 md:mb-16">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {cases.map((item, idx) => {
            const isDarkCard = item.cardBg !== "white";
            return (
              <div
                key={`${item.name}-${idx}`}
                className="rounded-sm py-10 px-15 shadow-xl"
                style={{ background: item.cardBg }}
              >
                <p
                  className={`text-sm md:text-base leading-relaxed ${
                    isDarkCard ? "text-white" : "text-[#3D3D3D]"
                  }`}
                >
                  {item.content}
                </p>

                <div className="flex items-center gap-3 md:gap-4 mt-10">
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
