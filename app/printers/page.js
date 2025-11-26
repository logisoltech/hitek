'use client';

import { ProductsPage } from '../all-products/page';
import { useSearchParams } from 'next/navigation';

export default function PrintersPage() {
  const searchParams = useSearchParams();

  return (
    <ProductsPage
      searchParams={Object.fromEntries(searchParams)}
      restrictToType="printer"
      pageTitle="Printers"
      showCategoryFilter={false}
    />
  );
}

