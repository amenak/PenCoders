module.exports = (sequelize, DataTypes) => {
	const Drafts = sequelize.define('Drafts', {
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
		draftText: {
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