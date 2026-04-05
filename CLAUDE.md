# Quillt: AI Guide

> [!IMPORTANT]
> **MANDATORY FIRST STEP:** Before starting any task, check for the existence of a `specs/` directory using `ls -d specs/ 2>/dev/null`. If it exists, `ls specs/` to identify any relevant design or architectural rules before proposing changes.

## Build & Dev Commands
- `npm run dev`: Start Astro dev server (default port 4321)
- `npm run build`: Sync and build for production (Vercel)
- `npm run preview`: Preview production build
- `npm run lint:islands`: Run hydration linter for Astro islands

## Git Workflow Rule:
- For every new task/spec, you MUST create a new feature branch using the format feat/short-description.
- Do not work on main directly.
- Once the task is complete, provide a summary of changes and the command to push the branch.

## Coding Style & Conventions
- **Framework**: Astro 6.x with Keystatic CMS (Local Storage Mode).
- **Style**: Modular Astro components. Focus on static HTML first.
- **Interactivity**: Use standard `<script>` tags in `.astro` files for simple logic. Use React only for Keystatic or complex stateful islands.
- **Styling**: Vanilla CSS in `src/styles/global.css`. Use CSS variables for design tokens.
- **Token Management**: Always look for a `specs/` file before proposing changes to the design system or tokens.
- **Post-Commit**: Always suggest `/compact` to the user after a successful git commit.

## Architecture
- **Environment**: SSR mode (`output: 'server'`) deployed to Vercel.
- **Content**: 
  - Posts are Markdoc files in `src/content/posts/`.
  - Images are in `public/images/` and referenced via absolute paths.
  - Use Keystatic Admin (`/keystatic`) for local content management.

## Project Structure
- `src/components/`: Modular Astro components.
- `src/layouts/`: Base Page and Post layouts.
- `src/pages/`: File-based routing (Index, Posts, Subscribe).
- `keystatic.config.ts`: CMS schema and custom Markdoc blocks (`gallery`, `image70`).
