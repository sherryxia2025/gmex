import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";
import { Products } from "@/components/blocks/products";
import { SubHero } from "@/components/blocks/sub-hero";
import { getProductCategories } from "@/models/product-category";

export default async function ProductsPage() {
  const categories = await getProductCategories({
    page: 1,
    limit: 100,
  });

  // Transform features from JSON to array
  const transformedCategories = categories.map((cat) => ({
    id: cat.id,
    uuid: cat.uuid,
    name: cat.name,
    title: cat.title,
    description: cat.description,
    features:
      cat.features && typeof cat.features === "object"
        ? Array.isArray(cat.features)
          ? (cat.features as string[])
          : []
        : [],
    coverUrl: cat.coverUrl,
  }));

  return (
    <>
      <Header />
      <SubHero
        title="Products"
        bgImage="/images/banner_products.jpg"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />
      <Products categories={transformedCategories} />
      <Footer />
    </>
  );
}
