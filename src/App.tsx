import React, { FormEvent } from 'react';
import logo from './logo.svg';
import './App.css';
import {parseKindleSnippets, Snippet} from "./parser/parser";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface State {
  formValue: string,
  snippets: Snippet[],
}

const KINDLE_SNIPPETS_KEY = "kindle_snippets";

const Input = styled('input')({
  display: 'none',
});

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    let snippetsRaw = localStorage.getItem(KINDLE_SNIPPETS_KEY);
    let snippets: Snippet[] = snippetsRaw ? JSON.parse(snippetsRaw) : [];

    this.state = {
      formValue: "unset",
      snippets,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderSnippets = this.renderSnippets.bind(this);
  }

  handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
    console.log(event);
    this.setState({formValue: event.currentTarget.value});
  }

  handleSubmit(event: React.SyntheticEvent) {
    // alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    const parsedSnippets = parseKindleSnippets(this.state.formValue);
    this.setState({snippets: parsedSnippets});
    localStorage.setItem(KINDLE_SNIPPETS_KEY, JSON.stringify(parsedSnippets));
  }

  renderSnippets() {
    return this.state.snippets.slice(0).reverse().map(snippet => 
      <Card sx={{ minWidth: 275, marginTop: 2.5 }} variant="outlined">
        <CardContent>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {snippet.title} ({snippet.author})
          </Typography>
          <Typography variant="body2">
            {snippet.content}
          </Typography>
          <Typography sx={{ fontSize: 14, marginTop: 2 }} color="text.secondary" gutterBottom>
            Page {snippet.page}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <textarea value={this.state.formValue} onChange={this.handleChange} />
        </label>
        <br/>
        <Button variant="contained" component="span">
          Submit
        </Button>
        <label htmlFor="contained-button-file">
          <Input accept="image/*" multiple type="file" id="contained-button-file" />
            <Button variant="contained" component="span">
              Upload
            </Button>
        </label>
      </form>
      <Box sx={{
        minWidth: 275,
        maxWidth: 700,
        textAlign: 'left',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        {this.renderSnippets()}
      </Box>
      </div>
    );
  }
}


export default App;
