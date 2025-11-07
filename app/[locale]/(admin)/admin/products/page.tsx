import { getProducts } from "@/models/product";
import ProductsPageContent from "./products-content";

export default async function ProductsPage() {
  const products = await getProducts({
    page: 1,
    limit: 50,
  });

  // Type assertion needed because getProducts returns Product[] with category included
  return (
    <ProductsPageContent
      products={
        products as unknown as Parameters<
          typeof ProductsPageContent
        >[0]["products"]
      }
    />
  );
}
