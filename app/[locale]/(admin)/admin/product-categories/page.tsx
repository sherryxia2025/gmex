import { getProductCategories } from "@/models/product-category";
import ProductCategoriesPageContent from "./product-categories-content";

export default async function ProductCategoriesPage() {
  const categories = await getProductCategories({
    page: 1,
    limit: 1000, // Get all categories for sorting
  });

  return <ProductCategoriesPageContent categories={categories} />;
}
