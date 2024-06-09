import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({
    path: './config/.env'
})


export default new DataSource( {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['./src/**/*.entity.ts'],
    synchronize: false,
    migrations: ['src/db/migrations/*.ts'],
    migrationsTableName: 'migrations'
})