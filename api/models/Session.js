
const sequelize = require('../../config/database')


const { Model, DataTypes } = require('sequelize');
const User = require('./User');

class Session extends Model {
}

Session.init({
    sid: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
    isAuth: DataTypes.BOOLEAN,
    userAgent: DataTypes.TEXT,
},
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Session', // We need to choose the model name 
        tableName: 'session',
        // paranoid: true
    });

User.hasMany(Session);
Session.belongsTo(User);


const sequelizePaginate = require('sequelize-paginate');

sequelizePaginate.paginate(Session);

module.exports = Session