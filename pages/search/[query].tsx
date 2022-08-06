import type { NextPage, GetServerSideProps } from "next";
import { Box, Typography } from "@mui/material";

import { ShopLayout } from "../../components/layout";
import { ProductList } from "../../components/products/ProductList";

import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  productsFound: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, productsFound, query }) => {
  return (
    <ShopLayout
      title="Tesla-Shop - Search"
      pageDescription="Find the best products of tesla shop!"
    >
      <Typography variant="h1" component="h1">
        Search Products
      </Typography>
      {productsFound ? (
        <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
          Results of: {query}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" sx={{ mb: 1 }}>
            No products found with:
          </Typography>
          <Typography
            variant="h2"
            sx={{ ml: 1 }}
            color="secondary"
            textTransform="capitalize"
          >
            {query}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0)
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };

  let products = await dbProducts.getProductByTerm(query);
  const productsFound = products.length > 0;

  if (!productsFound) products = await dbProducts.getAllProducts();

  return {
    props: {
      products,
      productsFound,
      query,
    },
  };
};

export default SearchPage;
