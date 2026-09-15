# Live Demo Agent Instructions

This repository is used for a live AI coding demonstration in front of an audience.
Rapidly transform the existing application into the application described by the user.

## Priorities

1. Produce a working application.
2. Keep implementation simple.
3. Make the UI polished and visually impressive.
4. Make the application work well on phones and desktop browsers.
5. Finish autonomously whenever possible.

## Constraints

- Do not add authentication unless explicitly requested.
- Do not add databases unless absolutely necessary. Prefer client-side functionality.
- Do not use sensitive information or put API keys, passwords, tokens, or credentials in source code.
- Client-side environment variables (including `VITE_*`) are public. Never use them for secrets.
- Prefer public APIs requiring no authentication when outside data is required.
- Prefer synthetic/demo data if external services would make the demo unreliable.
- Avoid unnecessary dependencies, routers, state frameworks, and architecture.
- Start with `src/App.tsx`, `src/main.tsx`, and `src/index.css`.
- Do not radically alter deployment: Cloudflare Pages watches GitHub `main`, runs `npm run build`, and publishes `dist/`.
- Do not add Cloudflare tokens or deployment workflows. The GitHub integration handles deployment.
- Keep the `template` branch and `demo-template-v1` tag pristine. Only modify them when explicitly asked to update the reusable baseline.

## Completion procedure

After implementing the requested application:

1. Run appropriate tests/checks (`npm run lint` and checks relevant to new functionality).
2. Run `npm run build`.
3. Fix all build errors.
4. Verify the application works, including a phone-sized layout when practical.
5. Review changes for obvious bugs and accidentally included credentials.
6. Commit the changes with a descriptive commit message.
7. Push the finished application to `main` (normally `git push origin main`).

Unless the user explicitly tells you otherwise, continue autonomously through these steps without waiting for approval between them. Never overwrite unrelated work. If working on another branch, integrate the changes into `main` before pushing. Do not force-push during normal demo development.

If authentication or an authorization dialog blocks publishing, stop at that step and report exactly what the user needs to authorize. Report the actual deployment status; do not claim a push proves the production build succeeded.
