import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBj0WZsknje5KmjFCa1NUWekvQHtrDqM_o",
  authDomain: "cooplay-eca41.firebaseapp.com",
  projectId: "cooplay-eca41",
  storageBucket: "cooplay-eca41.firebasestorage.app",
  messagingSenderId: "683002912479",
  appId: "1:683002912479:web:9273aa2672486cc19bd36a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const run = async () => {
  const userCred = await signInWithEmailAndPassword(auth, "test8@gmail.com", "mdpTEST8,");
  const token = await userCred.user.getIdToken();
  console.log("ID Token:", token);
};

run();
