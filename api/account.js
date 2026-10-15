// POST /api/account  { action, ... }
//   signup  { code, pin, save }        -> { token, recovery }
//   login   { code, pin }              -> { token, save }
//   resume  { token }                  -> { code, save }      (stay logged in on this device)
//   reset   { code, recovery, pin }    -> { token, recovery, save }   (old recovery code is used up)
//   save    { token, save }            -> { ok }
//   logout  { token }                  -> { ok }
const L = require('./_lib');

const TOO_MANY = `Too many wrong tries for this code. Wait ${L.LIMITS.lockSeconds / 60} minutes and try again.`;

function cleanSave(save) {
  if (!save || typeof save !== 'object') return null;
  const s = JSON.stringify(save);
  return s.length > L.LIMITS.maxSaveBytes ? null : JSON.parse(s);
}

const actions = {
  async signup(b) {
    const code = L.normalizeCode(b.code);
    const p = L.codeProblem(code) || L.pinProblem(b.pin); if (p) return [400, { error: p }];
    const salt = L.randHex(16), recovery = L.makeRecoveryCode(), recSalt = L.randHex(16);
    const acct = {
      code, salt, pinHash: await L.hashSecret(b.pin, salt), recSalt, recHash: await L.hashSecret(L.cleanRecovery(recovery), recSalt),
      save: cleanSave(b.save), created: Date.now(), updated: Date.now(),
    };
    // NX = only if nobody has this code yet (atomic, so two people can't claim it at once)
    const ok = await L.redis('SET', L.acctKey(code), JSON.stringify(acct), 'NX');
    if (!ok) return [409, { error: 'That code is already taken. Pick another.' }];
    return [200, { token: await L.newSession(code), recovery }];
  },

  async login(b) {
    const code = L.normalizeCode(b.code);
    if (L.codeProblem(code)) return [400, { error: 'Codes are 4 letters or digits with at least 2 letters.' }];
    if (await L.locked(code)) return [429, { error: TOO_MANY }];
    const acct = await L.getAccount(code);
    if (!acct) return [404, { error: 'No account with that code. Check it, or sign up.' }];
    if (!L.sameHex(await L.hashSecret(b.pin, acct.salt), acct.pinHash)) {
      const n = await L.noteFail(code);
      return [401, { error: n >= L.LIMITS.failedTries ? TOO_MANY : 'Wrong PIN. Try again, or use your recovery code.' }];
    }
    await L.clearFails(code);
    return [200, { token: await L.newSession(code), save: acct.save }];
  },

  async resume(b) {
    const code = await L.sessionCode(b.token);
    if (!code) return [401, { error: 'Logged out. Please log in again.' }];
    const acct = await L.getAccount(code);
    if (!acct) return [401, { error: 'Logged out. Please log in again.' }];
    return [200, { code, save: acct.save }];
  },

  async reset(b) {
    const code = L.normalizeCode(b.code);
    const p = L.pinProblem(b.pin); if (p) return [400, { error: p }];
    if (await L.locked(code)) return [429, { error: TOO_MANY }];
    const acct = await L.getAccount(code);
    if (!acct) return [404, { error: 'No account with that code.' }];
    if (!L.sameHex(await L.hashSecret(L.cleanRecovery(b.recovery), acct.recSalt), acct.recHash)) {
      const n = await L.noteFail(code);
      return [401, { error: n >= L.LIMITS.failedTries ? TOO_MANY : 'That recovery code doesn\'t match.' }];
    }
    const salt = L.randHex(16), recovery = L.makeRecoveryCode(), recSalt = L.randHex(16);
    Object.assign(acct, { salt, pinHash: await L.hashSecret(b.pin, salt), recSalt, recHash: await L.hashSecret(L.cleanRecovery(recovery), recSalt), updated: Date.now() });
    await L.putAccount(code, acct);
    await L.clearFails(code);
    await L.endAllSessions(code); // a new PIN logs out every other device
    return [200, { token: await L.newSession(code), recovery, save: acct.save }];
  },

  async save(b) {
    const code = await L.sessionCode(b.token);
    if (!code) return [401, { error: 'Logged out. Please log in again.' }];
    const save = cleanSave(b.save); if (!save) return [400, { error: 'That save is too big or broken.' }];
    const acct = await L.getAccount(code);
    if (!acct) return [401, { error: 'Logged out. Please log in again.' }];
    acct.save = save; acct.updated = Date.now();
    await L.putAccount(code, acct);
    return [200, { ok: true }];
  },

  async logout(b) {
    if (b.token) await L.redis('DEL', 'sess:' + L.sha256(b.token));
    return [200, { ok: true }];
  },
};

module.exports = L.route(async (req, res) => {
  if (req.method !== 'POST') return L.send(res, 405, { error: 'Use POST.' });
  const b = await L.readBody(req);
  const fn = actions[b.action];
  if (!fn) return L.send(res, 400, { error: 'Unknown action.' });
  const [status, out] = await fn(b);
  L.send(res, status, out);
});
