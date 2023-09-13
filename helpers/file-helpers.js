const firebaseAdmin = require('../config/firebaseAdmin');

async function createFirebaseCustomToken(userId) {
  try {
    const uid = userId.toString();
    const customToken = await firebaseAdmin.auth().createCustomToken(uid);
    return customToken;
  } catch (err) {
    return console.warn('Error creating custom token:', err);
  }
}

module.exports = { createFirebaseCustomToken };
