# CLAUDE.md

## Rules
- Follow existing repository conventions, not generic best practices.
- Prefer the smallest safe patch.
- Reuse existing components, hooks, services, and utilities.
- Avoid `any` unless necessary.
- Use explicit prop and API types.
- Keep API logic out of presentational components.
- Follow the current form, query, and styling patterns.
- Do not refactor unrelated code.
- If unclear, state assumptions instead of guessing.

## When fixing code
Always provide:
1. Root cause
2. Files to update
3. Minimal patch
4. Retest checklist

## When creating code
- Inspect nearby files first
- Match naming and structure
- Reuse existing patterns
- Do not add new libraries unless asked