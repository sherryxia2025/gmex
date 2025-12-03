import { getProducts } from "@/models/product";
import { getProductCategories } from "@/models/product-category";
import ProductsPageContent from "./products-content";

export default async function ProductsPage() {
  const products = await getProducts({
    page: 1,
    limit: 1000, // Get all products for grouping and sorting
  });

  const categories = await getProductCategories({
    page: 1,
    limit: 1000,
  });

  // Type assertion needed because getProducts returns Product[] with category included
  return (
    <ProductsPageContent
      products={
        products as unknown as Parameters<
          typeof ProductsPageContent
        >[0]["products"]
      }
      categories={categories}
    />
  );
}
