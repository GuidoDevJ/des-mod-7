import {DataTypes} from "sequelize"
import { sequelize } from "../db/db"

export const User = sequelize.define("User",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email: DataTypes.STRING,
    name:DataTypes.STRING,
})