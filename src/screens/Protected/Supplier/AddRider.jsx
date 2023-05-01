import { StyleSheet, View } from "react-native";
import React from "react";
import { useState } from "react";

import { db, storage } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
	doc,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import RiderForm from "../../../components/Form/RiderForm";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
const AddRider = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [detail, setDetail] = useState({
		image: "",
		name: "",
		phone: "",
		id: "",
		password: "",
	});
	const [error, setError] = useState({
		nameError: "",
		phoneError: "",
		passwordError: "",
	});
	const [uploadedImage, setUploadedImage] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const userId = state && state.user && state.user.userId;
	const handleChange = async (name, val) => {
		if (name == "name") {
			setDetail({
				...detail,
				name: val,
			});
			if (!isNaN(+val) || val.length < 3) {
				setError({
					...error,
					nameError: "Characters only and more than 2",
				});
			} else {
				setError({
					...error,
					nameError: "",
				});
			}
		}
		if (name == "phone") {
			handlePhone(val);
		}
		if (name == "id") {
			setDetail({ ...detail, id: val });
		}
		if (name == "password") {
			setDetail({
				...detail,
				password: val,
			});
			if (val.length < 6 || val.length > 14) {
				setError({
					...error,
					passwordError:
						"Password should be 6-14 characters",
				});
			} else {
				setError({
					...error,
					passwordError: "",
				});
			}
		}
	};
	const handlePhone = async (value) => {
		setDetail({ ...detail, phone: value });
		const err =
			"Only Numbers starting with  3 and 10 characters long";
		if (
			isNaN(+value) ||
			Array.from(value)[0] != 3 ||
			value.length != 10
		) {
			setError({
				...error,
				phoneError: err,
			});
		} else {
			setError({
				...error,
				phoneError: "",
			});
		}
	};
	const handleSubmit = async () => {
		if (
			detail.password == "" ||
			detail.name == "" ||
			detail.phone == "" ||
			detail.id == "" ||
			uploadedImage == ""
		) {
			alert("Please fill all the fields");
			return;
		}
		if (
			error.nameError != "" ||
			error.phoneError != "" ||
			error.passwordError != ""
		) {
			alert("Please fill all the fields correctly");
			return;
		}
		try {
			const rider = {
				name: detail.name,
				phone: detail.phone,
				image: uploadedImage,
				riderId: detail.id,
				riderPassword: detail.password,
				userId,
				createdAt: serverTimestamp(),
			};
			setLoading(true);
			const riderRef = doc(db, "Riders", detail.id);
			await setDoc(riderRef, rider);
			setLoading(false);
			alert("Rider Added Successfully");
			navigation.navigate("Riders");
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
		const path = `Riders/${userId}/${Date.now()}`;
		const img = await uploadImage(
			path,
			pickerResult.assets[0].uri
		);
		setUploadedImage(img);
	};
	const uploadImage = async (imageReferenceID, uri) => {
		if (uri) {
			const result = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 100, height: 100 } }],
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
			<RiderForm
				detail={detail}
				error={error}
				loading={loading}
				handleImage={handleImage}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
				uploadedImage={uploadedImage}
			/>
		</View>
	);
};

export default AddRider;

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
