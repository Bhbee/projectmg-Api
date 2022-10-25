module.exports = (sequelize, DataTypes) => {
    const admin = sequelize.define("Admin",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },  
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {timestamps: false}
    );
    return admin;
};