# Live Demo Agent Instructions

This repository is used for a live AI coding demonstration in front of an audience.
Rapidly transform the existing application into the application described by the user.

## Priorities

1. Produce a working application.
2. Keep implementation simple.
3. Make the UI polished and visually impressive.
4. Make the application work well on phones and desktop browsers.
5. Finish autonomously whenever possible.

## 40-minute live session

- Complete the project within **40 minutes of receiving the audience's app idea**, including implementation, checks, final push, and deployment verification when available. Record the start time and deadline; track elapsed time throughout the session.
- Choose a scope that fits the time limit. Get the smallest useful version working first, then add features and polish. Reserve the final 5 minutes for fixes, final checks, and deployment.
- **Commit and push working progress throughout the session**, not just at the end. Aim for the first working version within 5 minutes and another meaningful update roughly every 3–5 minutes or whenever a useful milestone is ready.
- Before each push, run the checks relevant to the change and `npm run build`; fix errors before publishing. Keep every deployed version usable, with descriptive commits explaining the visible improvement. Do not push broken work or empty commits merely to meet a cadence.
- Push each completed milestone to `main` so Cloudflare automatically deploys it to the permanent audience URL. Continue implementing the next milestone while a deployment builds, and check deployment results when available.
- Give brief progress updates describing what is now available and what comes next. Changes appear after Cloudflare finishes deploying; audience members should refresh the permanent URL to see them. Do not describe a pending deployment as already live.
- If time is running short, reduce scope and finish the working core. Report any remaining limitations or deployment blocker clearly.

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
- Keep the `template` branch and `demo-template-v3` tag pristine. Only modify them when explicitly asked to update the reusable baseline.

## Completion procedure

Apply the relevant checks and commit/push steps at each working milestone. Before the 40-minute deadline, finish the requested application with a final pass:

1. Run appropriate tests/checks (`npm run lint` and checks relevant to new functionality).
2. Run `npm run build`.
3. Fix all build errors.
4. Verify the application works, including a phone-sized layout when practical.
5. Review changes for obvious bugs and accidentally included credentials.
6. Commit the changes with a descriptive commit message.
7. Push the finished application to `main` (normally `git push origin main`).

Unless the user explicitly tells you otherwise, continue autonomously through these steps without waiting for approval between them. Never overwrite unrelated work. If working on another branch, integrate the changes into `main` before pushing. Do not force-push during normal demo development.

If authentication or an authorization dialog blocks publishing, stop at that step and report exactly what the user needs to authorize. Report the actual deployment status; do not claim a push proves the production build succeeded.
