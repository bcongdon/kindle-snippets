import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { useDrawerToggleable } from "../utils/theming";

interface Props {
  onSettingsClick: () => void;
  onDrawerToggle: () => void;
}

const ToolbarHeader = ({ onSettingsClick, onDrawerToggle }: Props) => {
  const drawerToggleable = useDrawerToggleable();

  return (
    <Toolbar>
      {drawerToggleable ? (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
      ) : null}
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        Kindle Snippets Viewer
      </Typography>
      <IconButton
        size="large"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={onSettingsClick}
        color="inherit"
      >
        <SettingsIcon />
      </IconButton>
    </Toolbar>
  );
};

export default ToolbarHeader;
