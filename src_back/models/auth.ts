import {DataTypes} from "sequelize"
import { sequelize } from "../db/db"

export const Auth = sequelize.define("Auth",{
    password:DataTypes.STRING,
    email:DataTypes.STRING,
})
