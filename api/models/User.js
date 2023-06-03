const sequelize = require("../../config/database");
const sequelizePaginate = require("sequelize-paginate");
const { Model, DataTypes } = require("sequelize");


class User extends Model {};

User.init({
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true
    },
    name :{
        type: DataTypes.STRING(50),
        allowNull: false,
        
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true
    },
   
    phone:{
        type: DataTypes.NUMBER,
        allowNull:true,
        unique:false
    },
    location: {
        type: DataTypes.STRING(50),
        allowNull:true,
        unique:false
    },
    governorate:{
        type: DataTypes.STRING(50),
        allowNull:true,
    },
    online:{
        type: DataTypes.BOOLEAN,
        allowNull:true
    }
},{
    sequelize, // We need to pass the connection instance
    modelName: "Baj", // We need to choose the model name
    tableName: "baj",
    paranoid: true,
})

module.exports = User;