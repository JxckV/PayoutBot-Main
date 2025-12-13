const { REST, Routes } = require('discord.js');
const TOKEN = 'BOT TOKEN HERE';
const CLIENT_ID = 'BOT CLIENT ID HERE';

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Deleting all commands...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
        console.log('Commands deleted!');
    } catch (error) {
        console.error(error);
    }
})();