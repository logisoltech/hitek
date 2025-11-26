'use client';

import { ProductsPage } from '../all-products/page';

import { useSearchParams } from 'next/navigation';

export default function LaptopsPage() {
  const searchParams = useSearchParams();

  return (
    <ProductsPage
      searchParams={Object.fromEntries(searchParams)}
      restrictToType="laptop"
      pageTitle="Laptops"
      showCategoryFilter={false}
    />
  );
}

