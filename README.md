# The BTD6 Index Website (WIP)
This project uses [CloudFlare Pages](https://developers.cloudflare.com/pages/).
## Setup/Running
- Run `npm install` to install dependencies 
- Run `npm start` to start the application locally.
## API Reference (in progress)
All endpoints output a JSON `{"error": "error_message"}` in case of an error.
### `GET /fetch-2tc`
Outputs a list of 2tcs as a JSON in the below format:
```json
{
    "results": [
        {"tower1": "tower1", "tower2": "tower2", "map": "map", "person": "person", "link": "link", "og": "og", "pending": "pending", "filekey": "filekey"}
    ],
    "more": "boolean - whether there are more results after these"
}
```
`filekey` is a UUID key where the uploaded completion image is stored on CloudFlare R2 (if applicable) and is the prefix of keys for attachment images on CloudFlare R2. If `link` is `null`, the completion link is on CloudFlare R2 as `https://media.btd6index.win/<filekey>`. `pending` is `null` if the completion is verified; otherwise it is the identifier of the user that uploaded the completion.

Request parameters (send as query params in the URL):
- `query` - the text to filter by in the completions
- `tower1`, `tower2`, `map`, `person`, `link`, `og`, `pending` - filter by these fields
- `difficulty` - filter by map difficulty
- `offset` - amount of completions after the first result to offset by
- `count` - number of completions per page (max 100, default 10)

### `GET /fetch-2mp`
Outputs a list of 2mps as a JSON in the below format:
```json
{
    "results": [
        {"entity": "entity", "map": "map", "person": "person", "link": "link", "og": "og", "pending": "pending", "filekey": "filekey"}
    ],
    "more": "boolean - whether there are more results after these"
}
```
`filekey` is a UUID key where the uploaded completion image is stored on CloudFlare R2 (if applicable) and is the prefix of keys for attachment images on CloudFlare R2. If `link` is `null`, the completion link is on CloudFlare R2 as `https://media.btd6index.win/<filekey>`. `pending` is `null` if the completion is verified; otherwise it is the identifier of the user that uploaded the completion.

Request parameters (send as query params in the URL):
- `query` - the text to filter by in the completions
- `entity`, `map`, `person`, `link`, `og`, `pending` - filter by these fields
- `difficulty` - filter by map difficulty
- `offset` - amount of completions after the first result to offset by
- `count` - number of completions per page (max 100, default 10)

### `GET /fetch-2tcc`
Outputs a list of 2tccs as a JSON in the below format:
```json
{
    "results": [
        {"tower1": "tower1", "tower2": "tower2", "map": "map", "person1": "person1", "person2": "person2", "link": "link", "og": "og", "pending": "pending", "filekey": "filekey"}
    ],
    "more": "boolean - whether there are more results after these"
}
```
`filekey` is a UUID key where the uploaded completion image is stored on CloudFlare R2 (if applicable) and is the prefix of keys for attachment images on CloudFlare R2. If `link` is `null`, the completion link is on CloudFlare R2 as `https://media.btd6index.win/<filekey>`. `pending` is `null` if the completion is verified; otherwise it is the identifier of the user that uploaded the completion.

Request parameters (send as query params in the URL):
- `query` - the text to filter by in the completions
- `tower1`, `tower2`, `map`, `person1`, `person2`, `link`, `og`, `pending` - filter by these fields
- `difficulty` - filter by map difficulty
- `offset` - amount of completions after the first result to offset by
- `count` - number of completions per page (max 100, default 10)
