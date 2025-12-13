const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mypayout')
    .setDescription('Show your total payout based on guild contributions.'),

  async execute(interaction) {
    const db = new sqlite3.Database('database.db', sqlite3.OPEN_READONLY, err => {
      if (err) {
        console.error('Error opening database:', err);
        return interaction.reply('An error occurred while accessing the database.');
      }
    });

    db.all('SELECT * FROM guilds', (err, rows) => {
      if (err) {
        console.error('Error retrieving data:', err);
        db.close();
        return interaction.reply('An error occurred while retrieving data.');
      }

      const totalGuildPoints = rows.reduce((acc, row) => acc + calculateTotalPoints(row), 0);
      const userRow = rows.find(row => row.userId === interaction.user.id);

      if (!userRow) {
        db.close();
        return interaction.reply('No data found for your user.');
      }

      const userPoints = calculateTotalPoints(userRow);
      const userPercentage = totalGuildPoints > 0 ? ((userPoints / totalGuildPoints) * 100) : 0;
      const totalPayout = Math.floor((userPercentage / 100) * 10_000_000).toLocaleString();
      const totalPayoutFormatted = totalPayout.toLocaleString(); 

      const user = interaction.options.getUser('user');

      if (!interaction.member.roles.cache.some(role => role.name === 'Discord-Admin')) {
          return interaction.reply('You do not have permission to use this command.');
      }
      const embed = new EmbedBuilder()
        .setColor([52, 119, 235])
        .setTitle('Your Total Payout')
        .setAuthor({ name: 'Pyraxx Payout Bot', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' })
        .addFields(
          { name: 'Your Contribution Points:', value: `${userPoints.toLocaleString()}` },
          { name: 'Your Contribution Percentage:', value: `${userPercentage.toFixed(2)}%` },
          { name: 'Payout:', value: `$${totalPayoutFormatted}` },
          { name: 'IBAN:', value: `${userRow.userIBAN ?? 'Not Set'}` }
        );


      db.close();
      return interaction.reply({ embeds: [embed] });
    });
  }
};

function calculateTotalPoints(row) {
  return (
    (row.laundering ?? 0) * 0.3 +
    (row.procaineProcessed ?? 0) * 1500 +
    (row.turfsCapped ?? 0) * 50000 +
    (row.drugsSold ?? 0) * 450 +
    (row.ouncesCut ?? 0) * 300 +
    (row.cokeMade ?? 0) * 5000 +
    (row.methMade ?? 0) * 8000 +
    (row.armourMade ?? 0) * 1000 +
    (row.refiningBarrels ?? 0) * 2000 +
    (row.cocaPasteMade ?? 0) * 2000 +
    (row.atmsMade ?? 0) * 1250 +
    (row.rfMade ?? 0) * 500 +
    (row.jewelryCrafted ?? 0) * 1000 +
    (row.gunpartsMade ?? 0) * 1000 +
    (row.sheetsMade ?? 0) * 200 +
    (row.wireCrafted ?? 0) * 200 +
    (row.fishCooked ?? 0) * 500 +
    (row.premiumProcessed ?? 0) * 1000 +
    (row.regularProcessed ?? 0) * 500 +
    (row.hempSupplies ?? 0) * 150 +
    (row.metalSheetsSupplies ?? 0) * 400 +
    (row.paydirtSupplies ?? 0) * 100 +
    (row.premiumSupplies ?? 0) * 500 +
    (row.thermalsSupplies ?? 0) * 100 +
    (row.phoneSupplies ?? 0) * 100 +
    (row.radioSupplies ?? 0) * 100 +
    (row.lithPrecursors ?? 0) * 2200 +
    (row.phosPrecursors ?? 0) * 600 +
    (row.barrelsPrecursors ?? 0) * 1500 +
    (row.procainePrecursors ?? 0) * 2000 +
    (row.cocaleafsPrecursors ?? 0) * 150 +
    (row.refinedPrecursors ?? 0) * 4500 +
    (row.goldGems ?? 0) * 30 +
    (row.opalGems ?? 0) * 50 +
    (row.emeraldGems ?? 0) * 60 +
    (row.rubyGems ?? 0) * 70 +
    (row.diamondGems ?? 0) * 80 +
    (row.blueDiamondGems ?? 0) * 250 +
    (row.pinkDiamondGems ?? 0) * 300 +
    (row.tanzaniteGems ?? 0) * 30 +
    (row.larimarGems ?? 0) * 20 +
    (row.topazGems ?? 0) * 40 +
    (row.copperGems ?? 0) * 200 +
    (row.copperWireGems ?? 0) * 40 +
    (row.ironGems ?? 0) * 150 +
    (row.screwsGun ?? 0) * 500 +
    (row.pistolBodiesGun ?? 0) * 500 +
    (row.gunBarrelsGun ?? 0) * 500 +
    (row.gunStockGun ?? 0) * 500 +
    (row.gunTriggerGun ?? 0) * 500 +
    (row.springGun ?? 0) * 500 +
    (row.heavyGunBarrelGun ?? 0) * 500 +
    (row.smgBodyGun ?? 0) * 5000 +
    (row.rifleBodyGun ?? 0) * 5000 +
    (row.chardWine ?? 0) * 22 +
    (row.pinotWine ?? 0) * 26 +
    (row.zinfanWine ?? 0) * 33 +
    (row.sauvignonWine ?? 0) * 41 +
    (row.cabernetWine ?? 0) * 52 +
    (row.fermentingWine ?? 0) * 229 +
    (row.salmonFish ?? 0) * 150 +
    (row.groupFish ?? 0) * 150 +
    (row.dolphinFish ?? 0) * 150 +
    (row.activeKos ?? 0) * 15000 +
    (row.gangActivity ?? 0) * 50000 +
    (row.sojoGrown ?? 0) * 2500 +
    (row.mackerelFish ?? 0) * 200 +
    (row.bassFish ?? 0) * 600 +
    (row.pikeFish ?? 0) * 800 +
    (row.tunaFish ?? 0) * 400 +
    (row.stingrayfish ?? 0) * 500 +
    (row.stingrayTailFish ?? 0) * 1000 +
    (row.khalifaKush ?? 0) * 27.5 +
    (row.sourDiesel ?? 0) * 22.5 +
    (row.whiteWidow ?? 0) * 20 +
    (row.pineExpress ?? 0) * 25 +
    (row.barteringMission ?? 0) * 3000 +
    (row.xpDb ?? 0) * 100
  );
}