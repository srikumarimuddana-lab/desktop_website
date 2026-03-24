const { execSync } = require('child_process');
const fs = require('fs');

try {
  const commits = execSync('git log --format="%an <%ae>"', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
    
  const uniqueAuthors = [...new Set(commits)];
  fs.writeFileSync('authors.json', JSON.stringify(uniqueAuthors, null, 2));
} catch (err) {
  console.error(err.message);
}
