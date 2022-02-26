import { Snippet } from "../parser/parser";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type QuoteCardProps = {
  snippet: Snippet;
  onClickCopy: () => void;
};

const QuoteCard = ({ snippet, onClickCopy }: QuoteCardProps) => (
  <Card
    sx={{
      minWidth: 275,
      maxWidth: 900,
      marginTop: 2.5,
      overflowWrap: "anywhere",
    }}
    variant="outlined"
  >
    <CardHeader
      disableTypography
      title={
        <>
          <Typography color="text.primary">{snippet.title}</Typography>
        </>
      }
      subheader={
        <>
          <Typography color="text.secondary">{snippet.author}</Typography>
        </>
      }
    ></CardHeader>
    <CardContent>
      <Typography variant="body2">{snippet.content}</Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: "space-between" }} onClick={onClickCopy}>
      <Typography sx={{ fontSize: 14, marginLeft: 1 }} color="text.secondary">
        {snippet.page ? `Page ${snippet.page}` : `Location ${snippet.location}`}
      </Typography>
      <div className={"flex-grow"} />
      <IconButton sx={{ alignItems: "0" }}>
        <ContentCopyIcon />
      </IconButton>
    </CardActions>
  </Card>
);

export default QuoteCard;
