module.exports = (sequelize, DataTypes) => {
	const Books = sequelize.define ('Books', {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
	});

	Books.associate = (models) => {
		models.Books.belongsTo(models.Users);
		models.Books.hasMany(models.Chapters);
	}

	return Books;
}