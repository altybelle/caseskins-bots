const Bot = require("./bot.model");
const SteamBot = require("./bot");
const SteamTotp = require('steam-totp');

class BotPool {
    static _pool = [];

    static async createPool() {
        const bots = await Bot.find();

        bots.forEach((bot) => {
            this._pool.push(
                new SteamBot(
                    {
                        accountName: bot.account_name,
                        password: bot.password,
                        identitySecret: bot.identity_secret,
                        twoFactorCode: SteamTotp.generateAuthCode(bot.shared_secret)
                    }
                )
            )
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