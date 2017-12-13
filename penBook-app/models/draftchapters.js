module.exports = (sequelize, DataTypes) => {
	const DraftChapters = sequelize.define('DraftChapters', {
		slug: {
			type: DataTypes.STRING,
			unique: true,
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
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		});

	
	DraftChapters.associate = (models) => {
		models.DraftChapters.belongsTo(models.Users);
	}
	


	return DraftChapters;
}; 