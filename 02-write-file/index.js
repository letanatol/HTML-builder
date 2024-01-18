const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const fileText = path.resolve(__dirname, 'text.txt');

fs.open(fileText, 'w', (err) => {
  // 'w': только для записи (write).
  // Создает новый файл, если файл с указанным именем не существует,
  // и усекает файл до нулевой длины, если файл существует.
  if (err) throw err;
  // console.log('File created');
});

stdout.write('Напишите что-нибудь, пожалуйста\n');
stdin.on('data', (data) => {
  fs.appendFile(fileText, data, (err) => {
    if (err) throw err;
  });
});

stdin.on('data', (data) => {
  if (data.toString().trim() == 'exit') {
    stdout.write('Спасибо, до свидания!');
    process.exit();
  }
});

process.on('SIGINT', () => {
  stdout.write('Спасибо, до свидания!');
  process.exit();
});
