import React from "react";
import "./App.css";
import Footer from "./components/footer";
import { Snippet } from "./parser/parser";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import QuoteCard from "./components/quoteCard";
import ImporterDialog from "./components/importer";
import Typography from "@mui/material/Typography";
import BookDrawer from "./components/bookDrawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import SettingsIcon from "@mui/icons-material/Settings";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ToolbarHeader from "./components/toolbarHeader";
import { styled, useTheme } from "@mui/material/styles";
import { useDrawerToggleable, DRAWER_WIDTH } from "./utils/theming";

interface State {
  snippets: Snippet[];
  selectedBook?: number;
  copySnackbarOpen: boolean;
  importerOpen: boolean;
  drawerOpen: boolean;
}

const KINDLE_SNIPPETS_KEY = "kindle_snippets_content";
const SELECTED_BOOK_KEY = "kindle_snippets_selected_book";

const ThemeContainer = (props: { children: React.ReactNode }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ open }: { open: boolean }) => {
    const theme = useTheme();
    const drawerToggleable = useDrawerToggleable();

    return {
      flexGrow: 1,
      padding: theme.spacing(3),
      ...(!drawerToggleable || open
        ? {
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: DRAWER_WIDTH,
          }
        : {
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: 0,
          }),
    };
  }
);

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    let snippetsRaw = localStorage.getItem(KINDLE_SNIPPETS_KEY);
    let snippets: Snippet[] = snippetsRaw ? JSON.parse(snippetsRaw) : [];
    let selectedBook =
      Number(localStorage.getItem(SELECTED_BOOK_KEY)) ??
      (snippets.length ? 0 : undefined);

    this.state = {
      snippets,
      selectedBook,
      copySnackbarOpen: false,
      importerOpen: snippets.length === 0,
      drawerOpen: false,
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
    this.setState({ selectedBook, drawerOpen: false });
    localStorage.setItem(SELECTED_BOOK_KEY, selectedBook.toString());
  }

  render() {
    const snippetsContent = this.state.snippets.length ? (
      <>
        <BookDrawer
          onSelect={this.onSelectBook}
          selected={this.state.selectedBook}
          open={this.state.drawerOpen}
          titles={Array.from(this.snippetTitleCount()).map(
            ([title, count]) => ({ title, badge: count })
          )}
        />
        <Typography variant="h3">Snippets</Typography>
        <Main open={this.state.drawerOpen}>
          <Grid item container>
            <Grid item sm={0} md={1} xl={2} />
            <Grid
              sm={16}
              md={10}
              xl={8}
              item
              container
              sx={{
                minWidth: 275,
                textAlign: "left",
                flexDirection: "column",
                flexWrap: "nowrap",
                alignContent: "space-around",
              }}
            >
              {this.renderSnippets()}
            </Grid>
          </Grid>
          {/* <Footer /> */}
        </Main>
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
      <ThemeContainer>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <ToolbarHeader
            onSettingsClick={() => this.setState({ importerOpen: true })}
            onDrawerToggle={() =>
              this.setState({ drawerOpen: !this.state.drawerOpen })
            }
          />
        </AppBar>
        <ImporterDialog
          handleClose={() => this.setState({ importerOpen: false })}
          onImportSnippets={this.handleNewSnippets}
          onClear={this.clear}
          open={this.state.importerOpen}
        />
        {snippetsContent}
      </ThemeContainer>
    );
  }
}

export default App;
