const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'bin', 'index.js');
const shebang = '#!/usr/bin/env node\n';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  if (!data.startsWith(shebang)) {
    const updatedData = shebang + data;
    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('Shebang added successfully.');
      }
    });
  } else {
    console.log('Shebang already present.');
  }
}); 