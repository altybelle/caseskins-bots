const Bot = require("./bot.model");
const SteamTotp = require('steam-totp');

async function listAuthCodes(accountName) {
    if (accountName !== "") {
        const bot = await Bot.findOne({ accountName: accountName });
        console.log(`O código de autenticação para ${accountName} é ${SteamTotp.generateAuthCode(bot.sharedSecret)}.`);
    } else {
        const bots = await Bot.find();
        bots.forEach((bot) => {
            console.log(`O código de autenticação para ${bot.accountName} é ${SteamTotp.generateAuthCode(bot.sharedSecret)}.`);
        });
    }
}

listAuthCodes("");