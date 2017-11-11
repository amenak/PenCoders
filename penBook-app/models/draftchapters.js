module.exports = (sequelize, DataTypes) => {
	const DraftChapters = sequelize.define('DraftChapters', {
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

	
	Drafts.associate = (models) => {
		models.Drafts.belongsTo(models.Users);
	}
	


	return Drafts;
}; 