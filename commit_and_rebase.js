const { execSync } = require('child_process');

try {
  console.log("Committing uncommitted changes...");
  try {
    execSync('git add .', { stdio: 'pipe' });
    execSync('git commit -m "Update layout and seo scripts"', { stdio: 'pipe' });
    console.log("Committed.");
  } catch(e) {
    console.log("No changes to commit or commit failed.");
  }

  console.log("Rebasing...");
  execSync('git rebase -i --root --exec "git commit --amend --reset-author --no-edit"', { 
    env: { ...process.env, GIT_SEQUENCE_EDITOR: 'node -e ""' },
    stdio: 'pipe'
  });
  
  console.log("Pushing...");
  execSync('git push -f origin main', { stdio: 'pipe' });
  console.log("All done.");
} catch (err) {
  console.error("Error stdout:", err.stdout ? err.stdout.toString() : "");
  console.error("Error stderr:", err.stderr ? err.stderr.toString() : "");
  console.error(err.message);
}
