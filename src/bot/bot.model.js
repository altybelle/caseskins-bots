const mongoose = require('mongoose');

module.exports = mongoose.model('Bot', {
    steamid: String,
    account_name: String,
    password: String,
    shared_secret: String,
    identity_secret: String,
    is_online: Boolean,
    created_at: Date,
    updated_at: Date
})