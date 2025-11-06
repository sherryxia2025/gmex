import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
  };
  copyright?: string;
  menuItems?: MenuItem[];
}

export const Footer = ({
  logo = {
    src: "/images/logo.png",
    alt: process.env.NEXT_PUBLIC_APP_NAME || "",
    url: "/",
  },
  copyright = "Copyright © 2025 - All rights reserved.",
  menuItems = [
    {
      title: "LINKS",
      links: [
        { text: "Home", url: "/" },
        { text: "Products", url: "/products" },
        { text: "About", url: "/about" },
        { text: "Contact", url: "/contact" },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { text: "Terms of Service", url: "/terms-of-service" },
        { text: "Privacy Policy", url: "/privacy-policy" },
      ],
    },
    {
      title: "Friends",
      links: [
        { text: "Deamoy", url: "https://deamoy.com" },
        { text: "PressFast", url: "https://pressfa.st" },
      ],
    },
  ],
}: FooterProps) => {
  return (
    <section className="py-20 bg-[#151515] text-[rgba(255,255,255,0.5)]">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Link href={logo.url}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={100}
                    height={100}
                    priority
                  />
                </Link>
              </div>
              <p className="mt-4 font-bold">{copyright}</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-white">{section.title}</h3>
                <ul className="text-muted-foreground space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx} className="hover:text-white font-medium">
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
};
