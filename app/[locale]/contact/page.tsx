import { Footer } from "@/components/blocks/footer";
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
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Contact content goes here...
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
