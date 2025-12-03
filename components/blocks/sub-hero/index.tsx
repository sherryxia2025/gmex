"use client";

import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface SubHeroProps {
  title: string;
  breadcrumbs?: BreadcrumbItemType[];
  className?: string;
  bgImage?: string;
}

export const SubHero = ({
  title,
  breadcrumbs = [{ label: "Home", href: "/" }],
  className,
  bgImage,
}: SubHeroProps) => {
  return (
    <section
      className={cn(
        "relative flex items-center w-full py-16 md:py:24 lg:py-32 bg-black overflow-hidden",
        className,
      )}
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" aria-hidden />

      {/* Background overlay with industrial elements */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(234, 147, 32, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(234, 147, 32, 0.2) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="container relative mt-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight sm:leading-tight md:leading-tight mb-5">
            {title}
          </h1>
          {/* Breadcrumb Navigation */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb className="mb-4 sm:mb-5 md:mb-6">
              <BreadcrumbList className="text-white flex-wrap text-sm sm:text-base">
                {breadcrumbs.map((item, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  const key = `${item.label}-${item.href || "no-href"}-${index}`;

                  if (isLast) {
                    return (
                      <BreadcrumbItem key={key}>
                        <BreadcrumbPage className="text-white text-sm sm:text-base">
                          {item.label}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    );
                  }

                  return (
                    <Fragment key={key}>
                      <BreadcrumbItem>
                        {item.href ? (
                          <BreadcrumbLink
                            asChild
                            className="text-white hover:text-[#EA9320] transition-colors text-sm sm:text-base"
                          >
                            <Link href={item.href}>{item.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <span className="text-white text-sm sm:text-base">
                            {item.label}
                          </span>
                        )}
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="text-[#EA9320] mx-1 sm:mx-2">
                        &gt;
                      </BreadcrumbSeparator>
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
      </div>
    </section>
  );
};
