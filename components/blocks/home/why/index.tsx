"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icon";
import ChevronDownIcon from "@/components/icon/chevron-down-icon";

interface WhyProps {
  title?: string;
  description?: string;
  questions?: Array<{
    icon?: string;
    question: string;
    answer: string;
  }>;
  cover?: string;
  className?: string;
}

export default function Why(props: WhyProps) {
  const { title, description, questions, cover, className } = props;

  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openStates, setOpenStates] = useState<boolean[]>(() => {
    const states = Array(questions?.length || 0).fill(false);
    states[0] = true;
    return states;
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    event.preventDefault();

    const currentDetail = detailsRefs.current[index];
    const currentContent = contentRefs.current[index];

    if (!currentDetail || !currentContent) return;

    const isCurrentlyOpen = openStates[index];
    const newOpenStates = [...openStates];

    detailsRefs.current.forEach((detail, i) => {
      if (detail && i !== index && openStates[i]) {
        const otherContent = contentRefs.current[i];
        if (otherContent) {
          otherContent.style.height = `${otherContent.scrollHeight}px`;
          requestAnimationFrame(() => {
            otherContent.style.height = "0px";
          });
        }
        newOpenStates[i] = false;
        setTimeout(() => {
          detail.open = false;
        }, 300);
      }
    });

    if (isCurrentlyOpen) {
      currentContent.style.height = `${currentContent.scrollHeight}px`;
      requestAnimationFrame(() => {
        currentContent.style.height = "0px";
      });
      newOpenStates[index] = false;
      setTimeout(() => {
        currentDetail.open = false;
      }, 300);
    } else {
      currentDetail.open = true;
      const contentHeight = currentContent.scrollHeight;
      currentContent.style.height = "0px";
      requestAnimationFrame(() => {
        currentContent.style.height = `${contentHeight}px`;
      });
      newOpenStates[index] = true;
    }

    setOpenStates(newOpenStates);
  };

  useEffect(() => {
    contentRefs.current.forEach((content, index) => {
      if (content) {
        if (index === 0) {
          content.style.height = `${content.scrollHeight}px`;
        } else {
          content.style.height = "0px";
        }
      }
    });
    if (detailsRefs.current[0]) {
      detailsRefs.current[0].open = true;
    }
  }, []);

  if (!title && !description && (!questions || questions.length === 0)) {
    return null;
  }

  return (
    <section
      className={`min-h-screen flex flex-col items-center justify-center gap-5 py-12 md:py-20 lg:py-25 px-4 md:px-6 ${className || ""}`}
    >
      {title && (
        <h1 className="font-extrabold text-[#3D3D3D] dark:text-[#E5E5E5] text-2xl sm:text-3xl md:text-4xl text-center">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-[#666666] dark:text-[#A0A0A0] text-sm sm:text-base text-center max-w-2xl px-4">
          {description}
        </p>
      )}
      {questions && questions.length > 0 && (
        <div className="mt-8 md:mt-12 lg:mt-15 flex flex-col lg:flex-row gap-8 lg:gap-15 w-full max-w-7xl">
          <main className="w-full lg:w-xl space-y-4">
            {questions.map((question, index) => (
              <details
                key={question.question}
                ref={(el) => {
                  detailsRefs.current[index] = el;
                }}
                className="rounded p-3 md:p-4"
              >
                {/** biome-ignore lint/a11y/noStaticElementInteractions: for switch icon css */}
                <summary
                  onClick={(e) => handleClick(e, index)}
                  className="flex justify-between items-center text-[#555555] dark:text-[#A0A0A0] font-bold text-sm md:text-base cursor-pointer"
                >
                  <span className="inline-flex items-center">
                    <span
                      className={`${openStates[index] ? "bg-[#F14636] text-white" : "bg-[#F9F1EB] dark:bg-[#F14636]/20 text-[#F14636]"} inline-flex items-center justify-center size-8 md:size-10 rounded-full mr-2 md:mr-3 transition-colors duration-200`}
                    >
                      {question.icon && <Icon name={question.icon as string} />}
                    </span>
                    <span className="line-clamp-2">{question.question}</span>
                  </span>
                  <div className="relative w-5 h-5 flex-shrink-0">
                    <ChevronDownIcon
                      className={`transition-transform duration-300 ${openStates[index] ? "rotate-180" : "rotate-0"}`}
                    />
                  </div>
                </summary>
                <div
                  ref={(el) => {
                    contentRefs.current[index] = el;
                  }}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                >
                  <div
                    className={`pt-3 pb-6 ${index === questions.length - 1 ? "" : "border-b border-[#EBEBEB] dark:border-[#404040]"}`}
                  >
                    <p className="text-[#666666] dark:text-[#A0A0A0] text-sm md:text-base line-clamp-6">
                      {question.answer}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </main>
          {cover && (
            <div className="w-full lg:w-auto flex justify-center items-center">
              <img
                draggable={false}
                src={cover}
                alt={title || "Why Choose PressFast"}
                className="w-full max-w-md lg:max-w-none lg:w-[500px] object-cover lg:h-auto"
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
