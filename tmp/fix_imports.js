import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
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

const targetDir = process.argv[2] || 'packages/ui/src';

walk(targetDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  // Match import/export ... from '...' or import '...'
  const newContent = content.replace(
    /(import|export).*?from\s+['"](.*?)['"]|import\s+['"](.*?)['"]/g,
    (match, p1, p2, p3) => {
      const p = p2 || p3;
      if (p && p.includes('\\')) {
        const fixedPath = p.replace(/\\/g, '/');
        return match.replace(p, fixedPath);
      }
      return match;
    },
  );

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
});
