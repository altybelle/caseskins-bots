const BotPool = require('./bot/bot.pool');
const express = require('express');
const session = require('express-session');
const passportSocket = require('passport.socketio');
const cookieParser = require('cookie-parser');
const socket = require('socket.io');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DATABASE_URI);

const sessionStore = MongoStore.create({mongoUrl: process.env.DATABASE_URI})
const app = express();
const server = http.Server(app);
const io = socket(server);
// const allowedCors = ['http://localhost:3000'];

app.use(session({
    secret: process.env.SESSION_SECRET,
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

server.listen(5000, () => {
    console.log('Server is running...');
    BotPool.createPool();
});

// io.use(passportSocket.authorize({
//     cookieParser: cookieParser,
//     key: 'U_SESSION',
//     secret: process.env.SESSION_SECRET,
//     store: sessionStore
// }));

io.on('connection', socket => {
    socket.on('deposit', data => {
        // const user = socket.request.user;
        console.log(`${data.personaName} está depositando ${data.assetIds}`);

        const bot = BotPool.acquireBot();
        bot.sendDepositTrade(
            data.user,
            data.tradeToken,
            data.assetIds,
            (err, success, tradeOffer) => {
                if (err && !success) {
                    console.log(err);
                    socket.emit('failure', {
                        message: 'Não pudemos processar sua solicitação no momento.'
                    });
                } else {
                    socket.emit('success', { tradeOffer });
                }
            }
        )
    })
})


