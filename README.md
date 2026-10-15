# When Pigs Fly 🐷

A small browser game about launching a pig as far as it'll go. A feed sack drops on a seesaw and flings your pig into the air. Use the coins you earn to buy wings, rockets and launch gear, then try to land on a hilltop that's farther away every level.

It's inspired by *Learn to Fly* (Light Bringer Games, 2009). The whole game is one `index.html` file: plain JavaScript and canvas, no libraries, no build step, no install.

## Play

- **Locally:** download or clone the repo and open `index.html` in a desktop browser.
- **Online:** host `index.html` on any static host (Vercel, Netlify, GitHub Pages). See [Deploying](#deploying).

### Controls

| Key | What it does |
|---|---|
| **↑ / ↓** | Tilt the pig's nose up or down |
| **Space** (hold) | Fire rockets, once you've bought them |
| **Enter** | Launch, from the shop |
| **Esc** | End the current flight early (or click **End run**) |
| Mouse | Menus and the shop |

### How it works

1. **Name your pig.** If you leave the name blank, it's called Snowball.
2. **Launch.** The seesaw flings the pig. There's nothing to do at launch.
3. **Fly.** Tilting only redirects your speed and never adds any, so your gear does most of the work.
4. **Land on the hill.** Fall short or overshoot and you splash into the lake. Stop dead center between the flags for the biggest payout.
5. **Shop.** Each tier of wings and rockets has three options, and only one is right for the level. If you pick wrong, you can sell it back, but you only get 60% of the price back.

**What unlocks when:**

| Level | Unlocks |
|---|---|
| 2 | Wings |
| 3 | Seesaw |
| 4 | Launch rig |
| 5 | Rockets |
| 6 | Gust-cloud powerups |
| 7 | Payload and obstacles |

There are 10 levels. Beat level 10 to unlock **Fly Infinitely**, an endless distance mode. A guided tutorial walks new players through the first level and the first shop visit.

## Saving and accounts

- **Default:** progress autosaves in your browser (`localStorage`).
- **Accounts and leaderboard:** players can log in with a 4-character code and a PIN, and there are global leaderboards. These need a save server, and the game uses whichever one it finds:
  - **On Vercel:** the functions in `api/`, backed by Upstash Redis (set up below).
  - **On the claude.ai-hosted version:** that page's built-in database.
  - **Anywhere else** (a local file, another static host): no accounts. The game runs fully with browser saves, and the login button explains why.

## Project files

| File | What it is |
|---|---|
| `index.html` | The whole game |
| `api/` | Vercel functions for accounts and leaderboards (`account.js`, `board.js`, `health.js`, shared helpers in `_lib.js`) |
| `SPEC.md` | The full game design, including every rule and change |
| `NOTES.md` | Build notes: balance method, physics decisions, test results, known issues |

### Tuning

Every tuning number lives in the `CONFIG` block near the top of `index.html`: physics, gear stats, level distances, prices, payouts, powerup odds, and the default pig name. Gear names and descriptions are in `CATALOG`, just below it.

### Dev mode

Open `index.html?dev` to add **+1000 coins** and **All levels** buttons to the shop, for jumping ahead while testing.

To wipe your local save, run `localStorage.clear()` in the browser console.

## Deploying

### Vercel (with accounts)

No build command or framework is needed, and there's nothing to install: the `api/` functions call the database over HTTPS.

1. **Import the repo.** In Vercel, choose **Add New → Project**. Set **Framework Preset** to **Other**, leave **Build Command** empty, and leave **Output Directory** as the repo root. Deploy.
2. **Add the database.** In the project, open **Storage → Create Database** (or **Browse Marketplace**) and pick **Upstash for Redis**. The free plan is plenty. Connect it to this project for all environments.
3. **Redeploy** (**Deployments → ⋯ → Redeploy**), so the functions pick up the new environment variables (`KV_REST_API_URL` and `KV_REST_API_TOKEN`, or the `UPSTASH_REDIS_REST_*` pair; either works).
4. **Check it.** Open `https://<your-site>/api/health`. It should say `{"ok":true}`. Then try **Log In / Sign Up** in the game.

Until the database is connected, the game still works with browser saves. The login box tells players accounts aren't available and shows you the setup hint.

**What the server does:** PINs and recovery codes are stored only as slow salted hashes. After 10 wrong tries a code is locked for 15 minutes. Logins use random session tokens that last 180 days, and resetting a PIN logs out every other device. Each player keeps only their best leaderboard entry. These limits live in `LIMITS` in `api/_lib.js`.

Static hosts serve every file in the repo, so `SPEC.md` and `NOTES.md` will be public too. To keep them private, list them in a `.vercelignore` file.

### Other static hosts

Netlify, GitHub Pages and similar hosts can serve `index.html` as is. There's no save server there, so it's browser saves only.

## Copyright

© 2026 Rachel Chen. All rights reserved.

If you plagiarize my work I will find you!!! 🐷
