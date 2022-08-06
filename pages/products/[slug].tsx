import { useContext, useState } from "react";
import {
  NextPage,
  GetStaticPaths,
  GetStaticProps,
  // GetServerSideProps,
} from "next";
import {
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";

import { ShopLayout } from "../../components/layout";
import { ProductSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { dbProducts } from "../../database";
import { CartContext } from "../../context";

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  /**
   * Una manera de hacerlo es modificar el hook para recibir el generico:
   * ... useProducts = <T>(url ...
   * y aqui pasarle que esperamos la respuesta de tipo IProduct
   * Pero esto no nos da SEO.
   */
  // const router = useRouter();
  // const {products: product, isLoading} = useProducts<IProduct>(`products/${router.query.slug}`);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const { addProductToCart } = useContext(CartContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct((oldProduct) => ({ ...oldProduct, size }));
  };

  const handleOnCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const updateQuantity = (newValue: number) => {
    setTempCartProduct((oldProduct) => ({ ...oldProduct, quantity: newValue }));
  };

  const onClickAddToCart = () => {
    if (!tempCartProduct.size) return setOpenSnackbar(true);

    addProductToCart(tempCartProduct);
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleOnCloseSnackbar}
      >
        <Alert
          onClose={handleOnCloseSnackbar}
          severity="info"
          sx={{ width: "100%" }}
        >
          You must select a size
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Quantity</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                maxValue={product.inStock > 5 ? 5 : product.inStock}
                updateQuantity={updateQuantity}
              />

              <SizeSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onSelectedSize={onSelectedSize}
              />
            </Box>

            {product.inStock > 0 ? (
              <Button
                color="secondary"
                onClick={onClickAddToCart}
                disabled={!tempCartProduct.size}
              >
                Add to cart
              </Button>
            ) : (
              <Chip
                label="Product not available"
                color="error"
                variant="outlined"
              />
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
/**
 * No usar esto porque no es bueno para lo bots de google, en su lugar
 * hacemos lo de abajo.
 */
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = "" } = params as { slug: string };
//   const product = await dbProducts.getProducBySlug(slug);

//   if (!product)
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };

//   return {
//     props: {
//       product,
//     },
//   };
// };

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductSlugs();

  return {
    paths: slugs.map(({ slug }) => ({
      params: {
        slug,
      },
    })),
    fallback: "blocking",
  };
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };

  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default ProductPage;
