const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('turf')
        .setDescription('Turf Commands')
        .addStringOption(option =>
            option.setName('turf')
            .setDescription('Turf Commands')
            .setRequired(true)
            .addChoices(
            {name:'Containers', value: 'containers'},
            {name:'Attack', value: 'attack'},
            {name:'Kortz', value: 'kortz'},
            {name:'Lumber', value: 'lumber'},
            {name:'Oil', value: 'oil'},
            {name:'Powerplant', value: 'powerplant'},
            {name:'Redwood', value: 'redwood'},
            )),



        async execute(interaction) {
            const category = interaction.options.getString('turf');
            switch (category) {
                case 'containers':
                    const embed = new EmbedBuilder()
                    .setColor([92, 92, 92])
                    .setTitle('Containers')
                    .setAuthor({ name: 'Attack', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' })
                    .setDescription('CONTAINERS IS GETTING HIT. PLEASE GET ON AND GET READY!')
                    .setImage('https://i.imgur.com/sS6YZV2.jpeg')
                    .setTimestamp()
                    .setFooter({ text: 'Made by: Jack'});
                interaction.reply({
                    embeds: [embed],
                    allowedMentions: { parse: ['everyone'] },
                    content: '@everyone'});
                            }

            switch(category) {
                case 'attack':
                    const embed = new EmbedBuilder()
                    .setColor([92, 92, 92])
                    .setTitle('Attack')
                    .setAuthor({ name: 'Turf', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' })
                    .setDescription('WE ARE GOING TO HIT TURFS SOON. PLEASE GET ON AND GET READY!')
                    .setImage('https://i.imgur.com/yxrSuhl.gif')
                    .setTimestamp()
                    .setFooter({ text: 'Made by: Jack'});
                interaction.reply({
                    embeds: [embed],
                    allowedMentions: { parse: ['everyone'] },
                    content: '@everyone'});
                            }
            switch(category) {
                case 'kortz':
                    const embed = new EmbedBuilder()
                    .setColor([92, 92, 92])
                    .setTitle('Kortz')
                    .setAuthor({ name: 'Attack', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' })
                    .setDescription('KORTZ IS GETTING HIT. PLEASE GET ON AND GET READY!')
                    .setImage('https://i.imgur.com/tdj9SUo.png')
                    .setTimestamp()
                    .setFooter({ text: 'Made by: Jack'});
                interaction.reply({
                    embeds: [embed],
                    allowedMentions: { parse: ['everyone'] },
                    content: '@everyone'});
                }
            switch(category) {
                case 'lumber':
                    const embed = new EmbedBuilder()
                    .setColor([92, 92, 92])
                    .setTitle('Lumber')
                    .setAuthor({ name: 'Attack', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' })
                    .setDescription('LUMBER IS GETTING HIT. PLEASE GET ON AND GET READY!')
                    .setImage('https://i.imgur.com/VDmJWRS.jpeg')
                    .setTimestamp()
                    .setFooter({ text: 'Made by: Jack'});
                interaction.reply({
                    embeds: [embed],
                    allowedMentions: { parse: ['everyone'] },
                    content: '@everyone'});
                }
            switch(category) {
                case 'oil':
                    const embed = new EmbedBuilder()
                    .setColor([92, 92, 92])
                    .setTitle('Oil')
                    .setAuthor({ name: 'Attack', iconURL: 'https://example.com/icon.png' })
                    .setDescription('OIL IS GETTING HIT. PLEASE GET ON AND GET READY!')
                    .setImage('https://i.imgur.com/tunb0Kb.png')
                    .setTimestamp()
                    .setFooter({ text: 'Made by: Jack'});
                interaction.reply({
                    embeds: [embed],
                    allowedMentions: { parse: ['everyone'] },
                    content: '@everyone'});
                }
            switch(category) {
                case 'powerplant':
                    const embed = new EmbedBuilder()
                    .setColor([92, 92, 92])
                    .setTitle('Powerplant')
                    .setAuthor({ name: 'Attack', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' })
                    .setDescription('POWERPLANT IS GETTING HIT. PLEASE GET ON AND GET READY!')
                    .setImage('https://i.imgur.com/6591zwy.png')
                    .setTimestamp()
                    .setFooter({ text: 'Made by: Jack'});
                interaction.reply({
                    embeds: [embed],
                    allowedMentions: { parse: ['everyone'] },
                    content: '@everyone'});
                }
            switch(category) {
                case 'redwood':
                    const embed = new EmbedBuilder()
                    .setColor([92, 92, 92])
                    .setTitle('Redwood')
                    .setAuthor({ name: 'Attack', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' })
                    .setDescription('REDWOOD IS GETTING HIT. PLEASE GET ON AND GET READY!')
                    .setImage('https://i.imgur.com/1xy9s37.png')
                    .setTimestamp()
                    .setFooter({ text: 'Made by: Jack'});
                interaction.reply({
                    embeds: [embed],
                    allowedMentions: { parse: ['everyone'] },
                    content: '@everyone'});
                
        }
    }
}