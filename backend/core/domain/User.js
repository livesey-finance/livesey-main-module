/**
 * Represents a User.
 */
export class User {
  /**
     * @param {string} userId - The unique identifier for the user.
     * @param {string} firstName - The first name of the user.
     * @param {string} lastName - The last name of the user.
     * @param {string} username - The username of the user.
     * @param {string} email - The email address of the user.
     * @param {string} password - The password of the user.
     * @param {string} roleId - The role of the user.
     * @param {Date} createdAt - The date when the user was created.
     * @param {Date} updatedAt - The date when the user was last updated.
     */
  constructor(
    userId,
    firstName,
    lastName,
    username,
    email,
    password,
    roleId,
    createdAt,
    updatedAt,
  ) {
    /**
         * @readonly
         * @type {string}
         */
    this.userId = userId;

    /**
         * @type {string}
         */
    this.firstName = firstName;

    /**
         * @type {string}
         */
    this.lastName = lastName;

    /**
         * @type {string}
         */
    this.username = username;

    /**
         * @type {string}
         */
    this.email = email;

    /**
         * @type {string}
         */
    this.password = password;

    /**
         * @type {string}
         */
    this.roleId = roleId;

    /**
         * @type {Date}
         */
    this.createdAt = createdAt;

    /**
         * @type {Date}
         */
    this.updatedAt = updatedAt;
  }
}
