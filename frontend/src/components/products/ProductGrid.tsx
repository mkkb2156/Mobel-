import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-xl text-walnut">尚無商品</p>
        <p className="mt-2 text-sm text-walnut/60">請稍後再回來查看</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
