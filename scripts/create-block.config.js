const fs = require('fs');
const BLOCKS_DIR = 'blocks';
const BLOCKS_STYLING_DIR = 'styles/blocks';
const blockName = process.argv[2] || 'new-block';
const files = [
  `${BLOCKS_DIR}/${blockName}/${blockName}.js`,
  `${BLOCKS_STYLING_DIR}/${blockName}/${blockName}.css`
];

async function createDirectory(path) {
  fs.mkdirSync(path, err => {
    if (err) {
      console.error(`Failed to create directory ${path}:`, err);
      throw err;
    }
  });
}

function checkBlockExists() {
  const blockExists = checkFilesExists();

  if (blockExists) {
    console.log(`Block already exists with name: ${blockName}`);
    process.exit(0);
  }
}

function checkFilesExists() {
  return files.some(fs.existsSync);
}

function createBlockFiles() {
  try {
    createDirectory(`${BLOCKS_DIR}/${blockName}`);
    createDirectory(`${BLOCKS_STYLING_DIR}/${blockName}`);

    fs.readFile('scripts/block-template.js', 'utf8', (err, data) => {
      if (err) {
        console.error('Failed to read block template JS', err);
        throw err;
      } else {
        fs.writeFile(`${BLOCKS_DIR}/${blockName}/${blockName}.js`, data, err => {
          if (err) {
            console.error('Failed to create JS', err);
            throw err;
          }
        });
      }
    });

    fs.openSync(`${BLOCKS_STYLING_DIR}/${blockName}/${blockName}.css`, 'a');

    console.log(`Block: ${blockName} created!`);
  } catch (err) {
    console.error('Error creating block files:', err);
  }
}

(async () => {
  try {
    checkBlockExists();
    createBlockFiles();
  } catch (err) {
    console.error('Error creating block:', err);
  }
})();
