import { Contact } from "@/components/blocks/contact";
import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";
import { SubHero } from "@/components/blocks/sub-hero";

export default function ContactPage() {
  return (
    <>
      <Header />
      <SubHero
        title="Contact"
        bgImage="/images/banner_contact.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Contact />
      <Footer />
    </>
  );
}
