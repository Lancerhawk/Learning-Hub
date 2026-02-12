# Branching Strategy

This project follows a simplified **GitHub Flow** strategy to ensure code stability and smooth collaboration.

## Overview

- **`main`**: The production-ready branch. All code in `main` should be deployable.
- **`develop`** (Optional): A staging branch for integrating features before merging to main.
- **Feature Branches**: Short-lived branches for specific features or fixes.

## Branch Naming Convention

All branches should follow this naming convention:

`type/description-of-change`

### Types
- `feat/` - New features (e.g., `feat/add-user-profile`)
- `fix/` - Bug repairs (e.g., `fix/login-error`)
- `docs/` - Documentation changes (e.g., `docs/update-readme`)
- `style/` - Formatting, missing semi colons, etc; no code change
- `refactor/` - Refactoring production code
- `test/` - Adding missing tests, refactoring tests
- `chore/` - Updating build tasks, package manager configs, etc

### Examples
- `feat/dark-mode-toggle`
- `fix/image-upload-crash`
- `docs/api-endpoints`

## Workflow

1.  **Sync with upstream**: Always start by pulling the latest changes from `main`.
    ```bash
    git checkout main
    git pull origin main
    ```

2.  **Create a branch**:
    ```bash
    git checkout -b feat/my-new-feature
    ```

3.  **Develop**: Make your changes. Commit small and often.
    - See [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) for commit message guidelines.

4.  **Push**:
    ```bash
    git push origin feat/my-new-feature
    ```

5.  **Pull Request**: Open a PR on GitHub from your branch to `main`.
    - Fill out the PR template.
    - Request a review from a maintainer.

6.  **Merge**: Once approved and CI passes, squash and merge into `main`.

## Hotfixes

For critical bugs in production:
1.  Branch from `main`: `git checkout -b hotfix/critical-bug`
2.  Fix and test.
3.  PR to `main`.
