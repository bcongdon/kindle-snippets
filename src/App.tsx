import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Snippet } from "./parser/parser";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import QuoteCard from "./components/quoteCard";
import BookGrid from "./components/bookGrid";
import ImporterDialog from "./components/importer";
import Typography from "@mui/material/Typography";
import BookDrawer from "./components/bookDrawer";
interface State {
  formValue: string;
  snippets: Snippet[];
  selectedBook?: number;
  copySnackbarOpen: boolean;
  importerOpen: boolean;
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
      importerOpen: snippets.length === 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleNewSnippets = this.handleNewSnippets.bind(this);
    this.renderSnippets = this.renderSnippets.bind(this);
    this.clear = this.clear.bind(this);
    this.titles = this.titles.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ formValue: event.currentTarget.value });
  }

  handleNewSnippets(snippets: Snippet[]) {
    this.setState({ snippets });
    localStorage.setItem(KINDLE_SNIPPETS_KEY, JSON.stringify(snippets));
  }

  copyToClipboard(snippet: Snippet) {
    const location = snippet.page ? `${snippet.page}` : snippet.location;
    const copyContent = `${snippet.content} (${location})`;
    navigator.clipboard.writeText(copyContent);
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
        <ImporterDialog
          handleClose={() => this.setState({ importerOpen: false })}
          onImportSnippets={this.handleNewSnippets}
          onClear={this.clear}
          open={this.state.importerOpen}
        />
        <Button
          variant="contained"
          component="span"
          onClick={() => this.setState({ importerOpen: true })}
        >
          Edit
        </Button>
        <div
          style={{ display: this.state.snippets.length ? undefined : "none" }}
        >
          <BookDrawer
            onSelect={(selectedBook) => this.setState({ selectedBook })}
            selected={this.state.selectedBook}
            titles={this.titles().map((t) => {
              return {
                title: t,
              };
            })}
          />
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
