# When Pigs Fly — Project Spec

> Status: **design only, not building yet.** Nothing gets built until the designer says to start. This spec is updated as decisions are made.
>
> Legend: items are **decided** unless marked *(proposed)* or listed under Open questions.
>
> The build happens in **5 steps**. Each step ends with something playable that can be tested on its own before moving on.
>
> **Starting the build in a new chat:** this file is the whole design. Read it top to bottom, build **only Step 1**, and stop for playtesting before Step 2. Put every tuning number in the config block. Where the spec says *(proposed)*, use that as the default.

---

## Overview

### Background
- Inspired by the original **Learn to Fly** (Light Bringer Games, 2009, Flash), remembered from Coolmath Games: launch a flightless animal, earn money, buy gear, fly farther each level.
- The original appears to be gone from Coolmath. Flash support ended in 2020, and the penguin game there now is believed to be a different spinoff (likely *Learn to Fly Idle*). *(Not verified.)*
- Title: **When Pigs Fly**. Endless mode is called **Fly Infinitely**.

### Core loop
1. Buy or sell gear and powerups in the shop.
2. The pig gets launched off the seesaw.
3. Fly. Tilt control is limited, and rockets come in later levels.
4. Land on the hilltop to pass the level, or splash into the water.
5. See the results, then back to the shop.

### Design pillars (apply to every step)
- **Gear decides the outcome.** Skill is a small edge and can't save bad gear.
- **It's about upgrades, not reflexes. NOT a Flappy Bird game.** The arrow keys should never be a distraction. Obstacles are spaced far apart, and flying is mostly about watching your gear work.
- **You need the right combination of gear**, not the most upgrades. Too much gear can overshoot.
- **No grinding.** Money is scarce, and replays barely pay.
- **Mistakes cost you.** No pity bonus, and sell-backs lose money.

### Tech *(proposed)*
- A single HTML file using canvas and plain JavaScript, no install.
- All tuning numbers (physics, prices, targets, odds) in one labeled config block at the top, so they can be changed without reading the rest of the code.
- Desktop browser, keyboard only. **No mobile support.**
- **Published as a shareable page with a built-in shared database** (for accounts, saves, and the leaderboard).

---

## Step 1 — Fly the pig

**Goal:** the core flight feels right. No shop, no money.

### Character
- A **cute pig**.
- Body is **very oval/egg-shaped** with **really small limbs**, so it looks aerodynamic.
- **Goggles, always.**
- Tone: cartoon. Earlier direction was "not overly cutesy, guys will play it too," then the designer chose a **cute** pig. **Not "scrappy."**

### World
- **Farm / plains** setting. Not arctic.
- **Backdrop:** blue sky, clouds, rolling hills, lakes, plains.
- **The ground at the bottom is water**, so the pig never dies. A missed run ends in a splash.
- Each level ends at a **raised hilltop** (the landing hill; see Step 2).

### Launch
- A **wooden plank seesaw / catapult** flings the pig. It fills the same role as the ice ramp in Learn to Fly.
- **The player makes no decisions at launch.** No aiming, no timing, no power meter.

### Flight & controls
- **Arrow keys tilt the pig** (nose up / nose down), slowly, with a limited turn rate.
- Tilting **only redirects energy, never adds it.**
  - Diving fast: you can pull up and trade speed for height.
  - Slow or falling: tilting doesn't help. **You can be tilted fully up and still fall straight down.**
- **Arrow keys cannot save a badly equipped pig.** Skill is worth roughly 10–20% more distance at best.
- *(proposed)* Pulling up too hard stalls you, so you can't climb forever.

### Results screen
- Shows the distance reached and how the run ended: landed on the hill, fell short, or overshot.

### Test checklist
- [ ] Launch looks and feels good.
- [ ] Diving then pulling up gains height; tilting up while slow does nothing.
- [ ] The pig always ends in the water or on the landing hill, never "dies."
- [ ] Landing on the hill passes; falling short or overshooting fails.

---

## Step 2 — Shop, gear, and 10 levels

**Goal:** the full progression game from level 1 to level 10.

### Levels
- **10 levels**, numbered. Each one has a **landing hill** that's farther away each level.
- Clearing a level unlocks the next one.
- **Level 1 is a demo stage.** The pig has **no wings and no upgrades, just the catapult**, and level 1 should be **easy to pass** with that alone.

### Landing hill (win condition)
- Each level ends at a **raised hilltop**. **To pass, the pig must land on top of it.**
- **Falling short = fail** (splash into the water).
- **Flying past it = fail too.**
- If your gear gets you to the hill's height and distance, you can **use the arrow keys to bring the pig down onto it** instead of overshooting.
- **Gear can be too good.** Upgrading all four categories can overshoot by more than the arrow keys can correct.
- **Every level is passable by upgrading just 2 things**, if you pick the right options. You can afford 3 (see Pricing), but you never *need* 3.
  - **The right 3 upgrades still pass** without overshooting.
  - **The wrong 3 upgrades fail**, even though that's more than you needed.
- **There's always more than one way to pass.**
- **Half-category upgrades count.** You can pass by upgrading only half the seesaw (just Length or just Height), or only the Rocket, or only the Fuel tank, as long as you pick the right option.
- **You never need the best gear to win.** Level 10 is beatable with mid-tier gear, e.g. tier 5 wings, tier 4 seesaw, tier 5 fuel. Top tiers are a choice, not a requirement.
- **Landing accuracy sets the payout.** Two flags mark the ends of the landing zone. The closer to **dead center between the flags** the pig comes to a stop, the bigger the level's first-clear payout (see Pricing). Stopping right at a flag still passes, but pays less.

### Shop screen
- **The shop takes up the whole page**, not half of it, so the options are big and easy to compare.
- A small live preview of the pig wearing its equipped gear sits in the shop header.
- **Tiers are clearly separated.** Each wing/rocket tier is its own panel with a "Tier N" badge and its price; tiers you can't buy yet look faded. Linear tracks (seesaw, launch rig, fuel tank, payload) show striped rows with tier numbers.

### Gear categories
Based on the Learn to Fly series shops:

| Learn to Fly | Our version | What it does | How upgrades work |
|---|---|---|---|
| Ramp (Length + Height) | **Seesaw**: **Length** and **Height**, two separate tracks | Launch speed and angle | Linear, 1 tier per level on each track |
| Sled | **Launch rig** | Extra launch speed | Linear, 1 tier per level |
| Glider | **Wings** | Lift, which is what lets you go **forward** | **3 options per tier**, pick one |
| Booster / Rocket + gas pump | **Rockets**: **Rocket** and **Fuel tank**, two separate tracks | Thrust, and how long it lasts | Rocket: **3 options per tier**. Fuel tank: linear |
| Payload | **Payload** | Smashing obstacles | Linear, 1 tier per level |

- Every upgrade has a **name**. See the **Gear catalog** at the end of this spec.
- **Launch rig** is renamed from "sled" since there's no snow. **No active or timed rigs**, because the player makes no decisions at launch.

### Seesaw: Length & Height
- **Two separate upgrades**, Length and Height, bought independently.
- **Each costs half a normal upgrade.** The expectation is that you upgrade both, so together they cost about one upgrade.
- You **can get by with only one** of them, but only if the rest of your gear is the best combination.
- **Rigid tiers:** launch → better launch → even better launch. No angle picker; nothing about it should feel scientific.

### Rockets: Rocket & Fuel tank
- **Two separate upgrades.** Both change how the rocket performs.
- **Rocket** (thrust): **expensive**, with 3 options per tier like the wings.
- **Fuel tank** (capacity, i.e. how long you can burn): **cheap**, linear. Tiers are named by **actual quantity in gallons**: starts at 1 gallon, then 3, 5, 10, 15, 18, 20 (see Gear catalog).
- **Together they cost about one normal upgrade** *(e.g. rocket ~75%, fuel tank ~25%)*.
- **Rockets push in the direction the pig is pointing.** This is where the arrow keys matter most: aim the nose to aim the thrust. With bad wings the pig ends up nose-up, so the rocket drives it straight up.
- **Hold Space to fire the rockets.** Nothing fires on its own: if you never press Space, you sink with a full tank.
- **Fuel is free and refills every flight.** You pay for tank *capacity* once, not for fuel.

### Unlock order (exact)
Features unlock one at a time, in this exact order. The tutorial introduces each one when it unlocks.

| After passing… | New unlock | Available from level |
|---|---|---|
| Level 1 | Wings | 2 |
| Level 2 | Seesaw | 3 |
| Level 3 | Launch rig | 4 |
| Level 4 | Rockets | 5 |
| Level 5 | **Powerups** (see Step 3) | 6 |
| Level 6 | **Payload + obstacles, together**, with a tutorial explaining them | 7 |

This replaces the earlier plans of rockets at level 6–7 and payload/obstacles at level 6.
While Step 2 is being tested (before Step 3 exists), passing level 5 unlocks nothing new.

### Upgrade tiers & caps
- Each category has **tiers**. Buy them **in order; no skipping**.
- **A category's cap starts at 1 when it unlocks** and goes up by 1 each level you pass after that.
- So the number of tiers per category = the number of levels it's available for:

  | Category | Available on levels | Tiers |
  |---|---|---|
  | Wings | 2–10 | 9 |
  | Seesaw Length / Height | 3–10 | 8 each |
  | Launch rig | 4–10 | 7 |
  | Rocket / Fuel tank | 5–10 | 6 each |
  | Payload | 7–10 | 4 |

- **You can catch up.** If you skipped upgrading a category, you can buy several tiers in one visit, up to the current cap.
  - Example: on level 4, wings are at cap 3 (unlocked for levels 2, 3, 4). If you've only bought wings once, you can buy 2 more tiers now. Tier 4 unlocks after passing level 4.
- **Wings and Rocket: each tier offers 3 options.** Think **Mario Kart gliders**: the three look clearly different (different shapes, styles, and colors, not recolors of the same glider) and fly differently.
  - **Only one is right for the current level.** The right one doesn't have to look the coolest.
  - *(proposed)* Of the other two, one comes up short and one overshoots the hill, so a wrong pick fails in a way you can learn from.
  - **Picked wrong? Sell it** (60% back), then buy a different option in the same tier.
- **Seesaw, Launch rig, Fuel tank, Payload:** one upgrade per tier, no choice.

### Obstacles & payload
- **Obstacles: trees, farmhouses, and hills** (hills you can crash into, separate from the background hills).
- **Obstacles and payload unlock at the same time and start at level 7.** A tutorial explains them when they unlock.
- **Ramp up slowly.** Default: level 7 has 1 obstacle, level 8 has 2, level 9 has 3, level 10 has 4.
  - Alternative to try while tuning: keep the number constant and make the obstacles **stronger** each level.
- **At least 5 seconds of flight between obstacles, in level mode AND endless mode**, often longer, with randomized gaps. Level distances have to be long enough to fit them.
- **Two ways past an obstacle:**
  - **Ram through it with payload.** Ramming uses **no more fuel than normal flying.**
  - **Fly over it.** Possible, but it takes the **arrow keys and a lot more fuel** than ramming through.
- **Payload** smashes obstacles, like in Learn to Fly 2. A stronger payload breaks stronger obstacles.
- **Hitting an obstacle your payload can't break stops the pig, and it drops into the water** (fail).

### Owned gear & equipping (both modes)
- **Gear you buy stays in your inventory.** Buying a higher tier doesn't throw away the lower one.
- **Once you've bought something, you can always re-equip it, unless you sell it.**
- **You can equip any lower-tier gear you've bought**, in level mode and in Fly Infinitely. For example, drop back to an older glider if your new one overshoots.
- **In level mode you can also buy the other options of earlier tiers**, but it won't help: going *backwards* in equipment makes the pig worse off.
- Selling (60% back) still works the same.
- **You can sell any gear you own**, not just the most recent purchase: older tiers too.
  - "No skipping" only applies to **buying**: it checks the highest tier you've ever bought, so selling old gear never blocks the next tier.
  - A sold tier on a linear track (seesaw, launch rig, fuel tank, payload) shows **Buy back** at its full price.

### How gear combinations play out
Each slot covers a weakness in the others:
- **Max fuel + bad wings or a bad launch:** you go **straight up** until the fuel runs out, then fall. **Bad wings can't carry you forward.**
- **Good wings + a bad launch or low fuel:** you go forward some, but **don't reach the hill's height.**
- **Everything maxed:** you can **overshoot** the hill.
- **Passing takes the right combination**, not the most upgrades.

### Money sources
| Source | Rule |
|---|---|
| **Level payout** | Paid **once**, on the **first** clear of each level. Replays never pay it again. |
| **Coins in the flight path** | **Very few per run**, around 1–2% of an upgrade's price (e.g. ~5 coins per run when gear costs ~300). Not worth grinding. |

- **No per-meter distance pay.** It makes money too easy to earn.
- **One currency: coins.** Payouts, coins grabbed in the air, powerups, and gear all use coins.

### Pricing
*(Current direction; the designer may change pricing later.)*
- Gear starts cheap, and **prices go up each level**.
- **"One upgrade"** = one tier of one category at that level's price. Seesaw Length + Height together = one upgrade. Rocket + Fuel tank together = one upgrade.
- **Level payout = up to 3× the cost of one upgrade** at that level.
  - You only **need 2** to pass, so the third is a cushion: if you blunder, you still have some money.
  - You *can* spend it on a 3rd upgrade. The right 3 still pass; the wrong 3 fail.
- **The payout depends on how well you land.** Stopping **dead center between the flags pays 3×**. Stopping at the **edge (at either flag) pays about 2.5×**. In between scales smoothly.
- **Early levels pay less, because there's less to buy.** Never pay for more upgrades than the next level has shop categories:
  - Before level 2 (only Wings open): **1× one upgrade**.
  - Before level 3 (Wings + Seesaw open): **2×**.
  - From level 4 on (3+ categories): the normal 2.5–3×.
  - On these 1× and 2× levels, add a small cushion that covers **exactly one wrong-pick sell-back** (40% of one upgrade), so a single wrong pick can never leave the player stuck. Landing accuracy adds up to 1/6 extra on top, the same share it swings on later levels.

### Selling gear
- Gear sells back for **60%** of its price. Anything higher, like 75%, is too forgiving.
- If you buy the wrong thing, it hurts. That's intended.

### Rejected
- **NO pity bonus.** No catch-up mechanics for failing repeatedly.
- No grinding for money by replaying.

### Saving
- **Progress (level, money, gear) is saved to your account:** your **4-character code** (same as your leaderboard name) plus a **4- or 6-digit PIN**.
- **When creating an account, the PIN has to be entered twice** so players don't mistype or forget it.
- **PINs are stored scrambled (hashed)**, never as plain numbers. This is game-level security, not bank-level, so players shouldn't reuse a real PIN.
- Log in again later with the same code and PIN to continue, on any device.
- **Autosave.** Progress saves automatically after every purchase, sale, equip change, and run. There's no Save button.
- **PIN reset uses a one-time recovery code** shown at signup. The player writes it down, and entering it later lets them set a new PIN. If they lose both, they start over. Low stakes: it's a game about a flying pig, and a returning player already knows how to get back to where they were.
- Saves live in the game's **shared database**.
  - **On Vercel** that's **Upstash Redis** (added through Vercel's Storage tab), reached through small server functions in `api/`. The server hashes PINs, and **10 wrong tries lock a code for 15 minutes**, so a 4-digit PIN can't simply be guessed.
  - On the claude.ai-hosted version it's that page's built-in database.
- *(proposed)* While Steps 1–4 are being tested, progress saves in the browser. Accounts get connected in Step 5, along with the shared database.

### Test checklist
- [ ] Level 1 is easy to pass with the catapult alone, no wings.
- [ ] Each level is beatable by upgrading only 2 things with the right options, in more than one way.
- [ ] The right 3 upgrades pass without overshooting; the wrong 3 fail.
- [ ] Passing works with half-category upgrades (just Length, just Height, just Rocket, or just Fuel).
- [ ] Level 10 is beatable with mid-tier gear.
- [ ] One level's payout = 3 upgrades for a dead-center landing, about 2.5 for one at a flag (from level 3 on).
- [ ] Clearing level 1 pays about 1 upgrade and level 2 about 2, plus enough to fix one wrong pick.
- [ ] The results screen shows how centered the landing was.
- [ ] Bad combos fail in the ways described above, including overshooting.
- [ ] Categories unlock in the exact order above.
- [ ] Tier caps work: no skipping, catch-up allowed, nothing past the cap.
- [ ] The 3 wing/rocket options per tier look clearly different.
- [ ] Seesaw halves and rocket + fuel tank each add up to about one upgrade.
- [ ] Replaying a level doesn't make money pile up.
- [ ] You can sell back a wrong pick and buy another, and it stings.
- [ ] Obstacles and payload unlock together and start at level 7, ramping up slowly, at least 5 seconds apart.
- [ ] Rockets only fire while Space is held; fuel refills for free each flight.
- [ ] A pig without enough payload drops into the water when it hits an obstacle.
- [ ] Bought gear stays owned, and lower tiers can be re-equipped (until sold).
- [ ] Any owned gear can be sold, including older tiers, and selling never blocks buying the next tier.
- [ ] Progress autosaves; there's no Save button.
- [ ] Ramming through with payload uses no extra fuel; flying over costs a lot more fuel.

---

## Step 3 — Powerups (the gamble)

**Goal:** add a bit of gambling and hope, not a reliable source of income.

- **Unlock after passing level 5** (available from level 6), before obstacles. Introduced by the tutorial.
- Paid for with **coins**, like everything else.
- Bought in the shop **before a run**. Each one is placed at a **random spot along the flight route**.
- **Placement:** never so high or low that the pig can't get near it, but it can land where it **doesn't help much**.
- **Never beyond the landing hill** in level mode: every powerup spawns before the hill starts.
- **Never tell the player that some will be duds.** In-game text just says each powerup appears at a random spot along the route.
- **Duds happen naturally**, and you don't know until you fly:
  - It's somewhere you never reach.
  - You're going too fast early on to steer into it.
  - Two powerups spawn close together (e.g. 1m apart), and hitting the first makes you miss the second.
- **Multiple per run, no cap.** Each one costs **double the last**: 5, 10, 20, 40, 80… (3 powerups cost 35 total). The doubling is the limit.
- **Effect when hit:** a gust that gives **a bit of speed and a bit of height**. **Same strength every time.**
- **Coins when hit:** a random 0–20, weighted heavily toward low amounts so powerups are never a "gold mine":

  | Coins | Chance (approx.) |
  |---|---|
  | 0–5 | ~80% |
  | 6–9 | ~15% |
  | 10–20 | ~5% |

### Test checklist
- [ ] Some powerups are duds, and that feels fair rather than broken.
- [ ] Buying several gets expensive fast.
- [ ] Coin payouts feel like a small bonus, not income.

---

## Step 4 — Main menu, tutorial, ending, and endless mode

**Goal:** the game has a start, a way to learn it, a finish, and something to do afterward.

### Main menu
Buttons depend on who's playing:

| Player | Menu options |
|---|---|
| **New player** (no account yet) | **Start New Game** |
| **Returning player, logged in, hasn't beaten the game** | **Start New Game**, **Continue Game** |
| **Returning player, logged in, has beaten the game** | **Start New Game**, **Fly Infinitely**, plus the **leaderboard** |

- **A Log In / Sign Up button** on the main menu.
- **Logging in remembers the player's status** (which level they're on, whether they've beaten the game) **and the equipment they left off with.**
- **"Fly Infinitely"** (endless mode) **never shows until the player has beaten the game**, and it has to actually work when it does. *(Final button name TBD.)*
- **Beating the game is remembered permanently.** A logged-in player who has beaten it can always go back to Fly Infinitely, with the equipment they left off with.
- **Start New Game while logged in:** the level run starts **from scratch: level 1, no gear.** Your **leaderboard score stays**.
- **Name your pig.** Start New Game asks the player to name their pig (up to 16 characters). Leaving it blank names the pig **Snowball**. The name shows in the shop, on the results screen, in the tutorial and in the ending. It is private to the player (not on the leaderboard).
- **The level run and Fly Infinitely are saved separately.** Starting a new game **never touches** your Fly Infinitely save; you can always go back to it.

### Tutorial
- A **guided tutorial** for new players, with **short, helpful prompts** pointing at the thing to do: "Click here to ________."
  - e.g. "Click **Launch** to fling your pig." / "Press **↑** to tilt up." / "Click **Wings** to see your upgrade options."
- **Easy to get out of:** a visible **End tutorial** option at every step. Players who already know how to play are never stuck in it.
- It walks through level 1 (the demo stage) and the first shop visit.
- **It explains the perfect landing spot:** stop between the two flags, and dead center pays the most. After the first clear it says whether the landing got the top payout.
- **It introduces each new feature when it unlocks**: wings, seesaw, launch rig, rockets (they aim where the pig points), payload and obstacles, powerups, Fly Infinitely.
- **Obstacle + payload tip (required, at level 7):** you can **fly over** obstacles **or ram through** them with payload. **Ramming through takes no more fuel than normal flying; flying over takes extra fuel.**
- *(proposed)* Replayable from the main menu.

### Ending
- Beating **level 10** plays the ending: **the pig is happy with its farm friends** (sheep, cows, other pigs, chickens). The designer may come up with a bigger ending later.

### Endless mode
- Unlocks after the ending. Fly with your gear, no target distance, go as far as you can.
- **High-end gear unlocks**, as one more tier in each category (see Gear catalog, "Endless" rows), so endless mode has something to save for.
- **Milestone payouts:** a one-time payment the first time you pass each distance marker. Same idea as level payouts: each one pays once and can't be ground.
- **Coins and powerups** keep working the same way.
- **Obstacles appear in endless mode too, but rarely**, so it doesn't turn into Flappy Bird.
  - **At least 5 seconds of flight between obstacles** (same rule as level mode), often longer. The gap is **randomized** (e.g. 5–12 seconds; tune it).
- **Fly Infinitely is its own save and never resets.** Logging back in resumes it with the equipment you left off with.
- **Go back and try skipped gear:** in Fly Infinitely you can buy options or tiers you passed on during the levels (e.g. the other two wings from tier 3). **Gear costs the same as in level mode.**
- **Toggle upgrades on and off**, e.g. to feel what the starting pig is like again.
- **Equip lower-tier gear you own**, the same as in level mode.
- There's no reason to restart Fly Infinitely, since you can always go back and try other gear.
- Brainstormed but not chosen: personal-best bonus, leaderboard rank bonus, one-time challenges.

### Test checklist
- [ ] Menu → new game → level 1 works.
- [ ] The tutorial guides a new player through launching and the first shop visit.
- [ ] "End tutorial" works at every step.
- [ ] Ending plays after level 10.
- [ ] Endless mode has no target, and milestones pay only once.
- [ ] Endless-mode obstacles are at least 5 seconds apart and randomly spaced.
- [ ] The obstacle tip explains flying over vs. ramming through.
- [ ] Logging back in restores status and equipment, including Fly Infinitely gear.
- [ ] Start New Game resets the level run to level 1 with no gear, and Fly Infinitely is untouched.
- [ ] In Fly Infinitely: buy skipped gear, toggle upgrades on/off, equip lower tiers.
- [ ] The tutorial introduces each feature when it unlocks.

---

## Step 5 — Accounts, saves, and global leaderboard

**Goal:** players keep their progress and compete for the farthest endless-mode flight.

### Hosting
- **The game is published as a shareable page with a built-in shared database.** That database holds accounts, saves, and the leaderboard.

### Accounts
- **4-character code + 4- or 6-digit PIN** (details in Step 2 → Saving).
- PIN entered **twice** at signup, stored **scrambled**, reset with a **one-time recovery code**.
- Starting a new game wipes gear and progress but **keeps the player's leaderboard score**.
- The same code is your leaderboard name.
- *(proposed)* Codes are unique, so two players can't claim the same one.

### Leaderboard
- **Global, shared by all players.**
- **Lives on the main menu** but **only appears after the player has beaten level 10**, so new players don't get confused.
- Ranks **endless-mode distance**.
- Player name is the **4-character code**:
  - Exactly 4 characters, letters and digits.
  - **At least 2 must be letters**, so it can't be all numbers.
- *(proposed)* Sanity checks against faked scores, e.g. reject distances the player's gear can't physically reach.
- *(proposed)* A filter for offensive 4-character codes.
- *(proposed, optional)* A second board for "fastest to beat all 10 levels."

### Test checklist
- [ ] Hidden until level 10 is beaten.
- [ ] Codes like "1234" are rejected, and "AB12" is accepted.
- [ ] Signup rejects mismatched PIN entries.
- [ ] Log in with code + PIN and pick up where you left off; a wrong PIN is rejected.
- [ ] PIN reset with the recovery code works.
- [ ] Menu shows the right buttons for new, returning, and finished players.
- [ ] Starting a new game wipes progress but keeps the leaderboard score.
- [ ] Scores from different players show up on the same board.

---

## Later / future versions

- **Endless-mode personal-best luck ("Monte Carlo" style).** Arrow keys only do so much, so with the same gear a player's distance would plateau. Add a bit of run-to-run randomness (e.g. wind) so there's about a **5–10% chance** of a new personal best with the same equipment.
- A way to **test different launches**.
- A bigger ending scene.
- **Sound effects and music** (not in the first version).
- **Totally overpowered upgrades** that cost an arm and a leg. Possibly paid with real money. **Not part of Steps 1–5.** (Real-money payments would need a payment provider and possibly different hosting; figure that out if and when.)
- Pricing may be revisited.

## Open questions

**Can be settled while tuning (defaults go in the config block):**
- [ ] Obstacle ramp: more obstacles each level (1→5), or the same number getting stronger?
- [ ] Stats and prices per tier.
- [ ] Milestone payouts: how far apart the markers are, and how much each one pays.
- [ ] Exact level target distances and payout curve.
- [ ] Art tone beyond "cute oval pig with goggles, farm setting."

## Ideas considered but not adopted

- Bonus cash for max height, top speed, or airtime.
- Cash for hitting birds or balloons.
- "Insurance payout" for hard crashes (no longer fits, since the pig lands in water).
- Making every reasonable gear choice able to pass a level (rejected).
- "~25% of combinations pass" as a loose rule (replaced by the 3-options-per-tier, one-right-pick system).
- Rockets unlocking at level 6–7 (replaced: rockets available from level 5).
- An adjustable or "scientific" launch angle (rejected: launch upgrades are fixed tiers).
- Active/timed launch rigs (rejected: no decisions at launch).
- Turning payload into ballast instead of using it to smash obstacles.
- Payout covering "about half of all upgrades" (replaced).
- Payout of 2.5× one upgrade (replaced: 3×, so a blunder still leaves some money).
- A flat 3× payout on every level (replaced: early levels pay 1× and 2× because there's less to buy, and landing accuracy moves it between 2.5× and 3×).
- A half-page shop (replaced: the shop fills the whole page).
- Only letting the player sell their newest tier (replaced: any owned gear can be sold).
- Powerups spawning anywhere along the predicted path, including past the hill (replaced: always before the hill).
- Fuel tank items named after containers like Water Bottle and Gas Can (replaced: named by gallons).
- Starting with basic wings (rejected: the pig starts with no wings).
- Pushing obstacles to a later version (replaced: obstacles + payload start at level 7, right after powerups).
- Rockets firing automatically (rejected: hold Space).
- Paying for fuel each run (rejected: fuel is free and refills every flight).
- Hiding Fly Infinitely again after a new game (rejected: beating the game is remembered).
- Frequent obstacles in endless mode (rejected: at least 5 seconds apart).
- Pity bonus (firmly rejected).

## Gear catalog *(draft names; rename anything)*

Tier counts: **Wings 9, Seesaw Length 8, Seesaw Height 8, Launch rig 7, Rocket 6, Fuel tank 6, Payload 4**, plus one **Endless** tier per category after level 10. Which of the 3 options is "right" for each tier gets decided while tuning, and it shouldn't always be the same slot.

### Wings (3 options per tier, each a different style)
Start: **no wings.**

| Tier | Option A | Option B | Option C |
|---|---|---|---|
| 1 | **Cardboard Wings**: flat brown box flaps, tape on the seams | **Paper Plane**: folded white notebook paper, blue lines | **Big Leaf**: one giant green leaf held overhead |
| 2 | **Kite**: red diamond kite with a ribbon tail | **Farmer's Umbrella**: yellow-and-white striped parasol | **Bedsheet Flyer**: floral bedsheet tied at four corners |
| 3 | **Hang Glider**: orange delta wing, metal frame | **Hot Wings**: flame-red feathered wings with flickering tips | **Buffalo Wings**: saucy orange, shaped like giant drumsticks |
| 4 | **Superfly Wings**: sleek silver, swept back | **Scarecrow Sail**: patchwork burlap on crossed sticks | **Bat Wings**: purple membrane, pointy |
| 5 | **Weathervane**: copper rooster vane, wings spread | **Dragonfly**: four thin see-through wings, teal | **Patio Awning**: green canvas, scalloped edge |
| 6 | **Barnstormer**: yellow biplane double wings | **Swan Song**: big white feathered wings | **Picnic Blanket**: red gingham, flapping |
| 7 | **Windmill Rotor**: spinning wooden blades overhead | **Monarch**: orange-and-black butterfly wings | **Stealth Sow**: matte black, angular |
| 8 | **Hog Glider**: pink, aerodynamic, goggles painted on the nose | **Jet Wing**: chrome with blue stripes | **Thunderhog**: storm-gray with yellow lightning bolts |
| 9 | **Pigasus**: golden feathered wings | **Sky Sow-er**: giant white sailcloth wing | **Hamhawk**: brown-and-cream hawk wings |
| Endless | **Wings of Bacon**: crispy-striped, legendary | **Cloud Nine**: made of actual cloud | **Hogzilla Wings**: huge red-and-black scaled wings |

### Rocket (3 options per tier, each a different style; expensive)
| Tier | Option A | Option B | Option C |
|---|---|---|---|
| 1 | **Bottle Rocket**: a single stick firework, red | **Soda Fizzer**: shaken soda bottles, green glass | **Leaf Blower**: orange yard blower strapped on |
| 2 | **Firecracker Pack**: bundle of red sticks | **Fire Extinguisher**: red tank, white foam trail | **Pressure Washer**: yellow, water-jet trail |
| 3 | **Corn Popper**: popcorn machine, kernels fly out the back | **Moonshine Jug**: clay jug marked "XXX", blue flame | **Hog Wild**: twin cartoon rockets with flames painted on |
| 4 | **Bacon Burner**: sizzling striped thruster | **Silo Rocket**: mini red grain silo with a nozzle | **Tractor Twin-Pipes**: two black exhaust stacks, smoky |
| 5 | **Methane Machine**: green tank, green puffs (yes, it's that joke) | **Comet Tail**: icy blue, long sparkly trail | **Thunder Thruster**: chrome, crackling sparks |
| 6 | **Swine Shuttle**: white space-shuttle boosters | **Supersonic Sow**: silver jet engine with a sonic boom | **Hambush**: camo-green military rocket pack |
| Endless | **Hogzilla Engine**: massive, red-hot | **Pork Star**: gold, leaves a starry trail | **Ham Radio**: a rocket made from an old radio tower, sparks everywhere |

### Fuel tank (linear; cheap)
Named by capacity.

| Tier | Name |
|---|---|
| 0 (start, comes with rockets) | **1 Gallon** |
| 1 | **3 Gallons** |
| 2 | **5 Gallons** |
| 3 | **10 Gallons** |
| 4 | **15 Gallons** |
| 5 | **18 Gallons** |
| 6 | **20 Gallons** |
| Endless | **30 Gallons** |

### Seesaw Length (linear; half price)
| Tier | Name |
|---|---|
| 0 (start) | **Wobbly Plank** |
| 1 | **Sturdy Plank** |
| 2 | **Double Plank** |
| 3 | **Oak Beam** |
| 4 | **Barn Door** |
| 5 | **Fence Rail** |
| 6 | **Telephone Pole** |
| 7 | **Steel Girder** |
| 8 | **Trebuchet Arm** |
| Endless | **The Pigapult** |

### Seesaw Height (linear; half price)
What the plank sits on, which sets how high and steep the launch is.

| Tier | Name |
|---|---|
| 0 (start) | **Flat Rock** |
| 1 | **Brick Stack** |
| 2 | **Milk Crate** |
| 3 | **Hay Bale** |
| 4 | **Oil Drum** |
| 5 | **Tractor Tire** |
| 6 | **Stone Wall** |
| 7 | **Feed Silo Stump** |
| 8 | **Windmill Base** |
| Endless | **Mount Mudpile** |

### Launch rig (linear)
| Tier | Name |
|---|---|
| 0 (start) | nothing, just the pig |
| 1 | **Bucket** |
| 2 | **Barrel** |
| 3 | **Wheelbarrow** |
| 4 | **Feed Trough** |
| 5 | **Shopping Cart** |
| 6 | **Mine Cart** |
| 7 | **Turbo Tractor Seat** |
| Endless | **Golden Trough** |

### Payload (linear; for obstacles)
| Tier | Name |
|---|---|
| 1 | **Pumpkin** |
| 2 | **Milk Can** |
| 3 | **Anvil** |
| 4 | **Wrecking Ball** |
| Endless | **Cast-Iron Cow Bell** |

## Ways the designer can contribute

- Playtesting and tuning the config numbers. This has the biggest impact.
- Sprites (Piskel / Aseprite), and later sound effects (jsfxr / freesound.org).
- Renaming or adding to the gear catalog.
- Later: learning a bit of JavaScript by tweaking values.

## Sources

- Learn to Fly fan wiki: [Ramp](https://learntofly.fandom.com/wiki/Ramp), [Sleighs](https://learntofly.fandom.com/wiki/Sleighs), [Payloads](https://learntofly.fandom.com/wiki/Payloads), [Boost](https://learntofly.fandom.com/wiki/Boost)
