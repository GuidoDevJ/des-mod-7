import {DataTypes} from "sequelize"
import { sequelize } from "../db/db"

export const Pet = sequelize.define("Pet",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    state:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    } ,
    name:DataTypes.STRING,
    img:DataTypes.STRING,
    lng:DataTypes.FLOAT,
    lat:DataTypes.FLOAT

})