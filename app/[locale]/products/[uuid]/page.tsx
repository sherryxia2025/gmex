import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";
import { SubHero } from "@/components/blocks/sub-hero";
import { getProducts, ProductStatus } from "@/models/product";
import { findProductCategoryByUuid } from "@/models/product-category";

interface ProductCategoryPageProps {
  params: Promise<{ uuid: string; locale: string }>;
}

export default async function ProductCategoryPage({
  params,
}: ProductCategoryPageProps) {
  const { uuid } = await params;
  const category = await findProductCategoryByUuid(uuid);

  if (!category) {
    notFound();
  }

  const products = await getProducts({
    categoryUuid: uuid,
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
          {/* Products List */}
          {products.length > 0 && (
            <div className="space-y-6">
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
                    className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row shadow-lg"
                  >
                    {/* Product Image */}
                    {product.coverUrl && (
                      <div className="w-full md:w-1/3 h-64 md:h-auto bg-gray-100 flex items-center justify-center overflow-hidden relative">
                        <Image
                          src={product.coverUrl}
                          alt={product.title || product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain p-4"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 p-6 md:p-8">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                        {product.title || product.name}
                      </h3>

                      {metadataEntries.length > 0 ? (
                        <div className="space-y-2 text-sm md:text-base">
                          {metadataEntries.map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="font-semibold text-gray-700 min-w-[180px] md:min-w-[220px]">
                                {formatKey(key)}:
                              </span>
                              <span className="text-gray-600">
                                {formatValue(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        product.description && (
                          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
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
