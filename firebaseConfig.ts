import * as admin from "firebase-admin";
const serviceAccount = require("./k20-oto-firebase-adminsdk-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const messaging = admin.messaging();
