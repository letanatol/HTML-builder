const fs = require('fs');
const path = require('path');
const secretFolder = path.join(__dirname, './secret-folder');

fs.readdir(secretFolder, { withFileTypes: true }, (error, data) => {
  if (error) console.log('Error');

  data.forEach((dirFile) => {
    if (dirFile.isFile()) {
      fs.stat(path.join(secretFolder, dirFile.name), (error, stats) => {
        if (error) console.log('Error');
        const fileName = path.parse(dirFile.name).name;
        const extName = path.extname(dirFile.name).slice(1);
        const sizeName = stats.size / 1024;

        console.log(`${fileName} - ${extName} - ${sizeName}kb`);
      });
    }
  });
});
