const express = require("express");
const app = express();
const http = require("http");
require('dotenv').config()
const cors = require('cors');
require('./api/models/Session')
const sharedsession = require("express-socket.io-session")



const server = http.createServer(app);
const PORT = process.env.PORT || 3001


server.listen(PORT, () => console.log(`server is starting on port http://localhost:${PORT} ..`))

//imports routes
const UserRoutes = require('./api/routes/User');
const sessionRoutes = require('./api/routes/Session');
const items = require("./api/routes/items");
const pasket =require("./api/routes/pasket")



//session tools
const SequelizeStore = require("connect-session-sequelize")(require("express-session").Store);
const sequelize = require('./config/database');


function extendDefaultFields(defaults, session) {
    return {
      data: defaults.data,
      expires: defaults.expires,
      sid: session.sid,
      isAuth: session.isAuth,
      user: session.user,
      userAgent: session.userAgent,
      UserId: session.UserId
    };
  }
  
  var store = new SequelizeStore({
    db: sequelize,
    table: "Session",
    extendDefaultFields: extendDefaultFields,
  });
  
  
  const session = require("express-session")({
    secret: process.env.S_KEY,
    store: store,
    saveUninitialized: true,
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true, // if you do SSL outside of node.
  }
  )


//using tools
app.use(cors({
    origin: "http://localhost:3001",
  },
  ));
  app.use(express.json({
    limit:'100mb'
  }));
  app.use(express.urlencoded({
    extended: true
  }));
  //the name is explain every thing 
  var compression = require('compression')
   
  app.use(compression())
  
  // Attach session
  app.use(session);

//using the routes
app.use('/api/user', UserRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/items',items);
app.use('/api/pasket',pasket);







