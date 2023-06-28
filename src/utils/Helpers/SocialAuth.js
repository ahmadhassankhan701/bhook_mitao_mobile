import {
	GoogleAuthProvider,
	signInWithCredential,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { activateNotify } from "./NotifyConfig";

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
		const push_token = await activateNotify(docRef);
		userData = {
			userId: user.uid,
			provider: "social",
			push_token,
			...docSnap.data(),
		};
	} else {
		await setDoc(docRef, {
			category: categ,
			name: user.displayName,
			email: user.email,
			image: user.photoURL,
		});
		const push_token = await activateNotify(docRef);
		userData = {
			userId: user.uid,
			push_token,
			provider: "social",
			category: categ,
			name: user.displayName,
			email: user.email,
			image: user.photoURL,
		};
	}
	return userData;
};
export const signUpGoogleSup = async (
	accessToken,
	categ
) => {
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
		const push_token = await activateNotify(docRef);
		userData = {
			userId: user.uid,
			push_token,
			city: user.city,
			provider: "social",
			registered: true,
			...docSnap.data(),
		};
	} else {
		userData = {
			registered: false,
		};
	}
	return userData;
};
