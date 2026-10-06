const fs = require('fs');
const path = require('path');

function scanDir(dir, patterns) {
    let matches = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file === 'node_modules' || file === '__pycache__' || file === '.git') continue;
            matches = matches.concat(scanDir(fullPath, patterns));
        } else {
            if (!fullPath.match(/\.(py|js|jsx|md|json)$/)) continue;
            const content = fs.readFileSync(fullPath, 'utf8');
            for (const p of patterns) {
                if (content.match(p)) {
                    matches.push(fullPath);
                    break;
                }
            }
        }
    }
    return matches;
}

console.log("BACKEND MATCHES:");
console.log(scanDir('backend', [/apps\.core/, /api\/core/]));

console.log("FRONTEND MATCHES:");
console.log(scanDir('frontend/src', [/apps\/core/, /api\/core/]));
