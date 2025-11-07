import { getProductCategories } from "@/models/product-category";
import ProductCategoriesPageContent from "./product-categories-content";

export default async function ProductCategoriesPage() {
  const categories = await getProductCategories({
    page: 1,
    limit: 50,
  });

  return <ProductCategoriesPageContent categories={categories} />;
}
