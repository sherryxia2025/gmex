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
        description="We break through the boundaries of connection technology and create the world's advanced and cost-effective fastener connection technology.We design,manufacture,test,and support customized fasteners to enable our connection technology to interact and thrive."
        imageSrc="/images/about1.png"
        imageAlt="About Us"
        features={["We Are Bring Quality Services", "Exprience And Telented"]}
        buttonSecondary={{
          text: "Learn More",
          href: "/",
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
