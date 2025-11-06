import { AboutUs } from "@/components/blocks/about-us";
import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";
import { Logos } from "@/components/blocks/logos";
import { OurFactory } from "@/components/blocks/our-factory";
import { SubHero } from "@/components/blocks/sub-hero";

export default function AboutPage() {
  return (
    <>
      <Header />
      <SubHero
        title="About Us"
        bgImage="/images/about1.png"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />
      <AboutUs
        title="About Us"
        description="We break through the boundaries of connection technology and create the world's advanced and cost-effective fastener connection technology.We design,manufacture,test,and support customized fasteners to enable our connection technology to interact and thrive.
We cooperate with customers to promote the development of equipment,enterprises,and the entire industry,in order to promote progress and establish lasting connections.
On a global scale, our employees and solutins are redefining connectivity,addressing today's challenges, and driving innovation to meet future needs."
        imageSrc="/images/about1.png"
        imageAlt="About Us"
        features={[]}
        buttonSecondary={null}
      />
      <OurFactory
        title="Our Factory"
        description="Everything you need to launch your AI SaaS startup quickly and efficiently."
        images={[
          {
            src: "/images/factory1.png",
            alt: "factory1",
          },
          {
            src: "/images/factory2.png",
            alt: "factory2",
          },
          {
            src: "/images/factory3.png",
            alt: "factory3",
          },
        ]}
      />
      <OurFactory
        className="bg-white"
        title="Equimpent"
        description="Everything you need to launch your AI SaaS startup quickly and efficiently."
        images={[
          {
            src: "/images/equimpent1.png",
            alt: "Coil Spring",
            description: "Coil Spring",
          },
          {
            src: "/images/equimpent2.png",
            alt: "Stamping",
            description: "Stamping",
          },
          {
            src: "/images/equimpent3.png",
            alt: "Inspection",
            description: "Inspection",
          },
        ]}
      />
      <Logos />
      <Footer />
    </>
  );
}
