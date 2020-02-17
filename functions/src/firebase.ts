const admin = require("firebase-admin");
const serviceAccount = require('./../../service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wrabbitignys.firebaseio.com",
    storageBucket: "wrabbitignys.appspot.com"
})
admin.firestore().settings({ timestampsInSnapshots: true });

export default admin