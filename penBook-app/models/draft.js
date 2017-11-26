module.exports = (sequelize, DataTypes) => {
  const Draft = sequelize.define('draft', {
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
      unique: 'compositeIndex',
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  Draft.associate = (models) => {
    models.Draft.belongsTo(models.Book);
  }

  return Draft;
};
