const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shuts down the bot.'),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(role => role.name === 'Discord-Admin')) {
            return interaction.reply('You do not have permission to use this command.');
          
        } else {
            await interaction.reply('Shutting down...');
            process.exit();
        }
    },
};