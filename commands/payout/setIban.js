const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setiban')
        .setDescription('Set your IBAN.')
        .addStringOption(option =>
            option.setName('iban')
                .setDescription('Your IBAN.')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.user;
        const iban = interaction.options.getString('iban');

        const db = new sqlite3.Database('database.db');

        db.get('SELECT userId FROM guilds WHERE userId = ?', [user.id], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                db.close();
                return interaction.reply('An error occurred while accessing the database.');
            }

            if (!row) {
                db.close();
                return interaction.reply('You are not registered in the database.');
            }

            db.run('UPDATE guilds SET userIBAN = ? WHERE userId = ?', [iban, user.id], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating IBAN:', updateErr);
                    db.close();
                    return interaction.reply('An error occurred while setting your IBAN.');
                }

                interaction.reply(`Your IBAN has been set to ${iban}.`);
                db.close();
            });
        });
    },
};