'use client';

import { ProductsPage } from '../all-products/page';

export default function LaptopsPage({ searchParams }) {
  return (
    <ProductsPage
      searchParams={searchParams}
      restrictToType="laptop"
      pageTitle="Laptops"
      showCategoryFilter={false}
    />
  );
}

