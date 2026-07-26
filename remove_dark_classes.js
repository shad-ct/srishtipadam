const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const clientSrcDir = path.join(__dirname, 'client', 'src');

walkDir(clientSrcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove simple dark classes
    const classesToRemove = [
      'dark:bg-background-dark',
      'dark:bg-surface-dark',
      'dark:text-text-dark',
      'dark:text-accent',
      'dark:text-text-dark/80',
      'dark:text-text-dark/70',
      'dark:text-text-dark/60',
      'dark:text-text-dark/50',
      'dark:text-text-dark/40',
      'dark:fill-surface-dark',
      'dark:mix-blend-luminosity',
      'dark:from-surface-dark'
    ];
    
    classesToRemove.forEach(cls => {
      content = content.split(cls).join('');
    });
    
    // Regex replacements for dynamic ones
    content = content.replace(/text-primary\s+dark:text-accent/g, 'text-primary');
    content = content.replace(/bg-primary\/(\d+)\s+dark:bg-accent\/\1/g, 'bg-primary/$1');
    content = content.replace(/border-gray-\d+(\/\d+)?\s+dark:border-gray-\d+(\/\d+)?/g, 'border-border');
    content = content.replace(/text-gray-\d+\s+dark:text-gray-\d+/g, 'text-text-secondary');
    content = content.replace(/bg-gray-\d+\s+dark:bg-gray-\d+/g, 'bg-surface-raised');
    
    // Clean up spaces in className strings
    content = content.replace(/className="([^"]+)"/g, (match, p1) => {
      let cleaned = p1.replace(/\s+/g, ' ').trim();
      return `className="${cleaned}"`;
    });
    
    // Also clean up template literal classes `...`
    content = content.replace(/className={`([^`]+)`}/g, (match, p1) => {
      let cleaned = p1.replace(/\s+/g, ' ').trim();
      return `className={\`${cleaned}\`}`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});
