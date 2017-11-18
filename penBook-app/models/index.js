//file System
var fs        = require('fs');
//path provides utilities for working with files and directory pahts.
var path      = require('path');
var Sequelize = require('sequelize');
//last portion index.js   /home/wei/PenCoders/penBook-app/models/index.js
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env]
var db        = {};

function getSequelize() {
  if (config.use_env_variable) {
    return new Sequelize(process.env[config.use_env_variable]);
  }
  return new Sequelize(config.database, config.username, config.password, config);
}

const sequelize = getSequelize();

// return an array of files of current dir
fs.readdirSync(__dirname)
//for each js file other than index.js
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    //store model definitions in a variable // /home/wei/PenCoders/penBook-app/models/User.js
    const model = sequelize.import(path.join(__dirname, file));
    const modelName = `${model.name.charAt(0).toUpperCase()}${model.name.slice(1)}`;
    //model.name = "User"
    db[modelName] = model;
  });

//The Object.keys() method returns an array of a given object's own properties, in the same order as 
//that provided by a for...in loop
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;  
