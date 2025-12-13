const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setvalue')
    .setDescription('Set a specific value for a person.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to set the value for.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Select an item to set.')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount to set.')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const item = interaction.options.getString('item');
    const amount = interaction.options.getInteger('amount');

    console.log('User:', user);
    console.log('Item:', item);
    console.log('Amount:', amount);

    const db = new sqlite3.Database('database.db');

    const userId = user.id;
    db.get('SELECT * FROM guilds WHERE userId = ?', userId, (err, row) => {
      if (err) {
        console.error('Error accessing database:', err);
        interaction.reply('An error occurred while accessing the database.');
        return;
      }

      if (!row) {
        interaction.reply('Guild not found.');
        return;
      }

      const guild = row;

      const oldValue = guild[item] || 0;
      const newValue = amount;

      const embed = new EmbedBuilder()
        .setColor([52, 119, 235])
        .setTitle(`Set ${item} to ${newValue} for ${user.username}`)
        .setDescription(`Old value: ${oldValue}, New value: ${newValue}`)
        .setAuthor({ name: 'Pyraxx Admin Values', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' });

      interaction.reply({ embeds: [embed] });

      guild[item] = newValue;

      db.run(
        `UPDATE guilds SET ${item} = ? WHERE userId = ?`,
        [newValue, userId],
        (err) => {
          if (err) {
            console.error('Error updating database:', err);
          }
        }
      );

      db.close();
    });
  },

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = [
      'lithPrecursors',
      'phosPrecursors',
      'barrelsPrecursors',
      'procainePrecursors',
      'cocaleafsPrecursors',
      'refinedPrecursors',

      'mackerelFish',
      'salmonFish',
      'bassFish',
      'groupFish',
      'pikeFish',
      'tunaFish',
      'dolphineFish',
      'stingrayFish',
      'stingrayTailFish',

      'turfsCapped',
      'laundering',
      'drugsSold',
      'ouncesCut',
      'cokeMade',
      'methMade',
      'armourMade',
      'refiningBarrels',
      'cocaPasteMade',
      'atmsMade',
      'rfMade',
      'jewelryCrafted',
      'gunpartsMade',
      'sheetsMade',
      'wireCrafted',
      'fishCooked',
      'premiumProcessed',
      'regularProcessed',
      'activeKos',
      'procaineProcessed',
      'sojoGrown',
      'gangActivity',
      'barteringMission',

      'goldGems',
      'opalGems',
      'emeraldGems',
      'rubyGems',
      'diamondGems',
      'blueDiamondGems',
      'pinkDiamondGems',
      'tanzaniteGems',
      'larimarGems',
      'topazGems',
      'copperGems',
      'copperWireGems',
      'ironGems',

      'screwsGun',
      'pistolBodiesGun',
      'gunBarrelsGun',
      'gunStockGun',
      'gunTriggerGun',
      'springGun',
      'heavyGunBarrelGun',
      'smgBodyGun',
      'rifleBodyGun',

      'hempSupplies',
      'metalSheetsSupplies',
      'paydirtSupplies',
      'premiumSupplies',
      'thermalsSupplies',
      'phoneSupplies',
      'radioSupplies',
      'gangSkinning',
      'chardWine',
      'pinotWine',
      'zinfanWine',
      'sauvignonWine',
      'cabernetWine',
      'fermentingWine',
    ];

    const filtered = choices.filter(choice =>
      choice.toLowerCase().includes(focusedValue.toLowerCase())
    );
    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: choice })).slice(0, 25)
    );
  }
};