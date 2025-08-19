import admin from "firebase-admin"
import serviceAccount from "../shared/cooplay-firebase.json"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
