import { Typography } from "@mui/material";

import { ShopLayout } from "../../components/layout";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const KidsPage = () => {
  const { products, isLoading } = useProducts("/products?gender=kid");
  return (
    <ShopLayout title="Tesla-Shop - Kids" pageDescription="Products for kids">
      <Typography variant="h1" component="h1">
        Kids
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Products for kids
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidsPage;
