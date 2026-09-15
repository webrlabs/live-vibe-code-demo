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

If `npm ci` reports `EPERM` while deleting `rolldown-binding.win32-x64-msvc.node`, stop this project's running `npm run dev` and `npm run preview` processes with Ctrl+C in their terminals, then retry `npm ci`. Windows cannot replace a native module while a process has it loaded. Do not stop unrelated Node applications. If no project process is running, retry once before investigating file permissions or antivirus locks.

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
| Repository | [webrlabs/live-vibe-code-demo](https://github.com/webrlabs/live-vibe-code-demo) |
| Production branch | `main` |
| Pristine baseline branch | `template` |
| Baseline tag | `demo-template-v1` |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root (leave blank) |
| Node version | `24.14.0` |

### GitHub setup

The connected repository is [webrlabs/live-vibe-code-demo](https://github.com/webrlabs/live-vibe-code-demo). The production branch `main`, pristine `template` branch, and `demo-template-v1` tag have been pushed. Keep this remote for the current demo.

When cloning onto a different development computer:

```sh
git clone https://github.com/webrlabs/live-vibe-code-demo.git
cd live-vibe-code-demo
npm ci
```

If `origin/template` is missing after a fetch, stop before resetting. In the original checkout, verify the local `template` branch and `demo-template-v1` tag, then publish them with `git push origin template demo-template-v1` and run `git fetch origin`. A fetch only downloads branches that exist on the remote.

### Connect Cloudflare Pages once

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Open **Workers & Pages → Create application → Pages → Connect to Git**.
3. Choose GitHub. If asked, authorize **Cloudflare Workers and Pages**, selecting only this demo repository.
4. Choose `webrlabs/live-vibe-code-demo` and **Begin setup**.
5. Apply the settings in the table above; keep automatic production deployments enabled. The committed `.node-version` pins the build runtime; if required, also set `NODE_VERSION=24.14.0` in build settings.
6. Select **Save and Deploy**, wait for success, and copy the **production** URL from the project dashboard.
7. Use that URL (or a custom domain connected to it) for the permanent QR code. Keep the same Pages project across demonstrations. Do not use a deployment-specific preview URL.
8. Optionally disable preview branch deployments; `template` must never be the production branch.

No production URL or automatic deployment has been verified yet. Update this README with the actual production URL after connecting it.

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

First stop this project's dev/preview servers so Windows can replace dependencies. After initial GitHub setup, run these commands one at a time, stopping on any error:

```sh
git fetch origin
git rev-parse --verify origin/template
git checkout main
git reset --hard origin/template
git commit --allow-empty -m "Reset live demo to template"
git push --force-with-lease origin main
npm ci
```

PowerShell does not automatically stop after a failed Git command. To paste the reset as one operation, use this guarded block:

```powershell
& {
    git fetch origin
    if ($LASTEXITCODE -ne 0) { throw 'Fetch failed. Reset stopped.' }
    git rev-parse --verify origin/template
    if ($LASTEXITCODE -ne 0) { throw 'Publish the template branch first. Reset stopped.' }
    git checkout main
    if ($LASTEXITCODE -ne 0) { throw 'Checkout failed. Reset stopped.' }
    git reset --hard origin/template
    if ($LASTEXITCODE -ne 0) { throw 'Reset failed. Nothing will be committed or pushed.' }
    git commit --allow-empty -m "Reset live demo to template"
    if ($LASTEXITCODE -ne 0) { throw 'Commit failed. Nothing will be pushed.' }
    git push --force-with-lease origin main
    if ($LASTEXITCODE -ne 0) { throw 'Push failed. Check remote changes before retrying.' }
    npm ci
    if ($LASTEXITCODE -ne 0) { throw 'Install failed. Stop this project’s dev/preview servers and retry npm ci.' }
}
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
