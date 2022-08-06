import type { NextPage } from "next";
import { Typography } from "@mui/material";

import { ShopLayout } from "../components/layout";
import { ProductList } from "../components/products/ProductList";
import { FullScreenLoading } from "../components/ui";

import { useProducts } from "../hooks";

const HomePage: NextPage = () => {
  const { products, isLoading } = useProducts("/products");

  return (
    <ShopLayout
      title="Tesla-Shop - Home"
      pageDescription="Find the best products of tesla shop!"
    >
      <Typography variant="h1" component="h1">
        Store
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        All products
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
