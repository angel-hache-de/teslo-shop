import NextLink from "next/link";
import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layout";

const EmptyPage = () => {
  return (
    <ShopLayout
      title="Empty cart"
      pageDescription="There is nothing in your cart"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 70 }} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            variant="h1"
            component="h1"
            fontSize={70}
            fontWeight={200}
          >
            Your cart is empty
          </Typography>
          <NextLink href="/" passHref>
            <Link typography="h4" color="secondary">
              Go Back
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
