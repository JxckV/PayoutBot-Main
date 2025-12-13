const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', '..', 'database.db');
const db = new sqlite3.Database(dbPath);

const get = (sql, params = []) =>
  new Promise((res, rej) =>
    db.get(sql, params, (e, r) => (e ? rej(e) : res(r)))
  );

const all = (sql, params = []) =>
  new Promise((res, rej) =>
    db.all(sql, params, (e, r) => (e ? rej(e) : res(r)))
  );

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

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flyinstatus')
    .setDescription('View the current fly-in status'),

  async execute(interaction) {
    const flyin = await get(
      `SELECT id, timeLabel, scheduledAtUtc
       FROM flyins
       WHERE isClosed = 0
       ORDER BY createdAt DESC
       LIMIT 1`
    );

    if (!flyin) {
      return interaction.reply({
        content: 'There is currently no active fly-in.',
        flags: MessageFlags.Ephemeral
      });
    }

    const responses = await all(
      `SELECT status FROM flyin_responses WHERE flyinId = ?`,
      [flyin.id]
    );

    const counts = { confirmed: 0, cannot: 0, tentative: 0 };
    for (const r of responses) counts[r.status]++;

    const tzRow = await get(
      `SELECT timezone FROM user_timezones WHERE userId = ?`,
      [interaction.user.id]
    );

    let localTime = null;
    if (tzRow) {
      localTime = formatInTimezone(flyin.scheduledAtUtc, tzRow.timezone);
    }

    const embed = new EmbedBuilder()
      .setTitle('✈️ Current Fly-In Status')
      .addFields(
        { name: 'Server Time', value: flyin.timeLabel },
        {
          name: 'Your Time',
          value: localTime
            ? `${localTime} (${tzRow.timezone})`
            : 'Not set — use `/timezone set`'
        },
        { name: 'Confirmed ✅', value: String(counts.confirmed), inline: true },
        { name: 'Cannot ❌', value: String(counts.cannot), inline: true },
        { name: 'Tentative ❔', value: String(counts.tentative), inline: true }
      )
      .setColor('Blue')
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};