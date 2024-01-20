const path = require('path');
const { readdir, readFile, writeFile } = require('fs/promises');

const dirStyles = path.resolve(__dirname, 'styles');
const dirProjectDist = path.resolve(__dirname, 'project-dist');
const fileBundle = path.resolve(dirProjectDist, 'bundle.css');

async function mergeStyles() {
  try {
    const filesStyles = await readdir(dirStyles, { withFileTypes: true });
    const arrayCSSFiles = filesStyles.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    const arrayStyles = await Promise.all(
      arrayCSSFiles.map((file) =>
        readFile(path.resolve(dirStyles, file.name), 'utf-8'),
      ),
    );

    const stringStyles = arrayStyles.join('\n');

    await writeFile(fileBundle, stringStyles);
  } catch (error) {
    console.error(error.message);
  }
}

mergeStyles();
