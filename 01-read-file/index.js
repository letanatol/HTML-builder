const fs = require('fs');
const path = require('path');

// const pathToFile = path.resolve(__dirname, 'text.txt');
// const fileStream = fs.createReadStream(pathToFile, 'utf-8');

// fileStream.on('error', (err) => {
//   console.log('Error', err.message);
// });

// fileStream.on('data', (data) => {
//   console.log(data);
// });

const fileStream = fs.createReadStream(
  path.resolve(__dirname, 'text.txt'),
  'utf-8',
);
const { stdout } = process;

let data = '';

fileStream.on('data', (chunk) => (data += chunk));
fileStream.on('end', () => stdout.write(data));
fileStream.on('error', (error) => stdout.write('Error', error.message));
