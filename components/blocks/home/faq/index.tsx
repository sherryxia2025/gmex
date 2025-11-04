"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MinusIcon from "@/components/icon/minus-icon";
import PlusIcon from "@/components/icon/plus-icon";
import { useIsMobile } from "@/hooks/use-mobile";

interface FAQProps {
  title?: string;
  description?: string;
  questions?: Array<{
    question: string;
    answer: string;
  }>;
  className?: string;
  columns?: number; // number of columns to split the FAQ list into
}

export default function FAQ(props: FAQProps) {
  const { title, description, questions, className, columns = 2 } = props;
  const isMobile = useIsMobile();

  // Split questions into N columns by contiguous chunks for better reading order
  const safeQuestions = questions || [];
  const columnCount = useMemo(() => {
    if (isMobile) return 1;
    return Math.max(1, Math.min(columns, safeQuestions.length || 1));
  }, [isMobile, columns, safeQuestions.length]);

  const columnsData: (typeof safeQuestions)[] = useMemo(() => {
    const baseSize = Math.ceil(safeQuestions.length / columnCount);
    return Array.from({ length: columnCount }, (_, colIdx) =>
      safeQuestions.slice(colIdx * baseSize, (colIdx + 1) * baseSize),
    );
  }, [safeQuestions, columnCount]);

  // Refs and state per column
  const detailsRefs = useRef<(HTMLDetailsElement | null)[][]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const [openStates, setOpenStates] = useState<boolean[][]>(
    columnsData.map((col) => Array(col.length).fill(false)),
  );

  // Reset when questions/columns change
  useEffect(() => {
    detailsRefs.current = columnsData.map(() => []);
    contentRefs.current = columnsData.map(() => []);
    setOpenStates(columnsData.map((col) => Array(col.length).fill(false)));
  }, [columnsData]);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    colIndex: number,
    itemIndex: number,
  ) => {
    event.preventDefault();

    const currentDetail = detailsRefs.current[colIndex]?.[itemIndex] || null;
    const currentContent = contentRefs.current[colIndex]?.[itemIndex] || null;
    if (!currentDetail || !currentContent) return;

    const isCurrentlyOpen = openStates[colIndex]?.[itemIndex] || false;
    const newOpenStates = openStates.map((col) => [...col]);

    // Close other items within the same column (mutually exclusive per column)
    detailsRefs.current[colIndex]?.forEach((detail, i) => {
      if (detail && i !== itemIndex && openStates[colIndex]?.[i]) {
        const otherContent = contentRefs.current[colIndex]?.[i] || null;
        if (otherContent) {
          otherContent.style.height = `${otherContent.scrollHeight}px`;
          requestAnimationFrame(() => {
            otherContent.style.height = "0px";
          });
        }
        newOpenStates[colIndex][i] = false;
        setTimeout(() => {
          detail.open = false;
        }, 300);
      }
    });

    // Toggle the current item
    if (isCurrentlyOpen) {
      currentContent.style.height = `${currentContent.scrollHeight}px`;
      requestAnimationFrame(() => {
        currentContent.style.height = "0px";
      });
      newOpenStates[colIndex][itemIndex] = false;
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
      newOpenStates[colIndex][itemIndex] = true;
    }

    setOpenStates(newOpenStates);
  };

  // Initialize heights
  useEffect(() => {
    contentRefs.current.forEach((col) => {
      col.forEach((content) => {
        if (content) {
          content.style.height = "0px";
        }
      });
    });
  }, [columnsData]);

  // Tailwind grid cols classes (enumerated to avoid dynamic class names)
  const gridColsClass = (() => {
    switch (columnCount) {
      case 4:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
      case 3:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
      case 2:
        return "grid grid-cols-1 md:grid-cols-2 gap-4";
      default:
        return "grid grid-cols-1 gap-4";
    }
  })();

  if (!title && !description && (!questions || questions.length === 0)) {
    return null;
  }

  return (
    <section
      className={`py-25 md:py-20 lg:py-25 bg-[#F9F8F5] dark:bg-[#0F0F0F] px-4 md:px-6 ${className || ""}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-8 md:gap-16 lg:gap-20">
        <div className="flex flex-col items-center justify-start gap-4 md:gap-6 w-full lg:w-auto">
          {title && (
            <h1 className="uppercase text-[#3D3D3D] dark:text-[#E5E5E5] font-extrabold text-2xl sm:text-3xl md:text-4xl">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-[#666666] dark:text-[#A0A0A0] text-sm md:text-base">
              {description}
            </p>
          )}
        </div>
        {safeQuestions.length > 0 && (
          <main className={`w-full ${gridColsClass}`}>
            {columnsData.map((col, colIdx) => (
              <div
                key={`faq-col-${col[0]?.question}-${col[0]?.answer}`}
                className="space-y-4"
              >
                {col.map((question, itemIdx) => (
                  <details
                    key={`${question.question}-${question.answer}`}
                    ref={(el) => {
                      if (!detailsRefs.current[colIdx])
                        detailsRefs.current[colIdx] = [];
                      detailsRefs.current[colIdx][itemIdx] = el;
                    }}
                    className="bg-white dark:bg-[#2A2A2A] rounded p-3 md:p-4 [&>summary::-webkit-details-marker]:hidden [&>summary::marker]:hidden [&>summary]:list-none"
                  >
                    {/** biome-ignore lint/a11y/noStaticElementInteractions: for switch icon css */}
                    <summary
                      onClick={(e) => handleClick(e, colIdx, itemIdx)}
                      className="flex justify-between items-center text-[#555555] dark:text-[#A0A0A0] font-bold text-sm md:text-base cursor-pointer"
                    >
                      <span className="line-clamp-2">{question.question}</span>
                      <div className="relative w-5 h-5 flex-shrink-0">
                        <PlusIcon
                          className={`absolute top-0 left-0 w-4 h-4 md:w-5 md:h-5 text-[#555555] dark:text-[#A0A0A0] transition-all duration-300 ${
                            openStates[colIdx]?.[itemIdx]
                              ? "opacity-0 rotate-90"
                              : "opacity-100 rotate-0"
                          }`}
                        />
                        <MinusIcon
                          className={`absolute top-0 left-0 w-4 h-4 md:w-5 md:h-5 text-[#555555] dark:text-[#A0A0A0] transition-all duration-300 ${
                            openStates[colIdx]?.[itemIdx]
                              ? "opacity-100 rotate-0"
                              : "opacity-0 rotate-90"
                          }`}
                        />
                      </div>
                    </summary>
                    <div
                      ref={(el) => {
                        if (!contentRefs.current[colIdx])
                          contentRefs.current[colIdx] = [];
                        contentRefs.current[colIdx][itemIdx] = el;
                      }}
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                    >
                      <div className="pt-3">
                        <p className="text-[#666666] dark:text-[#A0A0A0] text-sm md:text-base line-clamp-6">
                          {question.answer}
                        </p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            ))}
          </main>
        )}
      </div>
    </section>
  );
}
