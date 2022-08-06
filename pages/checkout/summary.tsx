import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import {
  Typography,
  Grid,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Chip,
} from "@mui/material";

import { CartContext } from "../../context";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layout";
import { countries } from "../../utils";
import Cookies from "js-cookie";

const SummaryPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const { shippingAddress, orderSummary, createOrder } =
    useContext(CartContext);

  useEffect(() => {
    if (!Cookies.get("firstName")) router.push("/checkout/address");
  }, [router]);

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();

    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`);
  };

  if (!shippingAddress) return <></>;

  const {
    firstName,
    lastName,
    address,
    city,
    country,
    phone,
    zip,
    address2 = "",
  } = shippingAddress;
  return (
    <ShopLayout
      title="Shopping Summary"
      pageDescription="Your shopping summary"
    >
      <Typography variant="h1" component="h1">
        Shopping summary
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Summary ({orderSummary.numberOfItems} product
                {orderSummary.numberOfItems > 1 && "s"})
              </Typography>
              <Divider />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Delivery address</Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Edit</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address} {address2}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>{countries.getCountryNameByCode(country)}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Edit</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirm Order
                </Button>

                {!!errorMessage && (
                  <Chip color="error" label={errorMessage} sx={{ mt: 2 }} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
