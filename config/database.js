require('dotenv').config();

module.exports = {
    database: process.env.DATABASE_URL,
    secret: process.env.SECRET_TOKEN_KEY,
  };