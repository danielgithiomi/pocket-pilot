> Note for AI-assisted commits (Antigravity, Windsurf, etc.)
> Always follow the commit format and examples below

## Contributing Guidelines

### Commit Message Format

All commit messages must follow this structure:

`<Type>(<Section>): <Ticket-ID> <Summary>`

#### Fields

- **Type**
  - `ref` – code refactoring commit
  - `feat` – new functionality or feature
  - `fix` – bug fixes
  - `refactor` – code restructuring
  - `config` – configuration changes
  - `setup` – project or tooling setup

- **Section**
  - The area being worked on
  - Examples: `root-config`, `auth-service`, `wallet`, `mobile-app`

- **Ticket-ID**
  - Derived from the branch name
  - Branches must be named like:

    ``` (shell)
    PP-001-feature-description
    ```

  - Only the `PP-001` portion is used in commits

- **Summary**
  - Short, imperative description
  - No trailing period
  - Max 72 characters

### Examples

- `ref (config): PP-003: Added @common module path alias to moduleNameMapper in Jest config and reformatted imports and spacing in main.ts for better readability.`
- `feat (auth-service): PP-001 add login functionality`
- `fix (wallet): PP-002 resolve transaction issue`
- `ref (root-config): PP-003 optimize configuration`

### Notes

- Always include the ticket ID
- Use lowercase types
- Do not quote the ticket ID
