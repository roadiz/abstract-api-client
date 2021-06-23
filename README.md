# abstract-api-client
Abstract API Typescript client interfaces and SDK.

Based on *Axios* HTTP client.

## Usage

```json
yarn add @roadiz/abstract-api-client
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": [
      "@roadiz/abstract-api-client"
    ]
  }
}
```

## Test

Tests use *jest* and require a working Roadiz headless API to fetch responses from. Copy `.env.dist` to `.env` 
and fill your server credentials.

```
yarn
cp .env.dist .env
yarn test
```
