import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import BookIcon from "@mui/icons-material/Book";
import ListItemText from "@mui/material/ListItemText";

interface Title {
  title: string;
  badge?: number;
}

type BookDrawerProps = {
  titles: Title[];
  selected?: number;
  onSelect: (idx: number) => void;
};

const BookDrawer = ({ titles, selected, onSelect }: BookDrawerProps) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        maxWidth: 500,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          maxWidth: 500,
          boxSizing: "border-box",
        },
      }}
    >
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
    </Drawer>
  );
};

export default BookDrawer;
