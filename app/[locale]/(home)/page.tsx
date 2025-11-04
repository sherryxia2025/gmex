import { AboutUs } from "@/components/blocks/home2/about-us";
import { Feature1 } from "@/components/blocks/home2/feature1";
import { Footer } from "@/components/blocks/home2/footer";
import { Header } from "@/components/blocks/home2/header";
import { Hero } from "@/components/blocks/home2/hero";
import { Logos } from "@/components/blocks/home2/logos";
import { What } from "@/components/blocks/home2/what";

interface HomePageProps {
  params: Promise<{ locale: string }>;
  className?: string;
}

export default async function HomePage(props: HomePageProps) {
  return (
    <div>
      <Header />
      <Hero />
      <Feature1 />
      <Logos />
      <AboutUs />
      <What />
      <Footer />
    </div>
  );
}
