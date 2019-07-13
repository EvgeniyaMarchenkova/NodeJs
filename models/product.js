'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    NAME: DataTypes.STRING,
    BRAND: DataTypes.STRING,
    PRICE: DataTypes.INTEGER,
    COLOR: DataTypes.STRING,
    SIZE: DataTypes.STRING
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};