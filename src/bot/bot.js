const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');

class SteamBot {
    constructor(config) {
        this.client = new SteamUser();
        this.community = new SteamCommunity();
        this.manager = new TradeOfferManager({
            steam: this.client,
            community: this.community,
            language: 'en'
        });

        this.logOn(config);
    }

    logOn(config) {
        this.client.logOn(config);

        this.client.on('loggedOn', () => {
            console.log(`Logged into Steam as ${config.accountName}`);
            
            this.client.setPersona(SteamUser.EPersonaState.Online);
            this.client.gamesPlayed(300);
        });

        this.client.on('webSession', (sessionId, cookies) => {
            this.manager.setCookies(cookies);
            this.community.setCookies(cookies);
            this.community.startConfirmationChecker(10000, config.identity_secret);
            
        });

        this.client.logOff();
    }

    getInventory(partner) {
        console.log(`Bot ${this.client.accountInfo.name} accessed user ${partner} inventory.`);

        return new Promise((resolve, reject) => {
            this.community.getUserInventoryContents(partner, 730, 2, false, (err, inv) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(inv);
                }
            });
        })
        

    }
}

module.exports = SteamBot;