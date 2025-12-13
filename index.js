const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');
const sqlite3 = require('sqlite3').verbose();

/* =========================
   DATABASE SETUP
========================= */

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const executeQuery = (query) =>
  new Promise((resolve, reject) => {
    db.run(query, err => (err ? reject(err) : resolve()));
  });

const removeUserFromDb = (userId) =>
  new Promise((resolve, reject) => {
    db.run('DELETE FROM guilds WHERE userId = ?', [userId], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });

/* =========================
   CREATE TABLES
========================= */

const createTables = async () => {
  try {
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS guilds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        userIBAN TEXT,
        turfsCapped INTEGER DEFAULT 0,
        laundering INTEGER DEFAULT 0,
        drugsSold INTEGER DEFAULT 0,
        ouncesCut INTEGER DEFAULT 0,
        cokeMade INTEGER DEFAULT 0,
        methMade INTEGER DEFAULT 0,
        armourMade INTEGER DEFAULT 0,
        refiningBarrels INTEGER DEFAULT 0,
        cocaPasteMade INTEGER DEFAULT 0,
        atmsMade INTEGER DEFAULT 0,
        rfMade INTEGER DEFAULT 0,
        jewelryCrafted INTEGER DEFAULT 0,
        gunpartsMade INTEGER DEFAULT 0,
        sheetsMade INTEGER DEFAULT 0,
        wireCrafted INTEGER DEFAULT 0,
        fishCooked INTEGER DEFAULT 0,
        premiumProcessed INTEGER DEFAULT 0,
        regularProcessed INTEGER DEFAULT 0,
        gangActivity INTEGER DEFAULT 0,
        barteringMission INTEGER DEFAULT 0,
        hempSupplies INTEGER DEFAULT 0,
        metalSheetsSupplies INTEGER DEFAULT 0,
        paydirtSupplies INTEGER DEFAULT 0,
        premiumSupplies INTEGER DEFAULT 0,
        thermalsSupplies INTEGER DEFAULT 0,
        phoneSupplies INTEGER DEFAULT 0,
        radioSupplies INTEGER DEFAULT 0,
        lithPrecursors INTEGER DEFAULT 0,
        phosPrecursors INTEGER DEFAULT 0,
        barrelsPrecursors INTEGER DEFAULT 0,
        procainePrecursors INTEGER DEFAULT 0,
        procaineProcessed INTEGER DEFAULT 0,
        cocaleafsPrecursors INTEGER DEFAULT 0,
        refinedPrecursors INTEGER DEFAULT 0,
        goldGems INTEGER DEFAULT 0,
        opalGems INTEGER DEFAULT 0,
        emeraldGems INTEGER DEFAULT 0,
        rubyGems INTEGER DEFAULT 0,
        diamondGems INTEGER DEFAULT 0,
        blueDiamondGems INTEGER DEFAULT 0,
        pinkDiamondGems INTEGER DEFAULT 0,
        tanzaniteGems INTEGER DEFAULT 0,
        larimarGems INTEGER DEFAULT 0,
        topazGems INTEGER DEFAULT 0,
        copperGems INTEGER DEFAULT 0,
        copperWireGems INTEGER DEFAULT 0,
        ironGems INTEGER DEFAULT 0,
        screwsGun INTEGER DEFAULT 0,
        pistolBodiesGun INTEGER DEFAULT 0,
        gunBarrelsGun INTEGER DEFAULT 0,
        gunStockGun INTEGER DEFAULT 0,
        gunTriggerGun INTEGER DEFAULT 0,
        springGun INTEGER DEFAULT 0,
        heavyGunBarrelGun INTEGER DEFAULT 0,
        smgBodyGun INTEGER DEFAULT 0,
        rifleBodyGun INTEGER DEFAULT 0,
        chardWine INTEGER DEFAULT 0,
        pinotWine INTEGER DEFAULT 0,
        zinfanWine INTEGER DEFAULT 0,
        sauvignonWine INTEGER DEFAULT 0,
        cabernetWine INTEGER DEFAULT 0,
        fermentingWine INTEGER DEFAULT 0,
        salmonFish INTEGER DEFAULT 0,
        groupFish INTEGER DEFAULT 0,
        dolphineFish INTEGER DEFAULT 0,
        mackerelFish INTEGER DEFAULT 0,
        bassFish INTEGER DEFAULT 0,
        tunaFish INTEGER DEFAULT 0,
        stingrayFish INTEGER DEFAULT 0,
        stingrayTailFish INTEGER DEFAULT 0,
        pikeFish INTEGER DEFAULT 0,
        freshWaterTurtle INTEGER DEFAULT 0,
        totalPayout INTEGER DEFAULT 0,
        totalPoints INTEGER DEFAULT 0,
        sojoGrown INTEGER DEFAULT 0,
        khalifaKush INTEGER DEFAULT 0,
        sourDiesel INTEGER DEFAULT 0,
        whiteWidow INTEGER DEFAULT 0,
        pineExpress INTEGER DEFAULT 0,
        activeKos INTEGER DEFAULT 0
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS flyins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guildId TEXT NOT NULL,
        timeValue TEXT NOT NULL,
        timeLabel TEXT NOT NULL,
        announcementChannelId TEXT NOT NULL,
        announcementMessageId TEXT NOT NULL,
        logChannelId TEXT NOT NULL,
        logMessageId TEXT NOT NULL,
        createdByUserId TEXT,
        createdAt INTEGER NOT NULL,
        closeAt INTEGER NOT NULL,
        isClosed INTEGER DEFAULT 0
      )
    `);
    //  MIGRATION
await executeQuery(`
  ALTER TABLE flyins ADD COLUMN scheduledAtUtc INTEGER
`).catch(() => {});


    await executeQuery(`
      CREATE TABLE IF NOT EXISTS flyin_responses (
        flyinId INTEGER NOT NULL,
        userId TEXT NOT NULL,
        status TEXT NOT NULL,
        updatedAt INTEGER NOT NULL,
        PRIMARY KEY (flyinId, userId)
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS flyin_daily_runs (
        guildId TEXT NOT NULL,
        runDate TEXT NOT NULL,
        timeValue TEXT NOT NULL,
        PRIMARY KEY (guildId, runDate, timeValue)
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS flyin_config (
        guildId TEXT PRIMARY KEY,
        dailyEnabled INTEGER DEFAULT 0,
        dailyPostTime TEXT DEFAULT '12:00',
        dailyTimes TEXT DEFAULT '7PM',
        autoCloseMinutes INTEGER DEFAULT 120
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_timezones (
        userId TEXT PRIMARY KEY,
        timezone TEXT NOT NULL
      )
    `);

    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

/* =========================
   CLIENT INIT
========================= */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User
  ]
});

/* =========================
   COMMAND LOADER
========================= */

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');

for (const folder of fs.readdirSync(foldersPath)) {
  const commandsPath = path.join(foldersPath, folder);
  for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

/* =========================
   EVENT LOADER
========================= */

const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

/* =========================
   MEMBER CLEANUP
========================= */

client.on('guildMemberRemove', async member => {
  try {
    await removeUserFromDb(member.user.id);
  } catch (err) {
    console.error(err);
  }
});

/* =========================
   LOGIN + SCHEDULER
========================= */

client.login(token).then(async () => {
  await createTables();

  const flyScheduler = require(path.join(__dirname, 'services', 'flyinScheduler.js'));
  flyScheduler.init(db);

  await flyScheduler.cacheOpenFlyins();

  setInterval(async () => {
    try {
      await flyScheduler.closeDueFlyins(client);
      await flyScheduler.runDailyScheduler(client);
    } catch (err) {
      console.error('Fly-in scheduler error:', err);
    }
  }, 60 * 1000);

  console.log('Bot online and fully operational.');
}).catch(console.error);