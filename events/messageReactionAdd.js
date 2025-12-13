const path = require('node:path');
const fly = require(path.join(__dirname, '..', 'commands', 'payout', 'flyintimedevelopment.js'));

const PYRAX_ROLE_ID = '1449160168855175341';
const VALID_EMOJIS = ['✅', '❌', '❔'];

module.exports = {
  name: 'messageReactionAdd',
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

    // ❌ Invalid emoji
    if (!VALID_EMOJIS.includes(reaction.emoji.name)) {
      await reaction.users.remove(user.id).catch(() => {});
      return;
    }

    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    // 🔒 Role enforcement
    if (!member.roles.cache.has(PYRAX_ROLE_ID)) {
      await reaction.users.remove(user.id).catch(() => {});
      return;
    }

    // Map emoji to status
    const statusMap = {
      '✅': 'confirmed',
      '❌': 'cannot',
      '❔': 'tentative'
    };

    const status = statusMap[reaction.emoji.name];

    // Store/update response
    await new Promise((res, rej) =>
      fly.db.run(
        `
        INSERT INTO flyin_responses (flyinId, userId, status, updatedAt)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(flyinId, userId)
        DO UPDATE SET status = excluded.status, updatedAt = excluded.updatedAt
        `,
        [flyinId, user.id, status, Date.now()],
        err => (err ? rej(err) : res())
      )
    );

    await fly.updateLogForFlyin(reaction.message.client, flyinId);
  }
};