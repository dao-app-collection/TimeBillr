const { Sequelize } = require("../models");

let conn = null;

if (process.env.NODE_ENV === "production") {
  conn = new Sequelize("mysql", process.env.USERNAME, process.env.PASSWORD, {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: "mysql",
    // dialectOptions: {
    //     ssl: 'Amazon RDS'
    // },
    pool: { maxConnections: 5, maxIdleTime: 30 },
    language: "en",
  });
}
