const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
require("dotenv").config();

mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack8-vl593.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query
    
    connectedUsers[user] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use("/", express.static(__dirname + "/../../frontend/dist"));
app.use(routes);
const port = process.env.PORT || 9999;

server.listen(port, function () {
    console.log(`Servidor executando em ${port}`)
});