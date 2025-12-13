const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Load commands with DEBUG output
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (!command.data || !command.execute) {
      console.warn(
        `[WARNING] The command at ${filePath} is missing "data" or "execute". Skipping.`
      );
      continue;
    }

    try {
      commands.push(command.data.toJSON());
      console.log(`✓ Loaded command: ${command.data.name} (${file})`);
    } catch (err) {
      console.error(`✗ FAILED to load command file: ${filePath}`);
      throw err; // THIS WILL SHOW THE REAL OFFENDER
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error('DEPLOY FAILED:', error);
  }
})();