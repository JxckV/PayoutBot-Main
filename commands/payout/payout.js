const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('payout')
    .setDescription('Add items to the payout.')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('Select an item to add.')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of the item to add.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const item = interaction.options.getString('item');

    console.log('Item:', item);
    console.log('Amount:', amount);

    const db = new sqlite3.Database('database.db');

    const userId = interaction.member.user.id;
    db.get('SELECT * FROM guilds WHERE userId = ?', [userId], (err, row) => {
      if (err) {
        console.error('Error accessing database:', err);
        interaction.reply('An error occurred while accessing the database.');
        return;
      }

      if (!row) {
        interaction.reply('Member is not in the database.');
        return;
      }

      const guild = row;

      const oldValue = guild[item] || 0;
      const newValue = oldValue + amount;

      const embed = new EmbedBuilder()
        .setColor([52, 119, 235])
        .setTitle(`Added ${amount} ${item} to the payout.`)
        .setAuthor({ name: 'Pyraxx Payouts ', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' })
        .setDescription(`Total amount of ${item}: ${newValue}`);

      interaction.reply({ embeds: [embed] });

      guild[item] = newValue;

      db.run(
        `UPDATE guilds SET [${item}] = ? WHERE userId = ?`,
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
      { name: "Lithium Added", value: 'lithPrecursors' },
      { name: "Phos Added", value: 'phosPrecursors' },
      { name: "Barrels Added", value: 'barrelsPrecursors' },
      { name: "Procaine Added", value: 'procainePrecursors' },
      { name: "Coca Leafs Added", value: 'cocaleafsPrecursors' },
      { name: "Refined Added", value: 'refinedPrecursors' },

      { name: "Mackerel Added", value: 'mackerelFish' },
      { name: "Salmon Added", value: 'salmonFish' },
      { name: "Bass Added", value: 'bassFish' },
      { name: "Grouper Added", value: 'groupFish' },
      { name: "Pike Added", value: 'pikeFish' },
      { name: "Tuna Added", value: 'tunaFish' },
      { name: "Dolphine Fish Added", value: 'dolphineFish' },
      { name: "Stingray Fish Added", value: 'stingrayFish' },
      { name: "Stingray Tail Fish Added", value: 'stingrayTailFish' },

      { name: "Turfs Capped", value: 'turfsCapped' },
      { name: "Amount Laundered", value: 'laundering' },
      { name: "Drugs Sold", value: 'drugsSold' },
      { name: "Ounces Cut", value: 'ouncesCut' },
      { name: "Coke Made", value: 'cokeMade' },
      { name: "Meth Made", value: 'methMade' },
      { name: "Armour Made", value: 'armourMade' },
      { name: "Barrels Refined", value: 'refiningBarrels' },
      { name: "Coca Paste Made", value: 'cocaPasteMade' },
      { name: "ATMs Made", value: 'atmsMade' },
      { name: "RF Scanner Made", value: 'rfMade' },
      { name: "Jewelry Crafted", value: 'jewelryCrafted' },
      { name: "Gun Parts Made", value: 'gunpartsMade' },
      { name: "Metal Sheets Made", value: 'sheetsMade' },
      { name: "Wire Crafted", value: 'wireCrafted' },
      { name: "Fish Cooked", value: 'fishCooked' },
      { name: "Premium Paydirt Processed", value: 'premiumProcessed' },
      { name: "Paydirt Processed", value: 'regularProcessed' },
      { name: "KOS Attended", value: 'activeKos' },
      { name: "Procaine Processed", value: 'procaineProcessed' },
      { name: "Sojo Grown", value: 'sojoGrown' },
      { name: "Gang Activity", value: 'gangActivity' },
      { name: "Bartering Mission", value: 'barteringMission' },

      { name: "Gold Added", value: 'goldGems' },
      { name: "Black Opals Added", value: 'opalGems' },
      { name: "Emeralds Added", value: 'emeraldGems' },
      { name: "Rubys Added", value: 'rubyGems' },
      { name: "Diamonds Added", value: 'diamondGems' },
      { name: "Blue Diamonds Added", value: 'blueDiamondGems' },
      { name: "Pink Diamonds Added", value: 'pinkDiamondGems' },
      { name: "Tanzanite Added", value: 'tanzaniteGems' },
      { name: "Larimar Added", value: 'larimarGems' },
      { name: "Topaz Added", value: 'topazGems' },
      { name: "Copper Added", value: 'copperGems' },
      { name: "Copper Wire Added", value: 'copperWireGems' },
      { name: "Iron Added", value: 'ironGems' },

      { name: "Screws Added", value: 'screwsGun' },
      { name: "Pistol Bodies Added", value: 'pistolBodiesGun' },
      { name: "Gun Barrels Added", value: 'gunBarrelsGun' },
      { name: "Gun Stock Added", value: 'gunStockGun' },
      { name: "Gun Trigger Added", value: 'gunTriggerGun' },
      { name: "Springs Added", value: 'springGun' },
      { name: "Heavy Barrels Added", value: 'heavyGunBarrelGun' },
      { name: "SMG Bodies Added", value: 'smgBodyGun' },
      { name: "Rifle Bodies Added", value: 'rifleBodyGun' },

      { name: "Hemp Added", value: 'hempSupplies' },
      { name: "Metal Sheets Added", value: 'metalSheetsSupplies' },
      { name: "Paydirt Added", value: 'paydirtSupplies' },
      { name: "Premium Paydirt Added", value: 'premiumSupplies' },
      { name: "Thermals Added", value: 'thermalsSupplies' },
      { name: "Phones Added", value: 'phoneSupplies' },
      { name: "Radios Added", value: 'radioSupplies' },
      { name: "Meat Skinned", value: 'gangSkinning' },

      { name: "Chardonnay Added", value: 'chardWine' },
      { name: "Pinot Noir Added", value: 'pinotWine' },
      { name: "Zinfandel Added", value: 'zinfanWine' },
      { name: "Sauvignon Added", value: 'sauvignonWine' },
      { name: "Cabernet Added", value: 'cabernetWine' },
      { name: "Fermenting Added", value: 'fermentingWine' },
    ];

    const filtered = choices.filter(choice =>
      choice.name.toLowerCase().includes(focusedValue.toLowerCase())
    );
    await interaction.respond(
      filtered.map(choice => ({ name: choice.name, value: choice.value })).slice(0, 25)
    );
  }
};