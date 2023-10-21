// imports
const express = require('express');
const path = require("path")
const engines = require('consolidate');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { addDeckEndpoints } = require('./deckEndpoints.js');
const { addAccountEndpoints } = require('./accountEndpoints.js');
const { addLobbyEndpoints } = require('./lobbyEndpoints.js');
const { setupGameWS } = require('./gameWebsocket.js');

// variables
const publicDir = path.join(__dirname, '../client/build')
port = 8080;
const oneDay = 1000 * 60 * 60 * 24;

// create app
app = express();

// render-engine (probably no-longer necessary)
app.engine('html', engines.mustache);
app.set('view engine', 'html');


// settings
app.set('res', __dirname + '../client/build');

// middleware
app.use(cors());
app.use(cookieParser());
app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(sessions({
    secret: "lkjhghbnmkloiuytrfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

// start app
app.listen(port, ()=>{
    console.log("the server has been started on " + port);
});


setupGameWS();