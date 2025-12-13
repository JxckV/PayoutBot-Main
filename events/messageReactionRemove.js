const path = require('node:path');
const fly = require(path.join(__dirname, '..', 'commands', 'payout', 'flyintimedevelopment.js'));

const VALID_EMOJIS = ['✅', '❌', '❔'];

module.exports = {
  name: 'messageReactionRemove',
  async execute(reaction, user) {
    if (user.bot) return;

    try {
      if (reaction.partial) await reaction.fetch();
      if (reaction.message.partial) await reaction.message.fetch();
    } catch {
      return;
    }

    const flyinId = fly.flyinCache.get(reaction.message.id);
    if (!flyinId) return;

    if (!VALID_EMOJIS.includes(reaction.emoji.name)) return;

    // Remove response from DB
    await new Promise((res, rej) =>
      fly.db.run(
        `DELETE FROM flyin_responses WHERE flyinId = ? AND userId = ?`,
        [flyinId, user.id],
        err => (err ? rej(err) : res())
      )
    );

    await fly.updateLogForFlyin(reaction.message.client, flyinId);
  }
};