module.exports = (sequelize, DataTypes) => {
	const Drafts = sequelize.define('Drafts', {
		title: DataTypes.STRING,
		draftText: DataTypes.STRING
		});


	return Drafts;
}; 