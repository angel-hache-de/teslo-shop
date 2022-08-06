import { Box, Button, Typography } from "@mui/material";
import { FC } from "react";
import { ISize } from "../../interfaces";

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  onSelectedSize: (size: ISize) => void;
}

export const SizeSelector: FC<Props> = ({
  selectedSize,
  sizes,
  onSelectedSize,
}) => {
  return (
    <>
      <Typography variant="body2" color="secondary">
        Select one size
      </Typography>
      <Box display="flex">
        {sizes.map((size) => (
          <Button
            key={size}
            size="small"
            color={selectedSize === size ? "primary" : "info"}
            onClick={() => onSelectedSize(size)}
          >
            {size}
          </Button>
        ))}
      </Box>
    </>
  );
};
