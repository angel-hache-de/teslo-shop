import { Box, Typography } from "@mui/material";

import { ShopLayout } from "../components/layout";

const Custom404Page = () => {
  return (
    <ShopLayout title="Page not found" pageDescription="There is nothing here">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <Typography variant="h1" component="h1" fontSize={70} fontWeight={200}>
          404 |
        </Typography>
        <Typography marginLeft={2}>No page was found here</Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404Page;
