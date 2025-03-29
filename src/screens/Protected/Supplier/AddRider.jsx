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
import Failure from "../../../components/Modal/Failure";
import Success from "../../../components/Modal/Success";
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
	const [successAlert, setSuccessAlert] = useState(false);
	const [failAlert, setFailAlert] = useState(false);
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
			const location = {
				currentLocation: {
					lat: 0,
					lng: 0,
				},
			};
			const rider = {
				name: detail.name,
				phone: detail.phone,
				image: uploadedImage,
				riderId: detail.id,
				riderPassword: detail.password,
				userId,
				location,
				createdAt: serverTimestamp(),
			};
			setLoading(true);
			const riderRef = doc(db, "Riders", detail.id);
			await setDoc(riderRef, rider);
			setLoading(false);
			setSuccessAlert(true);
			navigation.navigate("Riders");
		} catch (error) {
			setFailAlert(true);
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
		<View style={styles.container}>
			<Failure
				visible={failAlert}
				setVisible={setFailAlert}
				title={"Rider could not be added"}
				icon={"exclamation-thick"}
			/>
			<Success
				visible={successAlert}
				setVisible={setSuccessAlert}
				title={"Rider added successfully!"}
				icon={"check-circle"}
			/>
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
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
});
