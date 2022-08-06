import { FC, useContext } from "react";
import { Grid, Typography } from "@mui/material";
import { CartContext } from "../../context";
import { currency } from "../../utils";
import { IOrderSummary } from "../../interfaces";

interface Props {
  propsOrderSummary?: IOrderSummary;
}

export const OrderSummary: FC<Props> = ({ propsOrderSummary }) => {
  const { orderSummary } = useContext(CartContext);

  const { numberOfItems, subTotal, total, tax } = !!propsOrderSummary
    ? propsOrderSummary
    : orderSummary;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>Number of Products</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {numberOfItems} product{numberOfItems > 1 && "s"}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          Taxes ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)
        </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total:</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography variant="subtitle1">{currency.format(total)}</Typography>
      </Grid>
    </Grid>
  );
};
