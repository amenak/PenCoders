module.exports = (sequelize, DataTypes) => {
	const Drafts = sequelize.define('Drafts', {
		title: DataTypes.STRING,
		draftText: DataTypes.STRING
		});

	/*
	Drafts.associate = (models) => {
		models.Drafts.belongsTo(models.Chapters);
	}
	*/


	return Drafts;
}; 