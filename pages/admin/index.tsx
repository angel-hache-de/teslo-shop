import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { SummaryTile } from "../../components/admin";
import { AdminLayout } from "../../components/layout";
import { DashboardSummaryResponse } from "../../interfaces";

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    "/api/admin/dashboard",
    { refreshInterval: 30 * 1000 }
  );

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((actualValue) => (actualValue > 0 ? actualValue - 1 : 30));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!error && !data) return <></>;

  if (error) return <Typography>Error while fetching the info</Typography>;

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInvetory,
  } = data!;

  return (
    <AdminLayout
      title="Dashborad"
      subtitle="General statistics"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={numberOfOrders}
          subtitle="Total Orders"
        />

        <SummaryTile
          icon={<AttachMoneyOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={paidOrders}
          subtitle="Paid orders"
        />

        <SummaryTile
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
          title={notPaidOrders}
          subtitle="Pending orders"
        />

        <SummaryTile
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
          title={numberOfClients}
          subtitle="Clients"
        />

        <SummaryTile
          icon={<AttachMoneyOutlined color="warning" sx={{ fontSize: 40 }} />}
          title={numberOfProducts}
          subtitle="Products"
        />

        <SummaryTile
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
          title={productsWithNoInventory}
          subtitle="Not in stock"
        />

        <SummaryTile
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
          title={lowInvetory}
          subtitle="In stock"
        />

        <SummaryTile
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={refreshIn}
          subtitle="Updating in: "
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
