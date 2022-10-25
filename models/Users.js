module.exports = (sequelize, DataTypes) => {
    const newUser = sequelize.define("Users",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        first_name:{
            required: true,
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name:{
            required: true,
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            required: true,
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username:{
            required: true,
            type: DataTypes.STRING,
            allowNull: false,
            len: [5, 20]
        },
        password:{
            required: true,
            type: DataTypes.STRING,
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.STRING,
        }
    });
    return newUser;
};

