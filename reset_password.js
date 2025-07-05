/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const bcrypt = require('bcryptjs');

// Generate a new password hash
const newPassword = 'password123'; // Simple password for development
const saltRounds = 12;

bcrypt.hash(newPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }

  console.log('New password:', newPassword);
  console.log('New hash:', hash);
  console.log('');
  console.log('SQL to update the password:');
  console.log(
    `UPDATE clients SET password_hash = '${hash}' WHERE email = 'craigpestell@gmail.com';`,
  );
});
