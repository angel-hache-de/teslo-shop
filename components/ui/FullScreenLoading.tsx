import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

export const FullScreenLoading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)"
    >
      <Typography sx={{ mb: 3 }} variant="h2" fontWeight={200} fontSize={20}>
        Loading...
      </Typography>
      <CircularProgress thickness={2} />
    </Box>
  );
};
