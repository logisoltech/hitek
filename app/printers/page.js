'use client';

import { ProductsPage } from '../all-products/page';

export default function PrintersPage({ searchParams }) {
  return (
    <ProductsPage
      searchParams={searchParams}
      restrictToType="printer"
      pageTitle="Printers"
      showCategoryFilter={false}
    />
  );
}

