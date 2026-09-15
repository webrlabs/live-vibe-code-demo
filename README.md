# Live AI App Challenge

A deliberately small React + TypeScript + Vite starter for turning an audience idea into a working app during a live presentation. One component, one stylesheet, no accounts, database, or external data required.

## Local development

Use Node.js 24.14.0 (pinned in `.node-version`) and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Edit `src/App.tsx` and `src/index.css`; `src/main.tsx` mounts the app. Assets belong in `public/`.

```sh
npm run lint
npm run build
npm run preview
```

The build checks TypeScript and creates `dist/`. Preview serves the production build locally. Commit `package-lock.json`; use `npm ci` for a clean install.

**Windows npm troubleshooting:** On the setup computer, npm's launcher selected an incomplete global npm installation. If you see a missing `AppData/Roaming/npm/node_modules/npm/bin/npm-cli.js` error, run this in the current PowerShell session before the normal npm commands:

```powershell
$env:npm_config_prefix = 'C:\Program Files\nodejs'
```

If a restricted agent session also cannot write the npm cache:

```powershell
$env:npm_config_cache = "$env:TEMP\live-ai-app-npm-cache"
```

These are session-only workarounds; they do not change global settings.

## Deployment architecture

```text
Presenter phone
      │
      ▼
Remote coding agent
      │
      ▼
Home development computer
      │
      ▼
GitHub main branch
      │
      ▼
Cloudflare automatic build
      │
      ▼
Permanent public URL
      │
      ▼
Audience phones
```

Cloudflare Pages' GitHub integration deploys pushes to `main`. The coding agent needs normal GitHub push access, with no Cloudflare API token. This repository does not install or configure a remote agent service.

| Setting | Value |
| --- | --- |
| Repository name | `live-ai-app-challenge` |
| Production branch | `main` |
| Pristine baseline branch | `template` |
| Baseline tag | `demo-template-v1` |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root (leave blank) |
| Node version | `24.14.0` |

### Finish GitHub setup

Setup status: the local template is prepared, but GitHub creation/push and Cloudflare configuration require completion. GitHub CLI was unavailable; the browser requires sign-in. The saved Git account is `onlyjus`, but the requested remote could not be found. No remote was configured and no repository was overwritten.

1. Sign in to [GitHub](https://github.com/login).
2. Open [New repository](https://github.com/new). Choose the intended owner, name it `live-ai-app-challenge`, and create it **without** a README, .gitignore, or license (these local files already exist). A private repository works with Pages; the deployed website will be public.
3. If that name already exists, inspect it first. Connect it only if it belongs to this demo; do not overwrite an unrelated repository.
4. Copy its HTTPS URL, then run the following, replacing `YOUR-OWNER`:

```sh
git remote add origin https://github.com/YOUR-OWNER/live-ai-app-challenge.git
git push -u origin main
git push origin template
git push origin demo-template-v1
```

If GitHub CLI is installed and authenticated later, you can create the repository instead with `gh repo create live-ai-app-challenge --private --source=. --remote=origin --push`, then push the baseline branch and tag above. Do not run creation commands against an existing remote.

### Connect Cloudflare Pages once

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Open **Workers & Pages → Create application → Pages → Connect to Git**.
3. Choose GitHub. If asked, authorize **Cloudflare Workers and Pages**, selecting only this demo repository.
4. Choose `live-ai-app-challenge` and **Begin setup**.
5. Apply the settings in the table above; keep automatic production deployments enabled. The committed `.node-version` pins the build runtime; if required, also set `NODE_VERSION=24.14.0` in build settings.
6. Select **Save and Deploy**, wait for success, and copy the **production** URL from the project dashboard.
7. Use that URL (or a custom domain connected to it) for the permanent QR code. Keep the same Pages project across demonstrations. Do not use a deployment-specific preview URL.
8. Optionally disable preview branch deployments; `template` must never be the production branch.

No production URL or automatic deployment has been verified yet. Update this README with the actual repository and production URLs after connecting them.

References: [Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [React/Vite build settings](https://developers.cloudflare.com/pages/configuration/build-configuration/), [build runtime configuration](https://developers.cloudflare.com/pages/configuration/build-image/).

## Run the live challenge

1. Reset to the placeholder using the procedure below; wait for its deployment to succeed.
2. Test the permanent URL on your phone, ideally on mobile data. Display its QR code to the audience.
3. Open this repository in the remote coding agent on your home development computer.
4. Paste `LIVE_DEMO_PROMPT.md`, replacing the idea placeholder with the audience's suggestion.
5. The agent follows `AGENTS.md`: implement, check, build, review, commit, and push to `main`.
6. Watch the Cloudflare deployment. Once it succeeds, ask the audience to refresh the same URL. The placeholder does not automatically refresh.

Keep the idea achievable and prefer local/demo data. The placeholder's waiting indicator is decorative, not a live deployment status feed.

## Verify each deployment

1. **Push succeeded:** check `git status -sb`, then compare `git rev-parse HEAD` with `git ls-remote origin refs/heads/main`. Their commit hashes must match.
2. **Build started:** open your Pages project's **Deployments** tab. Find a production build for that commit on `main`.
3. **Build succeeded:** open its build log and wait for success. A successful Git push alone does not prove deployment.
4. **Production responds:** open the permanent URL and confirm the expected application, then repeat on a phone. Optionally run `curl.exe --fail --location --head https://YOUR-PRODUCTION-URL` on Windows (`curl` elsewhere).
5. If no build appears, check GitHub integration permissions, production branch, automatic deployment settings, and Cloudflare logs. An HTTP 200 can still be the old deployment, so verify both the commit and visible app.

## Reset before another presentation

The `template` branch and `demo-template-v1` tag preserve the initial placeholder. Leave both untouched during live challenges.

**This intentionally discards tracked local edits and replaces production branch history.** Save any demo you want to keep on a separate branch and commit or stash local edits first. Run from this repository and check that `origin` is the intended demo repository.

After initial GitHub setup, run these commands one at a time, stopping on any error:

```sh
git fetch origin
git checkout main
git reset --hard origin/template
git commit --allow-empty -m "Reset live demo to template"
git push --force-with-lease origin main
npm ci
```

The fresh reset commit gives Cloudflare a new commit to build even when the original baseline was already deployed. The template remains pristine. Wait for the successful deployment before presenting; the URL remains the same. If the lease is rejected, inspect the remote changes before trying again.

Untracked files are not removed by reset. Review and remove demo-only leftovers manually if needed. If GitHub branch rules forbid force-pushing, restore the baseline with a normal commit instead:

```sh
git checkout main
git pull --ff-only origin main
git restore --source=demo-template-v1 --staged --worktree -- .
git commit --allow-empty -m "Restore live demo placeholder"
git push origin main
npm ci
```

Before a remote exists, `git reset --hard template` restores the local baseline only.

## Secrets

`.gitignore` excludes dependencies, build output, environment secrets, local Cloudflare state, and key files. Only intentionally empty/example environment files may be committed. Never put credentials in source code or `VITE_*` variables: browser bundles are public.
