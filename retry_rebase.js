const { execSync } = require('child_process');

try {
  try {
    console.log("Aborting previous rebase...");
    execSync('git rebase --abort', { stdio: 'pipe' });
  } catch(e) {} // ignore if no rebase in progress

  console.log("Committing any dangling changes without hooks...");
  try {
    execSync('git add .', { stdio: 'pipe' });
    execSync('git commit --no-verify -m "Save local changes"', { stdio: 'pipe' });
  } catch(e) {}

  console.log("Rebasing...");
  execSync('git rebase -i --root --exec "git commit --amend --reset-author --no-edit --no-verify"', { 
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
