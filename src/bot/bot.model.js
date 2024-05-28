const mongoose = require('mongoose');

module.exports = mongoose.model('Bots', {
    steamId: String,
    accountName: String,
    password: String,
    sharedSecret: String,
    identitySecret: String,
    mustRun: Boolean,
    createdAt: Date,
    updatedAt: Date
})