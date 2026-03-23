### Branch Protection Rules
To maintain code quality, the following rules are enforced on the `main` branch:
1. **Require status checks to pass:** The `CI` workflow (Lint, Typecheck, Test, Build) must succeed before merging.
2. **Require pull request reviews:** At least one approval is required for non-trivial changes.
3. **Do not allow force pushes:** All history must be preserved.