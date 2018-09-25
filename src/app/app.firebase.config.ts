var localConfig = require('./config.json');

export const FIREBASE_CONFIG = {
    apiKey: localConfig["firebaseApiKey"],
    authDomain: "yellow-heat.firebaseapp.com",
    databaseURL: "https://yellow-heat.firebaseio.com",
    projectId: "yellow-heat",
    storageBucket: "yellow-heat.appspot.com",
    messagingSenderId: localConfig["firebaseMessagingSenderId"]
  };