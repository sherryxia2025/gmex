import { AboutUs } from "@/components/blocks/home2/about-us";
import { Footer } from "@/components/blocks/home2/footer";
import { Header } from "@/components/blocks/home2/header";
import { Hero } from "@/components/blocks/home2/hero";
import { Logos } from "@/components/blocks/home2/logos";
import Scenarios from "@/components/blocks/home2/scenarios";
import { Services } from "@/components/blocks/home2/services";
import { What } from "@/components/blocks/home2/what";
import Why from "@/components/blocks/home2/why";

interface HomePageProps {
  params: Promise<{ locale: string }>;
  className?: string;
}

export default async function HomePage(props: HomePageProps) {
  return (
    <div>
      <Header />
      <Hero />
      <Why />
      <AboutUs />
      <Services />
      <Scenarios />
      <What />
      <Logos />
      <Footer />
    </div>
  );
}
