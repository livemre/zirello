// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkAUr1B1eg9xW-q8FH3e9demjcg4wWnCE",
  authDomain: "zirello.firebaseapp.com",
  projectId: "zirello",
  storageBucket: "zirello.appspot.com",
  messagingSenderId: "194904528217",
  appId: "1:194904528217:web:9b00ed7131997a175ba848"
};

// Initialize Firebase
const myFirebaseApp = initializeApp(firebaseConfig);
export default myFirebaseApp

