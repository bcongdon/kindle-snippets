import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

type BookGridProps = {
  titles: string[];
  selectedBook?: number;
  onBookClicked: (idx: number) => void;
};

type BookGridItemProps = {
  title: string;
  selected: boolean;
  onClick: () => void;
};

const BookGridItem = ({ title, selected, onClick }: BookGridItemProps) => (
  <Grid item xs={4}>
    <Card
      raised={false}
      sx={{ height: "100%", backgroundColor: selected ? "lightblue" : null }}
      variant="outlined"
      onClick={onClick}
    >
      <CardHeader
        disableTypography
        title={
          <>
            <Typography color="text.primary">{title}</Typography>
          </>
        }
        subheader={
          <>
            <Typography color="text.secondary">{"Cory Doctorow"}</Typography>
          </>
        }
      ></CardHeader>
    </Card>
  </Grid>
);

const BookGrid = (props: BookGridProps) => (
  <Grid container spacing={2} columns={12} direction="row" alignItems="stretch">
    {props.titles.map((title, idx) => (
      <BookGridItem
        title={title}
        selected={idx === props.selectedBook}
        key={idx}
        onClick={() => props.onBookClicked(idx)}
      />
    ))}
  </Grid>
);

export default BookGrid;
