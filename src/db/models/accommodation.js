
module.exports = (sequelize, DataTypes) => {
  const accommodation = sequelize.define('Accommodation', {
    locationName: DataTypes.STRING,
    streetNumber: DataTypes.STRING,
    numberOfRooms: DataTypes.INTEGER,
    availableRooms: DataTypes.ARRAY(DataTypes.JSON),
    imageOfBuilding: DataTypes.STRING
  }, {});
  accommodation.associate = function (models) {
    // associations can be defined here
  };
  return accommodation;
};
