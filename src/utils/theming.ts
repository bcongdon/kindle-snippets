import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const useDrawerToggleable = () => {
  const theme = useTheme();
  const drawerToggleable = useMediaQuery(theme.breakpoints.down("md"));
  return drawerToggleable;
};

const DRAWER_WIDTH = "500px";

export { useDrawerToggleable, DRAWER_WIDTH };
