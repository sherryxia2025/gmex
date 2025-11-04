import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface FooterProps {
  brandName?: string;
  logo?: string;
  copyright?: string;
  sections?: Array<{
    title: string;
    links: Array<{ text: string; href: string }>;
  }>;
  className?: string;
}

export default function Footer(props: FooterProps) {
  const { brandName, logo, copyright, sections, className } = props;

  if (!brandName && !logo && !copyright && !sections) {
    return null;
  }
  return (
    <footer
      className={`py-12 md:py-20 lg:py-25 px-4 md:px-6 ${className || ""}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 md:gap-16 lg:gap-40">
        <aside className="space-y-4 md:space-y-5">
          {(logo || brandName) && (
            <div className="flex items-center gap-2">
              {logo ? (
                <Image
                  src={logo}
                  alt={brandName || ""}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <Image
                  src="/favicon.svg"
                  alt={brandName || ""}
                  width={26}
                  height={32}
                />
              )}
              {brandName && (
                <h2 className="text-[#3D3D3D] dark:text-[#E5E5E5] text-[22px] md:text-[24px]">
                  <Link
                    href="/"
                    className="font-lt-saeada font-[600] leading-[24px] "
                  >
                    {brandName}
                  </Link>
                </h2>
              )}
            </div>
          )}
          {copyright && (
            <p className="text-sm md:text-base text-gray-600 dark:text-[#A0A0A0]">
              {copyright}
            </p>
          )}
        </aside>
        {sections && (
          <nav className="text-[#666666] dark:text-[#A0A0A0] flex flex-col sm:flex-row items-start justify-between gap-8 md:gap-12 lg:gap-41 w-full md:w-auto">
            {sections.map((section) => (
              <dl key={section.title} className="space-y-2 md:space-y-3">
                <dt className="text-[#555555] dark:text-[#A0A0A0] font-medium uppercase text-sm md:text-base">
                  {section.title}
                </dt>
                {section.links.map((link) => (
                  <dd key={link.href} className="text-sm md:text-base">
                    <Link
                      href={link.href}
                      className="hover:text-[#F14636] dark:hover:text-[#F14636] transition-colors"
                    >
                      {link.text}
                    </Link>
                  </dd>
                ))}
              </dl>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
