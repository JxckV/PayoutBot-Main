const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

/* ================= DB ================= */

const dbPath = path.join(__dirname, '..', '..', 'database.db');
const db = new sqlite3.Database(dbPath);

const get = (sql, params = []) =>
  new Promise((res, rej) =>
    db.get(sql, params, (e, r) => (e ? rej(e) : res(r)))
  );

const run = (sql, params = []) =>
  new Promise((res, rej) =>
    db.run(sql, params, e => (e ? rej(e) : res()))
  );

/* ================= HELPERS ================= */

// Strict IANA timezone validation
function isValidTimeZone(tz) {
  try {
    Intl.DateTimeFormat('en-US', { timeZone: tz }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

const safe = (v) => String(v ?? 'None');

/* ================= COMMAND ================= */

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timezone')
    .setDescription('Manage your timezone for fly-in times')
    .addSubcommand(sc =>
      sc
        .setName('set')
        .setDescription('Set your timezone (IANA format)')
        .addStringOption(o =>
          o
            .setName('timezone')
            .setDescription('Example: Europe/London')
            .setRequired(true)
        )
    )
    .addSubcommand(sc =>
      sc
        .setName('view')
        .setDescription('View your current timezone')
    )
    .addSubcommand(sc =>
      sc
        .setName('clear')
        .setDescription('Clear your saved timezone')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    /* ===== VIEW ===== */
    if (sub === 'view') {
      const row = await get(
        'SELECT timezone FROM user_timezones WHERE userId = ?',
        [userId]
      );

      return interaction.reply({
        content: row
          ? `Your timezone is set to **${safe(row.timezone)}**`
          : 'You have not set a timezone yet.',
        flags: MessageFlags.Ephemeral
      });
    }

    /* ===== CLEAR ===== */
    if (sub === 'clear') {
      await run(
        'DELETE FROM user_timezones WHERE userId = ?',
        [userId]
      );

      return interaction.reply({
        content: 'Your timezone has been cleared.',
        flags: MessageFlags.Ephemeral
      });
    }

    /* ===== SET ===== */
    if (sub === 'set') {
      let tz = interaction.options.getString('timezone');

      tz = tz.trim();

      if (!tz || !isValidTimeZone(tz)) {
        return interaction.reply({
          content:
            'Invalid timezone.\nUse an IANA format like `Europe/London` or `America/New_York`.',
          flags: MessageFlags.Ephemeral
        });
      }

      await run(
        `
        INSERT INTO user_timezones (userId, timezone)
        VALUES (?, ?)
        ON CONFLICT(userId)
        DO UPDATE SET timezone = excluded.timezone
        `,
        [userId, tz]
      );

      return interaction.reply({
        content: `Your timezone has been set to **${safe(tz)}**.`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
};