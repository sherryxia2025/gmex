"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface ProductCategory {
  id: number;
  uuid: string;
  name: string;
  title: string;
  description: string | null;
  features: string[] | null;
  coverUrl: string | null;
}

interface ProductsProps {
  categories: ProductCategory[];
}

export const Products = ({ categories }: ProductsProps) => {
  if (categories.length === 0) {
    return (
      <section className="bg-white py-10 md:py-24">
        <div className="px-4 sm:px-16 md:px-20 lg:px-28 xl:px-50">
          <div className="text-center">No product categories</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-10 md:py-24">
      <div className="px-4 sm:px-16 md:px-20 lg:px-28 xl:px-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.uuid}
              href={`/products/${category.uuid}`}
              className="bg-[rgba(246,246,246,0.898)] rounded-lg overflow-hidden flex flex-col p-2 transition-shadow"
            >
              {/* Category Image */}
              <div className="w-full h-48 md:h-56 lg:h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                {category.coverUrl ? (
                  <Image
                    src={category.coverUrl}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="text-gray-400">{category.title}</div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-[800] text-gray-900 mb-3">
                  {category.title}
                </h3>

                {/* Description */}
                {category.description && (
                  <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                )}

                {/* Divider */}
                {category.features && category.features.length > 0 && (
                  <>
                    <div className="w-full h-px bg-gray-300 mb-4" />

                    {/* Features List */}
                    <ul className="mt-auto space-y-2">
                      {category.features.map((feature, index) => (
                        <li
                          key={`${category.uuid}-${index}`}
                          className="flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3D3D3D] flex-shrink-0" />
                          <span className="text-sm md:text-base text-[#3D3D3D]">
                            {typeof feature === "string"
                              ? feature
                              : String(feature)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
