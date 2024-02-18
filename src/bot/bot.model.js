const mongoose = require('mongoose');

module.exports = mongoose.model('Bots', {
    steamId: String,
    accountName: String,
    password: String,
    sharedSecret: String,
    identitySecret: String,
    createdAt: Date,
    updatedAt: Date
})