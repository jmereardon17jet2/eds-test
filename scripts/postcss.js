const postcss = require('postcss');
const { postcssVarReplace } = require('postcss-var-replace');
const cssToObject = require('css-to-object');
const fs = require('fs');

const tokens = fs.readFileSync('src/styles/tokens.css', 'utf8').replace('[data-theme=holidays]', '');
const baseCSS = fs.readFileSync('src/styles/styles.css', 'utf8');

const variables = cssToObject(tokens);

postcss([postcssVarReplace({ variables })])
  .process(baseCSS, { from: 'src/styles/styles.css', to: 'styles/styles.css' })
  .then(res => fs.writeFile('styles/styles.css', res.css, () => true));

fs.readdirSync('src/styles/blocks').forEach(block => {
  const blockCSS = fs.readFileSync(`src/styles/blocks/${block}/${block}.css`, 'utf8');
  postcss([postcssVarReplace({ variables })])
    .process(blockCSS, { from: `src/styles/blocks/${block}/${block}.css`, to: `blocks/${block}/${block}.css` })
    .then(res => fs.writeFile(`blocks/${block}/${block}.css`, res.css, () => true));
});
