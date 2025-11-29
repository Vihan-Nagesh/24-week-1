const mineflayer = require('mineflayer');
const config = require('./settings.json');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is online'));
app.listen(8000, () => console.log('Webserver started'));

function createBot() {
    const bot = mineflayer.createBot({
        username: config['bot-account'].username,
        password: config['bot-account'].password,
        auth: config['bot-account'].type,
        host: config.server.ip,
        port: config.server.port,
        version: config.server.version
    });

    // AUTO REGISTER
    function autoRegister() {
        const pass = config.utils['auto-auth'].password;
        bot.chat(`/register ${pass} ${pass}`);
    }

    // AUTO LOGIN
    function autoLogin() {
        const pass = config.utils['auto-auth'].password;
        bot.chat(`/login ${pass}`);
    }

    bot.once('spawn', () => {
        console.log("[BOT] Spawned.");

        // AUTH
        if (config.utils['auto-auth'].enabled) {
            setTimeout(autoRegister, 500);
            setTimeout(autoLogin, 1500);
        }

        // TELEPORT BOT INTO POSITION (no pathfinder)
        const pos = config.position;
        if (pos.enabled) {
            console.log(`[BOT] Setting position to ${pos.x}, ${pos.y}, ${pos.z}`);
            bot.entity.position.set(pos.x + 0.5, pos.y, pos.z + 0.5);
        }

        // ANTI AFK
        if (config.utils['anti-afk'].enabled) {
            setInterval(() => {
                bot.setControlState("jump", true);
                setTimeout(() => bot.setControlState("jump", false), 300);
                bot.look(bot.entity.yaw + 0.05, 0, true);
            }, 4000);
        }
    });

    bot.on('kicked', reason => console.log("[KICKED]", reason));
    bot.on('error', err => console.log("[ERROR]", err));

    // AUTO RECONNECT
    bot.on('end', () => {
        console.log("[BOT] Lost connection. Reconnecting...");
        setTimeout(createBot, config.utils['auto-recconect-delay']);
    });
}

createBot();
