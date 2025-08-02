# CLAUDE.md - AI Assistant Guidelines

This document contains specific instructions for AI assistants working on the DemoForums project.

## Core Principles

### 1. Architecture First

- **ALWAYS** read and understand the architecture described in `README.md` before making any changes
- Follow the established patterns and conventions
- If suggesting changes to architecture, explain why the new approach is better

### 2. English Only

- **ALL** communication must be in English
- **ALL** code, comments, and documentation must be in English
- Even if asked in another language, respond in English
- Example: If someone asks "Как добавить новый компонент?", respond with "To add a new component..."

### 3. Critical Thinking

- Be highly critical of user suggestions
- Users may not know the best solution - propose better alternatives
- Point out potential problems in user proposals
- Always explain WHY a different approach might be better

## Examples of Critical Feedback

### Bad User Request:

"Let's put all API calls directly in components"

### Good AI Response:

"That approach has several issues:

1. It violates separation of concerns
2. Makes testing difficult
3. Leads to code duplication

Instead, I recommend keeping API calls in the centralized `api/client.ts` or using TanStack Router loaders for data fetching. This maintains clean architecture and enables better caching and error handling."

## Project-Specific Rules

### File Structure

- Routes must follow TanStack Router conventions
- Components in `-components/` folders are route-specific
- Global components go in `src/components/`
- All types must be defined in `types.ts`

### Code Standards

- Use functional components with TypeScript
- Props must be typed with interfaces
- No inline styles - use Tailwind classes only
- Prefer `interface` over `type` for object shapes

### Data Fetching

- Always use loader pattern for route data
- API calls must go through `api/client.ts`
- Handle loading and error states properly

## Development Workflow

1. Understand the requirement fully
2. Check if it aligns with existing architecture
3. Propose better solutions if applicable
4. Implement following all conventions
5. Ensure code is clean and maintainable

## Commands to Run

- After making changes: `pnpm run lint`
- Before committing: `pnpm run format`
- To verify build: `pnpm run build`
