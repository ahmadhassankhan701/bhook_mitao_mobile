import {
	GoogleAuthProvider,
	signInWithCredential,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const signUpGoogle = async (accessToken, categ) => {
	const credential = GoogleAuthProvider.credential(
		null,
		accessToken
	);
	const { user } = await signInWithCredential(
		auth,
		credential
	);
	const docRef = doc(db, `Auth/${categ}/users`, user.uid);
	const docSnap = await getDoc(docRef);
	let userData = {};
	if (docSnap.exists()) {
		userData = {
			userId: user.uid,
			...docSnap.data(),
		};
	} else {
		await setDoc(docRef, {
			category: categ,
			name: user.displayName,
			email: user.email,
			image: user.photoURL,
		});
		userData = {
			userId: user.uid,
			category: categ,
			name: user.displayName,
			email: user.email,
			image: user.photoURL,
		};
	}
	return userData;
};
