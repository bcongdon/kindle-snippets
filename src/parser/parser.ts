import * as kindleClippings from '@darylserrano/kindle-clippings';

export interface Snippet {
    author: string,
    title: string,
    content: string,
    page: number,
    location: string,
}

function parseKindleSnippets(input: string): Snippet[] {
    let entries = kindleClippings.readKindleClipping(input);
    let parsedEntries = kindleClippings.parseKindleEntries(entries);
    console.log(parsedEntries);
    return parsedEntries.map(e => {
        return {
            author: e.authors,
            title: e.bookTile,
            content: e.content,
            page: Number(e.page),
            location: e.location,
        };
    });
}

export {
    parseKindleSnippets
}