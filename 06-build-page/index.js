const path = require('path');
const {
  rm,
  mkdir,
  readdir,
  readFile,
  copyFile,
  writeFile,
} = require('fs/promises');

const dirProjectDist = path.resolve(__dirname, 'project-dist');
const dirAssets = path.resolve(__dirname, 'assets');
const dirProjectDistAssets = path.resolve(dirProjectDist, 'assets');
const dirStyles = path.resolve(__dirname, 'styles');
const dirComponents = path.resolve(__dirname, 'components');
const fileTemplate = path.resolve(__dirname, 'template.html');
const fileProjectDistIndex = path.resolve(dirProjectDist, 'index.html');

const buildPage = async () => {
  try {
    await rm(dirProjectDist, { recursive: true, force: true });
    await mkdir(dirProjectDist, { recursive: true });

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
    await writeFile(path.join(dirProjectDist, 'style.css'), stringStyles);

    await mkdir(dirProjectDistAssets, { recursive: true });

    const copyDir = async (currentFolder, copyFolder) => {
      const files = await readdir(currentFolder, { withFileTypes: true });

      for (const file of files) {
        if (file.isFile()) {
          const currentPathFile = path.resolve(currentFolder, file.name);
          const copyPathFile = path.resolve(copyFolder, file.name);

          await copyFile(currentPathFile, copyPathFile);
          continue;
        }

        await mkdir(path.join(copyFolder, file.name), { recursive: true });
        copyDir(
          path.join(currentFolder, file.name),
          path.join(copyFolder, file.name),
        );
      }
    };

    copyDir(dirAssets, dirProjectDistAssets);

    const components = await readdir(dirComponents, { withFileTypes: true });
    const objectComponents = {};

    await Promise.all(
      components.map(async (file) => {
        const { name: fileName } = file;
        const tagsHTML = await readFile(
          path.join(dirComponents, file.name),
          'utf8',
        );
        objectComponents[fileName.split('.')[0]] = tagsHTML;
      }),
    );

    await copyFile(fileTemplate, fileProjectDistIndex);
    let fileIndex = await readFile(fileProjectDistIndex, 'utf8');

    Object.entries(objectComponents).forEach(([key, value]) => {
      fileIndex = fileIndex.replaceAll(`{{${key}}}`, value);
    });

    await writeFile(fileProjectDistIndex, fileIndex);
  } catch (error) {
    console.error(error.message);
  }
};

buildPage();
