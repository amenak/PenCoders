
const bcrypt = require('bcrypt-nodejs');


module.exports = (sequelize, Datatypes) => {
	const Users = sequelize.define('Users', {
		firstName : {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
		lastName : {
      type: Datatypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
		email : {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password_hash : {
      type: Datatypes.STRING,
    },
    password: {
      type: Datatypes.VIRTUAL,
      validate: {
        notEmpty: true,
      },
    },
	});

  Users.associate = (models) => {
    models.Users.hasMany(models.Drafts);
  }

	Users.beforeCreate((user) =>
    	new sequelize.Promise((resolve) => {
      		bcrypt.hash(user.password_hash, null, null, (err, hashedPassword) => {
        		resolve(hashedPassword);
      		});
    	})
    		.then((hashedPw) => {
      		user.password_hash = hashedPw;
    	})
  );

	return Users;
}