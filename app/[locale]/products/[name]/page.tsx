import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";
import { SubHero } from "@/components/blocks/sub-hero";
import { getProducts, ProductStatus } from "@/models/product";
import { findProductCategoryByName } from "@/models/product-category";

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
        <div className="px-4 sm:px-16 md:px-20 lg:px-28 xl:px-50">
          {/* Products Grid */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => {
                const metadata = product.metadata as Record<
                  string,
                  unknown
                > | null;

                // format key name: first letter uppercase, handle camel case
                const formatKey = (key: string): string => {
                  return key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim();
                };

                // format value: handle different types of data
                const formatValue = (value: unknown): string => {
                  if (value === null || value === undefined) return "";
                  if (typeof value === "string") return value;
                  if (typeof value === "number" || typeof value === "boolean")
                    return String(value);
                  if (Array.isArray(value)) {
                    return value
                      .map((item) =>
                        typeof item === "string" ? item : String(item),
                      )
                      .join(", ");
                  }
                  if (typeof value === "object") {
                    return JSON.stringify(value, null, 2);
                  }
                  return String(value);
                };

                // get all key-value pairs of metadata
                const metadataEntries = metadata
                  ? Object.entries(metadata).filter(
                      ([, value]) =>
                        value !== null && value !== undefined && value !== "",
                    )
                  : [];

                return (
                  <div
                    key={product.uuid}
                    className="bg-white rounded-lg overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {/* Product Image */}
                    {product.coverUrl && (
                      <div className="w-full h-48 sm:h-56 lg:h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                        <Image
                          src={product.coverUrl}
                          alt={product.title || product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-4"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {product.title || product.name}
                      </h3>

                      {metadataEntries.length > 0 ? (
                        <div className="space-y-1.5 text-xs md:text-sm flex-1">
                          {metadataEntries.slice(0, 3).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex flex-col sm:flex-row gap-1"
                            >
                              <span className="font-semibold text-gray-700">
                                {formatKey(key)}:
                              </span>
                              <span className="text-gray-600 line-clamp-2">
                                {formatValue(value)}
                              </span>
                            </div>
                          ))}
                          {metadataEntries.length > 3 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{metadataEntries.length - 3} more
                            </div>
                          )}
                        </div>
                      ) : (
                        product.description && (
                          <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                            {product.description}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {products.length === 0 && (
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
