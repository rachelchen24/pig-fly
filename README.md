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
- **Accounts and leaderboard:** players can log in with a 4-character code and a PIN, and there are global leaderboards. These need a shared database. Right now that's the claude.ai-hosted version's built-in database, so they **only work there**. On any other host, the game runs fully with browser saves, and the login button explains that accounts aren't available.

## Project files

| File | What it is |
|---|---|
| `index.html` | The whole game |
| `SPEC.md` | The full game design, including every rule and change |
| `NOTES.md` | Build notes: balance method, physics decisions, test results, known issues |

### Tuning

Every tuning number lives in the `CONFIG` block near the top of `index.html`: physics, gear stats, level distances, prices, payouts, powerup odds, and the default pig name. Gear names and descriptions are in `CATALOG`, just below it.

### Dev mode

Open `index.html?dev` to add **+1000 coins** and **All levels** buttons to the shop, for jumping ahead while testing.

To wipe your local save, run `localStorage.clear()` in the browser console.

## Deploying

It's a static site, so no build command or framework is needed. On **Vercel**:

1. Import the repo (**Add New → Project**).
2. Set **Framework Preset** to **Other**, leave **Build Command** empty, and leave **Output Directory** as the repo root.
3. Deploy.

Or run `npx vercel --prod` from the project folder.

Static hosts serve every file in the repo, so `SPEC.md` and `NOTES.md` will be public too. To keep them private, list them in a `.vercelignore` file.
