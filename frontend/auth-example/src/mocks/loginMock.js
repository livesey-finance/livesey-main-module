// src/mocks/loginMock.js

const existingUsers = [
    { username: 'testuser', email: 'testuser@example.com', password: 'password123' },
  ];
  
  export function mockLogin(usernameOrEmail, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = existingUsers.find(
          user => (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password
        );
        if (user) {
          resolve({ success: true, message: 'Login successful', user });
        } else {
          reject({ success: false, message: 'Invalid username/email or password' });
        }
      }, 1000);
    });
  }
  