const sequelize = require("../../config/database");
const sequelizePaginate = require("sequelize-paginate");
const { Model, DataTypes } = require("sequelize");
const User = require("./User")
const items = require("./items");



class pasket extends Model {};

pasket.init({
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true
    },
    name :{
        type: DataTypes.STRING(50),
        allowNull: false,
        references:{
            model:items,
            key: 'name'

        }

        
    },

    price:{
        type: DataTypes.STRING(50),
        allowNull:true,
        unique:false,
        references:{
            model:items,
            key: 'price'

        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    location: {
        type: DataTypes.STRING(50),
        allowNull:true,
        unique:false,
        references:{
            model:items,
            key: 'location'

        }
    },
    quantity:{
        type:DataTypes.NUMBER,
        allowNull:false
    }
  
},{
    sequelize, // We need to pass the connection instance
    modelName: "pasket", // We need to choose the model name
    tableName: "pasket",
    paranoid: true,
})

User.hasMany(pasket,{
    foreignKey: "userId",
    constraints: false,
    });

pasket.belongsTo(User,{
    foreignKey: "userId",
            });
items.hasMany(pasket,{
    foreignKey: "itemsId",
    constraints: false,
}) ;

pasket.belongsTo(items,{
    foreignKey: "itemsId",
            });


module.exports = pasket;