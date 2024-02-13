const mongoose = require('mongoose');

module.exports = mongoose.model('Item', {
    assetid: String,
    market_hash_name: String,
    tradable: Boolean,
    shared_secret: String,
    identity_secret: String,
    is_online: Boolean,
    created_at: Date,
    updated_at: Date
})