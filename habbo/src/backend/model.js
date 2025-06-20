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
        tenantName:{
            type:DataTypes.STRING,
            allowNull:true
        },
        tenantID:{
            type:DataTypes.INTEGER,
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
            allowNull:true
        },
        locationUrl:
        {
            type:DataTypes.STRING,
            allowNull:true
        },
        description:
        {
            type:DataTypes.STRING,
            allowNull:true
        }

    },{
        timestamps:true
    }
)

export const tenantModel= DB.define('tenant',{
    IDTenant:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    fullName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    number:
    {
        type:DataTypes.STRING,
        allowNull:true
    },
    birthDate:
    {
        type:DataTypes.DATE,
        allowNull:true
    },
    maritalStatus:{
        type:DataTypes.STRING,
        allowNull:true
    },
    email:
    {
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    timestamps:true
})


try {
    await DB.sync()
    console.log('Tabla de usuarios creada con exito')
} catch (error) {
    console.log(error)
}