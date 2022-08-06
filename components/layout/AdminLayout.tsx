import { FC } from "react";

import { SideMenu } from "../ui";
import { AdminNavbar } from "../admin";
import { Box, Typography } from "@mui/material";

interface Props {
  children: JSX.Element | JSX.Element[];
  icon?: JSX.Element;
  title: string;
  subtitle: string;
}

export const AdminLayout: FC<Props> = ({ children, icon, title, subtitle }) => {
  return (
    <>
      <nav>
        <AdminNavbar />
      </nav>

      <SideMenu />

      <main
        style={{ margin: "80px auto", maxWidth: "1440px", padding: "0px 30px" }}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon}
            {" "}{title}
          </Typography>
          <Typography variant="h1" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        </Box>

        <Box className="fadeIn">{children}</Box>
      </main>
    </>
  );
};
