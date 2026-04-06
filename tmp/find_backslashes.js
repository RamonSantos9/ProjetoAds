import fs from 'fs';
import path from 'path';

const rootDir = process.argv[2] || '.';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const filename = path.join(dir, file);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      walk(filename, callback);
    } else if (/\.(tsx|ts)$/.test(filename)) {
      callback(filename);
    }
  });
}

const pattern = /from\s+['"]\.\.\\/g;
const filesWithBackslashes = [];

walk(rootDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (pattern.test(content)) {
    filesWithBackslashes.push(filePath);
  }
});

console.log(filesWithBackslashes.join('\n'));
