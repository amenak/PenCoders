module.exports = (sequelize, DataTypes) => {
	const Books = sequelize.define ('Books', {
		title: DataTypes.STRING
	});

	Books.associate = (models) => {
		models.Books.hasMany(models.Chapters);
	}

	return Books;
}