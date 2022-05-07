const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/user/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/user/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'fahrel' });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('fahrel')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username is available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('fahrel')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'fahrel',
        password: '123456',
        fullname: 'Fahrel Gibran',
      });

      // stub
      const fakeIdGenerator = () => '123';

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'fahrel',
        password: '123456',
        fullname: 'Fahrel Gibran',
      });
      const fakeIdGenerator = () => '123'; // stub
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'fahrel',
        fullname: 'Fahrel Gibran',
      }));
    });
  });
});
