# EDS Setup Repo

Playground repo for testing different setups with design system tokens

## Environments

- Preview: https://main--eds-test--jmereardon17jet2.aem.page/
- Live: https://main--eds-test--jmereardon17jet2.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:

1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Create a new block using `npm run new-block` followed by a name for a block: `npm run new-block your-block-name`
1. Start local server with aem cli and nodemon to watch for changes with `npm start` (opens your browser at `http://localhost:3000`)
1. Edit CSS files for blocks in `src/styles/blocks` to compile design tokens css variables to static values
1. Update design tokens using `npm run update-tokens` which will update the `src/styles/tokens.css` file
