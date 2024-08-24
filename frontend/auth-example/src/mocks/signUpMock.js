// src/mocks/signUpMock.js
const existingUsers = [
    { username: 'testuser', email: 'testuser@example.com' },
  ];
  
  export function mockSignUp({ firstName, lastName, username, email, password, repeatPassword }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!firstName || !lastName || !username || !email || !password || !repeatPassword) {
          reject({ success: false, message: 'All fields are required' });
        } else if (password !== repeatPassword) {
          reject({ success: false, message: 'Passwords do not match' });
        } else if (existingUsers.some(user => user.username === username || user.email === email)) {
          reject({ success: false, message: 'Username or Email already exists' });
        } else {
          const newUser = { username, email, firstName, lastName };
          existingUsers.push(newUser);
          resolve({ success: true, message: 'Sign up successful', user: newUser });
        }
      }, 1000);
    });
  }
  