const mineflayer = require('mineflayer');
const Movements = require('mineflayer-pathfinder').Movements;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const { GoalBlock } = require('mineflayer-pathfinder').goals;

const config = require('./settings.json');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running.');
});

app.listen(8000, () => {
  console.log('Web server running on port 8000');
});

function createBot() {
  const bot = mineflayer.createBot({
    username: config['bot-account']['username'],
    password: config['bot-account']['password'],
    auth: config['bot-account']['type'],
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version // false = auto-detect
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log('[AfkBot] Bot joined the server');

    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);

    // --- AUTO AUTH ---
    if (config.utils['auto-auth'].enabled) {
      const pwd = config.utils['auto-auth'].password;
      bot.chat(`/register ${pwd} ${pwd}`);
      bot.chat(`/login ${pwd}`);
    }

    // --- ANTI AFK ---
    if (config.utils['anti-afk'].enabled) {
      if (config.utils['anti-afk'].jump) bot.setControlState('jump', true);
      if (config.utils['anti-afk'].sneak) bot.setControlState('sneak', true);
    }

    // --- MOVE TO COORDINATES ---
    if (config.position.enabled) {
      const pos = config.position;
      console.log(`[AfkBot] Moving to (${pos.x}, ${pos.y}, ${pos.z})`);

      bot.pathfinder.setMovements(defaultMove);
      bot.pathfinder.setGoal(new GoalBlock(pos.x, pos.y, pos.z));
    }
  });

  // --- STOP MOVING WHEN GOAL REACHED ---
  bot.on('goal_reached', () => {
    console.log(`[AfkBot] Arrived at target: ${bot.entity.position}`);
    bot.pathfinder.setGoal(null);
    bot.clearControlStates();
  });

  // --- AUTO RECONNECT ---
  if (config.utils['auto-reconnect']) {
    bot.on('end', () => {
      console.log('[AfkBot] Disconnected — reconnecting...');
      setTimeout(createBot, config.utils['auto-recconect-delay']);
    });
  }

  bot.on('kicked', reason => console.log(`[AfkBot] Kicked: ${reason}`));
  bot.on('error', err => console.log(`[ERROR] ${err}`));
}

createBot();
