const sequelize = require("../../config/database");
const sequelizePaginate = require("sequelize-paginate");
const { Model, DataTypes } = require("sequelize");
const User = require("./User")


class items extends Model {};

items.init({
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true
    },
    name :{
        type: DataTypes.STRING(50),
        allowNull: false,
        
    },
    descrption:{
        type: DataTypes.STRING,
        allowNull: true
    },
   
    price:{
        type: DataTypes.STRING(50),
        allowNull:true,
        unique:false
    },
    location: {
        type: DataTypes.STRING(50),
        allowNull:true,
        unique:false
    },
    publishDate:{
        type: DataTypes.DATE,
        allowNull:true,
    },
    ability:{
        type: DataTypes.BOOLEAN,
        allowNull:true
    }
},{
    sequelize, // We need to pass the connection instance
    modelName: "Baj", // We need to choose the model name
    tableName: "baj",
    paranoid: true,
})

User.hasMany(items,{
    foreignKey: "userId",
    constraints: false,
    })
