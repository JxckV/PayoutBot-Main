const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

/* ================= CONFIG ================= */

const PYRAX_ROLE_ID = '1449160168855175341';
const ADMIN_ROLE_NAME = 'Discord-Admin';
const PAGE_SIZE = 5;

/* ================= DB ================= */

const dbPath = path.join(__dirname, '..', '..', 'database.db');
const db = new sqlite3.Database(dbPath);

const all = (sql, params = []) =>
  new Promise((res, rej) =>
    db.all(sql, params, (e, r) => (e ? rej(e) : res(r)))
  );

/* ================= HELPERS ================= */

function statusEmoji(status) {
  if (status === 'confirmed') return '✅ Confirmed';
  if (status === 'cannot') return '❌ Cannot';
  if (status === 'tentative') return '❔ Tentative';
  return 'Unknown';
}

/* ================= COMMAND ================= */

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flyinhistory')
    .setDescription('View fly-in history')
    .addUserOption(o =>
      o
        .setName('user')
        .setDescription('View history for another user (admin only)')
        .setRequired(false)
    )
    .addIntegerOption(o =>
      o
        .setName('page')
        .setDescription('Page number')
        .setMinValue(1)
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

    const page =
      interaction.options.getInteger('page') ?? 1;

    const isAdmin = member.roles.cache.some(
      r => r.name === ADMIN_ROLE_NAME
    );

    // Non-admin restriction
    if (!isAdmin && targetUser.id !== interaction.user.id) {
      return interaction.reply({
        content: 'You can only view your own fly-in history.',
        flags: MessageFlags.Ephemeral
      });
    }

    const offset = (page - 1) * PAGE_SIZE;

    const rows = await all(
      `
      SELECT
        f.timeLabel,
        f.createdAt,
        r.status
      FROM flyin_responses r
      JOIN flyins f ON r.flyinId = f.id
      WHERE r.userId = ?
        AND f.isClosed = 1
      ORDER BY f.createdAt DESC
      LIMIT ? OFFSET ?
      `,
      [targetUser.id, PAGE_SIZE, offset]
    );

    if (!rows.length) {
      return interaction.reply({
        content: page === 1
          ? 'No fly-in history found.'
          : 'No more history on this page.',
        flags: MessageFlags.Ephemeral
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('Fly-In History')
      .setColor('Blue')
      .setDescription(`Member: <@${targetUser.id}>\nPage: ${page}`)
      .setTimestamp();

    for (const row of rows) {
      const date = new Date(row.createdAt).toLocaleDateString('en-GB');

      embed.addFields({
        name: `${date} — ${row.timeLabel}`,
        value: statusEmoji(row.status),
        inline: false
      });
    }

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }
};
