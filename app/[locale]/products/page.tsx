import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";
import { Products } from "@/components/blocks/products";
import { SubHero } from "@/components/blocks/sub-hero";

export default function ProductsPage() {
  return (
    <>
      <Header />
      <SubHero
        title="Products"
        bgImage="/images/about1.png"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <Products />
      <Footer />
    </>
  );
}
