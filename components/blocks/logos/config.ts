export interface LogoItem {
  name: string;
  src: string; // public path
}

export interface LogosConfig {
  title: string;
  subtitle: string;
  items: LogoItem[];
}

export const defaultLogosConfig: LogosConfig = {
  title: "Our Customer&Quality",
  subtitle:
    "Forging lasting partnerships through rigorous quality standards and a shared pursuit of excellence in every project.",
  items: [
    { name: "BEEHE", src: "/images/customer-1.png" },
    { name: "SAINT-GOBAIN", src: "/images/customer-2.png" },
    { name: "B BRAUN", src: "/images/customer-3.png" },
    { name: "COMMSCOPE", src: "/images/customer-4.png" },
    { name: "LG", src: "/images/customer-5.png" },
    { name: "WURTH", src: "/images/customer-6.png" },
    { name: "ESTUN", src: "/images/customer-7.png" },
    { name: "i-sens", src: "/images/customer-8.png" },
    { name: "Hisense", src: "/images/customer-10.png" },
    { name: "ISO", src: "/images/customer-11.png" },
    { name: "CE", src: "/images/customer-12.png" },
    { name: "ISO9001", src: "/images/customer-13.png" },
    { name: "RoHS", src: "/images/customer-14.png" },
    { name: "UL", src: "/images/customer-15.png" },
  ],
};
