import Comment from "@/components/blocks/home/comment";
import FAQ from "@/components/blocks/home/faq";
import Features from "@/components/blocks/home/features";
import Footer from "@/components/blocks/home/footer";
import HappyAiCoding from "@/components/blocks/home/happy-ai-coding";
import Header from "@/components/blocks/home/header";
import Hero from "@/components/blocks/home/hero";
import Pricing from "@/components/blocks/home/pricing";
import Usage from "@/components/blocks/home/usage";
import What from "@/components/blocks/home/what";
import Why from "@/components/blocks/home/why";
import { getLandingPage } from "@/i18n";
import { cn } from "@/lib/utils";

interface HomePageProps {
  params: Promise<{ locale: string }>;
  className?: string;
}

export default async function HomePage(props: HomePageProps) {
  const { locale } = await props.params;
  const { className } = props;

  const page = await getLandingPage(locale);

  return (
    <article
      className={cn(
        "min-h-screen w-full bg-white dark:bg-[#212121] transition-colors",
        className,
      )}
    >
      {page.header && (
        <div className="fixed top-0 left-0 w-full z-60 bg-[#F9F8F5] dark:bg-[#0F0F0F]">
          <Header {...page.header} />
        </div>
      )}
      {page.hero && !page.heroMobile && <Hero {...page.hero} />}
      {page.hero && page.heroMobile && (
        <>
          <div className="block md:hidden">
            <Hero {...page.heroMobile} />
          </div>
          <div className="hidden md:block">
            <Hero {...page.hero} />
          </div>
        </>
      )}
      {page.what && <What {...page.what} />}
      {page.why && <Why {...page.why} />}
      {/* {page.showcase && <Showcase {...page.showcase} />} */}
      {page.usage && <Usage section={page.usage} />}
      {page.happyAiCoding && <HappyAiCoding {...page.happyAiCoding} />}
      {page.features && <Features {...page.features} />}
      {page.comment && <Comment {...page.comment} />}
      {page.pricing && <Pricing {...page.pricing} />}
      {page.faq && <FAQ {...page.faq} />}
      {page.footer && <Footer {...page.footer} />}
    </article>
  );
}
