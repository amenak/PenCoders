const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const models = require('./models');
const viewHelpers = require('./middlewares/viewHelpers');
const passport = require('./middlewares/authentication');
const controllers = require('./controllers');
const expressSession = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');


const app = express();
app.use(methodOverride('_method'));
const PORT = process.env.PORT || 8000;
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use(expressSession({ secret: 'keyboard dog', resave: false, saveUninitialized: true}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(viewHelpers.register());
app.use(controllers);


app.use(express.static('./public'));


app.engine('handlebars', exphbs({
  layoutsDir: './views/layouts',
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views/`);

models.sequelize.sync({force: false})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running on port: ${PORT}`)
    });
  });

  module.exports = {app};