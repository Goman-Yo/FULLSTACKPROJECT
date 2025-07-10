// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Configuration for local development
const localConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// Configuration for production on Render
const productionConfig = {
  connectionString: process.env.DATABASE_URL, // Render provides this
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(isProduction ? productionConfig : localConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};