const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    username: "AFKBot",
    auth: "offline", // ← CHANGE THIS IF YOU USE MICROSOFT
    host: "Flins_comehome.aternos.me",
    port: 38656,
    version: "1.12.1"
  });

  bot.once("spawn", () => {
    console.log("[BOT] Joined the server successfully!");

    bot.clearControlStates();

    // Passive anti-AFK
    setInterval(() => {
      const yaw = bot.entity.yaw + (Math.random() * 0.6 - 0.3);
      const pitch = bot.entity.pitch + (Math.random() * 0.2 - 0.1);
      bot.look(yaw, pitch, false);
    }, 20000);

    setInterval(() => bot.swingArm(), 30000);
  });

  bot.on("end", () => {
    console.log("[BOT] Disconnected. Reconnecting in 5s...");
    setTimeout(createBot, 5000);
  });

  bot.on("kicked", (reason) => {
    console.log("[KICKED]", reason);
  });

  bot.on("error", (err) => {
    console.log("[ERROR]", err);
  });
}

createBot();
