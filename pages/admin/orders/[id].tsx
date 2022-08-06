import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import {
  AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";

import { CartList, OrderSummary } from "../../../components/cart";
import { AdminLayout, ShopLayout } from "../../../components/layout";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces";

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress } = order;

  return (
    <AdminLayout
      title="Order summary"
      subtitle={`Order: ${order._id}`}
      icon={<AirplaneTicketOutlined />}
    >
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

              <Box sx={{ mt: 3 }} display="flex">
                {order.isPaid ? (
                  <Chip
                    sx={{ my: 2, flex: 1 }}
                    label="Order paid"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <Chip
                    sx={{ my: 2, flex: 1 }}
                    label="Order not paid"
                    variant="outlined"
                    color="error"
                    icon={<CreditCardOffOutlined />}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
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

  if (!order)
    return {
      redirect: {
        destination: "/admin/orders",
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
