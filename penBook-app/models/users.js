
const bcrypt = require('bcrypt-nodejs');


module.exports = (sequelize, Datatypes) => {
	const Users = sequelize.define('Users', {
		firstName : Datatypes.STRING,
		lastName : Datatypes.STRING,
		email : Datatypes.STRING,
		password_hash : Datatypes.STRING
	});

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