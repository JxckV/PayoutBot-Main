const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('totalpayouts')
    .setDescription('Show the total payouts of all guild members.'),
 
  async execute(interaction) {
    if (!interaction.member.roles.cache.some(role => role.name === 'Discord-Admin')) {
      return interaction.reply('You do not have permission to use this command.');
    }
 
    const db = new sqlite3.Database('database.db', sqlite3.OPEN_READONLY, err => {
      if (err) {
        console.error('Error opening database:', err);
        return;
      }
    });
 
    const guild = interaction.guild;
    const members = await guild.members.fetch();
    const userIdToNicknameMap = members.reduce((map, member) => {
      map[member.user.id] = member.nickname ?? member.user.username;
      return map;
    }, {});
 
    db.all('SELECT * FROM guilds', async (err, rows) => {
      if (err) {
        console.error('Error retrieving guild members:', err);
        db.close();
        return interaction.reply('An error occurred while retrieving guild members.');
      }
 
      const totalGuildPoints = rows.reduce((acc, row) => {
        return (
          acc +
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
          (row.chardWine ?? 0) * 44 +
          (row.pinotWine ?? 0) * 52 +
          (row.zinfanWine ?? 0) * 66 +
          (row.sauvignonWine ?? 0) * 82 +
          (row.cabernetWine ?? 0) * 104 +
          (row.fermentingWine ?? 0) * 458 +
          (row.salmonFish ?? 0) * 400 +
          (row.groupFish ?? 0) * 800 +
          (row.dolphinFish ?? 0) * 1000 +
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
          (row.gangSkinning ?? 0 ) * 500 +
          (row.xpDb ?? 0) * 100
        );
      }, 0);
 
      const payouts = rows.map(row => {
        const nickname = userIdToNicknameMap[row.userId] ?? 'Unknown';
 
        const totalPoints =
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
        (row.chardWine ?? 0) * 44 +
        (row.pinotWine ?? 0) * 52 +
        (row.zinfanWine ?? 0) * 66 +
        (row.sauvignonWine ?? 0) * 82 +
        (row.cabernetWine ?? 0) * 104 +
        (row.fermentingWine ?? 0) * 458 +
        (row.salmonFish ?? 0) * 400 +
        (row.groupFish ?? 0) * 800 +
        (row.dolphinFish ?? 0) * 1000 +
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
        (row.gangSkinning ??0 ) * 500 +
        (row.xpDb ?? 0) * 100;
 
        const userPercentage = totalGuildPoints > 0 
          ? ((totalPoints / totalGuildPoints) * 100).toFixed(2) 
          : 0;
 
        const totalPayout = Math.floor((userPercentage / 100) * 5_000_000).toLocaleString();
        const totalPayoutFormatted = totalPayout.toLocaleString(); 
 
        const userIBAN = row.userIBAN ?? 'Not Set';
 
        return {
          nickname: nickname,
          iban: userIBAN,
          payout: totalPayoutFormatted,
          laundering: row.laundering ?? 0,
          procaineProcessed: row.procaineProcessed ?? 0,
          turfsCapped: row.turfsCapped ?? 0,
          drugsSold: row.drugsSold ?? 0,
          ouncesCut: row.ouncesCut ?? 0,
          cokeMade: row.cokeMade ?? 0,
          methMade: row.methMade ?? 0,
          armourMade: row.armourMade ?? 0,
          refiningBarrels: row.refiningBarrels ?? 0,
          cocaPasteMade: row.cocaPasteMade ?? 0,
          atmsMade: row.atmsMade ?? 0,
          rfMade: row.rfMade ?? 0,
          jewelryCrafted: row.jewelryCrafted ?? 0,
          gunpartsMade: row.gunpartsMade ?? 0,
          sheetsMade: row.sheetsMade ?? 0,
          wireCrafted: row.wireCrafted ?? 0,
          fishCooked: row.fishCooked ?? 0,
          premiumProcessed: row.premiumProcessed ?? 0,
          regularProcessed: row.regularProcessed ?? 0,
          hempSupplies: row.hempSupplies ?? 0,
          metalSheetsSupplies: row.metalSheetsSupplies ?? 0,
          paydirtSupplies: row.paydirtSupplies ?? 0,
          premiumSupplies: row.premiumSupplies ?? 0,
          thermalsSupplies: row.thermalsSupplies ?? 0,
          phoneSupplies: row.phoneSupplies ?? 0,
          radioSupplies: row.radioSupplies ?? 0,
          lithPrecursors: row.lithPrecursors ?? 0,
          phosPrecursors: row.phosPrecursors ?? 0,
          barrelsPrecursors: row.barrelsPrecursors ?? 0,
          procainePrecursors: row.procainePrecursors ?? 0,
          cocaleafsPrecursors: row.cocaleafsPrecursors ?? 0,
          refinedPrecursors: row.refinedPrecursors ?? 0,
          goldGems: row.goldGems ?? 0,
          opalGems: row.opalGems ?? 0,
          emeraldGems: row.emeraldGems ?? 0,
          rubyGems: row.rubyGems ?? 0,
          diamondGems: row.diamondGems ?? 0,
          blueDiamondGems: row.blueDiamondGems ?? 0,
          pinkDiamondGems: row.pinkDiamondGems ?? 0,
          tanzaniteGems: row.tanzaniteGems ?? 0,
          larimarGems: row.larimarGems ?? 0,
          topazGems: row.topazGems ?? 0,
          copperGems: row.copperGems ?? 0,
          copperWireGems: row.copperWireGems ?? 0,
          ironGems: row.ironGems ?? 0,
          screwsGun: row.screwsGun ?? 0,
          pistolBodiesGun: row.pistolBodiesGun ?? 0,
          gunBarrelsGun: row.gunBarrelsGun ?? 0,
          gunStockGun: row.gunStockGun ?? 0,
          gunTriggerGun: row.gunTriggerGun ?? 0,
          springGun: row.springGun ?? 0,
          heavyGunBarrelGun: row.heavyGunBarrelGun ?? 0,
          smgBodyGun: row.smgBodyGun ?? 0,
          rifleBodyGun: row.rifleBodyGun ?? 0,
          chardWine: row.chardWine ?? 0,
          pinotWine: row.pinotWine ?? 0,
          zinfanWine: row.zinfanWine ?? 0,
          sauvignonWine: row.sauvignonWine ?? 0,
          cabernetWine: row.cabernetWine ?? 0,
          fermentingWine: row.fermentingWine ?? 0,
          salmonFish: row.salmonFish ?? 0,
          groupFish: row.groupFish ?? 0,
          dolphinFish: row.dolphinFish ?? 0,
          activeKos: row.activeKos ?? 0,
          gangActivity: row.gangActivity ?? 0,
          sojoGrown: row.sojoGrown ?? 0,
          mackerelFish: row.mackerelFish ?? 0,
          bassFish: row.bassFish ?? 0,
          pikeFish: row.pikeFish ?? 0,
          tunaFish: row.tunaFish ?? 0,
          stingrayfish: row.stingrayfish ?? 0,
          stingrayTailFish: row.stingrayTailFish ?? 0,
          khalifaKush: row.khalifaKush ?? 0,
          sourDiesel: row.sourDiesel ?? 0,
          whiteWidow: row.whiteWidow ?? 0,
          pineExpress: row.pineExpress ?? 0,
          barteringMission: row.barteringMission ?? 0,
          xpDb : row.xpDb ?? 0
        };
      });
 
      payouts.sort((a, b) => b.payout.replace(/,/g, '') - a.payout.replace(/,/g, '')); // remove commas before sorting
 
      db.close();
 
      // Define the output directory
      const outputDir = path.join(__dirname, '../../payouts');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
 
      const csvHeaders = Object.keys(payouts[0]).join(',');
      const csvRows = payouts.map(row => {
        return Object.values(row).map(value => `"${value}"`).join(',');
      });
      const csvContent = [csvHeaders, ...csvRows].join('\n');
 
      const filePath = path.join(outputDir, `total_payouts_${new Date().toISOString().split('T')[0]}.csv`);
      fs.writeFileSync(filePath, csvContent);
 
      const attachment = new AttachmentBuilder(filePath, { name: `total_payouts_${new Date().toISOString().split('T')[0]}.csv` });
 
      let currentPage = 0;
      const itemsPerPage = 10;
      const totalPages = Math.ceil(payouts.length / itemsPerPage);
 
      const getPageEmbed = page => {
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const currentItems = payouts.slice(start, end);
 
        const embed = new EmbedBuilder()
          .setColor([255, 255, 255])
          .setTitle(`Total Payouts - Page ${page + 1} of ${totalPages}`)
          .setAuthor({ name: 'Pyraxx Payout Bot', iconURL: 'https://cdn.discordapp.com/avatars/1292953520252780615/f4ca3c20dc4dd5902d15ab3cdf8f670c?size=256' });
 
        currentItems.forEach(payout => {
          embed.addFields(
            { name: `${payout.nickname}'s Payout:`, value: `IBAN: ${payout.iban}\nPayout: ${payout.payout}` }
          );
        });
 
        return embed;
      };
 
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === totalPages - 1)
        );
 
      await interaction.reply({ embeds: [getPageEmbed(currentPage)], components: [row], files: [attachment], ephemeral: true });
 
      const filter = i => ['previous', 'next'].includes(i.customId) && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1200000 });
 
      collector.on('collect', async i => {
        if (i.customId === 'next' && currentPage < totalPages - 1) {
          currentPage++;
        } else if (i.customId === 'previous' && currentPage > 0) {
          currentPage--;
        }
 
        await i.update({
          embeds: [getPageEmbed(currentPage)],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('previous')
                  .setLabel('Previous')
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPage === 0),
                new ButtonBuilder()
                  .setCustomId('next')
                  .setLabel('Next')
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(currentPage === totalPages - 1)
              )
          ],
          ephemeral: true
        });
      });
    });
  },
};