const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

/* ================= CONFIG ================= */

const ANNOUNCEMENTS_CHANNEL_ID = '1398637203441057922';
const LOG_CHANNEL_ID = '1448454971363168288';
const PYRAX_ROLE_ID = '1449160168855175341';
const ADMIN_ROLE_NAME = 'Discord-Admin';

/* ================= DB ================= */

const dbPath = path.join(__dirname, '..', '..', 'database.db');
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) =>
  new Promise((res, rej) => db.run(sql, params, e => (e ? rej(e) : res())));

const get = (sql, params = []) =>
  new Promise((res, rej) => db.get(sql, params, (e, r) => (e ? rej(e) : res(r))));

const all = (sql, params = []) =>
  new Promise((res, rej) => db.all(sql, params, (e, r) => (e ? rej(e) : res(r))));

/* ================= HELPERS ================= */

const safe = v => String(v ?? 'None');

function timeLabelFromValue(timeValue) {
  const map = { '7PM': '7:00 PM', '8PM': '8:00 PM', '9PM': '9:00 PM' };
  return safe(map[timeValue] ?? timeValue);
}

// ---------- TIMEZONE HELPERS ----------

async function getUserTimezone(userId) {
  const row = await get(
    'SELECT timezone FROM user_timezones WHERE userId = ?',
    [userId]
  );
  return row?.timezone ?? null;
}

function formatInTimezone(timestampUtc, timezone) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestampUtc));
  } catch {
    return null;
  }
}

/* ================= CACHE ================= */

const flyinCache = new Map(); // messageId -> flyinId

/* ================= CORE ================= */

async function createFlyin(client, guild, timeValue, createdByUserId = null) {
  const timeLabel = timeLabelFromValue(timeValue);

  // Canonical UTC timestamp (stored in createdAt)
  const hourMap = { '7PM': 19, '8PM': 20, '9PM': 21 };
  const now = new Date();
  const scheduledUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hourMap[timeValue],
    0,
    0
  );

  const announceChannel = await client.channels.fetch(ANNOUNCEMENTS_CHANNEL_ID);
  const logChannel = await client.channels.fetch(LOG_CHANNEL_ID);

  /* ---------- ANNOUNCEMENT ---------- */

  const announceEmbed = new EmbedBuilder()
    .setTitle('Pyrax Fly-In Scheduled')
    .setDescription(
      [
        'A Pyrax-only fly-in has been scheduled.',
        '',
        `🕒 Server Time: **${timeLabel} (UTC)**`,
        '',
        'React with:',
        '✅ Confirmed',
        '❌ Cannot attend',
        '❔ Tentative'
      ].join('\n')
    )
    .setColor('Blue')
    .setTimestamp();

  const announcementMessage = await announceChannel.send({ embeds: [announceEmbed] });

  await announceChannel.send({
    content: `<@&${PYRAX_ROLE_ID}> Fly-in scheduled! React above.`,
    allowedMentions: { roles: [PYRAX_ROLE_ID] }
  });

  await announcementMessage.react('✅');
  await announcementMessage.react('❌');
  await announcementMessage.react('❔');

  /* ---------- LOG ---------- */

  const logEmbed = new EmbedBuilder()
    .setTitle('Pyrax Fly-In Log')
    .addFields(
      { name: 'Scheduled Time (UTC)', value: timeLabel },
      { name: 'Status', value: 'OPEN' },
      { name: 'Confirmed ✅', value: 'None' },
      { name: 'Cannot Attend ❌', value: 'None' },
      { name: 'Tentative ❔', value: 'None' }
    )
    .setColor('Grey')
    .setTimestamp();

  const logMessage = await logChannel.send({ embeds: [logEmbed] });

  const closeAt = scheduledUtc + 60 * 60 * 1000;

  await run(
    `
    INSERT INTO flyins
    (guildId, timeValue, timeLabel,
     announcementChannelId, announcementMessageId,
     logChannelId, logMessageId,
     createdByUserId, createdAt, closeAt, isClosed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `,
    [
      guild.id,
      timeValue,
      timeLabel,
      announceChannel.id,
      announcementMessage.id,
      logChannel.id,
      logMessage.id,
      createdByUserId,
      scheduledUtc,
      closeAt
    ]
  );

  const row = await get(
    'SELECT id FROM flyins WHERE announcementMessageId = ?',
    [announcementMessage.id]
  );

  if (row) flyinCache.set(announcementMessage.id, row.id);
}

/* ================= LOG UPDATE ================= */

async function updateLogForFlyin(client, flyinId) {
  const flyin = await get(
    `SELECT timeLabel, createdAt, logChannelId, logMessageId, isClosed
     FROM flyins WHERE id = ?`,
    [flyinId]
  );
  if (!flyin) return;

  const responses = await all(
    'SELECT userId, status FROM flyin_responses WHERE flyinId = ?',
    [flyinId]
  );

  const confirmed = [];
  const cannot = [];
  const tentative = [];

  for (const r of responses) {
    const tz = await getUserTimezone(r.userId);
    let local = '';

    if (tz) {
      const formatted = formatInTimezone(flyin.createdAt, tz);
      if (formatted) local = ` (${formatted})`;
    }

    const mention = `<@${r.userId}>${local}`;

    if (r.status === 'confirmed') confirmed.push(mention);
    if (r.status === 'cannot') cannot.push(mention);
    if (r.status === 'tentative') tentative.push(mention);
  }

  const logChannel = await client.channels.fetch(flyin.logChannelId);
  const logMessage = await logChannel.messages.fetch(flyin.logMessageId);

  const embed = new EmbedBuilder()
    .setTitle('Pyrax Fly-In Log')
    .setColor(flyin.isClosed ? 'Red' : 'Grey')
    .addFields(
      { name: 'Scheduled Time (UTC)', value: flyin.timeLabel },
      { name: 'Status', value: flyin.isClosed ? 'CLOSED' : 'OPEN' },
      { name: 'Confirmed ✅', value: confirmed.join('\n') || 'None' },
      { name: 'Cannot Attend ❌', value: cannot.join('\n') || 'None' },
      { name: 'Tentative ❔', value: tentative.join('\n') || 'None' }
    )
    .setTimestamp();

  await logMessage.edit({ embeds: [embed] });
}

/* ================= COMMAND ================= */

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flyintime')
    .setDescription('Create a Pyrax fly-in')
    .addStringOption(o =>
      o.setName('time')
        .setDescription('Select the fly-in time')
        .setRequired(true)
        .addChoices(
          { name: '7:00 PM', value: '7PM' },
          { name: '8:00 PM', value: '8PM' },
          { name: '9:00 PM', value: '9PM' }
        )
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.some(r => r.name === ADMIN_ROLE_NAME)) {
      return interaction.reply({
        content: 'You do not have permission.',
        flags: MessageFlags.Ephemeral
      });
    }

    const timeValue = interaction.options.getString('time');

    await createFlyin(
      interaction.client,
      interaction.guild,
      timeValue,
      interaction.user.id
    );

    await interaction.reply({
      content: `Fly-in created for **${timeLabelFromValue(timeValue)}**.`,
      flags: MessageFlags.Ephemeral
    });
  },

  flyinCache,
  db,
  createFlyin,
  updateLogForFlyin
};