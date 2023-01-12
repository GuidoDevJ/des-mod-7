import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';
dotenv.config()

 export const sequelize = new Sequelize('egwknvnn', 'egwknvnn', `${process.env.SEQUEALIZE_PASSWORD}`, {
    host: 'tuffi.db.elephantsql.com',
    dialect: 'postgres'
  });


