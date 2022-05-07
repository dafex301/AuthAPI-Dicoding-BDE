/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [token]);
  },

  async findToken(token) {
    const { rows } = await pool.query('SELECT * FROM authentications WHERE token = $1', [token]);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE authentications');
  },
};

module.exports = AuthenticationsTableTestHelper;
