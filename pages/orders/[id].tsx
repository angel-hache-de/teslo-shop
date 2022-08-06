import { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { PayPalButtons } from "@paypal/react-paypal-js";

import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Divider,
  Link,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";

import { dbOrders } from "../../database";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layout";
import { IOrder } from "../../interfaces";
import { tesloApi } from "../../api";

interface Props {
  order: IOrder;
}

export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
};

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const { shippingAddress } = order;

  const onOrderComleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") return alert("Order was not paid");

    setIsPaying(true);

    try {
      const { data } = await tesloApi.post("/orders/pay", {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert("Error");
    }
  };

  return (
    <ShopLayout title="Order summary" pageDescription="Your shopping summary">
      <Typography variant="h1" component="h1">
        Order: {order._id}
      </Typography>

      {!order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Without paying"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Order already paid"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      )}

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Summary ({order.numberOfItems}{" "}
                {order.numberOfItems > 1 ? "products" : "product"})
              </Typography>
              <Divider />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Delivery address</Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address},{" "}
                {shippingAddress.address2 && `${shippingAddress.address2}`}
              </Typography>
              <Typography>
                {shippingAddress.city}, {shippingAddress.zip}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                propsOrderSummary={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  tax: order.tax,
                  total: order.total,
                }}
              />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                {isPaying && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    className="fadeIn"
                  >
                    <CircularProgress />
                  </Box>
                )}

                {order.isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label="Order paid"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  !isPaying && (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderComleted(details);
                          // const name = details.payer.name!.given_name;
                          // alert(`Transaction completed by ${name}`);
                        });
                      }}
                    />
                  )
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request tim
export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;

  const session: any = await getSession({ req });

  if (!session)
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };

  const order = await dbOrders.getOrderById(id.toString());

  if (!order || order.user !== session.user._id)
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
