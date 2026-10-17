# When Pigs Fly: Build Notes

## Summary

**What was built:** all 5 steps of SPEC.md, in one file, `index.html` (about 2,150 lines, plain JavaScript + canvas, no libraries). It is also published as a private page with a shared database: https://claude.ai/artifact/8tJcmKiqmJxwTvyS6sKr9J

- **Step 5:** accounts with a 4-character code + 4- or 6-digit PIN, autosave to the account, a one-time recovery code for PIN resets, and global leaderboards. Details in the Step 5 section below.

- **Step 1:** cute egg-shaped pig with goggles and tiny legs. Farm/lake world with water at the bottom. Wooden seesaw: a 500 lb feed sack drops on it and flings the pig, and the player makes no decisions at launch. Slow ↑/↓ tilt. Stalls. The pig lands on the hilltop or splashes. Results screen.
- **Step 2:** shop with Wings, Seesaw (Length + Height), Launch Rig, Rockets (Rocket + Fuel Tank) and Payload. All catalog names, plus a canvas drawing for every wing, rocket, rig, payload, plank and base. 3 options per wing/rocket tier. Caps, catch-up, no skipping, 60% sell-back, re-equip anything you own. 10 levels with landing hills. Obstacles (trees, farmhouses, hills) on levels 7–10. Coins, payouts, autosave.
- **Step 3:** Gust Cloud powerups bought before a flight. They're placed randomly along your route, cost 5/10/20/40…, and pay 0–20 coins at the spec's odds.
- **Step 4:** main menu with the right buttons for new, returning and finished players. Guided tutorial with "End tutorial" on every bubble, plus an intro for each feature as it unlocks. Ending scene with the farm friends. Fly Infinitely with milestones, rare obstacles, Endless-tier gear, and its own save.

**What to test first:**
1. Open `index.html` and click **Start New Game**. Follow the tutorial through level 1 and the first shop visit. Does the launch feel good? Does the tilt feel slow but useful?
2. Play levels 2–5 normally. Are the wrong wing picks fun to learn from, and does selling sting?
3. Use `index.html?dev` to jump ahead: the shop gets **+1000** and **All lvls** buttons. Try level 7 (obstacle tip) and level 10 (ending → Fly Infinitely).
4. The tuning numbers are all in the CONFIG block at the top of `index.html`, starting around line 110.

**What didn't work (details under Checklist results):**
- With good steering, a wrong wing pick can often still pass on levels 3–7. With no steering, the wrong picks fail as designed.
- On rocket levels, a skilled player can sometimes pass with only 1 upgrade, mostly by firing the rocket later instead of right away.
- I could only test with scripted bots and headless screenshots. Nobody has hand-played it yet, so the *feel* needs your playtest.

---

## How to play
- Open `index.html` in a desktop browser. Mouse for menus; keyboard in flight.
- **↑ / ↓** tilt the nose. **Space** (hold) fires rockets once you have them. **Enter** in the shop = Launch.
- Progress autosaves in this browser (localStorage key `whenPigsFly.save.v1`). To wipe it: open the browser console (F12) and run `localStorage.clear()`.
- `index.html?dev` adds test buttons in the shop footer: +1000 coins, and unlock all levels.

## Where things are in index.html
The accounts and leaderboard code sits in its own block (search for `ACCOUNTS + LEADERBOARD`), between the art and the game code.

| Section | Starts at line ~ |
|---|---|
| **CONFIG**: every tuning number (physics, launch, gear stats, levels, unlocks, prices, coins, powerups, endless, view) | 110 |
| CATALOG: all gear names + descriptions (rename freely) | 273 |
| Flight simulation (no drawing) | 307 |
| Economy rules (prices, caps, payouts) | 525 |
| Art (all drawing code) | 562 |
| Accounts + leaderboard (Step 5) | 1095 |
| Game (menus, shop, tutorial, flight loop, results, ending, endless) | 1338 |

In CONFIG, `(proposed)` marks values taken from the spec's proposed defaults, and `[default]` marks numbers the spec left open that I picked. The wing stats are designer-friendly: `glide` (glide ratio), `cruise` (preferred speed, m/s) and `steady` (how firmly it holds its glide). `wings.right` / `rockets.right` record which option (0=A, 1=B, 2=C) is "right" for each tier, and the slot varies by tier.

---

## How the balance was done
I wrote a headless copy of the flight simulator plus a balance tool. These are **not in the repo**; they sit in my scratch folder, and I can add them under `tools/` if you want them.
1. **Reference gear path.** A "careful player" path buys 2 upgrades per level: L2 Wings T1 · L3 Wings T2 + Seesaw 1 · L4 Wings T3 + Seesaw 2 · L5 Rocket 1 (+fuel) + Wings T4 · L6 Seesaw 3 + Rig 1 · L7 Pumpkin + Wings T5 · L8 Seesaw 4 + Rocket 2 · L9 Milk Can + Rig 2 · L10 Rocket 3 + Wings T6.
2. **Calibration.** Each tier's stats were calibrated so that each upgrade adds about 20% distance on that path. Two upgrades ≈ ×1.44 per level, and ×1.2 on the payload levels.
3. **Hill placement.** Each hill was placed so the reference gear lands with **no steering at all** ("gear decides the outcome"). The flat top starts a little before that touchdown point and ends a bit past where it skids to a stop.
4. **Checking.** I checked every gear combo of up to 3 upgrades on each level. Each combo flew with no steering, and then with about 40 simple "good human" strategies: hold nose up, hold nose down, stall-brake near the hill, dive near the hill, fire the rocket late, cut the rocket early.

### Physics decisions worth knowing (all in CONFIG → physics)
- **Natural trim.** With no keys pressed, the wings settle into their best glide by themselves, and they flare automatically when low over water. Without this, an expert could stretch flights by ~45% by skimming the water, which is way past the spec's 10–20% skill edge. Steering now adds about 0–15% distance.
- **Speed limits your tilt.** The faster you go, the less the arrow keys can tilt you, which is how "arrow keys can't save a bad pig" shows up. Slow or falling, you can point straight up and still drop (stall).
- **Landing rules.** Touching down **too steep** (falling faster than 7 m/s) **bounces** instead of landing. Touching down **too fast skids** you off the far edge (overshoot). Without these, diving at the hill could fix any overshoot.
- **Rocket climb trim.** While the rocket fires, the natural trim climbs at about 20°. Weak wings can't hold the nose down against the rocket's kick, so bad wings + rocket = nose up.
- **Payload.** It has no weight, and smashing costs no speed, so ramming uses no extra fuel. Obstacle tops sit about 6 m + 8% above the reference path, so flying over takes aiming up plus 1–2 bigger fuel tanks.

---

## Checklist results (best I could test)
Tested with the balance tool (thousands of simulated flights) and with headless Chrome driving the real `index.html` (clicks, key presses, screenshots).

### Step 1
| Item | Result |
|---|---|
| Launch looks and feels good | ⚠️ Looks right in screenshots (sack drops, plank swings, rig tumbles away). Feel needs your playtest. |
| Diving then pulling up gains height; tilting up while slow does nothing | ✅ Physics does this (lift only redirects speed; stall when slow). Built-in trim reduces how much you *need* it. |
| Always ends in water or on the hill, never "dies" | ✅ Every flight ends as landed / short / overshot / bonked-then-splash. |
| Landing on the hill passes; short or overshooting fails | ✅ |

### Step 2
| Item | Result |
|---|---|
| Level 1 easy with the catapult alone | ✅ Bare catapult lands with no input; the hill is extra wide. |
| Each level beatable with 2 right upgrades, more than one way | ✅ Levels 3–10 have 3 to 90+ passing 2-upgrade routes (level 2 only offers 1 thing to buy). |
| Right 3 pass without overshooting; wrong 3 fail | ⚠️ **Partly.** With **no steering**, exactly one wing option lands on every level 2–10, and the other two fail (one short, one over); rockets behave the same, except on level 6, where the rocket tier is a level old. **With good steering**, many wrong picks can still be rescued on levels 3–7, and "too good" wings can usually be braked onto the hill. Right-3 combos pass. |
| Half-category upgrades can pass | ✅ Just-Length and just-Height routes pass from level 3; just-Rocket and just-Fuel routes from level 5 (just-Rocket isn't needed on level 10). |
| Level 10 beatable with mid-tier gear | ✅ Reference gear is Wings T6, Seesaw 4, Rig 2, Rocket 3, 10-gallon tank, Milk Can. |
| One level's payout = 3 upgrades | ✅ from level 3 on, for a dead-center landing (L3 pays 190–228 = 2.5–3 × 76). **Changed at your request:** L1 pays 56–63 and L2 pays 132–150, since level 2 has only 1 category and level 3 only 2. Tested in the browser: a level-1 landing 36% centered paid 58. |
| Bad combos fail as described, incl. overshoot | ✅ Maxing every category overshoots from level 6 on. On levels 4–5 a skilled player can still land a maxed pig (e.g. by not firing the rocket). |
| Categories unlock in exact order | ✅ Wings 2, Seesaw 3, Rig 4, Rockets 5, Powerups 6, Payload + obstacles 7. |
| Tier caps: no skipping, catch-up, nothing past cap | ✅ Tested (matches the spec's level-4 wings example exactly). |
| 3 wing/rocket options look clearly different | ✅ Each of the 30 wings and 21 rockets has its own drawing and trail effect. |
| Seesaw halves and rocket + fuel each ≈ one upgrade | ✅ e.g. 28 + 28 vs 55; 79 + 26 vs 105. |
| Replaying doesn't pile up money | ✅ Payout once; replays only give ~1–6 coins. |
| Sell back a wrong pick, and it stings | ✅ 60% back. **Changed at your request:** any owned gear can be sold, not just the newest tier. No-skipping checks the highest tier ever bought, so selling never blocks the next tier; sold linear tiers show **Buy back** at full price. Tested: sold T1 and T2 wings, then T3 was still buyable; sold seesaw tiers 1 and 2, then bought tier 1 back. |
| Obstacles + payload unlock together at 7, ramp slowly, ≥5 s apart | ✅ 1/2/3/4 obstacles; gaps 5.7–6.8 s even with faster gear. |
| Rockets only fire while Space held; fuel refills free | ✅ |
| Pig without enough payload drops into the water | ✅ "BONK", falls, splash. |
| Bought gear stays owned; lower tiers re-equippable | ✅ |
| Autosave, no Save button | ✅ After every purchase, sale, equip change and flight. |
| Ramming uses no extra fuel; flying over costs a lot more | ✅ e.g. L7: ram 0.8 s of fuel; flying over needs a 10-gallon tank and 2.5 s of burn. |

### Step 3
| Item | Result |
|---|---|
| Some powerups are duds, and it feels fair | ⚠️ They're placed randomly from 25 m to 115% of where your gear lands, at 55–145% of your path height, so some are out of reach. Whether that feels fair needs playtesting. |
| Buying several gets expensive fast | ✅ 5, 10, 20, 40, 80… (3 = 35). |
| Coin payouts are a bonus, not income | ✅ Measured: 80% give 0–5, 15% give 6–9, 5% give 10–20; average ≈ 3.9 coins. |

### Step 4
| Item | Result |
|---|---|
| Menu → new game → level 1 | ✅ |
| Tutorial guides launching and first shop visit | ✅ Launch → ↑ → ↓ → land → Next → Wings → Buy → Launch. |
| "End tutorial" works at every step | ✅ The one exception is on purpose: the required obstacle tip (level 7) has only "Got it" and shows even after the tutorial is ended. |
| Ending plays after level 10 | ✅ Farm friends scene → Fly Infinitely appears on the menu. |
| Endless has no target; milestones pay once | ✅ Markers every 250 m, paid once each. |
| Endless obstacles ≥5 s apart, random | ✅ Random 6.5–12 s gap (min kept above 5 so a speed boost can't squeeze it under 5). |
| Obstacle tip explains flying over vs. ramming | ✅ |
| Logging back in restores status + equipment, incl. Fly Infinitely | ✅ Via browser save (accounts are Step 5). Reload restores everything. |
| Start New Game resets the run, Fly Infinitely untouched | ✅ Also keeps best distance and "beaten the game". |
| Fly Infinitely: buy skipped gear, toggle off, equip lower tiers | ✅ |
| Tutorial introduces each feature when it unlocks | ✅ Wings, seesaw, rig, rockets, powerups, payload/obstacles, Fly Infinitely. |

---

### Step 5: accounts, saves, and leaderboard
**Where it works:** on the published page only. Opened as a local file, there is no shared database: the game still plays and saves in the browser, and "Log In / Sign Up" explains this.

**How it works**
- **Account:** 4-character code (letters/digits, at least 2 letters, must not contain a blocked word) + a 4- or 6-digit PIN typed twice. Codes are unique.
- **PIN storage:** the PIN is stored only as a salted, slow hash (PBKDF2, 150,000 rounds), never as a plain number.
- **Recovery:** sign-up shows a one-time recovery code (e.g. `K7PQ-M2XR`). Using it to set a new PIN uses it up and shows a fresh one.
- **Saves:** progress autosaves to the account after every change. This device remembers the login until you click Log Out. If you played before signing up, that progress moves into the new account.
- **Leaderboard:** shows on the menu only after beating level 10. It has two tabs:
  - **Farthest flight** (Fly Infinitely distance).
  - **Fastest to beat 10 levels** (play time from Start New Game to the level-10 clear, not counting time on the menu). This is the spec's optional second board.
- **Fake-score check:** a distance more than about 1.6× what your gear can naturally reach is not posted.
- **Start New Game** keeps your leaderboard scores.

**Checklist**
| Item | Result |
|---|---|
| Hidden until level 10 is beaten | ✅ |
| "1234" rejected, "AB12" accepted | ✅ |
| Signup rejects mismatched PINs | ✅ |
| Log in with code + PIN and pick up where you left off; wrong PIN rejected | ✅ |
| PIN reset with the recovery code works | ✅ It works once, then a new code is issued. |
| Menu shows the right buttons for new, returning and finished players | ✅ Plus "Log Out" and "Logged in as …" when logged in. |
| New game wipes progress but keeps the leaderboard score | ✅ |
| Scores from different players show on the same board | ✅ Tested with two accounts. On the live page, one score was written and read back as a view-only player. |

These were tested headlessly against an in-memory copy of the database, plus one live read and write on the published page. I couldn't sign in as a second real person.

**Limits you should know**
- **Who can save:** only people with **Contributor** (or higher) access. The page is private to you right now. To let friends play, share it from the page's Share menu with Contributor access. Viewers can play and log in, but saving and posting scores is refused, and the game tells them so.
- **Trust:** the game has no server of its own. Account records (PIN hash, save, scores) are readable by everyone who can open the page, and the "fake score" check runs in the player's browser. That matches the spec's "game-level security, not bank-level", but a determined player could cheat or brute-force a 4-digit PIN. The sign-up screen warns players not to reuse a real PIN.
- **Updates:** the published page doesn't update by itself when you edit `index.html`. Ask me to republish.

## Defaults I picked (spec left these open)
- **Prices:** one upgrade costs 40, 55, 76, 105, 145, 200, 276, 381, 526 on levels 2–10; Endless tier = 726 × 1.5. A tier's price is set by the level it belongs to (wing tier 3 always costs the level-4 price), so catching up on old tiers is cheaper.
- **Payout:** up to 3 × the **next** level's upgrade price, so you can actually afford 3 upgrades for the level you're about to play.
  - **Landing accuracy (your request):** stopping dead center between the flags pays 3×, stopping at a flag pays 2.5×, linear in between. Measured where the pig stops after skidding. `CONFIG.economy.edgePayoutUpgrades`.
  - **Early levels (your request):** never more upgrades than the next level has shop categories, so 1× before level 2 and 2× before level 3. There, a cushion of 0.4 × one upgrade is added (exactly what selling back one wrong pick loses), so one wrong wing can't strand you with no way to earn money (replays pay ~1 coin there). Accuracy adds up to 1/6 on top instead of taking away, so even a flag-edge landing leaves the swap money. Set `mistakeCushion` to 0 to remove the cushion, or `payoutPerCategory` to false for 2.5–3× everywhere.
  - **Tutorial:** the first-flight tip says to stop between the flags (center pays most); after clearing level 1 it says whether you got the top payout.
- **Shop tiers (your request):** each wing/rocket tier is its own tinted panel with a Tier badge, price and "✓ owned"; not-yet-buyable tiers are dashed and faded. Linear tracks get striped rows with tier-number pills.
- **Powerups (your request):** in level mode they never spawn past the hill; the latest spot is `CONFIG.powerups.hillGap` (5 m) before the hill starts. Tested 720 spawns with overpowered gear: none past the hill.
- **Pig name (your request):** Start New Game opens a "Name your pig" box; blank = **Snowball** (`CONFIG.pig`). Saved with the run (and copied into the Fly Infinitely save); old saves show Snowball. Used in the shop name tag, results title, tutorial and ending. Shown as plain text, so typed HTML does nothing. Not filtered for rude words since only the player sees it.
- **Web icon (your request):** the side-view pig exactly as it looks in flight. It's drawn at page load with the game's own `drawPig` onto a 64×64 canvas and set as the favicon (`makePigFavicon` in the art section), so it always matches the in-game pig. The published page's gallery/tab icon is set to "pig".
- **Vercel save server (your request):** `api/` holds 3 Vercel functions using Upstash Redis over its REST API (no npm packages). The game picks its save server at startup (`initAccounts`): the claude.ai database if present, otherwise `/api/health`, otherwise browser-only. Both servers answer the same calls (`CLAUDE_API` / `HTTP_API` in the accounts section). It's more secure than the claude.ai version: hashing happens server-side, 10 wrong PIN/recovery tries lock a code for 15 min, session tokens instead of reusable hashes, and the server re-checks code rules and score bounds. Tested end to end against the real `api/` code with a local stand-in for Vercel plus a fake Upstash: signup, login, autosave, resume after reload, logout, PIN reset, both leaderboards, the lockout, forged tokens (401), and the "no database connected" message. **Not tested against a real Upstash database:** that needs your Vercel project. Setup steps are in README.md.
- **Rocket fix (your request):** firing used to make you fall faster if you held ↑, or with the high-kick rocket options. The nose went past the stall angle, wing lift dropped to 30%, and the weak thrust couldn't make up for it. Measured: holding ↑ while firing put the pig in the water within 5 s every time. Now, while firing, the nose is capped just below the stall angle (`physics.rocketStallGuard`). Firing always ends higher than not firing, and ↑ while firing is now the best way to stay up (e.g. level 8: 36 m up after 5 s vs. 19 m without firing). Balance check before/after: reference gear and wrong-option results unchanged on every level; level 9 3-upgrade passes 170 → 173 of 310. The rocket tip now says to tilt up a little while firing.
- **Overshoot ends quickly (your request):** once the pig is past the far end of the hill, the flight ends after 2.5 s (`physics.overshootEndSec`). Tested: a level-2 overshoot 100 m up ended 2.5 s after passing the hill.
- **Fly Infinitely coins (your request):** coins used to be placed at launch along a predicted path that assumes the rocket fires from the start, so for most flights they hung 20–40 m above the pig (test: 0 of 8 collected). Now `endlessSpawner` drops each coin ~2.5 s ahead at the height the pig is heading to (`coins.endlessLeadSec`, `endlessHeightJitter`). Test: 2 of 3 collected with no steering, the third 2 m off.
- **Leaderboards (your request):** both boards now sit on either side of the main menu for every player (previously one tabbed board, only after beating the game). They stack under the menu below 1050 px wide.
- **Pig name default (your request):** a blank name now means "automatic": the player's account code when logged in, otherwise Snowball. It's resolved live, so a pig named while logged out takes the code after logging in.
- **End run (your request):** button at the top right during a flight, or Esc. Ends the flight on the spot with outcome "ended": a fail in levels (no payout), and in Fly Infinitely the distance so far counts. Hidden while the pig is skidding to a stop on the hill. The button never takes keyboard focus, so holding Space for the rocket can't trigger it. Tested in both modes.
- **Bug fix: long Fly Infinitely flights missing from the leaderboard.** A friend flew 19 km logged in but wasn't on the board. Cause: the anti-cheat check compares a distance with a predicted no-steering flight, and `predictPath` stopped after 240 s of simulated flight. Long flights run much longer, so the prediction (and the limit) came out far too low: with Fly Infinitely-tier gear it predicted 5.6 km and refused anything over 9.2 km, while that gear really flies ~26 km. The score was dropped with only a brief popup. Fix: the check now simulates up to 1 hour (`CONFIG.leaderboard.predictMaxSec`), and its margins moved into `CONFIG.leaderboard`. Also, `postMissingBest` re-posts a personal best that never reached the board when the boards load (checked against the gear equipped for Fly Infinitely now). Tested: a stuck 19 km best got posted on the next menu visit; 500 km with that gear and 19 km with mid gear are still refused.
- **Phone support (your request):** touch flying uses pointer events on the canvas (so a mouse works too). Sliding a finger up/down from where it touched gives an analog tilt (`CONFIG.touch`: 10 px dead zone, full tilt at 70 px), passed to the sim as `input.tilt`. Double-tap (2 taps within 320 ms and 40 px) toggles the rocket, and it switches itself off when the tank is empty. While a finger is down, the HUD draws where it touched and how far it has slid, and shows "ROCKET ON" while the toggle is on. Tutorial prompts, the rocket tip and the HUD hint switch to touch wording on touch screens. Phone layout fixes below 640 px: the tier grid (it needed 560 px), shop header, tabs, option cards (descriptions hidden, smaller stats) and the results card. Tested in a real 390 px frame: shop fits with no sideways scroll, menu stacks, and simulated finger slides/double-taps tilt, fire, stop and ignore single taps.
- **Help screen (your request):** ❓ Help on the main menu and in the shop footer; Esc or clicking outside closes it. Numbers in it (unlock levels, sell-back %, powerup cost, overshoot time, milestone spacing) come from CONFIG, so it stays accurate when tuning changes.
- **Coins on the route:** ~1.7% of an upgrade's price per run (1 coin early, ~5–7 by level 8–10).
- **Fuel burn:** 0.25 s per gallon (1 gal = 0.25 s … 20 gal = 5 s, 30 gal = 7.5 s).
- **Obstacle ramp:** the spec's default (more obstacles each level). Strengths L7 [1], L8 [1,1], L9 [1,2,1], L10 [2,1,1,2], so you need a Pumpkin at 7 and a Milk Can at 9. Anvil / Wrecking Ball / Cow Bell matter in Fly Infinitely, where obstacles get stronger with distance.
- **Milestones:** every 250 m, paying 25 + 0.05 × distance (e.g. 250 m → 38, 1000 m → 75).
- **Hill heights:** 4, 4, 5, 5, 6, 7, 8, 10, 12, 14 m.

## Spec interpretations (tell me if any are wrong)
1. **No account yet:** a player who isn't logged in still has a browser save, so they see "Continue Game" like a returning player.
2. **Full-screen shop:** the shop covers the whole screen, with a small live preview of the pig wearing its gear in the header.
3. **Continue Game for finished players:** the spec's table lists only New / Fly Infinitely for someone who has beaten the game. If that player starts a new run, I also show **Continue Game**, otherwise they'd lose the run they just started.
4. **Tutorial replay** (proposed): "Tutorial" on the menu starts a practice run from level 1 that is **not saved**. Your real save is untouched.
5. **Fly Infinitely save** is created when you first beat level 10, as a copy of your gear and coins at that moment. After that it's separate and never resets.
6. **Unequip** works in level mode too, not just in Fly Infinitely, as a harmless superset.
7. **Buying auto-equips** the new item.
8. You can **replay any cleared level** from the level dropdown in the shop (coins only, no payout).
9. The shop shows each **hill's range** ("Hill: 93–152 m"), and wings/rockets show simple pip bars instead of numbers.

## Questions for you (I didn't stop for these; defaults are in place)
1. Should skilled steering be able to rescue a wrong wing pick? Right now it often can on levels 3–7. If you want it harsher: lower `physics.turnRateDeg`, make the wrong options more extreme in `wings.tiers`, or narrow the hills.
2. On rocket levels, firing the rocket a few seconds after launch is about 20% better than holding Space from the start. Keep that as "skill", or make holding from the start the best play?
3. Is a hard landing **bounce** OK? It's not in the spec, but it's what stops diving from fixing every overshoot.
4. Obstacles: keep "more obstacles each level", or try the spec's alternative (same count, stronger each level)?
5. Milestone spacing/pay and the price curve: placeholders, so tune them freely.
6. The obstacle tip has no "End tutorial" button, since the spec says it's required. OK?

## Known issues / limitations
- Tested by scripts and screenshots only. Nobody has played it by hand yet.
- When the camera zooms out (high or fast flights), the pig is drawn bigger than its collision size, so near-misses can look like hits.
- A "too strong" rocket option can always be tamed by letting go of Space, so rocket overshoot is mostly about the extra nose-up kick.
- The level-6 reference still uses the level-5 rocket, so all three tier-1 rockets land on level 6.
- No sound (spec: later). Desktop only (by spec).
- If you change gear stats in CONFIG, the hill positions won't move with them. The balance tool recalculates them, and I can hand it over.
