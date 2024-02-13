const BotPool = require('./bot/bot.pool');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DATABASE_URI);
const sessionStore = MongoStore.create({mongoUrl: process.env.DATABASE_URI})
const app = express();

// const allowedCors = ['http://localhost:3000'];

app.use(session({
    secret: 'QUALQUER_COISA_FAZ_AI123456789789123456789',
    name: 'U_SESSION',
    resave: true,
    saveUninitialized: true,
    store: sessionStore
}))

// app.use(cors(allowedCors));
app.use(morgan('tiny'));

app.get('/inventory/:steamid', async (req, res) => {
    const { steamid } = req.params;

    if (steamid) { 
        const bot = BotPool.acquireBot();
        const inventory = await bot.getInventory(steamid);
        BotPool.releaseBot(bot);
        res.status(200).json(inventory);
    } else {
        res.status(400).json({ message: 'Você deve informar o Steam ID do usuário.'});
    }
});

app.listen(5000, () => {
    console.log('Server is running...');
    BotPool.createPool();
})



