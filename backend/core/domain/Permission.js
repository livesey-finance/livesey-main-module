/**
 * Represents a Permission.
 */
export class Permission {
    /**
     * @param {string} permissionId - The unique identifier for the permission.
     * @param {string} permissionName - The name of the permission.
     */
    constructor(
      permissionId,
      permissionName,
    ) {
      /**
           * @readonly
           * @type {string}
           */
      this.permissionId = permissionId;
  
      /**
           * @type {string}
           */
      this.permissionName = permissionName;
    }
  }
  