const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    host: "Flins_comehome.aternos.me",
    port: 38656,
    username: "AFKBot",
  });

  bot.on("spawn", () => {
    console.log("Bot joined! Starting human‑like AFK.");

    function randomAction() {
      if (!bot.entity) return;

      const actions = [
        () => bot.look(bot.entity.yaw + (Math.random() - 0.5) * 0.3, bot.entity.pitch, true),
        () => bot.setControlState("jump", true),
        () => bot.setControlState("jump", false),
        () => bot.setControlState("sneak", Math.random() < 0.5),
        () => bot.setControlState("forward", Math.random() < 0.4),
        () => bot.setControlState("back", Math.random() < 0.1),
        () => bot.setControlState("left", Math.random() < 0.1),
        () => bot.setControlState("right", Math.random() < 0.1),
      ];

      // pick random action
      const action = actions[Math.floor(Math.random() * actions.length)];
      action();

      // random wait between 5 and 25 seconds
      const next = Math.random() * 20000 + 5000;
      setTimeout(randomAction, next);
    }

    randomAction();
  });

  bot.on("end", () => {
    const delay = Math.floor(Math.random() * 60000) + 10000; // 10–70 seconds
    console.log(`Bot disconnected, reconnecting in ${delay / 1000}s...`);
    setTimeout(createBot, delay);
  });

  bot.on("error", (err) => console.log("ERROR:", err));
}

createBot();
