async function createFirebaseCustomToken(userId) {
  try {
    const firebaseAdmin = require('../config/firebaseAdmin')
    const uid = userId.toString()
    const customToken = await firebaseAdmin.auth().createCustomToken(uid)
    return customToken
  } catch(err) {
    console.log('Error creating custom token:', err)
  }
}

module.exports = { createFirebaseCustomToken }

