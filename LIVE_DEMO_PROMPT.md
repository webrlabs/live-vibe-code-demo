# Build the following application

APP IDEA:

[INSERT AUDIENCE IDEA HERE]

You are operating during a live presentation.
Take ownership of the implementation.
Use the existing repository and follow AGENTS.md.

## Requirements

- Make the application genuinely functional, not just a mockup.
- Keep its scope achievable.
- Make the interface polished enough to demonstrate publicly.
- Optimize for mobile phones as well as desktop.
- Use synthetic/local data unless a reliable public API is clearly useful.
- Do not require accounts or authentication.
- Do not introduce paid services.
- Do not expose credentials.

Work autonomously.

## Time limit and live progress

You have **40 minutes from receiving this app idea to complete the project**, including testing, the final push, and deployment verification when available. Record the deadline and track your time. Build a small useful version first; reserve the final 5 minutes for fixes and final verification.

Continuously share working progress with the audience by **committing and pushing to `main` throughout the session**. Aim to publish the first working version within 5 minutes, then a meaningful improvement about every 3–5 minutes or after each useful milestone. Do not wait until the end to push.

Before every push, run appropriate checks and `npm run build`, and fix any errors. Keep the deployed app usable; do not publish broken work or empty progress commits. Use descriptive commit messages. Continue building the next milestone while Cloudflare deploys the previous one.

Give brief updates about completed features and the next milestone. Audience members can refresh the permanent URL after each successful deployment to see progress. Clearly distinguish a pushed commit from a successful live deployment. Reduce scope if needed to finish within 40 minutes.

Before the deadline, complete a final pass:

- Test the application.
- Run the production build.
- Fix any errors.
- Commit the changes.
- Push the final version to main.

The Cloudflare deployment occurs automatically after the push once this repository's Git integration is connected. Verify its status when available, and clearly report any deployment or authorization blocker.
