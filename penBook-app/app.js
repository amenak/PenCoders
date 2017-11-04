//body parsing middleware
const bodyParser = require('body-parser');
//web framework for node.js
const express = require('express');
//store data that you want to access to acrose requests, so you can read data between different routes
const expressSession = require('express-session');
//use handlebars as the view
const exphbs = require('express-handlebars');

const models = require('./models');
const viewHelpers = require('./middlewares/viewHelpers');
const passport = require('./middlewares/authentication');
const controllers = require('./controllers');

const flash = require('connect-flash');


const app = express();
//user port 3000 unless there exists a preconfigured port
const PORT = process.env.PORT || 8000;
//app.use(cookieParser());
//use middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'keyboard dog', resave: false, saveUninitialized: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(viewHelpers.register());
app.use(controllers);

//test

// Uncomment the following if you want to serve up static assets.
// (You must create the public folder)
app.use(express.static('./public'));

// Uncomment the following if you want to use handlebars
// on the backend. (You must create the views folder)
app.engine('handlebars', exphbs({
  layoutsDir: './views/layouts',
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views/`);

// First, make sure the Database tables and models are in sync
// then, start up the server and start listening.
//force true will drop the table if it already exists
models.sequelize.sync({force: false})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running on port: ${PORT}`)
    });
  });
