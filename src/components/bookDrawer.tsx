import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import BookIcon from "@mui/icons-material/Book";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useDrawerToggleable, DRAWER_WIDTH } from "../utils/theming";

interface Title {
  title: string;
  badge?: number;
}

type BookDrawerProps = {
  titles: Title[];
  selected?: number;
  onSelect: (idx: number) => void;
  open: boolean;
};

const BookDrawer = ({ titles, selected, onSelect, open }: BookDrawerProps) => {
  const drawerToggleable = useDrawerToggleable();

  return (
    <Drawer
      variant="persistent"
      open={drawerToggleable ? open : true}
      sx={{
        overflowWrap: "break-word",
        maxWidth: `min(100vw, ${DRAWER_WIDTH})`,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          maxWidth: `min(100vw, ${DRAWER_WIDTH})`,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {titles.sort().map((title, index) => (
            <ListItemButton
              selected={index === selected}
              key={title.title}
              onClick={() => onSelect(index)}
            >
              <ListItemIcon>
                <Badge
                  badgeContent={title.badge}
                  color="primary"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <BookIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary={title.title} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default BookDrawer;
