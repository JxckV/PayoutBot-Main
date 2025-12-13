const sqlite3 = require('sqlite3').verbose();
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetdb')
        .setDescription('Resets the database.'),
async execute(interaction) {


    if (!interaction.member.roles.cache.some(role => role.name === 'Discord-Admin')) {
        return interaction.reply('You do not have permission to use this command.');
      }

    
    const db = new sqlite3.Database('database.db');    
    
    db.run(`
    UPDATE guilds 
    SET 
      laundering = 0,
      drugsSold = 0,
      ouncesCut = 0,
      cokeMade = 0,
      methMade = 0,
      armourMade = 0,
      refiningBarrels = 0,
      cocaPasteMade = 0,
      atmsMade = 0,
      rfMade = 0,
      jewelryCrafted = 0,
      gunpartsMade = 0,
      sheetsMade = 0,
      wireCrafted = 0,
      fishCooked = 0,
      premiumProcessed = 0,
      regularProcessed = 0,
      hempSupplies = 0,
      metalSheetsSupplies = 0,
      paydirtSupplies = 0,
      premiumSupplies = 0,
      thermalsSupplies = 0,
      phoneSupplies = 0,
      radioSupplies = 0,
      lithPrecursors = 0,
      phosPrecursors = 0,
      barrelsPrecursors = 0,
      procainePrecursors = 0,
      cocaleafsPrecursors = 0,
      refinedPrecursors = 0,
      goldGems = 0,
      opalGems = 0,
      emeraldGems = 0,
      rubyGems = 0,
      diamondGems = 0,
      blueDiamondGems = 0,
      pinkDiamondGems = 0,
      tanzaniteGems = 0,
      larimarGems = 0,
      topazGems = 0,
      copperGems = 0,
      copperWireGems = 0,
      ironGems = 0,
      screwsGun = 0,
      pistolBodiesGun = 0,
      gunBarrelsGun = 0,
      gunStockGun = 0,
      gunTriggerGun = 0,
      springGun = 0,
      heavyGunBarrelGun = 0,
      smgBodyGun = 0,
      rifleBodyGun = 0,
      chardWine = 0,
      pinotWine = 0,
      zinfanWine = 0,
      sauvignonWine = 0,
      cabernetWine = 0,
      fermentingWine = 0,
      salmonFish = 0,
      groupFish = 0,
      dolphineFish = 0,
      turfsCapped = 0,
      gangActivity = 0,
      activeKos = 0,
      khalifaKush = 0,
      sourDiesel = 0,
      sojoGrown = 0,
      procaineProcessed = 0,
      whiteWidow = 0,
      pineExpress = 0,
      mackerelFish = 0,
      bassFish = 0,
      tunaFish = 0,
      stingrayFish = 0,
      stingrayTailFish = 0,
      pikeFish = 0,
      barteringMission = 0;
      



  `, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Stats reset to zero.');
  });
  

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
    }
    );
    interaction.reply('Database reset.');

}
};
