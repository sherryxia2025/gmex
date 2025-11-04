import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Crumb } from "@/types/blocks/base";

export default function AdminHeader({ crumb }: { crumb?: Crumb }) {
  return (
    <header className="flex border-b py-3 shrink-0 items-center gap-2 bg-background">
      <div className="flex items-center gap-2 px-4">
        {crumb?.items && crumb.items.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {crumb.items.map((item, index) => {
                if (item.is_active) {
                  return (
                    <BreadcrumbItem key={`active-${index}-${item.title}`}>
                      <BreadcrumbPage className="font-medium">
                        {item.title}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  );
                }

                return (
                  <Fragment key={`link-${index}-${item.title}`}>
                    <BreadcrumbItem className="hidden md:block">
                      <Link
                        href={item.url || ""}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.title}
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block text-muted-foreground" />
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
    </header>
  );
}
