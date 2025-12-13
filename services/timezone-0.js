const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', '..', 'database.db');
const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) =>
  new Promise((res, rej) => db.run(sql, params, e => (e ? rej(e) : res())));

const get = (sql, params = []) =>
  new Promise((res, rej) => db.get(sql, params, (e, r) => (e ? rej(e) : res(r))));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timezone')
    .setDescription('Manage your timezone')
    .addSubcommand(sc =>
      sc
        .setName('set')
        .setDescription('Set your timezone')
        .addStringOption(o =>
          o
            .setName('value')
            .setDescription('Example: Europe/London')
            .setRequired(true)
        )
    )
    .addSubcommand(sc =>
      sc
        .setName('view')
        .setDescription('View your timezone')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    if (sub === 'view') {
      const row = await get(
        `SELECT timezone FROM user_timezones WHERE userId = ?`,
        [userId]
      );

      return interaction.reply({
        content: row
          ? `Your timezone is set to **${row.timezone}**`
          : 'You have not set a timezone yet.',
        flags: MessageFlags.Ephemeral
      });
    }

    const tz = interaction.options.getString('value');

    // Validate timezone safely
    const validZones = Intl.supportedValuesOf('timeZone');
    if (!validZones.includes(tz)) {
      return interaction.reply({
        content: 'Invalid timezone. Example: Europe/London',
        flags: MessageFlags.Ephemeral
      });
    }

    await run(
      `
      INSERT INTO user_timezones (userId, timezone)
      VALUES (?, ?)
      ON CONFLICT(userId) DO UPDATE SET timezone = excluded.timezone
      `,
      [userId, tz]
    );

    return interaction.reply({
      content: `Timezone set to **${tz}**`,
      flags: MessageFlags.Ephemeral
    });
  }
};
