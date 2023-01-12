import {DataTypes} from "sequelize"
import { sequelize } from "../db/db"

export const Report = sequelize.define("Report",{
    name: DataTypes.STRING,
    phone:DataTypes.BIGINT,
    reportData:DataTypes.STRING
})