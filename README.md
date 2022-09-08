# WoTBlocks

WoTBlocks is a Vue components library intended to dynamically generate WoT UIs using [WoT TDs](https://www.w3.org/TR/wot-thing-description/)  

WoTBlocks can be imported to any any Vue.js project. Simply build the library and then include it in your project as part of the package.json file as a dependency. "wotblocks": "file:../../../PATH_TO_YOUR_WOTBLOCKS_REPO/Wotblocks/wotblocks" 

## Building WoTBlocks

Run npm install followed by npm run build to generate a dist/ folder that can be used for importing to other projects.

```bash
npm install
```

```bash
npm run build
```


## Running Storybook for a WoTBlocks Showcase (useful for developing and contributing to the library)

Storybook makes it easy to test or showcase the WoTBlock library components, by providing a frontend application that isolates each component for testing its UI.

```bash
npm run storybook
```


## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
