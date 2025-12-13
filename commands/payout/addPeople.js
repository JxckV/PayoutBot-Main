const sqlite3 = require('sqlite3').verbose();
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adddb')
        .setDescription('Add people to the db.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to add to the db.')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!interaction.member.roles.cache.some(role => role.name === 'Discord-Admin')) {
            return interaction.reply('You do not have permission to use this command.');
        }

        const db = new sqlite3.Database('database.db');

        db.get('SELECT COUNT(userId) AS count FROM guilds', (countErr, countRow) => {
            if (countErr) {
                console.error(`Error counting the database entries: ${countErr}`);
                return interaction.reply('An error occurred while accessing the database.');
            }


            db.get('SELECT userId FROM guilds WHERE userId = ?', [user.id], (err, row) => {
                if (err) {
                    console.error(`Error querying the database: ${err}`);
                    return interaction.reply('An error occurred while accessing the database.');
                }

                if (row) {
                   
                    return interaction.reply(`Member ${user.id} is already in the database.`);
                }

                db.run('INSERT INTO guilds (userId) VALUES (?)', [user.id], (insertErr) => {
                    if (insertErr) {
                        console.error(`Error adding member ${user.id} to the table: ${insertErr}`);
                        return interaction.reply(`An error occurred while adding member ${user.id} to the table.`);
                    }
                    
                    interaction.reply(`Member ${user.id} has been added to the table.`);
                });
            });
        });

        db.close();
    },
};