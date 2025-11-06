export interface NavItem {
  label: string;
  href: string;
}

export interface NavConfig {
  brandName: string;
  logo: string;
  items: NavItem[];
}

export const defaultNavConfig: NavConfig = {
  brandName: process.env.NEXT_PUBLIC_APP_NAME || "",
  logo: "/images/logo.png",
  items: [
    { label: "Home", href: "/" },
    { label: "About", href: "/" },
    { label: "Products", href: "/" },
    { label: "Contact", href: "/" },
  ],
};
