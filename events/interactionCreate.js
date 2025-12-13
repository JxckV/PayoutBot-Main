const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Handle autocomplete interactions
		if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found for autocomplete.`);
				return;
			}

			try {
				if (command.autocomplete) {
					await command.autocomplete(interaction);
				}
			} catch (error) {
				console.error(`Error handling autocomplete for ${interaction.commandName}`);
				console.error(error);
			}
			return; // Stop further processing since this was an autocomplete interaction
		}

		// Handle chat input commands
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}
	},
};
