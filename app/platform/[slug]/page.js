import { notFound } from "next/navigation";
import ProductPage from "../../../components/product-page";
import { products } from "../../../lib/site-data";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export default async function PlatformPage({ params }) {
  const resolvedParams = await params;
  const product = products.find((item) => item.id === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return <ProductPage product={product} />;
}
