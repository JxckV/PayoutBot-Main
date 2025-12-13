const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

/* ================= CONFIG ================= */

const PYRAX_ROLE_ID = 'ROLE ID HERE';
const ADMIN_ROLE_NAME = 'Discord-Admin';

/* ================= DB ================= */

const dbPath = path.join(__dirname, '..', '..', 'database.db');
const db = new sqlite3.Database(dbPath);

const all = (sql, params = []) =>
  new Promise((res, rej) =>
    db.all(sql, params, (e, r) => (e ? rej(e) : res(r)))
  );

/* ================= COMMAND ================= */

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flyinstats')
    .setDescription('View fly-in attendance statistics')
    .addUserOption(o =>
      o
        .setName('user')
        .setDescription('View stats for another user (admin only)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const member = interaction.member;

    // Must be Pyrax
    if (!member.roles.cache.has(PYRAX_ROLE_ID)) {
      return interaction.reply({
        content: 'You must be a Pyrax member to use this command.',
        flags: MessageFlags.Ephemeral
      });
    }

    const targetUser =
      interaction.options.getUser('user') ?? interaction.user;

    const isAdmin = member.roles.cache.some(
      r => r.name === ADMIN_ROLE_NAME
    );

    // Non-admins cannot check others
    if (!isAdmin && targetUser.id !== interaction.user.id) {
      return interaction.reply({
        content: 'You can only view your own fly-in stats.',
        flags: MessageFlags.Ephemeral
      });
    }

    // Fetch stats (only CLOSED fly-ins)
    const rows = await all(
      `
      SELECT r.status, COUNT(*) AS count
      FROM flyin_responses r
      JOIN flyins f ON r.flyinId = f.id
      WHERE r.userId = ?
      AND f.isClosed = 1
      GROUP BY r.status
      `,
      [targetUser.id]
    );

    let confirmed = 0;
    let cannot = 0;
    let tentative = 0;

    for (const row of rows) {
      if (row.status === 'confirmed') confirmed = row.count;
      if (row.status === 'cannot') cannot = row.count;
      if (row.status === 'tentative') tentative = row.count;
    }

    const total = confirmed + cannot + tentative;
    const attendance =
      total > 0 ? Math.round((confirmed / total) * 100) : 0;

    const embed = new EmbedBuilder()
      .setTitle('Fly-In Attendance Stats')
      .setColor('Blue')
      .addFields(
        { name: 'Member', value: `<@${targetUser.id}>` },
        { name: 'Total Fly-Ins', value: String(total), inline: true },
        { name: 'Confirmed ✅', value: String(confirmed), inline: true },
        { name: 'Cannot ❌', value: String(cannot), inline: true },
        { name: 'Tentative ❔', value: String(tentative), inline: true },
        {
          name: 'Attendance %',
          value: `${attendance}%`,
          inline: true
        }
      )
      .setTimestamp();

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }
};
