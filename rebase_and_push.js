const { execSync } = require('child_process');

try {
  console.log("Setting git sequence editor to bypass interactive prompt...");
  
  // Rebasing all commits to reset their author to the current global config
  execSync('git rebase -i --root --exec "git commit --amend --reset-author --no-edit"', { 
    env: { ...process.env, GIT_SEQUENCE_EDITOR: 'node -e ""' },
    stdio: 'inherit'
  });
  
  console.log("Rebase finished successfully. Force pushing to origin...");
  execSync('git push -f origin main', { stdio: 'inherit' });
  console.log("Push completed successfully.");
} catch (err) {
  console.error("An error occurred during rebase/push:", err.message);
}
