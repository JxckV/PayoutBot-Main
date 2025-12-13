const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const path = require('node:path');

const fly = require(path.join(__dirname, 'flyintimedevelopment.js'));
const ADMIN_ROLE_NAME = 'Discord-Admin';

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    fly.db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    fly.db.run(sql, params, err => err ? reject(err) : resolve());
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flyinconfig')
    .setDescription('Configure fly-in scheduler and auto-close settings')

    // VIEW
    .addSubcommand(sc =>
      sc
        .setName('view')
        .setDescription('View current fly-in configuration')
    )

    // SET
    .addSubcommand(sc =>
      sc
        .setName('set')
        .setDescription('Update fly-in configuration')

        .addBooleanOption(o =>
          o
            .setName('daily_enabled')
            .setDescription('Enable or disable daily fly-ins')
        )

        .addStringOption(o =>
          o
            .setName('daily_post_time')
            .setDescription('Time to post daily fly-ins (HH:MM, 24h)')
        )

        .addStringOption(o =>
          o
            .setName('daily_times')
            .setDescription('Comma-separated list: 7PM,8PM,9PM')
        )

        .addIntegerOption(o =>
          o
            .setName('auto_close_minutes')
            .setDescription('Minutes before a fly-in automatically closes')
            .setMinValue(5)
        )

        // ✅ MISSING OPTION (THIS FIXES DEPLOY)
        .addStringOption(o =>
          o
            .setName('timezone')
            .setDescription('IANA timezone (e.g. Europe/London, Europe/Berlin)')
        )
    ),

  async execute(interaction) {
    if (!interaction.member.roles.cache.some(r => r.name === ADMIN_ROLE_NAME)) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        flags: MessageFlags.Ephemeral
      });
    }

    const guildId = interaction.guild.id;
    const sub = interaction.options.getSubcommand();

    await dbRun(
      `INSERT OR IGNORE INTO flyin_config (guildId) VALUES (?)`,
      [guildId]
    );

    const config = await dbGet(
      `SELECT * FROM flyin_config WHERE guildId = ?`,
      [guildId]
    );

    if (sub === 'view') {
      const embed = new EmbedBuilder()
        .setTitle('Fly-In Configuration')
        .addFields(
          { name: 'Daily Enabled', value: config.dailyEnabled ? 'Yes' : 'No' },
          { name: 'Daily Post Time', value: String(config.dailyPostTime) },
          { name: 'Daily Times', value: String(config.dailyTimes) },
          { name: 'Timezone', value: String(config.timezone || 'Europe/London') },
          { name: 'Auto-Close Minutes', value: String(config.autoCloseMinutes) }
        )
        .setColor('Blue');

      return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

    // SET
    const updates = {
      dailyEnabled: interaction.options.getBoolean('daily_enabled'),
      dailyPostTime: interaction.options.getString('daily_post_time'),
      dailyTimes: interaction.options.getString('daily_times'),
      autoCloseMinutes: interaction.options.getInteger('auto_close_minutes'),
      timezone: interaction.options.getString('timezone')
    };

    const fields = [];
    const values = [];

    for (const [key, val] of Object.entries(updates)) {
      if (val !== null && val !== undefined) {
        fields.push(`${key} = ?`);
        values.push(val);
      }
    }

    if (!fields.length) {
      return interaction.reply({
        content: 'No values provided to update.',
        flags: MessageFlags.Ephemeral
      });
    }

    values.push(guildId);

    await dbRun(
      `UPDATE flyin_config SET ${fields.join(', ')} WHERE guildId = ?`,
      values
    );

    return interaction.reply({
      content: 'Fly-in configuration updated successfully.',
      flags: MessageFlags.Ephemeral
    });
  }
};