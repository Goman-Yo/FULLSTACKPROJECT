// backend/hashPassword.js
const bcrypt = require('bcryptjs');

// IMPORTANT: Replace this with the strong password you want to use
const password = 'yosef05868'; 
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('--- Your New Password Hash ---');
  console.log(hash);
  console.log('--- Copy this hash and update your database ---');
});