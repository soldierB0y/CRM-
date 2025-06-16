import { DataTypes } from "sequelize";
import { DB } from "./db";


export const UserModel= DB.define('user',
    {
        IDUser:{
            type: DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
        username:
        {
            type:DataTypes.STRING,
            allowNull:false
        },
        password:
        {
         type:  DataTypes.STRING,
         allowNull:false
        }

    }
,{
    timestamps:true
})

try {
    await DB.sync()
    console.log('Tabla de usuarios creada con exito')
} catch (error) {
    console.log(error)
}


export const apartmentModel= DB.define('Apartament',
    {
        IDApartment:{
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false
        },
        rent:{
            type:DataTypes.DOUBLE,
            allowNull:false
        },
        tenant:
        {
            type:DataTypes.STRING,
            allowNull:true
        },
        inversion:
        {
            type:DataTypes.DOUBLE,
            allowNull:true
        },
        revenue:
        {
            type:DataTypes.DOUBLE,
            allowNull:true
        },
        location:
        {
            type:DataTypes.STRING,
            allowNull:false
        },
        locationUrl:
        {
            type:DataTypes.STRING,
            allowNull:false
        },

    },{
        timestamps:true
    }
)