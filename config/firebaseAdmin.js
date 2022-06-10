const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "chatbar-18653",
    "private_key_id": "9aee9a1cbf5ca61cf31a9f3f505384fa18129f22",
    "private_key": process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-i6ge9@chatbar-18653.iam.gserviceaccount.com",
    "client_id": "110512819916708335942",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-i6ge9%40chatbar-18653.iam.gserviceaccount.com"
  })
});

module.exports = admin