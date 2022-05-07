/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'fahrel', password = 'rahasia', fullName = 'Fahrel Gibran',
  }) {
    await pool.query('INSERT INTO users (id, username, password, fullName) VALUES ($1, $2, $3, $4)', [id, username, password, fullName]);
  },

  async findUsersById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users');
  },
};

module.exports = UsersTableTestHelper;
