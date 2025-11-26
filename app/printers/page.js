'use client';

import { ProductsPage } from '../all-products/page';

export default function PrintersPage() {
  return (
    <ProductsPage
      restrictToType="printer"
      pageTitle="Printers"
      showCategoryFilter={false}
    />
  );
}

