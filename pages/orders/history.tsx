import { useMemo } from "react";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import NextLink from "next/link";
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { ShopLayout } from "../../components/layout";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Fullname", width: 300 },
  {
    field: "paid",
    headerName: "Paid out",
    description: "Status (either paid out or unpaid out)",
    width: 200,
    renderCell: (params: GridValueGetterParams) =>
      params.row.paid ? (
        <Chip color="success" label="Paid out" variant="filled" />
      ) : (
        <Chip color="error" label="To be paid" variant="filled" />
      ),
  },
  {
    field: "order",
    headerName: "See order",
    width: 200,
    renderCell: (params: GridValueGetterParams) => (
      <NextLink href={`/orders/${params.row.orderId}`} passHref>
        <Link underline="always">See Order</Link>
      </NextLink>
    ),
    sortable: false,
  },
];

// const rows = [
//   { id: 1, paid: true, fullname: "Angel Hernandez" },
//   { id: 1, paid: false, fullname: "Diana Pineda" },
// ];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = useMemo(
    () =>
      orders.map((o, index) => ({
        id: index + 1,
        paid: o.isPaid,
        fullname: `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`,
        orderId: o._id,
      })),
    [orders]
  );

  return (
    <ShopLayout title="History" pageDescription="Orders History">
      <Typography variant="h1" component="h1">
        Order history
      </Typography>

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session)
    return {
      redirect: {
        destination: "/auth/login?p=/orders/history",
        permanent: false,
      },
    };

  const orders = await dbOrders.getOrdersByUser(session.user._id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
