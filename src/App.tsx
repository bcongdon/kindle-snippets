import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { parseKindleSnippets, Snippet } from "./parser/parser";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import QuoteCard from "./components/quoteCard";
import BookGrid from "./components/bookGrid";
import { Typography } from "@mui/material";

interface State {
  formValue: string;
  snippets: Snippet[];
  selectedBook?: number;
  copySnackbarOpen: boolean;
}

const KINDLE_SNIPPETS_KEY = "kindle_snippets";

const Input = styled("input")({
  display: "none",
});

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    let snippetsRaw = localStorage.getItem(KINDLE_SNIPPETS_KEY);
    let snippets: Snippet[] = snippetsRaw ? JSON.parse(snippetsRaw) : [];

    this.state = {
      formValue: "",
      snippets,
      copySnackbarOpen: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderSnippets = this.renderSnippets.bind(this);
    this.titles = this.titles.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ formValue: event.currentTarget.value });
  }

  handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const parsedSnippets = parseKindleSnippets(this.state.formValue);
    this.setState({ snippets: parsedSnippets });
    localStorage.setItem(KINDLE_SNIPPETS_KEY, JSON.stringify(parsedSnippets));
  }

  copyToClipboard(snippet: Snippet) {
    navigator.clipboard.writeText(snippet.content);
    this.setState({ copySnackbarOpen: true });
  }

  titles() {
    return Array.from(new Set(this.state.snippets.map((s) => s.title)));
  }

  clear() {
    this.setState({
      selectedBook: undefined,
      snippets: [],
    });
    localStorage.setItem(KINDLE_SNIPPETS_KEY, "");
  }

  renderSnippets() {
    const titles = this.titles();
    return this.state.snippets
      .filter(
        (snippet) =>
          this.state.selectedBook &&
          titles[this.state.selectedBook] == snippet.title
      )
      .sort((a, b) => {
        if (a.title !== b.title) {
          return a.title.localeCompare(b.title);
        }
        return a.page - b.page;
      })
      .map((snippet, idx) => (
        <QuoteCard
          snippet={snippet}
          onClickCopy={() => this.copyToClipboard(snippet)}
          key={idx}
        />
      ));
  }

  render() {
    return (
      <div className="App">
        <form>
          <TextField
            multiline
            placeholder="Paste Snippets"
            value={this.state.formValue}
            onChange={this.handleChange}
            minRows={3}
            maxRows={3}
          />
          <br />
          <Button
            variant="contained"
            component="span"
            onClick={() => this.clear()}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            component="span"
            onClick={this.handleSubmit}
          >
            Submit
          </Button>
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
              startIcon={<UploadIcon />}
            >
              Upload
            </Button>
          </label>
        </form>
        <div
          style={{ display: this.state.snippets.length ? undefined : "none" }}
        >
          <Typography variant="h3">Books</Typography>
          <Box
            sx={{
              minWidth: 275,
              maxWidth: 1200,
              textAlign: "left",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 10,
            }}
          >
            <BookGrid
              titles={this.titles()}
              selectedBook={this.state.selectedBook}
              onBookClicked={(idx) => this.setState({ selectedBook: idx })}
            />
          </Box>
          <Typography variant="h3">Snippets</Typography>
          <Box
            sx={{
              minWidth: 275,
              maxWidth: 700,
              textAlign: "left",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 10,
            }}
          >
            {this.renderSnippets()}
          </Box>
          <Snackbar
            open={this.state.copySnackbarOpen}
            autoHideDuration={3000}
            onClose={() => {
              this.setState({ copySnackbarOpen: false });
            }}
            message="Snippet copied"
          />
        </div>
      </div>
    );
  }
}

export default App;
