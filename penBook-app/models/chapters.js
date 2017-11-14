module.exports = (sequelize, DataTypes) => {
	const Chapters = sequelize.define('Chapters', {
		slug: {
			type: DataTypes.STRING,
			unique: 'compositeIndex',
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
		},
		text: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},

	});

	Chapters.associate = (models) => {
		models.Chapters.belongsTo(models.Books);
	}

	return Chapters;
}