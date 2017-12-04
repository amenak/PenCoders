module.exports = (sequelize, DataTypes) => {
	const Books = sequelize.define ('Books', {
		slug: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},

		title: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},

		genre: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},

		description: {
			type: DataTypes.TEXT,
		},

	});

	Books.associate = (models) => {
		models.Books.belongsTo(models.Users);
		models.Books.hasMany(models.Chapters);
	}

	return Books;
}