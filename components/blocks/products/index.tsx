import Image from "next/image";

interface ProductItem {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
}

interface ProductsProps {
  products?: ProductItem[];
}

const defaultProducts: ProductItem[] = [
  {
    id: 1,
    title: "Cable Lug",
    description:
      "Get instant access to scalable infrastructure with best practices built-in.",
    image: "/images/products1.png",
    features: ["scalable infrastructure with", "140*2", "infrastructure"],
  },
  {
    id: 2,
    title: "Screws",
    description:
      "Get instant access to scalable infrastructure with best practices built-in.",
    image: "/images/products2.png",
    features: ["scalable infrastructure with", "140*2", "infrastructure"],
  },
  {
    id: 3,
    title: "Spring",
    description:
      "Get instant access to scalable infrastructure with best practices built-in.",
    image: "/images/products3.png",
    features: ["scalable infrastructure with", "140*2", "infrastructure"],
  },
  {
    id: 4,
    title: "Cable Tie",
    description:
      "Get instant access to scalable infrastructure with best practices built-in.",
    image: "/images/products4.png",
    features: ["scalable infrastructure with", "140*2", "infrastructure"],
  },
  {
    id: 5,
    title: "Nuts",
    description:
      "Get instant access to scalable infrastructure with best practices built-in.",
    image: "/images/products5.png",
    features: ["scalable infrastructure with", "140*2", "infrastructure"],
  },
  {
    id: 6,
    title: "Terminals",
    description:
      "Get instant access to scalable infrastructure with best practices built-in.",
    image: "/images/products6.png",
    features: ["scalable infrastructure with", "140*2", "infrastructure"],
  },
];

export const Products = ({ products = defaultProducts }: ProductsProps) => {
  return (
    <section className="bg-white py-10 md:py-24">
      <div className="px-4 sm:px-16 md:px-20 lg:px-28 xl:px-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[rgba(246,246,246,0.898)] rounded-lg overflow-hidden flex flex-col p-2"
            >
              {/* Product Image */}
              <div className="w-full h-48 md:h-56 lg:h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-[800] text-gray-900 mb-3">
                  {product.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-gray-300 mb-4" />

                {/* Features List */}
                <ul className="mt-auto space-y-2">
                  {product.features.map((feature) => (
                    <li
                      key={`${product.id}-${feature}`}
                      className="flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3D3D3D] flex-shrink-0" />
                      <span className="text-sm md:text-base text-[#3D3D3D]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
