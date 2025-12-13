const { SlashCommandBuilder } = require('discord.js');

let timerActive = false; // Variable to track if a timer is already active

module.exports = {
    data: new SlashCommandBuilder()
        .setName('barrels')
        .setDescription('Starts barrels timer.'),
    async execute(interaction) {
        if (timerActive) {
            await interaction.reply({content:'A timer is already active!' , ephemeral: true});
            return;
        }

        await interaction.reply('Barrels timer started!');
        timerActive = true;

        // 2700000 = 45 minutes
        const timerDuration = 2700000;

        setTimeout(() => {
            interaction.channel.send(`${interaction.user} Barrels are almost ready to be picked up!`);
            timerActive = false; // Reset the timerActive variable after the timer ends
        }, timerDuration);
    },
};