module.exports = (sequelize, DataTypes) => {
	const Comments = sequelize.define('Comments', {
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},

	});

	Comments.associate = (models) => {
		models.Comments.belongsTo(models.Chapters);
		models.Comments.belongsTo(models.Users);
	}

	return Comments;
}