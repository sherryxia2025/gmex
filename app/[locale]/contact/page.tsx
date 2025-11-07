import { Contact } from "@/components/blocks/contact";
import { Footer } from "@/components/blocks/footer";
import { GoogleMap } from "@/components/blocks/google-map";
import { Header } from "@/components/blocks/header";
import { SubHero } from "@/components/blocks/sub-hero";

export default function ContactPage() {
  return (
    <>
      <Header />
      <SubHero
        title="Contact"
        bgImage="/images/about1.png"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Contact />
      <GoogleMap />
      <Footer />
    </>
  );
}
