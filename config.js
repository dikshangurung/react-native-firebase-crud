import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore"; //for uploading data

const firebaseConfig = {
	apiKey: "AIzaSyCy0omcarNZTlTxRJ0oIX_5fELdG6DoSOk",
	authDomain: "expense-8079c.firebaseapp.com",
	databaseURL: "https://expense-8079c-default-rtdb.firebaseio.com",
	projectId: "expense-8079c",
	storageBucket: "expense-8079c.appspot.com",
	messagingSenderId: "248314026136",
	appId: "1:248314026136:web:b4fd7c12635fdeb3a0d8ed",
	measurementId: "G-LKTCBJESXR",
};
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}
export { firebase };
