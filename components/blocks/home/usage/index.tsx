import { Badge } from "@/components/ui/badge";
import type { Section as SectionType } from "@/types/blocks/section";

export default function Usage({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section className="py-30.75 bg-[#F9F8F5] dark:bg-[#0B0B0B]">
      <div className="container px-8">
        <div className="mb-16 max-w-xl px-8 lg:px-0">
          {section.label && (
            <Badge variant="outline" className="mb-4">
              {section.label}
            </Badge>
          )}
          <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-4 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>
        <div>
          <div className="relative grid items-start gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-4 right-0 top-[30px] -z-10 hidden h-px bg-input lg:block"></div>
            {section.items?.map((item, index) => {
              return (
                <div
                  className="h-full w-full lg:w-auto bg-[#FFFFFF] dark:bg-[#151515] rounded-[12px]"
                  key={item.title ? `${item.title}-${index}` : index}
                >
                  <div className="group pointer-events-none lg:pointer-events-auto h-full w-full">
                    <div className="flex gap-4 rounded-md px-8 py-4 text-left lg:block lg:px-4 min-h-[160px] h-full w-full lg:min-w-[220px] lg:max-w-[290px]">
                      <div className="flex flex-col items-center lg:contents">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-[#EDEDED] dark:bg-[#1F1F1F] dark:text-white font-mono text-xs font-medium group-data-[state=active]:text-white dark:group-data-[state=active]:text-white lg:group-data-[state=active]:bg-[#f14636] lg:group-data-[state=active]:ring-primary/40">
                          {index + 1}
                        </span>
                        <span className="h-full w-px bg-input lg:hidden"></span>
                      </div>
                      <div>
                        <h3 className="mb-1 font-medium lg:mt-4">
                          {item.title}
                        </h3>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
