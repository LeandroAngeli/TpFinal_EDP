'use strict';
module.exports = (sequelize, DataTypes) => {
  const instituto = sequelize.define('instituto', {
    nombre: DataTypes.STRING,
    director: DataTypes.STRING,
    id_universidad: DataTypes.INTEGER
  }, {});
  instituto.associate = function(models) {
    instituto.belongsTo(models.universidades// modelo al que pertenece
      ,{
        as : 'Universidad-Relacionada',  // nombre de mi relacion
        foreignKey: 'id_universidad'     // campo con el que voy a igualar
      })
  };
  return instituto;
};
