import { StyleSheet, View } from "react-native";
import React from "react";
import { useState } from "react";

import { db, storage } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import EventForm from "../../../components/Form/EventForm";
const AddEvents = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [detail, setDetail] = useState({
		title: "",
		desc: "",
		filePath: "",
	});
	const [uploadedImage, setUploadedImage] = useState("");
	const [loading, setLoading] = useState(false);
	const userId = state && state.user && state.user.userId;
	const handleChange = async (name, val) => {
		setDetail({ ...detail, [name]: val });
	};
	const handleSubmit = async () => {
		if (
			detail.title == "" ||
			detail.desc == "" ||
			uploadedImage == ""
		) {
			alert("Please fill all the fields");
			return;
		}
		try {
			const event = {
				title: detail.title,
				description: detail.desc,
				filePath: detail.filePath,
				image: uploadedImage,
				orgId: userId,
				createdAt: serverTimestamp(),
			};
			setLoading(true);
			const eventRef = collection(db, "Events");
			await addDoc(
				collection(eventRef, `${userId}`, "event"),
				{ ...event }
			);
			setLoading(false);
			alert("Event Added Successfully");
			navigation.navigate("Events");
		} catch (error) {
			alert(error.message);
			console.log(error);
		}
	};
	const handleImage = async () => {
		let permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			alert("Camera access is required");
			return;
		}
		// get image from gallery
		let pickerResult =
			await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
		if (pickerResult.canceled === true) {
			return;
		}
		const path = `Events/${userId}/${Date.now()}`;
		const img = await uploadImage(
			path,
			pickerResult.assets[0].uri
		);
		setDetail({ ...detail, filePath: path });
		setUploadedImage(img);
	};
	const uploadImage = async (imageReferenceID, uri) => {
		if (uri) {
			const result = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 300, height: 300 } }],
				{
					compress: 0.5,
					format: ImageManipulator.SaveFormat.JPEG,
				}
			);
			const response = await fetch(result.uri);
			const blob = await response.blob();
			const storageRef = ref(storage, imageReferenceID);
			await uploadBytes(storageRef, blob);
			return getDownloadURL(storageRef);
		}
		return null;
	};
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<EventForm
				detail={detail}
				loading={loading}
				handleImage={handleImage}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
				uploadedImage={uploadedImage}
			/>
		</View>
	);
};

export default AddEvents;

const styles = StyleSheet.create({
	google_btn: {
		width: 200,
		height: 42,
		backgroundColor: "#4285f4",
		borderRadius: 2,
		display: "flex",
		flexDirection: "row",
		boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.25)",
		alignItems: "center",
		alignSelf: "center",
		marginVertical: "5%",
	},
	google_icon_wrapper: {
		flex: 1,
		marginTop: 1,
		marginLeft: 1,
		width: 40,
		height: 40,
		borderRadius: 2,
		backgroundColor: "#fff",
	},
	google_icon: {
		marginTop: 11,
		marginLeft: 11,
		width: 20,
		height: 20,
	},
	btn_text: {
		flex: 4,
		alignSelf: "center",
		margin: 11,
		marginRight: 11,
		fontSize: 14,
		fontWeight: "bold",
		fontFamily: "Roboto",
		letterSpacing: 0.2,
		color: "#fff",
	},
});
