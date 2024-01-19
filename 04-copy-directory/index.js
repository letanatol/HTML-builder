const path = require('path');
const files = path.resolve(__dirname, 'files');
const filesCopy = path.resolve(__dirname, 'files-copy');

const { readdir, mkdir, rm, copyFile } = require('fs/promises');

async function copyDir(currentFolder, copyFolder) {
  try {
    await rm(copyFolder, { recursive: true, force: true });
    await mkdir(copyFolder, { recursive: true });
    const files = await readdir(currentFolder, { withFileTypes: true });

    for (const file of files) {
      const currentPathFile = path.resolve(currentFolder, file.name);
      const copyPathFile = path.resolve(copyFolder, file.name);

      await copyFile(currentPathFile, copyPathFile);
    }
  } catch (error) {
    console.error(error.message);
  }
}

copyDir(files, filesCopy);
