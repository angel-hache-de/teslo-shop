import { FC } from "react";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

interface Props {
  currentValue: number;
  updateQuantity: (newValue: number) => void;
  maxValue: number;
}

export const ItemCounter: FC<Props> = ({
  currentValue,
  updateQuantity,
  maxValue,
}) => {
  return (
    <Box display="flex" alignItems="center">
      <IconButton
        disabled={currentValue <= 1}
        onClick={() => updateQuantity(currentValue - 1)}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }}>
        {currentValue}
      </Typography>
      <IconButton
        disabled={currentValue >= maxValue}
        onClick={() => updateQuantity(currentValue + 1)}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
