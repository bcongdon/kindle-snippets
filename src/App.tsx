import React from "react";
import "./App.css";
import { Snippet } from "./parser/parser";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import QuoteCard from "./components/quoteCard";
import ImporterDialog from "./components/importer";
import Typography from "@mui/material/Typography";
import BookDrawer from "./components/bookDrawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
interface State {
  formValue: string;
  snippets: Snippet[];
  selectedBook?: number;
  copySnackbarOpen: boolean;
  importerOpen: boolean;
}

const KINDLE_SNIPPETS_KEY = "kindle_snippets_content";
const SELECTED_BOOK_KEY = "kindle_snippets_selected_book";

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    let snippetsRaw = localStorage.getItem(KINDLE_SNIPPETS_KEY);
    let snippets: Snippet[] = snippetsRaw ? JSON.parse(snippetsRaw) : [];
    let selectedBook =
      Number(localStorage.getItem(SELECTED_BOOK_KEY)) ??
      (snippets.length ? 0 : undefined);

    this.state = {
      formValue: "",
      snippets,
      selectedBook,
      copySnackbarOpen: false,
      importerOpen: snippets.length === 0,
    };

    this.handleNewSnippets = this.handleNewSnippets.bind(this);
    this.renderSnippets = this.renderSnippets.bind(this);
    this.clear = this.clear.bind(this);
    this.onSelectBook = this.onSelectBook.bind(this);
  }

  handleNewSnippets(snippets: Snippet[]) {
    this.setState({ snippets, selectedBook: snippets.length ? 0 : undefined });
    localStorage.setItem(KINDLE_SNIPPETS_KEY, JSON.stringify(snippets));
  }

  copyToClipboard(snippet: Snippet) {
    const location = snippet.page ? `${snippet.page}` : snippet.location;
    const copyContent = `${snippet.content} (${location})`;
    navigator.clipboard.writeText(copyContent);
    this.setState({ copySnackbarOpen: true });
  }

  titles() {
    return Array.from(this.snippetsByTitle().keys());
  }

  snippetsByTitle() {
    let out: Map<string, Snippet[]> = new Map();
    for (let snippet of this.state.snippets) {
      if (!out.has(snippet.title)) {
        out.set(snippet.title, []);
      }
      out.get(snippet.title)?.push(snippet);
    }
    return out;
  }

  snippetTitleCount() {
    let out: Map<string, number> = new Map();
    for (let [title, snippets] of this.snippetsByTitle().entries()) {
      out.set(title, snippets.length);
    }
    return out;
  }

  clear() {
    this.setState({
      selectedBook: undefined,
      snippets: [],
    });
    [KINDLE_SNIPPETS_KEY, SELECTED_BOOK_KEY].forEach((k) =>
      localStorage.removeItem(k)
    );
  }

  renderSnippets() {
    const titles = this.titles();
    return this.state.snippets
      .filter(
        (snippet) =>
          this.state.selectedBook !== undefined &&
          titles[this.state.selectedBook] === snippet.title
      )
      .sort((a, b) => {
        if (a.title !== b.title) {
          return a.title.localeCompare(b.title);
        }
        return a.page - b.page;
      })
      .map((snippet, idx) => (
        <Grid item key={idx}>
          <QuoteCard
            snippet={snippet}
            onClickCopy={() => this.copyToClipboard(snippet)}
          />
        </Grid>
      ));
  }

  onSelectBook(selectedBook: number) {
    this.setState({ selectedBook });
    localStorage.setItem(SELECTED_BOOK_KEY, selectedBook.toString());
  }

  render() {
    const snippetsContent = this.state.snippets.length ? (
      <>
        <BookDrawer
          onSelect={this.onSelectBook}
          selected={this.state.selectedBook}
          titles={Array.from(this.snippetTitleCount()).map(
            ([title, count]) => ({ title, badge: count })
          )}
        />
        <Typography variant="h3">Snippets</Typography>
        <Grid
          item
          container
          sx={{
            minWidth: 275,
            maxWidth: 700,
            textAlign: "left",
            marginLeft: "500px",
            flexDirection: "column",
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          {this.renderSnippets()}
        </Grid>
        <Snackbar
          open={this.state.copySnackbarOpen}
          autoHideDuration={3000}
          onClose={() => {
            this.setState({ copySnackbarOpen: false });
          }}
          message="Snippet copied"
        />
      </>
    ) : (
      <Grid
        item
        container
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography noWrap component="div" sx={{ marginBottom: 1 }}>
          No snippets found. Want to import some?
        </Typography>
        <Button
          size="large"
          onClick={() => this.setState({ importerOpen: true })}
          variant="contained"
          startIcon={<SettingsIcon />}
        >
          Import
        </Button>
      </Grid>
    );

    return (
      <Grid container height="100vh">
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Kindle Snippets Viewer
            </Typography>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => this.setState({ importerOpen: true })}
              color="inherit"
            >
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <ImporterDialog
          handleClose={() => this.setState({ importerOpen: false })}
          onImportSnippets={this.handleNewSnippets}
          onClear={this.clear}
          open={this.state.importerOpen}
        />
        {snippetsContent}
      </Grid>
    );
  }
}

export default App;
