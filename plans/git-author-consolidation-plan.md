# Git Author Consolidation Plan

## Objective
Rebase the remote git repository to consolidate all commits under a single author: Srikumari Muddana <srikumarimuddana@gmail.com>

## Current State Analysis
- Local git config shows: `email = github@emergent.sh`, `name = emergent-agent-e1`
- authors.json currently contains only: "Srikumari Muddana <srikumarimuddana@gmail.com>"
- Existing scripts show two target authors were considered:
  - Kiran Kumar <srikumarimuddana@gmail.com>
  - Srikumari Muddana <srikumarimuddana@gmail.com>
- Target author selected: Srikumari Muddana <srikumarimuddana@gmail.com>

## Strategy Overview
We will use git filter-branch to rewrite git history across all branches, setting both GIT_AUTHOR and GIT_COMMITTER fields to the target author, then force-push all branches to the remote repository.

## Detailed Steps

### 1. Preparation
- Ensure working directory is clean (commit or stash any uncommitted changes)
- Fetch latest changes from remote: `git fetch --all`
- Verify current branch and remote tracking branches

### 2. Rewrite Git History
Use git filter-branch to rewrite all commits:
```bash
git filter-branch -f --env-filter "
  GIT_AUTHOR_NAME='Srikumari Muddana'
  GIT_AUTHOR_EMAIL='srikumarimuddana@gmail.com'
  GIT_COMMITTER_NAME='Srikumari Muddana'
  GIT_COMMITTER_EMAIL='srikumarimuddana@gmail.com'
" -- --all
```

### 3. Clean Up Backup References
Remove backup references created by filter-branch:
```bash
git for-each-ref --format="%(refname)" refs/original/ | while read ref; do
  git update-ref -d "$ref"
done
```

Alternative PowerShell command (as used in existing scripts):
```powershell
git for-each-ref --format="%(refname)" refs/original/ | % { git update-ref -d $_ }
```

### 4. Force Push All Branches
Push all rewritten branches to remote:
```bash
git push -f --all origin
```

### 5. Push Tags (if any)
```bash
git push -f --tags origin
```

### 6. Verification
- Verify authors on remote: `git log origin/main --format="%an <%ae>" | sort -u`
- Check that all commits now show the target author
- Confirm repository integrity

## Safety Considerations
- This operation rewrites git history and requires force-push
- Ensure all team members are aware and coordinate if this is a shared repository
- Consider creating a backup of the repository before proceeding
- The operation affects all branches and tags

## Alternative Approaches Considered
1. Interactive rebase with commit amendment (more selective but labor-intensive)
2. Using git commit --amend on individual commits (not practical for large history)
3. Using BFG Repo Cleaner (specialized tool, but filter-branch is built-in)

## Implementation Notes
The existing `filter_authors.js` script already implements steps 2, 3, and 4. It can be executed directly:
```bash
node filter_authors.js
```

However, for maximum safety, the steps should be executed manually with verification at each stage.

## Post-Consolidation
- Update local git config if desired to match the consolidated author
- Inform team members about the history rewrite
- Set up any necessary hooks or configurations to prevent mixed authors in future