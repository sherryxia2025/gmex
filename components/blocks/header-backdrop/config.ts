export interface NavItem {
  label: string;
  href: string;
}

export interface NavConfig {
  brandName: string;
  logo: string;
  darkLogo?: string;
  items: NavItem[];
}

export const defaultNavConfig: NavConfig = {
  brandName: process.env.NEXT_PUBLIC_APP_NAME || "",
  logo: "/images/logo.png",
  darkLogo: "/images/dark-logo.png",
  items: [
    { label: "HOME", href: "/" },
    { label: "PRODUCTS", href: "/products" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ],
};
