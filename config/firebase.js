const firebase = require('firebase')

const firebaseConfig = {
  apiKey: "AIzaSyC7_ngNVYfX7bIlF38bbtrNuXylP3DlQbk",
  authDomain: "chatbar-18653.firebaseapp.com",
  projectId: "chatbar-18653",
  storageBucket: "chatbar-18653.appspot.com",
  messagingSenderId: "381229737588",
  appId: "1:381229737588:web:44d6713852372c7d1d1321",
  measurementId: "G-JKR4BJ21PR"
}

firebase.initializeApp(firebaseConfig)

module.exports = firebase