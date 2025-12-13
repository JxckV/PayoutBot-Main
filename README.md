To change the value of the payout you need to change two files. Mypayout.js and totalpayout.js. const totalPayout = Math.floor((userPercentage / 100) * 10_000_000).toLocaleString(); This line needs to be changed to what ever value you want it to be.

Alot of this is just spaghetti code that I threw into chatgpt to fix my issues. Idk how any of the database shit works as im awful with sql.

Theres a few libraries you'll need to install to make this work. I think the main ones are sqlite3 and discordjs(obvisouly). You'll also need to change the color/name of each output to match the name of your gang. You'll need to figure out how to launch it on your own.

Be sure to add a role named: "Discord-Admin" to run any of the commands that make changes etc.


edit* I've added the config.json file. If you want to add a command to change the values of every item in there feel free. It's easy to do I'm just lazy.

TO EDIT THE VALUES OF THE PAYOUT CHANGE THE BELOW:
I've already done 3 for you. I didn't want to share the values that other gangs are currently using as they would just figure out what makes the most and do that so cba. I reccomend delete /mypayout so people don't abuse the payout system and learning what works best.

      const totalGuildPoints = rows.reduce((acc, row) => {
        return (
          acc +
          (row.laundering ?? 0) * 1.3 +
          (row.procaineProcessed ?? 0) * 1500 +
          (row.turfsCapped ?? 0) * 50000 +
          (row.drugsSold ?? 0) * 0 +
          (row.ouncesCut ?? 0) * 0 +
          (row.cokeMade ?? 0) * 0 +
          (row.methMade ?? 0) * 0 +
          (row.armourMade ?? 0) * 0 +
          (row.refiningBarrels ?? 0) * 0 +
          (row.cocaPasteMade ?? 0) * 0 +
          (row.atmsMade ?? 0) * 0 +
          (row.rfMade ?? 0) * 0 +
          (row.jewelryCrafted ?? 0) * 0 +
          (row.gunpartsMade ?? 0) * 0 +
          (row.sheetsMade ?? 0) * 0 +
          (row.wireCrafted ?? 0) * 0 +
          (row.fishCooked ?? 0) * 0 +
          (row.premiumProcessed ?? 0) * 0 +
          (row.regularProcessed ?? 0) * 0 +
          (row.hempSupplies ?? 0) * 0 +
          (row.metalSheetsSupplies ?? 0) * 0 +
          (row.paydirtSupplies ?? 0) * 0 +
          (row.premiumSupplies ?? 0) * 0 +
          (row.thermalsSupplies ?? 0) * 0 +
          (row.phoneSupplies ?? 0) * 0 +
          (row.radioSupplies ?? 0) * 0 +
          (row.lithPrecursors ?? 0) * 0 +
          (row.phosPrecursors ?? 0) * 0 +
          (row.barrelsPrecursors ?? 0) * 0 +
          (row.procainePrecursors ?? 0) * 0 +
          (row.cocaleafsPrecursors ?? 0) * 0 +
          (row.refinedPrecursors ?? 0) * 0 +
          (row.goldGems ?? 0) * 0 +
          (row.opalGems ?? 0) * 0 +
          (row.emeraldGems ?? 0) * 0 +
          (row.rubyGems ?? 0) * 0 +
          (row.diamondGems ?? 0) * 0 +
          (row.blueDiamondGems ?? 0) * 0 +
          (row.pinkDiamondGems ?? 0) * 0 +
          (row.tanzaniteGems ?? 0) * 0 +
          (row.larimarGems ?? 0) * 0 +
          (row.topazGems ?? 0) * 0 +
          (row.copperGems ?? 0) * 0 +
          (row.copperWireGems ?? 0) * 0 +
          (row.ironGems ?? 0) * 0 +
          (row.screwsGun ?? 0) * 0 +
          (row.pistolBodiesGun ?? 0) * 0 +
          (row.gunBarrelsGun ?? 0) * 0 +
          (row.gunStockGun ?? 0) * 0 +
          (row.gunTriggerGun ?? 0) * 0 +
          (row.springGun ?? 0) * 0 +
          (row.heavyGunBarrelGun ?? 0) * 0 +
          (row.smgBodyGun ?? 0) * 0 +
          (row.rifleBodyGun ?? 0) * 0 +
          (row.chardWine ?? 0) * 0 +
          (row.pinotWine ?? 0) * 0 +
          (row.zinfanWine ?? 0) * 0 +
          (row.sauvignonWine ?? 0) * 0 +
          (row.cabernetWine ?? 0) * 0 +
          (row.fermentingWine ?? 0) * 0 +
          (row.salmonFish ?? 0) * 0 +
          (row.groupFish ?? 0) * 0 +
          (row.dolphinFish ?? 0) * 0 +
          (row.activeKos ?? 0) * 0 +
          (row.gangActivity ?? 0) * 0 +
          (row.sojoGrown ?? 0) * 0 +
          (row.mackerelFish ?? 0) * 0 +
          (row.bassFish ?? 0) * 0 +
          (row.pikeFish ?? 0) * 0 +
          (row.tunaFish ?? 0) * 0 +
          (row.stingrayfish ?? 0) * 0 +
          (row.stingrayTailFish ?? 0) * 0 +
          (row.khalifaKush ?? 0) * 0 +
          (row.sourDiesel ?? 0) * 0 +
          (row.whiteWidow ?? 0) * 0 +
          (row.pineExpress ?? 0) * 0 +
          (row.barteringMission ?? 0) * 0 +
          (row.gangSkinning ?? 0) * 0
        );
      }, 0);
      
      const payouts = rows.map(row => {
        const nickname = userIdToNicknameMap[row.userId] ?? 'Unknown';
      
        const totalPoints =
          (row.laundering ?? 0) * 0.3 +
          (row.procaineProcessed ?? 0) * 1500 +
          (row.turfsCapped ?? 0) * 50000 +
          (row.drugsSold ?? 0) * 0 +
          (row.ouncesCut ?? 0) * 0 +
          (row.cokeMade ?? 0) * 0 +
          (row.methMade ?? 0) * 0 +
          (row.armourMade ?? 0) * 0 +
          (row.refiningBarrels ?? 0) * 0 +
          (row.cocaPasteMade ?? 0) * 0 +
          (row.atmsMade ?? 0) * 0 +
          (row.rfMade ?? 0) * 0 +
          (row.jewelryCrafted ?? 0) * 0 +
          (row.gunpartsMade ?? 0) * 0 +
          (row.sheetsMade ?? 0) * 0 +
          (row.wireCrafted ?? 0) * 0 +
          (row.fishCooked ?? 0) * 0 +
          (row.premiumProcessed ?? 0) * 0 +
          (row.regularProcessed ?? 0) * 0 +
          (row.hempSupplies ?? 0) * 0 +
          (row.metalSheetsSupplies ?? 0) * 0 +
          (row.paydirtSupplies ?? 0) * 0 +
          (row.premiumSupplies ?? 0) * 0 +
          (row.thermalsSupplies ?? 0) * 0 +
          (row.phoneSupplies ?? 0) * 0 +
          (row.radioSupplies ?? 0) * 0 +
          (row.lithPrecursors ?? 0) * 0 +
          (row.phosPrecursors ?? 0) * 0 +
          (row.barrelsPrecursors ?? 0) * 0 +
          (row.procainePrecursors ?? 0) * 0 +
          (row.cocaleafsPrecursors ?? 0) * 0 +
          (row.refinedPrecursors ?? 0) * 0 +
          (row.goldGems ?? 0) * 0 +
          (row.opalGems ?? 0) * 0 +
          (row.emeraldGems ?? 0) * 0 +
          (row.rubyGems ?? 0) * 0 +
          (row.diamondGems ?? 0) * 0 +
          (row.blueDiamondGems ?? 0) * 0 +
          (row.pinkDiamondGems ?? 0) * 0 +
          (row.tanzaniteGems ?? 0) * 0 +
          (row.larimarGems ?? 0) * 0 +
          (row.topazGems ?? 0) * 0 +
          (row.copperGems ?? 0) * 0 +
          (row.copperWireGems ?? 0) * 0 +
          (row.ironGems ?? 0) * 0 +
          (row.screwsGun ?? 0) * 0 +
          (row.pistolBodiesGun ?? 0) * 0 +
          (row.gunBarrelsGun ?? 0) * 0 +
          (row.gunStockGun ?? 0) * 0 +
          (row.gunTriggerGun ?? 0) * 0 +
          (row.springGun ?? 0) * 0 +
          (row.heavyGunBarrelGun ?? 0) * 0 +
          (row.smgBodyGun ?? 0) * 0 +
          (row.rifleBodyGun ?? 0) * 0 +
          (row.chardWine ?? 0) * 0 +
          (row.pinotWine ?? 0) * 0 +
          (row.zinfanWine ?? 0) * 0 +
          (row.sauvignonWine ?? 0) * 0 +
          (row.cabernetWine ?? 0) * 0 +
          (row.fermentingWine ?? 0) * 0 +
          (row.salmonFish ?? 0) * 0 +
          (row.groupFish ?? 0) * 0 +
          (row.dolphinFish ?? 0) * 0 +
          (row.activeKos ?? 0) * 0 +
          (row.gangActivity ?? 0) * 0 +
          (row.sojoGrown ?? 0) * 0 +
          (row.mackerelFish ?? 0) * 0 +
          (row.bassFish ?? 0) * 0 +
          (row.pikeFish ?? 0) * 0 +
          (row.tunaFish ?? 0) * 0 +
          (row.stingrayfish ?? 0) * 0 +
          (row.stingrayTailFish ?? 0) * 0 +
          (row.khalifaKush ?? 0) * 0 +
          (row.sourDiesel ?? 0) * 0 +
          (row.whiteWidow ?? 0) * 0 +
          (row.pineExpress ?? 0) * 0 +
          (row.barteringMission ?? 0) * 0 +
          (row.gangSkinning ?? 0) * 0;
        const userPercentage = totalGuildPoints > 0 
          ? ((totalPoints / totalGuildPoints) * 100).toFixed(2) 
          : 0;
