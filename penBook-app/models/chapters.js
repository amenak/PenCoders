module.exports = (sequelize, DataTypes) => {
	const Chapters = sequelize.define('Chapters', {
		title: DataTypes.STRING
	});

	Chapters.associate = (models) => {
		models.Chapters.hasMany(models.Drafts);
		models.Chapters.belongsTo(models.Books);
	}

	return Chapters;
}