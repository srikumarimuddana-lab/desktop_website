const { execSync } = require('child_process');

try {
  const config = execSync('git config -l', { encoding: 'utf8' })
    .split('\n')
    .filter(l => l.startsWith('user.'));
    
  const commits = execSync('git log -n 5 --format="%an <%ae>"', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
    
  console.log(JSON.stringify({ config, commits }, null, 2));
} catch (err) {
  console.error(err.message);
}
