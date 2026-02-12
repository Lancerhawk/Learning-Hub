# Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This leads to more readable messages that are easy to follow when looking through the project history.

## Commit Message Format

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The header is mandatory and should not exceed 50 characters.

## Types

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

## Scope

The scope could be anything specifying the place of the commit change. For example:
- `(auth)`
- `(api)`
- `(ui)`
- `(database)`
- `(readme)`

## Subject

The subject contains a succinct description of the change:
- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end

## Body

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

## Footer

The footer should contain any information about Breaking Changes and is also the place to reference GitHub issues that this commit closes.

## Examples

```
feat(auth): add google oauth login

Implemented Google OAuth2 flow using passport-google-oauth20 strategy.
Added new route /auth/google and callback handler.

Closes #123
```

```
fix(api): handle null rate limit headers

Rate limiter headers were sometimes missing, causing client crashes.
Added default values to safe header parsing safely.
```
