import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { db } from "../../../firebase";

export const NotifyConfig = () => {
	const registerForPushNotificationsAsync = async () => {
		let token;

		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync(
				"default",
				{
					name: "default",
					importance: Notifications.AndroidImportance.MAX,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: "#FF231F7C",
				}
			);
		}

		if (Device.isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } =
					await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				alert("Premission Denied for Push Notifications");
				return false;
			}

			token = (await Notifications.getExpoPushTokenAsync())
				.data;
		} else {
			alert(
				"Must use physical device for Push Notifications"
			);
		}

		return token;
	};

	const activeNotification = async (user) => {
		const token = await registerForPushNotificationsAsync();

		if (!token) {
			return;
		}

		// console.log("token", token);

		const docRef = await addDoc(
			collection(db, "notification"),
			{
				token: token,
				status: true,
				user: user.userId,
			}
		);
		// console.log("Document written with ID: ", docRef.id);
	};

	const deactiveNotification = async (user) => {
		const token = await registerForPushNotificationsAsync();

		if (!token) {
			return;
		}

		const q = query(
			collection(db, "notification"),
			where("token", "==", token),
			where("user", "==", user.userId)
		);
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((docu) => {
			deleteDoc(doc(db, "notification", docu.id));
		});
	};

	const sendNotification = async (user, title, body) => {
		// console.log(user, title, body);
		// await axios
		// 	.post("https://exp.host/--/api/v2/push/send", {
		// 		to: user,
		// 		title: title,
		// 		body: body,
		// 	})
		// 	.then(function (response) {})
		// 	.catch(function (error) {
		// 		console.log(error);
		// 	});
	};

	return {
		registerForPushNotificationsAsync,
		activeNotification,
		deactiveNotification,
		sendNotification,
	};
};
