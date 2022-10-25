module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define("Task",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        isCompleted:{
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        assignedTo:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
    );
    return Task;
};