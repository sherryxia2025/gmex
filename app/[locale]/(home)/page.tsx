import { AboutUs } from "@/components/blocks/about-us";
import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";
import { Hero } from "@/components/blocks/hero";
import { Logos } from "@/components/blocks/logos";
import Scenarios from "@/components/blocks/scenarios";
import { Services } from "@/components/blocks/services";
import { What } from "@/components/blocks/what";
import Why from "@/components/blocks/why";

interface HomePageProps {
  params: Promise<{ locale: string }>;
  className?: string;
}

export default async function HomePage(props: HomePageProps) {
  return (
    <>
      <Header />
      <Hero />
      <Why />
      <AboutUs
        title="About GMEX"
        description="GMEX pioneers advanced, cost-effective fastener connection technologies. We design, manufacture, test, and support customized fasteners that enable robust and innovative connections worldwide. By collaborating closely with customers, we drive progress across equipment, enterprises, and industries—redefining connectivity, solving today’s challenges, and building lasting partnerships to meet future needs."
        imageSrc="/images/about1.png"
        imageAlt="About Us"
        features={[
          "The Strict Quality Monitoring",
          "Fullfill International Standard",
          "Provide Service Efficiency",
        ]}
        buttonSecondary={{
          text: "Learn More",
          href: "/about",
        }}
      />
      <Services />
      <Scenarios />
      <What />
      <Logos />
      <Footer />
    </>
  );
}
