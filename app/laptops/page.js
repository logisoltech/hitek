'use client';

import { ProductsPage } from '../all-products/page';

export default function LaptopsPage() {
  return (
    <ProductsPage
      restrictToType="laptop"
      pageTitle="Laptops"
      showCategoryFilter={false}
    />
  );
}

