const sqlite3 = require('sqlite3').verbose();
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removedb')
    .setDescription('Remove someone from the db.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove from the db.')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    if (!interaction.member.roles.cache.some(role => role.name === 'Discord-Admin')) {
      return interaction.reply('You do not have permission to use this command.');
    }

    const db = new sqlite3.Database('database.db');

    db.run('DELETE FROM guilds WHERE userId = ?', user.id, (err) => {
      if (err) {
        console.error(`Error removing member ${user.id} from the table: ${err}`);
        return;
      }
      console.log(`Member ${user.id} has been removed from the table.`);
    });

    db.close();

    await interaction.reply('Member has been removed from the table.');
  },
};
