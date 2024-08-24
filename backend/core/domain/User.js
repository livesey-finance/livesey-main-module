export class User {
  constructor(
    userId,
    firstName,
    lastName,
    username,
    email,
    password,
    roleId,
    createdAt,
    updatedAt
  ) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.roleId = roleId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
