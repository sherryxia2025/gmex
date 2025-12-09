import { notFound } from "next/navigation";
import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";
import { SubHero } from "@/components/blocks/sub-hero";
import { getProducts, ProductStatus } from "@/models/product";
import { findProductCategoryByName } from "@/models/product-category";
import { ProductsGrid } from "./products-grid";

interface ProductCategoryPageProps {
  params: Promise<{ name: string; locale: string }>;
}

export default async function ProductCategoryPage({
  params,
}: ProductCategoryPageProps) {
  const { name } = await params;
  // Decode URL-encoded name (handle spaces and special characters)
  const decodedName = decodeURIComponent(name);
  const category = await findProductCategoryByName(decodedName);

  if (!category) {
    notFound();
  }

  const products = await getProducts({
    categoryUuid: category.uuid,
    status: ProductStatus.Online,
    page: 1,
    limit: 100,
  });

  // Use category banner if available, otherwise use default
  const bannerImage = category.bannerUrl || "/images/banner_products.jpg";

  return (
    <>
      <Header />
      <SubHero
        title={category.title}
        bgImage={bannerImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: category.title },
        ]}
      />

      <section className="bg-white py-10 md:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {products.length > 0 ? (
            <ProductsGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No products in this category</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
