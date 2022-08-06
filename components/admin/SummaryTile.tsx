import { FC } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

interface Props {
  icon: JSX.Element;
  subtitle: string;
  title: string | number;
}

export const SummaryTile: FC<Props> = ({ icon, subtitle, title }) => {
  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card sx={{ display: "flex" }}>
        <CardContent
          sx={{
            width: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} /> */}
          {icon}
        </CardContent>

        <CardContent
          sx={{
            flex: "1 0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h3">{title}</Typography>
          <Typography variant="caption">{subtitle}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};


