//web framework for node.js
const express = require('express');
//body parsing middleware
const bodyParser = require('body-parser');
//use handlebars as the view
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const models = require('./models');
const viewHelpers = require('./middlewares/viewHelpers');
const passport = require('./middlewares/authentication');
const controllers = require('./controllers');
//store data that you want to access to acrose requests, so you can read data between different routes
const expressSession = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');


//Init App
const app = express();
//user port 3000 unless there exists a preconfigured port
const PORT = process.env.PORT || 8000;
app.use(cookieParser());
//use middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg: msg,
      value: value
    };
  }
}));

//express session middleware
app.use(expressSession({ secret: 'keyboard dog', resave: false, saveUninitialized: true}));
//express messages middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

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

  module.exports = {app};