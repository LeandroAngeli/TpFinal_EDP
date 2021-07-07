'use strict';
module.exports = (sequelize, DataTypes) => {
  const universidades = sequelize.define('universidades', {
    nombre: DataTypes.STRING,
    localidad: DataTypes.STRING
  }, {});
  
  universidades.associate = function(models) {
    
  };
  return universidades;
};
