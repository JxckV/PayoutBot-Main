const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        // Define the activities you want to cycle through
        const activities = [
            { name: '3up Reece Hendrix  :( ', type: ActivityType.Playing },
            { name: 'Pyraxx Payout Bot', type: ActivityType.Playing },
        ];

        let activityIndex = 0;

        // Function to update the bot's activity
        const updateActivity = () => {
            const activity = activities[activityIndex];
            client.user.setActivity(activity.name, { type: activity.type });

            // Switch to the next activity in the array
            activityIndex = (activityIndex + 1) % activities.length;
        };

        // Call updateActivity initially
        updateActivity();

        // Change activity every 10 seconds (1000ms)
        setInterval(updateActivity, 10000);

        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};