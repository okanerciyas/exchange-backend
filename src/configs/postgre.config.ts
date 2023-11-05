import { Dialect, Sequelize } from 'sequelize';
import { SequelizeOptions } from 'sequelize-typescript';
import * as process from 'process';
export const postgreConfig: SequelizeOptions = {
  dialect: 'postgres' as Dialect,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'eva',
};

export const sequelize = new Sequelize(postgreConfig);
