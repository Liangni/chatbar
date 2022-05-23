const firebase = require('../config/firebase')

async function getDownloadUrl (targetUrl) {
  try {
    const storage = firebase.storage()
    const storageRef = storage.ref()

    return await storageRef.child(targetUrl).getDownloadURL()
  } catch(err) {
    return err
  }
}

module.exports = { getDownloadUrl }

