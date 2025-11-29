const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    username: "AFKBot",
    host: "Flins_comehome.aternos.me",
    port: 38656,
    version: "1.12.1"
  });

  bot.once("spawn", () => {
    console.log("[BOT] Spawned.");

    // Disable *all* movement so water/slime can push it
    bot.clearControlStates();
    bot.pathfinder?.setGoal(null);

    // ---- ANTI-AFK (Aternos Safe) ----

    // Look around slowly like a real player
    setInterval(() => {
      const yaw = bot.entity.yaw + (Math.random() * 0.6 - 0.3);
      const pitch = bot.entity.pitch + (Math.random() * 0.2 - 0.1);
      bot.look(yaw, pitch, false);
    }, 20000);

    // Occasionally swing hand
    setInterval(() => {
      bot.swingArm("right");
    }, 30000);

    // Light chat message sometimes (Aternos likes this)
    setInterval(() => {
      if (Math.random() < 0.33) {
        bot.chat("hello :D");
      }
    }, 60000);

    console.log("[BOT] AFK mode enabled. Physics fully active.");
  });

  // Auto reconnect
  bot.on("end", () => {
    console.log("[BOT] Disconnected. Reconnecting...");
    setTimeout(createBot, 5000);
  });

  bot.on("error", (err) => {
    console.log("[ERROR]", err);
  });

  bot.on("kicked", (reason) => {
    console.log("[KICKED]", reason);
  });
}

createBot();
