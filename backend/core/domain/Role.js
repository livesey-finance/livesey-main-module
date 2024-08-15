/**
 * Represents a Role.
 */
export class Role {
    /**
     * @param {string} roleId - The unique identifier for the role.
     * @param {string} roleName - The name of the role, such as "Admin", "User", or "Supervisor".
     */
    constructor(
      roleId,
      roleName,
    ) {
      /**
           * @readonly
           * @type {string}
           */
      this.roleId = roleId;
  
      /**
           * @type {string}
           */
      this.roleName = roleName;
    }
  }
  