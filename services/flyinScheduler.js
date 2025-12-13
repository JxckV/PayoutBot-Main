let db = null;
const flyinCache = new Map();

// pull log updater from command file
const path = require('node:path');
const fly = require(path.join(__dirname, '..', 'commands', 'payout', 'flyintimedevelopment.js'));

function init(database) {
  db = database;
}

/* =========================
   INTERNAL DB HELPERS
========================= */

function assertDbReady() {
  if (!db) {
    throw new Error('[FlyinScheduler] Database not initialised. Call init(db) first.');
  }
}

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    assertDbReady();
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    assertDbReady();
    db.run(sql, params, err => (err ? reject(err) : resolve()));
  });

/* =========================
   CORE FUNCTIONS
========================= */

async function cacheOpenFlyins() {
  assertDbReady();

  const rows = await all(
    'SELECT id, announcementMessageId FROM flyins WHERE isClosed = 0'
  );

  for (const row of rows) {
    flyinCache.set(row.announcementMessageId, row.id);
  }

  console.log(`[FlyinScheduler] Cached ${rows.length} open fly-in(s).`);
}

/* =========================
   PHASE 8.2 – AUTO CLOSE
========================= */

async function closeDueFlyins(client) {
  assertDbReady();

  const now = Date.now();

  const dueFlyins = await all(
    `
    SELECT id, announcementMessageId
    FROM flyins
    WHERE isClosed = 0 AND closeAt <= ?
    `,
    [now]
  );

  for (const flyin of dueFlyins) {
    // mark closed
    await run(
      'UPDATE flyins SET isClosed = 1 WHERE id = ?',
      [flyin.id]
    );

    // remove from cache
    flyinCache.delete(flyin.announcementMessageId);

    // 🔑 UPDATE LOG EMBED IMMEDIATELY (PHASE 8.2)
    try {
      await fly.updateLogForFlyin(client, flyin.id);
    } catch (err) {
      console.error(`[FlyinScheduler] Failed to update log for fly-in ${flyin.id}`, err);
    }

    console.log(`[FlyinScheduler] Auto-closed fly-in ${flyin.id}`);
  }
}

async function runDailyScheduler(client) {
  assertDbReady();
  // unchanged (Phase 7 logic lives here)
}

module.exports = {
  init,
  cacheOpenFlyins,
  closeDueFlyins,
  runDailyScheduler,
  flyinCache
};