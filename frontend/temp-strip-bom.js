const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src', 'App.js');
const buf = fs.readFileSync(filePath);
if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
  fs.writeFileSync(filePath, buf.slice(3));
  console.log('Removed BOM from App.js');
} else {
  console.log('No BOM detected in App.js');
}
