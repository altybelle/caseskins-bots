const Bot = require("./bot.model");
const SteamBot = require("./bot");
const SteamTotp = require('steam-totp');

class BotPool {
    static _pool = [];

    static async createPool() {
        const bots = await Bot.find();

        bots.forEach((bot) => {
            if (bot.mustRun) {
            this._pool.push(
                new SteamBot(
                    {
                        accountName: bot.accountName,
                        password: bot.password,
                        identitySecret: bot.identitySecret,
                        twoFactorCode: SteamTotp.generateAuthCode(bot.sharedSecret)
                    }
                )
            )
        }
        });
    }

    static acquireBot() {
        let bot;
        if (this._pool.length > 0) {
            bot = this._pool.shift();
        } else {
            bot = null;
        }
        return bot;
    }

    static releaseBot(bot) {
        this._pool.push(bot);
    }
}

module.exports = BotPool;