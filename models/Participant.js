module.exports = (sequelize, DataTypes) => {
    const participant = sequelize.define("Participant",{
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
    return participant;
};