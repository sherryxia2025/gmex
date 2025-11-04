export type LandingPage = {
  happyAiCoding?: {
    title?: string;
    buttonText?: string;
    buttonHref?: string;
  };
  usage?: {
    title?: string;
    description?: string;
    items?: Array<{
      title: string;
      description: string;
    }>;
  };
  hero?: {
    title?: string;
    title2?: string;
    brandName?: string;
    logo?: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
  };
  heroMobile?: {
    title?: string;
    title2?: string;
    brandName?: string;
    logo?: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
  };

  header?: {
    logo?: string;
    brandName?: string;
    navigation?: Array<{
      text: string;
      href: string;
    }>;
    showLanguageSwitcher?: boolean;
    showThemeSwitcher?: boolean;
  };

  what?: {
    title?: string;
    description?: string;
    items?: Array<{
      title: string;
      description: string;
      cover?: string;
    }>;
  };

  why?: {
    title?: string;
    description?: string;
    questions?: Array<{
      icon?: string;
      question: string;
      answer: string;
    }>;
    cover?: string;
  };

  showcase?: {
    title?: string;
    cases?: Array<{
      cover?: string;
      title: string;
      description: string;
      buttonText?: string;
      buttonHref?: string;
    }>;
  };

  features?: {
    title?: string;
    description?: string;
    items?: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
  };

  comment?: {
    testimonials?: Array<{
      title: string;
      description: string;
      cover?: string;
      author: {
        name: string;
        role: string;
        avatar?: string;
      };
    }>;
  };

  pricing?: {
    title?: string;
    description?: string;
    plans?: Array<{
      name: string;
      price: string;
      unit: string;
      description: string;
      features: string[];
      tip: string;
      isMostPopular: boolean;
      buttonText?: string;
      buttonHref?: string;
      metadata: {
        product_id: string;
        product_name: string;
        amount: number;
        currency: string;
        interval: "month" | "year" | "one-time";
        credits: number;
        valid_months: number;
        payMethod: "us" | "cn";
      };
      supportPayments?: Array<"alipay" | "wechatpay" | "card">;
    }>;
  };

  faq?: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
    questions?: Array<{
      question: string;
      answer: string;
    }>;
  };

  footer?: {
    brandName?: string;
    copyright?: string;
    logo?: string;
    sections?: Array<{
      title: string;
      links: Array<{ text: string; href: string }>;
    }>;
  };

  className?: string;
};
