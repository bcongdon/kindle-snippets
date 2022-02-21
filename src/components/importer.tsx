import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import UploadIcon from "@mui/icons-material/Upload";
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import { Typography } from "@mui/material";
import { useState } from "react";
import { parseKindleSnippets, Snippet } from "../parser/parser";

const Input = styled("input")({
  display: "none",
});

interface ImporterDialogProps {
  onImportSnippets: (snippets: Snippet[]) => void;
  onClear: () => void;
  handleClose: () => void;
  open: boolean;
}

const ImporterDialog = ({
  onImportSnippets,
  onClear,
  handleClose,
  open,
}: ImporterDialogProps) => {
  const [snippetsContents, setSnippetsContents] = useState("");

  const handleNewSnippets = (content: string) => {
    const parsedSnippets = parseKindleSnippets(content);
    if (parsedSnippets.length !== 0) {
      onImportSnippets(parsedSnippets);
      setSnippetsContents("");
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">Import Kindle Snippets</DialogTitle>
      <DialogContent>
        <Grid
          sx={{ marginTop: 0.25 }}
          container
          columns={16}
          rowSpacing={3}
          alignItems="stretch"
        >
          <Grid item xs={8} container direction="column" alignItems="center">
            <TextField
              multiline
              placeholder="Paste Snippets"
              minRows={3}
              maxRows={3}
              fullWidth
              value={snippetsContents}
              onChange={(e) => setSnippetsContents(e.currentTarget.value)}
            />
            <br />
            <Button
              variant="contained"
              component="span"
              sx={{ minWidth: 0 }}
              onClick={() => handleNewSnippets(snippetsContents)}
            >
              Import
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Divider orientation="vertical" variant="middle" />
          </Grid>
          <Grid
            item
            xs={7}
            container
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                multiple
                type="file"
                id="contained-button-file"
              />
              <Button
                variant="outlined"
                component="span"
                sx={{ marginLeft: "auto", marginRight: "auto" }}
                startIcon={<UploadIcon />}
              >
                Upload
              </Button>
            </label>
            <Typography variant="caption" sx={{ marginTop: 0.5 }}>
              Upload a Kindle Snippets export file.
            </Typography>
          </Grid>
          <Grid item xs={16}>
            <Divider flexItem />
          </Grid>
          <Grid item container justifyContent="right">
            <FormControl sx={{ marginTop: 1 }}>
              <Button
                sx={{ maxWidth: 0, marginLeft: "auto" }}
                variant="contained"
                component="span"
                color="error"
                onClick={() => {
                  onClear();
                  handleClose();
                }}
              >
                Clear
              </Button>
              <Typography variant="caption" sx={{ marginTop: 0.5 }}>
                Delete all existing snippets.
              </Typography>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ImporterDialog;
