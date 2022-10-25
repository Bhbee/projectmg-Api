module.exports = (sequelize, DataTypes) => {
    const project = sequelize.define("Projects",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        projectTitle:{
            type: DataTypes.STRING,
            allowNull: false,
            len: [10, 30]
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        creator:{
            type: DataTypes.STRING,
            allowNull: false
        },
        superAdmin:{
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
        
    });
    return project;
};